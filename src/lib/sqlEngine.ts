import initSqlJs, { Database } from "sql.js";

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  });
  dbInstance = new SQL.Database();
  return dbInstance;
}

export function resetDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
}

export async function setupSchema(db: Database, setupSQL: string) {
  db.run(setupSQL);
}

export async function executeQuery(
  db: Database,
  query: string
): Promise<{ success: true; result: QueryResult } | { success: false; error: string }> {
  try {
    const trimmed = query.trim();
    // Block dangerous statements
    const upper = trimmed.toUpperCase();
    if (
      upper.startsWith("DROP") ||
      upper.startsWith("ALTER") ||
      upper.startsWith("CREATE") ||
      upper.startsWith("INSERT") ||
      upper.startsWith("UPDATE") ||
      upper.startsWith("DELETE") ||
      upper.startsWith("TRUNCATE")
    ) {
      return { success: false, error: "Only SELECT queries are allowed." };
    }

    const results = db.exec(trimmed);
    if (results.length === 0) {
      return { success: true, result: { columns: [], values: [] } };
    }
    return {
      success: true,
      result: {
        columns: results[0].columns,
        values: results[0].values as (string | number | null)[][],
      },
    };
  } catch (e: any) {
    return { success: false, error: e.message || "Unknown SQL error" };
  }
}

export function compareResults(
  actual: QueryResult,
  expected: QueryResult,
  orderMatters: boolean = true
): { match: boolean; message: string } {
  // Check columns
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

  // Check row count
  if (actual.values.length !== expected.values.length) {
    return { match: false, message: `Expected ${expected.values.length} rows, got ${actual.values.length}.` };
  }

  // Compare values
  const normalize = (v: any) => (v === null ? "NULL" : String(v).trim());

  const sortRows = (rows: (string | number | null)[][]) =>
    [...rows].sort((a, b) => a.map(normalize).join("|").localeCompare(b.map(normalize).join("|")));

  const aRows = orderMatters ? actual.values : sortRows(actual.values);
  const eRows = orderMatters ? expected.values : sortRows(expected.values);

  for (let r = 0; r < eRows.length; r++) {
    for (let c = 0; c < eRows[r].length; c++) {
      const av = normalize(aRows[r][c]);
      const ev = normalize(eRows[r][c]);
      // Allow numeric tolerance
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
