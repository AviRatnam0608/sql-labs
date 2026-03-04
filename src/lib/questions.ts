export interface SQLQuestion {
  id: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  title: string;
  description: string;
  concept: string;
  conceptDetail: string;
  setupSQL: string;
  tables: TableVisual[];
  expectedSQL: string; // We'll run this to get expected result
  orderMatters: boolean;
  hints: string[];
}

export interface TableVisual {
  name: string;
  columns: string[];
  rows: (string | number | null)[][];
  colorGroup: "blue" | "green" | "purple" | "orange";
}

export const progressiveQuestions: SQLQuestion[] = [
  // 1. Basic SELECT
  {
    id: "p1",
    difficulty: "beginner",
    topic: "SELECT",
    title: "Select All Scientists",
    description: "Select all columns from the scientists table.",
    concept: "SELECT Basics",
    conceptDetail: "SELECT * returns all columns. SELECT col1, col2 returns specific columns. This is the simplest SQL query — just reading data from a table.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology', 8);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Biology", 8],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT * FROM scientists;",
    orderMatters: false,
    hints: ["Use SELECT * to get all columns", "The table is called 'scientists'"],
  },
  // 2. SELECT specific columns
  {
    id: "p2",
    difficulty: "beginner",
    topic: "SELECT",
    title: "Select Names and Fields",
    description: "Select only the name and field columns from the scientists table.",
    concept: "Column Selection",
    conceptDetail: "Instead of SELECT *, list specific columns: SELECT name, field. This is better practice — you only fetch what you need, and your query is self-documenting.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology', 8);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Biology", 8],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT name, field FROM scientists;",
    orderMatters: false,
    hints: ["List columns by name after SELECT", "Separate columns with commas"],
  },
  // 3. WHERE clause
  {
    id: "p3",
    difficulty: "beginner",
    topic: "WHERE",
    title: "Filter by Field",
    description: "Select all scientists who work in Physics.",
    concept: "WHERE Filtering",
    conceptDetail: "WHERE filters rows BEFORE any grouping. It evaluates each row individually. Use = for exact match, LIKE for patterns, >, <, >=, <= for comparisons.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Physics', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 'Biology', 2);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Physics", 8],
          [4, "Dave", "Biology", 2],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT * FROM scientists WHERE field = 'Physics';",
    orderMatters: false,
    hints: ["Use WHERE field = 'Physics'", "String values need single quotes"],
  },
  // 4. WHERE with comparison
  {
    id: "p4",
    difficulty: "beginner",
    topic: "WHERE",
    title: "Experience Filter",
    description: "Find scientists with more than 4 years of experience.",
    concept: "Comparison Operators",
    conceptDetail: "WHERE supports: = (equal), != or <> (not equal), > (greater), < (less), >= (greater or equal), <= (less or equal). These work on numbers, strings, and dates.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 'Physics', 1);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Biology", 8],
          [4, "Dave", "Physics", 1],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT * FROM scientists WHERE years_exp > 4;",
    orderMatters: false,
    hints: ["Use > for 'greater than'", "WHERE years_exp > 4"],
  },
  // 5. ORDER BY
  {
    id: "p5",
    difficulty: "beginner",
    topic: "ORDER BY",
    title: "Sort by Experience",
    description: "Select all scientists, ordered by years_exp from highest to lowest.",
    concept: "ORDER BY",
    conceptDetail: "ORDER BY sorts the final result. ASC = ascending (default, smallest first). DESC = descending (largest first). It runs AFTER SELECT in execution order.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology', 8);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Biology", 8],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT * FROM scientists ORDER BY years_exp DESC;",
    orderMatters: true,
    hints: ["Add ORDER BY at the end", "DESC for descending (highest first)"],
  },
  // 6. LIMIT
  {
    id: "p6",
    difficulty: "beginner",
    topic: "LIMIT",
    title: "Top 2 Experienced",
    description: "Get the top 2 scientists by experience (highest first).",
    concept: "LIMIT",
    conceptDetail: "LIMIT restricts how many rows are returned. It always runs last. Combined with ORDER BY, it gives you 'top N' queries. LIMIT 2 returns at most 2 rows.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 'Physics', 10);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Biology", 8],
          [4, "Dave", "Physics", 10],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT * FROM scientists ORDER BY years_exp DESC LIMIT 2;",
    orderMatters: true,
    hints: ["ORDER BY first, then LIMIT", "LIMIT 2 returns 2 rows"],
  },
  // 7. COUNT aggregate
  {
    id: "p7",
    difficulty: "beginner",
    topic: "Aggregates",
    title: "Count Scientists",
    description: "Count the total number of scientists. Return a single column called 'total'.",
    concept: "COUNT Aggregate",
    conceptDetail: "COUNT(*) counts all rows. COUNT(column) counts non-NULL values. Aggregate functions collapse multiple rows into one summary value. Use AS to alias the result column.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology', 8);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Biology", 8],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT COUNT(*) AS total FROM scientists;",
    orderMatters: false,
    hints: ["Use COUNT(*) to count rows", "Use AS to rename the column"],
  },
  // 8. GROUP BY
  {
    id: "p8",
    difficulty: "intermediate",
    topic: "GROUP BY",
    title: "Count per Field",
    description: "Count how many scientists are in each field. Return field and count (as 'num_scientists').",
    concept: "GROUP BY",
    conceptDetail: "GROUP BY collapses rows with the same value into one group. You must use aggregate functions (COUNT, SUM, AVG, MIN, MAX) for non-grouped columns. Every column in SELECT must be in GROUP BY or an aggregate.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Physics', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 'Biology', 2);
      INSERT INTO scientists VALUES (5, 'Eve', 'Physics', 4);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Physics", 8],
          [4, "Dave", "Biology", 2],
          [5, "Eve", "Physics", 4],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT field, COUNT(*) AS num_scientists FROM scientists GROUP BY field;",
    orderMatters: false,
    hints: ["GROUP BY field", "Use COUNT(*) AS num_scientists"],
  },
  // 9. INNER JOIN
  {
    id: "p9",
    difficulty: "intermediate",
    topic: "JOIN",
    title: "Scientists and Experiments",
    description: "Show each scientist's name alongside their experiment name. Only include scientists who have experiments.",
    concept: "INNER JOIN",
    conceptDetail: "INNER JOIN returns only rows where a match exists in BOTH tables. Rows without a match on either side are excluded. Syntax: FROM table_a JOIN table_b ON table_a.col = table_b.col",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics');
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry');
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology');
      CREATE TABLE experiments (id INTEGER PRIMARY KEY, scientist_id INTEGER, exp_name TEXT);
      INSERT INTO experiments VALUES (101, 1, 'Laser Test');
      INSERT INTO experiments VALUES (102, 1, 'Prism Study');
      INSERT INTO experiments VALUES (103, 2, 'Reaction X');
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field"],
        rows: [
          [1, "Alice", "Physics"],
          [2, "Bob", "Chemistry"],
          [3, "Carol", "Biology"],
        ],
        colorGroup: "blue",
      },
      {
        name: "experiments",
        columns: ["id", "scientist_id", "exp_name"],
        rows: [
          [101, 1, "Laser Test"],
          [102, 1, "Prism Study"],
          [103, 2, "Reaction X"],
        ],
        colorGroup: "green",
      },
    ],
    expectedSQL: "SELECT s.name, e.exp_name FROM scientists s JOIN experiments e ON s.id = e.scientist_id;",
    orderMatters: false,
    hints: ["JOIN experiments ON scientists.id = experiments.scientist_id", "Carol has no experiments — she won't appear"],
  },
  // 10. LEFT JOIN
  {
    id: "p10",
    difficulty: "intermediate",
    topic: "JOIN",
    title: "All Scientists, Even Without Experiments",
    description: "Show every scientist and their experiment name. If a scientist has no experiments, show NULL for exp_name.",
    concept: "LEFT JOIN",
    conceptDetail: "LEFT JOIN returns ALL rows from the left table plus matching rows from the right. When no match exists, right-side columns are NULL. Use this when you want 'everyone, even with 0 results'.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics');
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry');
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology');
      CREATE TABLE experiments (id INTEGER PRIMARY KEY, scientist_id INTEGER, exp_name TEXT);
      INSERT INTO experiments VALUES (101, 1, 'Laser Test');
      INSERT INTO experiments VALUES (102, 2, 'Reaction X');
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field"],
        rows: [
          [1, "Alice", "Physics"],
          [2, "Bob", "Chemistry"],
          [3, "Carol", "Biology"],
        ],
        colorGroup: "blue",
      },
      {
        name: "experiments",
        columns: ["id", "scientist_id", "exp_name"],
        rows: [
          [101, 1, "Laser Test"],
          [102, 2, "Reaction X"],
        ],
        colorGroup: "green",
      },
    ],
    expectedSQL: "SELECT s.name, e.exp_name FROM scientists s LEFT JOIN experiments e ON s.id = e.scientist_id;",
    orderMatters: false,
    hints: ["Use LEFT JOIN instead of JOIN", "Carol will show with NULL exp_name"],
  },
  // 11. JOIN + WHERE
  {
    id: "p11",
    difficulty: "intermediate",
    topic: "JOIN + WHERE",
    title: "Physics Experiments Only",
    description: "Show experiment names for scientists in the Physics field only.",
    concept: "Combining JOIN and WHERE",
    conceptDetail: "In execution order: FROM/JOIN runs first (combines tables), then WHERE filters the combined rows. This means you can filter on columns from either table after joining.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics');
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry');
      INSERT INTO scientists VALUES (3, 'Carol', 'Physics');
      CREATE TABLE experiments (id INTEGER PRIMARY KEY, scientist_id INTEGER, exp_name TEXT);
      INSERT INTO experiments VALUES (101, 1, 'Laser Test');
      INSERT INTO experiments VALUES (102, 2, 'Reaction X');
      INSERT INTO experiments VALUES (103, 3, 'Gravity Sim');
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field"],
        rows: [
          [1, "Alice", "Physics"],
          [2, "Bob", "Chemistry"],
          [3, "Carol", "Physics"],
        ],
        colorGroup: "blue",
      },
      {
        name: "experiments",
        columns: ["id", "scientist_id", "exp_name"],
        rows: [
          [101, 1, "Laser Test"],
          [102, 2, "Reaction X"],
          [103, 3, "Gravity Sim"],
        ],
        colorGroup: "green",
      },
    ],
    expectedSQL: "SELECT s.name, e.exp_name FROM scientists s JOIN experiments e ON s.id = e.scientist_id WHERE s.field = 'Physics';",
    orderMatters: false,
    hints: ["JOIN first, then WHERE", "Filter on s.field = 'Physics'"],
  },
  // 12. GROUP BY + HAVING
  {
    id: "p12",
    difficulty: "intermediate",
    topic: "HAVING",
    title: "Fields with Multiple Scientists",
    description: "Find fields that have more than 1 scientist. Return the field and the count as 'num'.",
    concept: "WHERE vs HAVING",
    conceptDetail: "WHERE filters individual rows BEFORE grouping. HAVING filters groups AFTER grouping. WHERE cannot use aggregates; HAVING can. This is the #1 SQL interview question!",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Physics', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 'Biology', 2);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Chemistry", 3],
          [3, "Carol", "Physics", 8],
          [4, "Dave", "Biology", 2],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT field, COUNT(*) AS num FROM scientists GROUP BY field HAVING COUNT(*) > 1;",
    orderMatters: false,
    hints: ["GROUP BY field first", "HAVING COUNT(*) > 1 filters after grouping"],
  },
  // 13. AVG aggregate
  {
    id: "p13",
    difficulty: "intermediate",
    topic: "Aggregates",
    title: "Average Experience per Field",
    description: "Find the average years of experience per field. Return field and avg_exp (rounded to 1 decimal).",
    concept: "AVG and ROUND",
    conceptDetail: "AVG() calculates the mean of a numeric column within each group. ROUND(value, decimals) rounds to specified decimal places. AVG ignores NULL values.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 'Physics', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 'Biology', 6);
      INSERT INTO scientists VALUES (5, 'Eve', 'Chemistry', 4);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field", "years_exp"],
        rows: [
          [1, "Alice", "Physics", 5],
          [2, "Bob", "Physics", 3],
          [3, "Carol", "Biology", 8],
          [4, "Dave", "Biology", 6],
          [5, "Eve", "Chemistry", 4],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT field, ROUND(AVG(years_exp), 1) AS avg_exp FROM scientists GROUP BY field;",
    orderMatters: false,
    hints: ["Use AVG(years_exp)", "Wrap in ROUND(..., 1)"],
  },
  // 14. JOIN + GROUP BY + COUNT
  {
    id: "p14",
    difficulty: "advanced",
    topic: "JOIN + GROUP BY",
    title: "Experiments per Scientist",
    description: "Count how many experiments each scientist has. Return name and experiment_count. Include only scientists who have experiments.",
    concept: "JOIN + GROUP BY",
    conceptDetail: "When you JOIN two tables then GROUP BY, you're first combining all rows, then collapsing them. The COUNT tells you how many right-table rows matched each left-table group.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics');
      INSERT INTO scientists VALUES (2, 'Bob', 'Chemistry');
      INSERT INTO scientists VALUES (3, 'Carol', 'Biology');
      CREATE TABLE experiments (id INTEGER PRIMARY KEY, scientist_id INTEGER, exp_name TEXT);
      INSERT INTO experiments VALUES (101, 1, 'Laser Test');
      INSERT INTO experiments VALUES (102, 1, 'Prism Study');
      INSERT INTO experiments VALUES (103, 2, 'Reaction X');
      INSERT INTO experiments VALUES (104, 1, 'Photon Count');
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field"],
        rows: [
          [1, "Alice", "Physics"],
          [2, "Bob", "Chemistry"],
          [3, "Carol", "Biology"],
        ],
        colorGroup: "blue",
      },
      {
        name: "experiments",
        columns: ["id", "scientist_id", "exp_name"],
        rows: [
          [101, 1, "Laser Test"],
          [102, 1, "Prism Study"],
          [103, 2, "Reaction X"],
          [104, 1, "Photon Count"],
        ],
        colorGroup: "green",
      },
    ],
    expectedSQL: "SELECT s.name, COUNT(e.id) AS experiment_count FROM scientists s JOIN experiments e ON s.id = e.scientist_id GROUP BY s.name;",
    orderMatters: false,
    hints: ["JOIN then GROUP BY s.name", "COUNT(e.id) counts experiments"],
  },
  // 15. LEFT JOIN + COUNT (the trap)
  {
    id: "p15",
    difficulty: "advanced",
    topic: "LEFT JOIN + COUNT",
    title: "All Scientists with Experiment Count",
    description: "Count experiments per scientist, including those with 0. Return name and experiment_count.",
    concept: "COUNT(*) vs COUNT(col)",
    conceptDetail: "With LEFT JOIN, unmatched rows have NULLs on the right side. COUNT(*) counts these as 1 (wrong!). COUNT(right_table.id) counts non-NULL values, correctly showing 0.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT);
      INSERT INTO scientists VALUES (1, 'Alice');
      INSERT INTO scientists VALUES (2, 'Bob');
      INSERT INTO scientists VALUES (3, 'Carol');
      CREATE TABLE experiments (id INTEGER PRIMARY KEY, scientist_id INTEGER, exp_name TEXT);
      INSERT INTO experiments VALUES (101, 1, 'Laser Test');
      INSERT INTO experiments VALUES (102, 1, 'Prism Study');
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name"],
        rows: [
          [1, "Alice"],
          [2, "Bob"],
          [3, "Carol"],
        ],
        colorGroup: "blue",
      },
      {
        name: "experiments",
        columns: ["id", "scientist_id", "exp_name"],
        rows: [
          [101, 1, "Laser Test"],
          [102, 1, "Prism Study"],
        ],
        colorGroup: "green",
      },
    ],
    expectedSQL: "SELECT s.name, COUNT(e.id) AS experiment_count FROM scientists s LEFT JOIN experiments e ON s.id = e.scientist_id GROUP BY s.name;",
    orderMatters: false,
    hints: ["LEFT JOIN to keep all scientists", "COUNT(e.id) not COUNT(*) for correct 0s"],
  },
  // 16. Subquery
  {
    id: "p16",
    difficulty: "advanced",
    topic: "Subquery",
    title: "Above Average Experience",
    description: "Find scientists whose years_exp is above the average. Return name and years_exp.",
    concept: "Subqueries",
    conceptDetail: "A subquery is a SELECT inside another query. It runs first, then the outer query uses its result. Common pattern: WHERE col > (SELECT AVG(col) FROM table).",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 3);
      INSERT INTO scientists VALUES (3, 'Carol', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 2);
      INSERT INTO scientists VALUES (5, 'Eve', 7);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "years_exp"],
        rows: [
          [1, "Alice", 5],
          [2, "Bob", 3],
          [3, "Carol", 8],
          [4, "Dave", 2],
          [5, "Eve", 7],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT name, years_exp FROM scientists WHERE years_exp > (SELECT AVG(years_exp) FROM scientists);",
    orderMatters: false,
    hints: ["Average is (5+3+8+2+7)/5 = 5.0", "Use a subquery: WHERE years_exp > (SELECT AVG(...))"],
  },
  // 17. CASE expression
  {
    id: "p17",
    difficulty: "advanced",
    topic: "CASE",
    title: "Experience Level Label",
    description: "Select name and a column called 'level': 'Senior' if years_exp >= 6, 'Mid' if >= 3, else 'Junior'.",
    concept: "CASE Expression",
    conceptDetail: "CASE WHEN condition THEN value WHEN ... ELSE default END. It's SQL's if/else. Conditions are evaluated top to bottom; the first match wins. Always include ELSE for safety.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, years_exp INTEGER);
      INSERT INTO scientists VALUES (1, 'Alice', 5);
      INSERT INTO scientists VALUES (2, 'Bob', 2);
      INSERT INTO scientists VALUES (3, 'Carol', 8);
      INSERT INTO scientists VALUES (4, 'Dave', 3);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "years_exp"],
        rows: [
          [1, "Alice", 5],
          [2, "Bob", 2],
          [3, "Carol", 8],
          [4, "Dave", 3],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT name, CASE WHEN years_exp >= 6 THEN 'Senior' WHEN years_exp >= 3 THEN 'Mid' ELSE 'Junior' END AS level FROM scientists;",
    orderMatters: false,
    hints: ["CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END", "Check >= 6 first, then >= 3"],
  },
  // 18. Multiple JOINs
  {
    id: "p18",
    difficulty: "advanced",
    topic: "Multiple JOINs",
    title: "Scientists, Experiments, and Data Points",
    description: "Show scientist name, experiment name, and the count of data_points per experiment. Return name, exp_name, and point_count.",
    concept: "Chaining JOINs",
    conceptDetail: "You can chain multiple JOINs: FROM a JOIN b ON ... JOIN c ON .... Each JOIN adds columns from another table. GROUP BY then works across all joined columns.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT);
      INSERT INTO scientists VALUES (1, 'Alice');
      INSERT INTO scientists VALUES (2, 'Bob');
      CREATE TABLE experiments (id INTEGER PRIMARY KEY, scientist_id INTEGER, exp_name TEXT);
      INSERT INTO experiments VALUES (101, 1, 'Laser Test');
      INSERT INTO experiments VALUES (102, 2, 'Reaction X');
      CREATE TABLE data_points (id INTEGER PRIMARY KEY, experiment_id INTEGER, value REAL);
      INSERT INTO data_points VALUES (1, 101, 3.14);
      INSERT INTO data_points VALUES (2, 101, 2.72);
      INSERT INTO data_points VALUES (3, 101, 1.41);
      INSERT INTO data_points VALUES (4, 102, 9.81);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name"],
        rows: [[1, "Alice"], [2, "Bob"]],
        colorGroup: "blue",
      },
      {
        name: "experiments",
        columns: ["id", "scientist_id", "exp_name"],
        rows: [[101, 1, "Laser Test"], [102, 2, "Reaction X"]],
        colorGroup: "green",
      },
      {
        name: "data_points",
        columns: ["id", "experiment_id", "value"],
        rows: [[1, 101, 3.14], [2, 101, 2.72], [3, 101, 1.41], [4, 102, 9.81]],
        colorGroup: "purple",
      },
    ],
    expectedSQL: "SELECT s.name, e.exp_name, COUNT(dp.id) AS point_count FROM scientists s JOIN experiments e ON s.id = e.scientist_id JOIN data_points dp ON e.id = dp.experiment_id GROUP BY s.name, e.exp_name;",
    orderMatters: false,
    hints: ["Chain two JOINs", "GROUP BY both name and exp_name"],
  },
  // 19. DISTINCT
  {
    id: "p19",
    difficulty: "intermediate",
    topic: "DISTINCT",
    title: "Unique Fields",
    description: "List all unique fields from the scientists table. Return just the field column.",
    concept: "DISTINCT",
    conceptDetail: "SELECT DISTINCT removes duplicate rows from the result. It applies to the entire row, not just one column. Useful when you want a list of unique values.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT, field TEXT);
      INSERT INTO scientists VALUES (1, 'Alice', 'Physics');
      INSERT INTO scientists VALUES (2, 'Bob', 'Physics');
      INSERT INTO scientists VALUES (3, 'Carol', 'Chemistry');
      INSERT INTO scientists VALUES (4, 'Dave', 'Biology');
      INSERT INTO scientists VALUES (5, 'Eve', 'Chemistry');
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name", "field"],
        rows: [
          [1, "Alice", "Physics"],
          [2, "Bob", "Physics"],
          [3, "Carol", "Chemistry"],
          [4, "Dave", "Biology"],
          [5, "Eve", "Chemistry"],
        ],
        colorGroup: "blue",
      },
    ],
    expectedSQL: "SELECT DISTINCT field FROM scientists;",
    orderMatters: false,
    hints: ["DISTINCT removes duplicates", "SELECT DISTINCT field FROM ..."],
  },
  // 20. Complex combo
  {
    id: "p20",
    difficulty: "advanced",
    topic: "Complex Query",
    title: "Top Scientists by Data Points",
    description: "Find scientists who have more than 2 data points total across all their experiments. Return name and total_points, ordered by total_points descending.",
    concept: "Putting It All Together",
    conceptDetail: "This combines JOIN (connect tables), GROUP BY (aggregate), HAVING (filter groups), and ORDER BY (sort). The execution order: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.",
    setupSQL: `
      CREATE TABLE scientists (id INTEGER PRIMARY KEY, name TEXT);
      INSERT INTO scientists VALUES (1, 'Alice');
      INSERT INTO scientists VALUES (2, 'Bob');
      INSERT INTO scientists VALUES (3, 'Carol');
      CREATE TABLE experiments (id INTEGER PRIMARY KEY, scientist_id INTEGER, exp_name TEXT);
      INSERT INTO experiments VALUES (101, 1, 'Laser Test');
      INSERT INTO experiments VALUES (102, 1, 'Prism Study');
      INSERT INTO experiments VALUES (103, 2, 'Reaction X');
      INSERT INTO experiments VALUES (104, 3, 'Cell Growth');
      CREATE TABLE data_points (id INTEGER PRIMARY KEY, experiment_id INTEGER, value REAL);
      INSERT INTO data_points VALUES (1, 101, 3.14);
      INSERT INTO data_points VALUES (2, 101, 2.72);
      INSERT INTO data_points VALUES (3, 102, 1.41);
      INSERT INTO data_points VALUES (4, 103, 9.81);
      INSERT INTO data_points VALUES (5, 103, 6.67);
      INSERT INTO data_points VALUES (6, 103, 1.38);
      INSERT INTO data_points VALUES (7, 104, 4.20);
    `,
    tables: [
      {
        name: "scientists",
        columns: ["id", "name"],
        rows: [[1, "Alice"], [2, "Bob"], [3, "Carol"]],
        colorGroup: "blue",
      },
      {
        name: "experiments",
        columns: ["id", "scientist_id", "exp_name"],
        rows: [[101, 1, "Laser Test"], [102, 1, "Prism Study"], [103, 2, "Reaction X"], [104, 3, "Cell Growth"]],
        colorGroup: "green",
      },
      {
        name: "data_points",
        columns: ["id", "experiment_id", "value"],
        rows: [[1, 101, 3.14], [2, 101, 2.72], [3, 102, 1.41], [4, 103, 9.81], [5, 103, 6.67], [6, 103, 1.38], [7, 104, 4.20]],
        colorGroup: "purple",
      },
    ],
    expectedSQL: "SELECT s.name, COUNT(dp.id) AS total_points FROM scientists s JOIN experiments e ON s.id = e.scientist_id JOIN data_points dp ON e.id = dp.experiment_id GROUP BY s.name HAVING COUNT(dp.id) > 2 ORDER BY total_points DESC;",
    orderMatters: true,
    hints: ["Chain two JOINs", "GROUP BY s.name, HAVING COUNT > 2, ORDER BY DESC"],
  },
];

// For time attack mode, we'll generate random variations
export function getRandomQuestion(): SQLQuestion {
  const pool = [...progressiveQuestions];
  return pool[Math.floor(Math.random() * pool.length)];
}
