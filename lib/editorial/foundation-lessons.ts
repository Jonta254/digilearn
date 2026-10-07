import type { CourseCurriculum, Lesson, LessonVisual } from "../learning-types";
import type { FoundationSpec } from "./foundation-spec";
import { PYTHON_LESSONS } from "./python-lessons";
import { SQL_LESSONS } from "./sql-lessons";
import { pythonSource, sqlSource } from "./foundation-spec";

function materialize(original: Lesson, spec: FoundationSpec, language: string): Lesson {
  const visual: LessonVisual = {
    id: `${original.id}-practical-map`, kind: "flow", title: `${spec.title}: the working sequence`,
    description: `Trace the three stages of ${spec.title.toLowerCase()} and compare them with the example.`,
    labels: spec.terms.slice(0, 3), items: spec.nodes.map((detail, index) => ({ label: spec.terms[index], detail })),
    connections: ["then", "then"], placement: "after-objectives", caption: "The sequence describes this example; use the code and output to check each stage.", takeaway: spec.summary.join(" "),
  };
  return { ...original, title: spec.title, introduction: spec.intro, objectives: spec.objectives, keyTerms: spec.terms,
    visual, visuals: [visual], commonMistakes: spec.mistakes, activity: `${spec.activity} Keep the changed example, its output and a short explanation of whether the result matched your prediction.`, summary: spec.summary, check: spec.check,
    references: [spec.source, language === "python" ? pythonSource("Python language reference", "reference/index.html") : sqlSource("PostgreSQL SQL language guide", "sql")], blocks: [
      { type: "paragraph", text: spec.explanation },
      { type: "code", language, code: spec.code },
      { type: "code", title: "Expected output", language: "text", code: spec.output },
      { type: "steps", title: "Try it, then change it", items: spec.steps },
      { type: "callout", tone: "remember", title: "What this example establishes", body: spec.summary.join(" ") },
    ],
  };
}

export function enrichFoundation(curriculum: CourseCurriculum): CourseCurriculum {
  const isPython = curriculum.courseId === "python-fund";
  const specs = isPython ? PYTHON_LESSONS : curriculum.courseId === "sql" ? SQL_LESSONS : undefined;
  if (!specs) return curriculum;
  const moduleNames = isPython ? ["First programs", "Collections and reusable code", "Reliable input and files", "Build and test a small application"] : ["Read and filter records", "Join and summarise", "Explain analytical queries", "Validate and deliver a report"];
  const modules = curriculum.modules.map((module, moduleIndex) => {
    const lessons = module.lessons.map((lesson, index) => {
      const spec = specs[moduleIndex * 3 + index];
      return spec ? materialize(lesson, spec, isPython ? "python" : "sql") : lesson;
    });
    return { ...module, title: moduleNames[moduleIndex], summary: lessons.map(lesson => lesson.title).join("; ") + ".", lessons };
  });
  const references = [...new Map(modules.flatMap(module => module.lessons.flatMap(lesson => lesson.references)).map(source => [source.url, source])).values()];
  // The original quantity validator and left-join lesson stay in their established positions.
  return { ...curriculum, modules, references,
    overview: isPython ? "Write, run and debug small Python programs. Learn values, decisions, loops, collections, functions, file handling, classes and tests, then build a stock report from fictional CSV data." : "Use SQL to answer practical questions about fictional orders. Filter records, handle missing values, join tables, group results and use window functions, then produce a report whose totals you can reconcile.",
    intendedLearner: isPython ? "Beginners who want to solve small tasks with code, with no previous programming experience required." : "Learners comfortable with spreadsheet rows and columns who want to write and check their own SQL reports.",
    prerequisites: isPython ? ["Create and locate a plain-text file", "Use a terminal or a browser-based Python 3 environment"] : ["Understand rows, columns and basic arithmetic", "Access a PostgreSQL scratch database; most examples also run in SQLite"],
    outcomes: isPython ? ["Run a Python file and interpret its output.", "Use conditions, loops, collections and functions to process records.", "Validate input and read CSV data without hiding errors.", "Write and run tests for normal and failure cases.", "Build a small stock-report program with a clear handover."] : ["Select and filter rows with explicit columns and ordering.", "Handle NULL values without confusing missing information with zero.", "Join and aggregate at the intended row grain.", "Use CTEs and window functions to explain an analytical query.", "Reconcile a final report against its input records."],
    glossary: isPython ? { variable: "A name bound to a value in a program.", function: "A named, reusable operation that can receive arguments and return a value.", list: "An ordered, mutable collection of values.", dictionary: "A mapping from unique keys to values.", exception: "A runtime error or other exceptional condition that interrupts normal execution.", class: "A definition used to create objects with associated data and behaviour.", assertion: "A check that raises AssertionError when its condition is false; useful in tests, not a replacement for input validation.", CSV: "Comma-separated values: a text format for tabular records that requires proper handling of quoting and delimiters." } : { SELECT: "A statement that retrieves rows and computes output columns.", NULL: "A marker for missing or unknown information; it is not a number or an empty string.", grain: "What a single output row represents, such as one customer or one order.", join: "An operation combining rows according to a matching condition.", aggregate: "A function that summarises a set of input rows.", CTE: "A named query introduced with WITH, used within a single statement.", window: "A set of rows related to the current row over which a window function is evaluated.", reconciliation: "Checking that a report's totals agree with independently calculated input totals." },
    finalOutcome: isPython ? "A working Python stock-report script, fictional CSV fixture, automated checks and run instructions." : "A customer order report, self-contained SQL fixtures, expected results and a reconciliation note.",
    practicalOutcome: {
      objective: isPython ? "Build a stock report from a fictional CSV file." : "Produce a customer order report that includes customers with no orders.",
      tools: isPython ? ["Python 3", "Text editor", "Terminal", "Fictional CSV file"] : ["PostgreSQL scratch database", "SQL editor", "Fictional customer and order fixtures"],
      steps: isPython ? ["Define CSV columns for item name, quantity and reorder level.", "Parse quantities as integers and reject missing names or negative values with a useful message.", "Write a function that finds items at or below their reorder level.", "Test empty data, a boundary quantity, invalid numeric text and a normal record.", "Print a readable report and document how to run the script and tests."] : ["Define the output grain as one row per customer.", "Create a small fixture with multiple orders, one unmatched customer and a pending order.", "Join and count paid orders while preserving customers with no matches.", "Check missing values and whether filters change the intended population.", "Reconcile counts and amounts to the source fixture and document the query and limitations."],
      successCriteria: isPython ? ["The same input produces the same ordered report.", "Boundary and invalid inputs have documented behaviour.", "Empty files and bad headers do not produce a misleading success message.", "Tests run with one documented command."] : ["Every intended customer appears once.", "Unmatched customers have a zero matching-order count.", "Paid and pending orders are handled by an explicit rule.", "Report totals agree with an independent input calculation."],
      expectedOutput: isPython ? "stock_report.py, a sample CSV, tests and a short README with example output." : "A runnable query, fixture records, expected-result table and reconciliation note.",
      selfReview: isPython ? ["Can someone run this from my instructions?", "Are malformed records reported clearly?", "Do the tests check a real failure and a boundary?"] : ["What does one report row represent?", "Which rows were excluded and why?", "Can I explain every difference between source totals and report totals?"],
      nextStep: isPython ? "Ask another learner to run your program with one new CSV fixture, then improve the first confusing error message." : "Add a fourth customer and an additional order, predict the new result and rerun the reconciliation.",
    },
  };
}
