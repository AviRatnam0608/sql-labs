import alasql from "alasql";

export type Database = {
  exec: (sql: string) => any;
};

let dbInstance: any = null;

export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = new (alasql as any).Database();
  }
  return dbInstance;
}

export function resetDb() {
  dbInstance = null;
}

export interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
}

export async function setupSchema(db: Database, setupSQL: string) {
  db.exec(setupSQL);
}

function isAllowedUserQuery(query: string) {
  const trimmed = query.trim().replace(/^\(+/, "").trim();
  const upper = trimmed.toUpperCase();
  return upper.startsWith("SELECT") || upper.startsWith("WITH");
}

export async function executeQuery(
  db: Database,
  query: string
): Promise<{ success: true; result: QueryResult } | { success: false; error: string }> {
  try {
    const trimmed = query.trim();

    if (!isAllowedUserQuery(trimmed)) {
      return { success: false, error: "Only SELECT queries are allowed." };
    }

    const rows = db.exec(trimmed);

    if (!Array.isArray(rows) || rows.length === 0) {
      return { success: true, result: { columns: [], values: [] } };
    }

    const columns = Object.keys(rows[0]);
    const values = rows.map((row: Record<string, unknown>) =>
      columns.map((col) => {
        const value = row[col];
        return value === undefined ? null : (value as string | number | null);
      })
    );

    return { success: true, result: { columns, values } };
  } catch (e: any) {
    return { success: false, error: e?.message || "Unknown SQL error" };
  }
}

export function compareResults(
  actual: QueryResult,
  expected: QueryResult,
  orderMatters: boolean = true
): { match: boolean; message: string } {
  if (actual.columns.length !== expected.columns.length) {
    return { match: false, message: `Expected ${expected.columns.length} columns, got ${actual.columns.length}.` };
  }

  const actualCols = actual.columns.map((c) => c.toLowerCase());
  const expectedCols = expected.columns.map((c) => c.toLowerCase());

  for (let i = 0; i < expectedCols.length; i++) {
    if (actualCols[i] !== expectedCols[i]) {
      return { match: false, message: `Column ${i + 1}: expected "${expectedCols[i]}", got "${actualCols[i]}".` };
    }
  }

  if (actual.values.length !== expected.values.length) {
    return { match: false, message: `Expected ${expected.values.length} rows, got ${actual.values.length}.` };
  }

  const normalize = (v: any) => (v === null ? "NULL" : String(v).trim());
  const sortRows = (rows: (string | number | null)[][]) =>
    [...rows].sort((a, b) => a.map(normalize).join("|").localeCompare(b.map(normalize).join("|")));

  const aRows = orderMatters ? actual.values : sortRows(actual.values);
  const eRows = orderMatters ? expected.values : sortRows(expected.values);

  for (let r = 0; r < eRows.length; r++) {
    for (let c = 0; c < eRows[r].length; c++) {
      const av = normalize(aRows[r][c]);
      const ev = normalize(eRows[r][c]);
      const aNum = parseFloat(av);
      const eNum = parseFloat(ev);

      if (!isNaN(aNum) && !isNaN(eNum)) {
        if (Math.abs(aNum - eNum) > 0.01) {
          return { match: false, message: `Row ${r + 1}, Col ${c + 1}: expected ${ev}, got ${av}.` };
        }
      } else if (av.toLowerCase() !== ev.toLowerCase()) {
        return { match: false, message: `Row ${r + 1}, Col ${c + 1}: expected "${ev}", got "${av}".` };
      }
    }
  }

  return { match: true, message: "Correct! Your query returns the expected results." };
}
