"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { COURSES, type Course } from "../courses";

// ── Data ────────────────────────────────────────────────────────────────────

const ALL_COURSES = COURSES;

type Section = { title: string; lessons: string[] };

const CURRICULUM: Record<string, { overview: string[]; sections: Section[] }> = {
  "chatgpt-mastery": {
    overview: ["Master ChatGPT from basic prompts to Custom GPTs","Build automated workflows that save hours per week","Create GPT-based tools for writing, research, and coding","Understand GPT-4o vision, voice, and Advanced Data Analysis"],
    sections: [
      { title:"ChatGPT Foundations",     lessons:["What is ChatGPT and how does it work?","Navigating the GPT-4o interface","ChatGPT vs Claude vs Gemini — picking the right tool","Setting up your workspace and plugins"] },
      { title:"Effective Prompting",      lessons:["The anatomy of a perfect prompt","Role, context, and instruction techniques","Formatting outputs for different use cases","Iterative refinement — get better results in 3 passes"] },
      { title:"Advanced Workflows",       lessons:["Multi-turn conversations and memory","Using system prompts for consistent personas","ChatGPT for coding, debugging, and code review","Research and summarisation at scale"] },
      { title:"Custom GPTs",             lessons:["Building your first Custom GPT","Connecting to external APIs and tools","Creating a customer-support GPT for your business","Publishing and sharing your GPT with others"] },
      { title:"Real-World Applications", lessons:["AI-assisted email and report writing","Competitor research workflows","ChatGPT for entrepreneurs and solo founders","Capstone: build a GPT-powered content system"] },
    ],
  },
  "react-nextjs": {
    overview:["Build production-ready React apps with the latest patterns","Master Next.js App Router with server and client components","Implement authentication, data fetching, and deployment","Ship to Vercel with CI/CD in under an hour"],
    sections:[
      { title:"React Fundamentals",  lessons:["Components, JSX, and the virtual DOM","Props, state, and one-way data flow","Event handling and synthetic events","Lists, keys, and conditional rendering"] },
      { title:"React Hooks",         lessons:["useState — local component state","useEffect — side effects and cleanup","useRef — DOM references and mutable values","useCallback, useMemo, and custom hooks"] },
      { title:"Next.js App Router",  lessons:["Project structure and file-based routing","Server Components vs Client Components","Data fetching: fetch, async components, and caching","Layouts, templates, and nested routes"] },
      { title:"Styling & UX",        lessons:["CSS Modules, Tailwind, and styled-components","Responsive design and mobile-first patterns","Page transitions and animation with Framer Motion","Accessibility fundamentals in React"] },
      { title:"Production & Deploy", lessons:["Environment variables and config","API routes and middleware","Deploying to Vercel — zero config","Performance: Image optimisation, lazy loading, bundle splitting"] },
    ],
  },
  "python-fund": {
    overview:["Go from zero to confident Python developer","Build real projects: file parsers, APIs, data tools","Learn OOP, error handling, and clean code patterns","Solid foundation for data science, automation, and web dev"],
    sections:[
      { title:"Python Basics",          lessons:["Installing Python and VS Code","Variables, data types, and type conversion","String formatting and f-strings","Numbers, arithmetic, and math module"] },
      { title:"Control Flow",           lessons:["if / elif / else branching","for loops and range()","while loops and break/continue","List comprehensions and generator expressions"] },
      { title:"Functions & Modules",    lessons:["Defining and calling functions","Args, kwargs, and default parameters","Lambda functions and closures","Importing standard library modules"] },
      { title:"Data Structures",        lessons:["Lists and tuple operations","Dictionaries and sets","Stacks, queues, and deque","Choosing the right data structure"] },
      { title:"OOP & File I/O",         lessons:["Classes, attributes, and methods","Inheritance and polymorphism","Reading and writing files","Exception handling with try/except/finally"] },
    ],
  },
  "machine-learning": {
    overview:["Build and evaluate ML models from scratch","Cover regression, classification, clustering, and more","Learn to prevent overfitting and tune hyperparameters","Deploy a model as an API — complete end-to-end project"],
    sections:[
      { title:"ML Foundations",      lessons:["What is machine learning?","Supervised vs unsupervised vs reinforcement","The ML pipeline from raw data to predictions","Train/validation/test splits — why it matters"] },
      { title:"Regression",          lessons:["Linear and polynomial regression","Regularisation: Ridge and Lasso","Evaluation: MAE, MSE, RMSE, R²","Project: Predicting house prices"] },
      { title:"Classification",      lessons:["Logistic regression explained","Decision trees and information gain","Random forests and ensemble methods","SVM, K-NN, and Naive Bayes"] },
      { title:"Clustering & PCA",    lessons:["K-Means clustering algorithm","Hierarchical clustering and dendrograms","DBSCAN for density-based clusters","Principal Component Analysis (PCA)"] },
      { title:"Model Deployment",    lessons:["Saving models with joblib and pickle","Building a Flask prediction API","Containerising with Docker","Deploying to cloud (Render / Railway)"] },
    ],
  },
  "html-css": {
    overview:["Build real websites from scratch with zero prior experience","Master Flexbox and Grid — the layout tools every developer uses","Write semantic, accessible HTML that performs well in search","Complete a full responsive landing page as your final project"],
    sections:[
      { title:"HTML Foundations",     lessons:["Document structure and the DOM","Text, headings, links, and images","Forms, inputs, and buttons","HTML5 semantic elements: article, section, aside"] },
      { title:"CSS Fundamentals",     lessons:["Selectors, specificity, and the cascade","The box model: margin, padding, border","Colors, typography, and CSS units","Display, position, and stacking contexts"] },
      { title:"Flexbox Layout",       lessons:["Flex container: direction, wrap, justify","Flex items: grow, shrink, align","Building navigation bars with flexbox","Common UI patterns: cards, hero, footer"] },
      { title:"CSS Grid",             lessons:["Grid template columns and rows","Auto-placement and named grid areas","Overlapping items and layering","Responsive grid with auto-fill and minmax"] },
      { title:"Responsive Design",    lessons:["Mobile-first methodology","Media queries and breakpoints","Fluid typography with clamp()","Capstone: build a fully responsive landing page"] },
    ],
  },
  "javascript": {
    overview:["Go from JavaScript basics to async, APIs, and ES2024","Understand closures, prototypes, and the event loop","Build real projects: to-do app, weather dashboard, quiz game","Learn modern array and object methods used in every codebase"],
    sections:[
      { title:"JS Fundamentals",       lessons:["Variables: var, let, const","Data types and coercion","Functions, scope, and hoisting","Objects and arrays"] },
      { title:"DOM Manipulation",      lessons:["Querying and modifying elements","Event listeners and delegation","Creating and removing DOM nodes","Forms and validation"] },
      { title:"Async JavaScript",      lessons:["The event loop and call stack","Callbacks and callback hell","Promises and .then() chains","Async/await — cleaner async code"] },
      { title:"ES2024 Features",       lessons:["Arrow functions and lexical this","Destructuring and the spread operator","Optional chaining and nullish coalescing","Array: map, filter, reduce, flatMap"] },
      { title:"Projects",              lessons:["To-do app with localStorage","Weather dashboard using the OpenWeather API","JavaScript quiz with score tracking","E-commerce cart — add, remove, checkout"] },
    ],
  },
  "ethical-hacking": {
    overview:["Learn penetration testing the right way — legally and ethically","Set up a full Kali Linux lab environment","Hack web apps, networks, and systems (in a safe lab)","Write professional pentest reports clients actually understand"],
    sections:[
      { title:"Intro to Ethical Hacking",     lessons:["Penetration testing methodology (PTES)","Legal framework and scope of engagement","Setting up Kali Linux VM","Reconnaissance: passive and active"] },
      { title:"Network Scanning",             lessons:["Nmap: host discovery and port scanning","Service and version detection","OS fingerprinting","Vulnerability scanning with Nessus / OpenVAS"] },
      { title:"Exploitation Basics",          lessons:["Metasploit Framework walkthrough","Common CVEs and how to exploit them","Buffer overflows — theory and practice","Post-exploitation: shells and payloads"] },
      { title:"Web App Pentesting",           lessons:["OWASP Top 10 overview","SQL injection — manual and automated","Cross-site scripting (XSS) and CSRF","Burp Suite workflow and Intruder"] },
      { title:"Reporting & Post-Exploitation",lessons:["Privilege escalation on Linux and Windows","Lateral movement and pivoting","Covering tracks responsibly","Writing pentest reports — executive and technical"] },
    ],
  },
  "digital-biz": {
    overview:["Validate and launch a profitable digital business in 90 days","Build an online presence that attracts clients without ads","Package your skills into services people will pay for","Scale from solo to a small team or productised service"],
    sections:[
      { title:"Business Foundations",  lessons:["Finding a profitable niche","Validating demand before you build","Business models: SaaS, agency, info product, consulting","Setting up your online presence on a budget"] },
      { title:"Building Your Offer",   lessons:["Packaging your skills into a service","Pricing strategy — value-based vs hourly","Creating a lead magnet that converts","Shipping your MVP in under 2 weeks"] },
      { title:"Marketing & Growth",    lessons:["Content marketing that compounds over time","Building an email list from zero","Choosing the right social platform for your niche","Paid ads: when to start and how to test"] },
      { title:"Sales & Revenue",       lessons:["Closing clients on discovery calls","Writing proposals that convert","Retainer vs project pricing — pros and cons","Upselling and building long-term client relationships"] },
      { title:"Scaling",               lessons:["Hiring your first contractor","Building SOPs for repeatable delivery","Automating repetitive tasks with no-code tools","From freelance to agency or SaaS product"] },
    ],
  },
  "prompt-engineering": {
    overview:["Write prompts that reliably produce high-quality outputs","Master chain-of-thought, few-shot, and tree-of-thought techniques","Build RAG pipelines that combine retrieval with generation","Understand agentic patterns and function calling in production"],
    sections:[
      { title:"Prompting Fundamentals",  lessons:["How LLMs process prompts at token level","Temperature, top-p, and sampling strategies","Instruction vs conversational prompts","The six elements of a reliable prompt"] },
      { title:"Advanced Techniques",     lessons:["Zero-shot vs few-shot prompting","Chain-of-thought and step-by-step reasoning","Tree of thoughts for complex decisions","Self-consistency and majority voting"] },
      { title:"RAG & Context",           lessons:["What is retrieval-augmented generation?","Chunking strategies and embedding models","Building a simple RAG pipeline with LangChain","Evaluating retrieval precision and recall"] },
      { title:"Agentic Patterns",        lessons:["Tool use and function calling","Multi-agent orchestration","The ReAct pattern: reason + act","Building a research agent from scratch"] },
      { title:"Production Prompting",    lessons:["Prompt versioning and A/B testing","Red-teaming your prompts for safety","Cost optimisation — fewer tokens, same quality","Monitoring and observability for LLM apps"] },
    ],
  },
  "sql-fundamentals": {
    overview:["Write confident SQL for data analysis and backend development","Master JOINs, aggregations, subqueries, and window functions","Understand indexing and query performance","Complete a cohort analysis project using real e-commerce data"],
    sections:[
      { title:"SQL Basics",             lessons:["SELECT, FROM, and WHERE","ORDER BY, LIMIT, and OFFSET","Aliasing columns and tables","Filtering with BETWEEN, IN, and LIKE"] },
      { title:"Joins & Relationships",  lessons:["INNER JOIN — the most common join","LEFT and RIGHT OUTER JOINs","FULL OUTER JOIN and CROSS JOIN","Self-joins and multi-table queries"] },
      { title:"Aggregations",           lessons:["COUNT, SUM, AVG, MIN, MAX","GROUP BY and filtering with HAVING","Nested subqueries","Common Table Expressions (CTEs) with WITH"] },
      { title:"Data Modification",      lessons:["INSERT, UPDATE, DELETE","Transactions and ACID properties","Creating indexes for performance","Views and materialized views"] },
      { title:"Analytical SQL",         lessons:["Window functions: ROW_NUMBER, RANK, DENSE_RANK","LAG, LEAD, and running totals","NTILE for percentile analysis","Capstone: cohort retention analysis"] },
    ],
  },
  "typescript": {
    overview:["Add static types to JavaScript and catch bugs before they run","Master generics, unions, and the utility types you'll use daily","Type real-world code: APIs, React props, and async data","Configure tsconfig and adopt TypeScript in any project"],
    sections:[
      { title:"TypeScript Basics",       lessons:["Why types: catching errors before runtime","Primitives, arrays, and tuples","Type inference vs explicit annotations","tsconfig and the compiler"] },
      { title:"Shaping Data",            lessons:["Interfaces vs type aliases","Union and intersection types","Literal types and enums","Optional, readonly, and index signatures"] },
      { title:"Generics",                lessons:["Writing your first generic function","Constraints with extends","Generic interfaces and classes","Reusable, type-safe utilities"] },
      { title:"Utility & Advanced Types",lessons:["Partial, Pick, Omit, and Record","keyof, typeof, and mapped types","Conditional types and infer","Narrowing and type guards"] },
      { title:"TypeScript in Practice",  lessons:["Typing React props and hooks","Typing API responses and async code","Declaration files and third-party types","Migrating a JavaScript project"] },
    ],
  },
  "node-api": {
    overview:["Build production REST APIs with Node.js and Express","Design clean routes, middleware, and error handling","Add JWT authentication and protect your endpoints","Connect a database and deploy your API"],
    sections:[
      { title:"Node.js Foundations",     lessons:["The event loop and non-blocking I/O","Modules, npm, and package.json","Environment variables and config","Your first HTTP server"] },
      { title:"Express Essentials",      lessons:["Routing: GET, POST, PUT, DELETE","Middleware and the request/response cycle","Parsing JSON bodies and query params","Structuring routes and controllers"] },
      { title:"Designing a REST API",    lessons:["REST principles and resource naming","Choosing the right status codes","Validation and error handling","Pagination, filtering, and sorting"] },
      { title:"Auth & Security",         lessons:["Hashing passwords with bcrypt","JWT authentication and refresh tokens","Protecting routes with middleware","CORS, rate limiting, and secure headers"] },
      { title:"Data & Deploy",           lessons:["Connecting a database (SQL or Mongo)","CRUD through a data layer","Testing your endpoints","Deploying the API to the cloud"] },
    ],
  },
  "deep-learning": {
    overview:["Understand how neural networks actually learn from data","Build and train models with PyTorch and TensorFlow","Master CNNs for images and transformers for sequences","Train, evaluate, and deploy a real deep-learning model"],
    sections:[
      { title:"Neural Network Foundations", lessons:["Neurons, weights, and activation functions","The forward pass and the loss function","Backpropagation and gradient descent","Building a small network from scratch"] },
      { title:"Training Deep Networks",  lessons:["Optimizers: SGD, Adam, learning rate","Overfitting, regularization, and dropout","Batch normalization and initialization","Monitoring training with metrics"] },
      { title:"Convolutional Networks",  lessons:["Convolutions and feature maps","Pooling and CNN architectures","Image classification end to end","Transfer learning with pretrained models"] },
      { title:"Sequences & Transformers",lessons:["RNNs and the vanishing-gradient problem","Attention and self-attention","The transformer architecture","Using pretrained language models"] },
      { title:"From Model to Product",   lessons:["Saving and loading models","Evaluation beyond accuracy","Exporting and serving a model","A complete end-to-end project"] },
    ],
  },
};

// Domain-tailored fallback curricula. Courses without a hand-written entry
// above still get a real, relevant outline for their topic — not a generic
// placeholder. Overviews weave in the course's own title and tags.
const TOPIC_SECTIONS: Record<string, Section[]> = {
  "ai-tools": [
    { title:"Getting Started",      lessons:["How modern AI tools actually work","Choosing the right model for the task","Prompts, context, and iteration basics","Setting up your AI toolkit"] },
    { title:"Core Techniques",      lessons:["Structuring an effective prompt","Giving the model context and constraints","Refining output through iteration","Combining several tools in one workflow"] },
    { title:"Practical Workflows",  lessons:["Research and summarisation","Drafting, editing, and rewriting","Automating repetitive steps","Fact-checking and verifying output"] },
    { title:"Advanced Use",         lessons:["Custom instructions and personas","Connecting tools via APIs and plugins","Cost, rate limits, and privacy","Avoiding hallucinations and errors"] },
    { title:"Capstone Project",     lessons:["Scoping a real workflow to automate","Building it step by step","Testing and refining the results","Packaging it to reuse and share"] },
  ],
  "webdev": [
    { title:"Foundations",          lessons:["How the web works: client, server, HTTP","Setting up your dev environment","Core syntax and project structure","Building your first working page"] },
    { title:"Building Blocks",      lessons:["Structure, styling, and layout","State and interactivity","Reusable components and patterns","Handling user input and forms"] },
    { title:"Data & APIs",          lessons:["Fetching and displaying remote data","Working with JSON and REST APIs","Async patterns and error handling","Basic auth and protected routes"] },
    { title:"Quality & Tooling",    lessons:["Debugging with browser dev tools","Responsive and accessible design","Testing the essentials","Version control with Git"] },
    { title:"Ship It",              lessons:["Preparing a production build","Deploying to the web","Performance and best practices","Capstone: build and deploy a real app"] },
  ],
  "data": [
    { title:"Foundations",          lessons:["The data workflow end to end","Setting up Python, notebooks, and libraries","Loading and inspecting datasets","Types, missing values, and cleaning"] },
    { title:"Wrangling & Analysis", lessons:["Filtering, grouping, and aggregating","Joining and reshaping data","Descriptive statistics that matter","Spotting patterns and outliers"] },
    { title:"Visualisation",        lessons:["Choosing the right chart","Plotting with matplotlib and seaborn","Telling a story with data","Dashboards and reporting basics"] },
    { title:"Modelling",            lessons:["Framing a prediction problem","Train/test splits and evaluation","A first model, start to finish","Avoiding overfitting and data leakage"] },
    { title:"Capstone Project",     lessons:["Picking a real dataset","Cleaning and exploring it","Building and evaluating a model","Presenting your findings"] },
  ],
  "automation": [
    { title:"Automation Foundations", lessons:["What to automate (and what not to)","Triggers, actions, and data flow","Connecting your first two apps","Mapping a manual process"] },
    { title:"Building Workflows",   lessons:["Multi-step scenarios","Filters, routers, and conditions","Working with variables and data","Error handling and retries"] },
    { title:"Working with APIs",    lessons:["Webhooks explained","Calling a REST API from a workflow","Authentication and tokens","Parsing and transforming responses"] },
    { title:"Reliability & Scale",  lessons:["Testing and debugging runs","Rate limits and cost control","Logging and monitoring","Keeping automations maintainable"] },
    { title:"Capstone Project",     lessons:["Designing an end-to-end automation","Building it step by step","Testing the edge cases","Documenting and handing it off"] },
  ],
  "security": [
    { title:"Security Foundations", lessons:["The CIA triad and threat modelling","How attackers think","Common vulnerability classes","Setting up a safe practice lab"] },
    { title:"Core Defences",        lessons:["Authentication and access control","Encryption in transit and at rest","Secure configuration and hardening","Logging, monitoring, and alerting"] },
    { title:"Offensive Basics (Ethical)", lessons:["Reconnaissance and scanning","Exploiting common weaknesses safely","Web app risks: the OWASP Top 10","Reporting findings responsibly"] },
    { title:"Operations",           lessons:["Incident response fundamentals","Patch and vulnerability management","Least privilege in practice","Phishing and security awareness"] },
    { title:"Capstone Project",     lessons:["Assessing a sample system","Documenting risks and fixes","Hardening it step by step","Writing a clear security report"] },
  ],
  "business": [
    { title:"Foundations",          lessons:["Finding a real problem worth solving","Validating demand before you build","Business models that fit your skills","Setting up lean and inexpensively"] },
    { title:"Building the Offer",   lessons:["Packaging skills into a clear offer","Pricing without underselling","Creating something people want","Shipping a minimal first version"] },
    { title:"Getting Customers",    lessons:["Where your first customers are","Content and outreach that works","Landing pages and conversion basics","Selling without being pushy"] },
    { title:"Running It",           lessons:["Delivering reliably and on time","Simple operations and tools","Money basics: invoices, tax, cashflow","Getting feedback and improving"] },
    { title:"Capstone Project",     lessons:["Defining your business idea","Building your offer and page","Getting your first conversations","A concrete 90-day action plan"] },
  ],
  "databases": [
    { title:"Relational Foundations", lessons:["Tables, rows, columns, and keys","Data types and constraints","Designing a simple schema","Setting up your database"] },
    { title:"Querying Data",        lessons:["SELECT, WHERE, and ORDER BY","Joining tables together","Grouping and aggregating","Subqueries and CTEs"] },
    { title:"Modelling & Integrity", lessons:["Normalisation and relationships","Primary and foreign keys","Transactions and ACID","Preventing bad data"] },
    { title:"Performance",          lessons:["How indexes work","Reading a query plan","Common performance pitfalls","Caching and scaling basics"] },
    { title:"Capstone Project",     lessons:["Designing a schema for a real app","Loading and querying data","Optimising the slow queries","Documenting your data model"] },
  ],
  "ethics": [
    { title:"Foundations",          lessons:["Why AI ethics matters now","Fairness, accountability, transparency","Stakeholders and real-world harms","A framework for ethical decisions"] },
    { title:"Bias & Fairness",      lessons:["Where bias enters an ML system","Measuring fairness","Auditing a model or dataset","Mitigation strategies and trade-offs"] },
    { title:"Privacy & Rights",     lessons:["Data protection and consent","Privacy-preserving techniques","Surveillance and civil liberties","GDPR and data rights in practice"] },
    { title:"Governance & Policy",  lessons:["The EU AI Act and global rules","Risk tiers and compliance","Documentation and model cards","Responsible deployment practices"] },
    { title:"Capstone Project",     lessons:["Choosing a real AI system to assess","Identifying risks and impacts","Proposing concrete safeguards","Writing an ethics review"] },
  ],
  "finance": [
    { title:"Foundations",          lessons:["How the financial system fits together","Key instruments and markets","Risk and return basics","Setting up your tools"] },
    { title:"Data & Analysis",      lessons:["Working with financial data","Returns, volatility, and metrics","Time-series basics","Backtesting an idea carefully"] },
    { title:"Core Topics",          lessons:["Valuation fundamentals","Portfolios and diversification","Payments and modern fintech rails","Where blockchain does (and doesn't) help"] },
    { title:"Risk & Judgement",     lessons:["Managing downside risk","Fees, taxes, and real costs","Common mistakes and biases","Non-hype, evidence-based thinking"] },
    { title:"Capstone Project",     lessons:["Framing a finance question","Gathering and cleaning data","Analysing and testing it","Presenting your conclusions"] },
  ],
  "healthcare": [
    { title:"Foundations",          lessons:["Digital health and the care journey","Health data types and standards","Key systems: EHR, imaging, devices","Setting up a safe, compliant workflow"] },
    { title:"Health Data",          lessons:["Interoperability: FHIR and HL7","Working with clinical data","Privacy, HIPAA, and de-identification","Data quality in healthcare"] },
    { title:"AI in Health",         lessons:["Where AI helps in diagnostics","Evaluating clinical models carefully","Bias and safety in medical AI","Regulation and validation"] },
    { title:"Responsible Practice", lessons:["Building a small health-data pipeline","Visualising patient-level data","Guardrails and human oversight","The ethics of health technology"] },
    { title:"Capstone Project",     lessons:["Choosing a realistic use case","Handling data responsibly","Building and evaluating your solution","Communicating results to clinicians"] },
  ],
  "policy": [
    { title:"Foundations",          lessons:["Technology, policy, and public good","How open data creates value","Key institutions and processes","Framing a policy question"] },
    { title:"Working with Data",    lessons:["Finding trustworthy open datasets","Cleaning and analysing public data","Visualising for decision-makers","Communicating uncertainty honestly"] },
    { title:"Governance & Regulation", lessons:["How rules and regulation are made","AI governance frameworks","Digital rights and accountability","Comparing approaches across regions"] },
    { title:"Civic Practice",       lessons:["Designing citizen-facing services","Transparency and participation","Data journalism techniques","Measuring real-world impact"] },
    { title:"Capstone Project",     lessons:["Choosing a public-interest problem","Gathering evidence and data","Proposing a concrete intervention","Presenting to a non-technical audience"] },
  ],
};

const DEFAULT_SECTIONS: Section[] = [
  { title:"Foundations",         lessons:["Core concepts and vocabulary","Setting up your environment","How the pieces fit together","Your first hands-on exercise"] },
  { title:"Core Skills",         lessons:["The fundamentals in depth","Working through real examples","Common patterns and pitfalls","Practice and self-assessment"] },
  { title:"Going Deeper",        lessons:["Intermediate techniques","Integrating with other tools","Real-world use cases","A guided mini-project"] },
  { title:"Applied Practice",    lessons:["Advanced patterns","Quality, testing, and reliability","Performance and trade-offs","A case-study walkthrough"] },
  { title:"Capstone Project",    lessons:["Project brief and requirements","Building it step by step","Review and refinement","Sharing your finished work"] },
];

const TOPIC_LEADS: Record<string, [string, string]> = {
  "ai-tools":   ["Use {title} confidently through hands-on, practical workflows", "Turn {t0} and {t1} into real everyday productivity"],
  "webdev":     ["Build real, working software with {title}", "Get comfortable with {t0}, {t1}, and modern tooling"],
  "data":       ["Work with real data using {title}", "Apply {t0} and {t1} to genuine datasets"],
  "automation": ["Automate real work with {title}", "Connect {t0}, {t1}, and the apps you already use"],
  "security":   ["Build practical security skills with {title}", "Understand {t0} and {t1} the way defenders do"],
  "business":   ["Turn skills into income with {title}", "Apply {t0} and {t1} to a real venture"],
  "databases":  ["Design and query databases with {title}", "Master {t0}, {t1}, and solid data modelling"],
  "ethics":     ["Think clearly about AI's impact with {title}", "Explore {t0}, {t1}, and responsible practice"],
  "finance":    ["Understand finance and fintech with {title}", "Work through {t0}, {t1}, and real data — no hype"],
  "healthcare": ["Explore digital health with {title}", "Handle {t0}, {t1}, and clinical data responsibly"],
  "policy":     ["Use technology for public good with {title}", "Apply {t0}, {t1}, and open data to real questions"],
};

const TOPIC_OUTCOMES: Record<string, [string, string]> = {
  "ai-tools":   ["Build reusable prompt and automation patterns", "Finish with a project you built yourself"],
  "webdev":     ["Write clean, responsive, accessible code", "Ship a project to the web you can show off"],
  "data":       ["Clean, analyse, and visualise with confidence", "Complete an end-to-end data project"],
  "automation": ["Design reliable, maintainable workflows", "Ship an automation that saves you hours"],
  "security":   ["Practise safely in a controlled lab", "Assess and harden a realistic system"],
  "business":   ["Validate, package, price, and sell", "Leave with a concrete 90-day plan"],
  "databases":  ["Write correct, performant queries", "Model the data for a real application"],
  "ethics":     ["Audit systems for bias and risk", "Write a real, structured ethics review"],
  "finance":    ["Reason about risk without the hype", "Complete a hands-on analysis project"],
  "healthcare": ["Respect privacy, safety, and regulation", "Build a realistic health-tech project"],
  "policy":     ["Turn evidence into clear recommendations", "Present findings to a non-technical audience"],
};

function fallbackCurriculum(course: Course): { overview: string[]; sections: Section[] } {
  const t0 = course.tags[0] ?? "the core skills";
  const t1 = course.tags[1] ?? "real projects";
  const fill = (s: string) => s.replace("{title}", course.title).replace("{t0}", t0).replace("{t1}", t1);
  const lead = TOPIC_LEADS[course.topic] ?? ["Build real, practical skills with {title}", "Learn {t0} and {t1} through worked examples"];
  const outcome = TOPIC_OUTCOMES[course.topic] ?? ["Practise with hands-on exercises throughout", "Finish with a project you built yourself"];
  return {
    overview: [fill(lead[0]), fill(lead[1]), outcome[0], outcome[1]],
    sections: TOPIC_SECTIONS[course.topic] ?? DEFAULT_SECTIONS,
  };
}

function DigiLearnLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill="url(#dl-bg-d)"/>
      <path d="M9 27V9l9 6 9-6v18l-9-5-9 5Z" fill="none" stroke="url(#dl-stroke-d)" strokeWidth="2" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="dl-bg-d" x1="0" y1="0" x2="36" y2="36"><stop offset="0%" stopColor="#001A33"/><stop offset="100%" stopColor="#000A1A"/></linearGradient>
        <linearGradient id="dl-stroke-d" x1="9" y1="9" x2="27" y2="27"><stop offset="0%" stopColor="#00D4FF"/><stop offset="100%" stopColor="#0080CC"/></linearGradient>
      </defs>
    </svg>
  );
}

// ── Course detail page ───────────────────────────────────────────────────────

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const course = ALL_COURSES.find((c) => c.id === params.id);
  const [openSection, setOpenSection] = useState<number | null>(0);

  if (!course) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"3rem", marginBottom:16 }}>🔍</div>
          <h1 style={{ fontSize:"1.5rem", marginBottom:12 }}>Course not found</h1>
          <Link href="/courses" style={{ color:"#0284C7", textDecoration:"none", fontWeight:600 }}>← Browse all courses</Link>
        </div>
      </div>
    );
  }

  const content = CURRICULUM[course.id] ?? fallbackCurriculum(course);
  const totalLessons = content.sections.reduce((s, sec) => s + sec.lessons.length, 0);
  const related = ALL_COURSES.filter((c) => c.topic === course.topic && c.id !== course.id).slice(0, 3);

  const levelColor = course.level === "Beginner" ? "#16A34A" : course.level === "Intermediate" ? "#0284C7" : "#7C3AED";

  return (
    <div style={{ minHeight:"100vh", background:"#fff", color:"#0F172A", fontFamily:"'Inter',sans-serif", WebkitFontSmoothing:"antialiased" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{color:inherit;text-decoration:none}
        .nav-c{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.96);border-bottom:1px solid rgba(15,23,42,0.08);backdrop-filter:blur(12px);padding:0 clamp(1rem,4vw,2.5rem);height:60px;display:flex;align-items:center;justify-content:space-between}
        .btn-enroll{background:#0284C7;color:#fff;font-weight:700;border:none;padding:12px 28px;border-radius:10px;font-size:0.9rem;cursor:pointer;width:100%;transition:filter 200ms;font-family:'Inter',sans-serif}
        .btn-enroll:hover{filter:brightness(1.1)}
        .pill-tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:100px;background:rgba(2,132,199,0.1);color:#0284C7;font-size:0.72rem;font-weight:600;border:1px solid rgba(2,132,199,0.2)}
        .section-btn{width:100%;background:none;border:none;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;text-align:left;border-bottom:1px solid rgba(15,23,42,0.06);transition:background 160ms;font-family:'Inter',sans-serif}
        .section-btn:hover{background:rgba(2,132,199,0.04)}
        @media(min-width:1024px){.course-layout{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start}}
        .sidebar{background:#fff;border:1px solid rgba(15,23,42,0.1);border-radius:16px;overflow:hidden;position:sticky;top:76px}
      `}</style>

      {/* Nav */}
      <nav className="nav-c">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10 }}>
          <DigiLearnLogo />
          <span style={{ fontWeight:800, fontSize:"0.95rem" }}>DigiLearn</span>
        </Link>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <Link href="/courses" style={{ fontSize:"0.82rem", color:"#475569" }}>← All Courses</Link>
          <Link href="/practice" style={{ fontSize:"0.82rem", color:"#475569" }}>Practice</Link>
          <Link href="/dashboard" style={{ fontSize:"0.82rem", color:"#475569" }}>Dashboard</Link>
          <Link href="/auth?mode=signup" style={{ background:"#0284C7", color:"#fff", padding:"7px 18px", borderRadius:8, fontSize:"0.82rem", fontWeight:700 }}>
            {course.free ? "Start Free" : "Enroll Now"}
          </Link>
        </div>
      </nav>

      {/* Hero banner */}
      <div style={{ background:course.thumb, padding:"3rem clamp(1.5rem,5vw,3rem)", position:"relative", overflow:"hidden" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize:"0.78rem", marginBottom:16, display:"flex", gap:8, alignItems:"center" }}>
            <Link href="/" style={{ color:"rgba(255,255,255,0.5)" }}>Home</Link>
            <span style={{ color:"rgba(255,255,255,0.3)" }}>›</span>
            <Link href="/courses" style={{ color:"rgba(255,255,255,0.5)" }}>Courses</Link>
            <span style={{ color:"rgba(255,255,255,0.3)" }}>›</span>
            <span style={{ color:"rgba(255,255,255,0.8)" }}>{course.title}</span>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            {course.free && <span style={{ padding:"3px 10px", borderRadius:6, fontSize:"0.65rem", fontWeight:800, background:"rgba(34,197,94,0.9)", color:"#fff", textTransform:"uppercase" }}>FREE</span>}
            <span style={{ padding:"3px 10px", borderRadius:6, fontSize:"0.65rem", fontWeight:700, background:"rgba(255,255,255,0.15)", color:"#fff", textTransform:"uppercase" }}>{course.topic.replace("-"," ")}</span>
          </div>

          <h1 style={{ fontSize:"clamp(1.75rem,4vw,2.75rem)", fontWeight:900, lineHeight:1.2, color:"#fff", marginBottom:14, letterSpacing:"-0.02em", maxWidth:700 }}>
            {course.icon} {course.title}
          </h1>

          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"1rem", lineHeight:1.7, maxWidth:560, marginBottom:20 }}>
            {content.overview[0]}. {content.overview[1]}.
          </p>

          <div style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"center", color:"rgba(255,255,255,0.8)", fontSize:"0.85rem" }}>
            <span>📚 {course.lessons} lessons</span>
            <span>·</span>
            <span>⏱ {course.hours} hours</span>
            <span>·</span>
            <span style={{ color:levelColor === "#16A34A" ? "#86EFAC" : levelColor === "#0284C7" ? "#7DD3FC" : "#C4B5FD" }}>{course.level}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem clamp(1rem,4vw,2rem)" }}>
        <div className="course-layout">

          {/* Left column */}
          <div>

            {/* What you'll learn */}
            <div style={{ border:"1px solid rgba(15,23,42,0.1)", borderRadius:14, padding:"1.75rem", marginBottom:28 }}>
              <h2 style={{ fontSize:"1.1rem", fontWeight:800, marginBottom:16 }}>What you&apos;ll learn</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 20px" }}>
                {content.overview.map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:"0.875rem" }}>
                    <span style={{ color:"#16A34A", marginTop:2, flexShrink:0 }}>✓</span>
                    <span style={{ color:"#334155" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28 }}>
              {course.tags.map((t) => <span key={t} className="pill-tag">{t}</span>)}
              <span className="pill-tag" style={{ background:"rgba(124,58,237,0.1)", color:"#7C3AED", borderColor:"rgba(124,58,237,0.2)" }}>{course.level}</span>
            </div>

            {/* Curriculum */}
            <div style={{ marginBottom:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16 }}>
                <h2 style={{ fontSize:"1.1rem", fontWeight:800 }}>Course Curriculum</h2>
                <span style={{ fontSize:"0.78rem", color:"#64748B" }}>{content.sections.length} sections · {totalLessons} lessons · {course.hours}h</span>
              </div>

              <div style={{ border:"1px solid rgba(15,23,42,0.1)", borderRadius:12, overflow:"hidden" }}>
                {content.sections.map((sec, si) => (
                  <div key={si}>
                    <button className="section-btn" onClick={() => setOpenSection(openSection === si ? null : si)}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:"0.82rem", fontWeight:700, color:"#1E293B" }}>{sec.title}</span>
                        <span style={{ fontSize:"0.72rem", color:"#94A3B8" }}>{sec.lessons.length} lessons</span>
                      </div>
                      <span style={{ color:"#64748B", fontSize:"0.9rem", transition:"transform 200ms", transform:openSection === si ? "rotate(180deg)" : "none" }}>▾</span>
                    </button>

                    {openSection === si && (
                      <div style={{ background:"#FAFAFA", borderBottom:"1px solid rgba(15,23,42,0.06)" }}>
                        {sec.lessons.map((lesson, li) => (
                          <div key={li} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 18px", borderBottom: li < sec.lessons.length - 1 ? "1px solid rgba(15,23,42,0.05)" : "none" }}>
                            <div style={{ width:22, height:22, borderRadius:"50%", border:"1px solid rgba(2,132,199,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <span style={{ fontSize:"0.55rem", color:"#0284C7" }}>▶</span>
                            </div>
                            <span style={{ fontSize:"0.85rem", color:"#334155" }}>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Related courses */}
            {related.length > 0 && (
              <div>
                <h2 style={{ fontSize:"1.1rem", fontWeight:800, marginBottom:16 }}>More {course.topic.replace("-"," ")} courses</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
                  {related.map((r) => (
                    <Link key={r.id} href={`/courses/${r.id}`} style={{ border:"1px solid rgba(15,23,42,0.09)", borderRadius:12, overflow:"hidden", display:"block", transition:"box-shadow 200ms" }}>
                      <div style={{ background:r.thumb, height:90, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem" }}>{r.icon}</div>
                      <div style={{ padding:"12px" }}>
                        <div style={{ fontWeight:700, fontSize:"0.82rem", marginBottom:4, lineHeight:1.3 }}>{r.title}</div>
                        <div style={{ fontSize:"0.72rem", color:"#64748B" }}>{r.lessons} lessons · {r.level}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sidebar">
              <div style={{ background:course.thumb, height:160, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"4rem" }}>{course.icon}</div>
              <div style={{ padding:"1.5rem" }}>
                <div style={{ fontSize:"1.6rem", fontWeight:900, marginBottom:4, letterSpacing:"-0.02em" }}>
                  {course.free ? <span style={{ color:"#16A34A" }}>Free</span> : "$49"}
                </div>
                {!course.free && <div style={{ fontSize:"0.75rem", color:"#94A3B8", marginBottom:14 }}>One-time · Lifetime access</div>}
                <button className="btn-enroll" style={{ marginBottom:10 }}>
                  {course.free ? "Start Learning — Free →" : "Enroll Now →"}
                </button>
                <Link href="/auth?mode=signup" style={{ display:"block", textAlign:"center", padding:"10px", borderRadius:10, border:"1px solid rgba(15,23,42,0.12)", fontSize:"0.82rem", color:"#475569", fontWeight:600, transition:"background 160ms" }}>
                  Try Pro — 7 days free
                </Link>

                <div style={{ marginTop:20, padding:"14px 0", borderTop:"1px solid rgba(15,23,42,0.08)" }}>
                  <div style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#94A3B8", marginBottom:10 }}>This course includes</div>
                  {[
                    `${course.lessons} on-demand lessons`,
                    `${course.hours} hours of content`,
                    "Full lifetime access",
                    "Certificate of completion",
                    "Community access",
                  ].map((item) => (
                    <div key={item} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8, fontSize:"0.82rem", color:"#334155" }}>
                      <span style={{ color:"#16A34A" }}>✓</span> {item}
                    </div>
                  ))}
                </div>

                <div style={{ padding:"14px 0", borderTop:"1px solid rgba(15,23,42,0.08)" }}>
                  <div style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#94A3B8", marginBottom:10 }}>Share this course</div>
                  <div style={{ display:"flex", gap:8 }}>
                    {["Copy link","LinkedIn","Twitter"].map((s) => (
                      <button key={s} style={{ flex:1, padding:"7px 4px", borderRadius:8, border:"1px solid rgba(15,23,42,0.1)", background:"none", fontSize:"0.65rem", fontWeight:600, cursor:"pointer", color:"#475569", fontFamily:"'Inter',sans-serif" }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
