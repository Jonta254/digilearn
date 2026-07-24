"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ── Data ────────────────────────────────────────────────────────────────────

type Course = {
  id: string; title: string; author: string; icon: string; thumb: string;
  lessons: number; hours: number; rating: number; reviews: number; level: string;
  topic: string; tags: string[]; badge: string; free: boolean;
};

const ALL_COURSES: Course[] = [
  { id:"chatgpt-mastery",    title:"ChatGPT & GPT-4o Mastery",           author:"Nadia Osei",   icon:"🤖", thumb:"linear-gradient(135deg,#0A0F2E,#1A1060)", lessons:38, hours:20, rating:4.9, reviews:8200,  level:"Beginner",     topic:"ai-tools",   tags:["ChatGPT","GPT-4o","Custom GPTs"],             badge:"bestseller",   free:true  },
  { id:"claude-mastery",     title:"Claude — Advanced AI Workflows",       author:"Marcus Chen",  icon:"🧬", thumb:"linear-gradient(135deg,#0D0A1A,#2D0A5A)", lessons:34, hours:18, rating:5.0, reviews:3100,  level:"Intermediate", topic:"ai-tools",   tags:["Claude","Long-context","API"],                badge:"new",          free:false },
  { id:"prompt-engineering", title:"Prompt Engineering Pro",               author:"Yuki Tanaka",  icon:"🧠", thumb:"linear-gradient(135deg,#0D001A,#6600CC)", lessons:44, hours:24, rating:5.0, reviews:5600,  level:"Intermediate", topic:"ai-tools",   tags:["Prompting","Chain-of-thought","RAG"],          badge:"hot",          free:false },
  { id:"midjourney",         title:"Midjourney & AI Image Generation",     author:"Sofia Reyes",  icon:"🎨", thumb:"linear-gradient(135deg,#1A0010,#800040)", lessons:32, hours:16, rating:4.8, reviews:4100,  level:"Beginner",     topic:"ai-tools",   tags:["Midjourney","DALL·E 3","Stable Diffusion"],   badge:"",             free:false },
  { id:"copilot-dev",        title:"GitHub Copilot for Developers",        author:"Leon Bauer",   icon:"🤝", thumb:"linear-gradient(135deg,#0A1000,#1A3300)", lessons:28, hours:14, rating:4.7, reviews:2890,  level:"Intermediate", topic:"ai-tools",   tags:["Copilot","AI coding","Code review"],           badge:"",             free:false },
  { id:"perplexity-gemini",  title:"AI Research: Perplexity & Gemini",    author:"Amara Diallo", icon:"🔍", thumb:"linear-gradient(135deg,#001A10,#003322)", lessons:24, hours:12, rating:4.7, reviews:1800,  level:"Beginner",     topic:"ai-tools",   tags:["Perplexity","Gemini","AI search"],             badge:"new",          free:true  },
  { id:"ai-writing",         title:"AI Writing & Content Creation",        author:"Nadia Osei",   icon:"✍️", thumb:"linear-gradient(135deg,#0A0510,#330050)", lessons:30, hours:14, rating:4.6, reviews:3300,  level:"Beginner",     topic:"ai-tools",   tags:["AI writing","Jasper","Copy.ai"],               badge:"",             free:false },
  { id:"sora-video",         title:"AI Video: Sora & RunwayML",            author:"Marcus Chen",  icon:"🎬", thumb:"linear-gradient(135deg,#1A0500,#660020)", lessons:26, hours:13, rating:4.8, reviews:2200,  level:"Beginner",     topic:"ai-tools",   tags:["Sora","RunwayML","HeyGen"],                   badge:"new",          free:false },
  { id:"ai-productivity",    title:"AI Productivity System",               author:"Yuki Tanaka",  icon:"⚡", thumb:"linear-gradient(135deg,#001520,#003355)", lessons:22, hours:10, rating:4.9, reviews:6700,  level:"Beginner",     topic:"ai-tools",   tags:["Notion AI","Copilot 365","AI workflow"],       badge:"bestseller",   free:true  },
  { id:"llm-agents",         title:"Building AI Agents & LLM Apps",        author:"Leon Bauer",   icon:"🤖", thumb:"linear-gradient(135deg,#0A0020,#200055)", lessons:48, hours:26, rating:4.8, reviews:1900,  level:"Advanced",     topic:"ai-tools",   tags:["LangChain","AutoGPT","Agents"],                badge:"hot",          free:false },
  { id:"html-css",           title:"HTML & CSS Mastery",                   author:"Elena Torres", icon:"🌐", thumb:"linear-gradient(135deg,#001A33,#003366)", lessons:48, hours:24, rating:4.9, reviews:9100,  level:"Beginner",     topic:"webdev",     tags:["HTML","CSS","Flexbox","Grid"],                 badge:"most enrolled",free:true  },
  { id:"javascript",         title:"JavaScript: Zero to Pro",              author:"James Okafor", icon:"⚡", thumb:"linear-gradient(135deg,#1A0D00,#CC6200)", lessons:62, hours:36, rating:4.8, reviews:7800,  level:"Beginner",     topic:"webdev",     tags:["JS","ES2024","Async","DOM"],                   badge:"",             free:false },
  { id:"react-nextjs",       title:"React & Next.js 16",                  author:"Priya Nair",   icon:"⚛️", thumb:"linear-gradient(135deg,#001520,#006080)", lessons:54, hours:32, rating:4.9, reviews:6200,  level:"Intermediate", topic:"webdev",     tags:["React","Next.js","App Router"],                badge:"hot",          free:false },
  { id:"typescript",         title:"TypeScript Deep Dive",                 author:"Leon Bauer",   icon:"🔷", thumb:"linear-gradient(135deg,#0A0530,#2A1590)", lessons:38, hours:20, rating:4.7, reviews:2900,  level:"Intermediate", topic:"webdev",     tags:["TypeScript","Generics","Utility Types"],       badge:"",             free:false },
  { id:"tailwind",           title:"Tailwind CSS v4 Complete",             author:"Sofia Reyes",  icon:"🌊", thumb:"linear-gradient(135deg,#001520,#004455)", lessons:32, hours:16, rating:4.8, reviews:3400,  level:"Beginner",     topic:"webdev",     tags:["Tailwind","Components","UI"],                  badge:"",             free:true  },
  { id:"node-api",           title:"Node.js & REST APIs",                  author:"James Okafor", icon:"🟢", thumb:"linear-gradient(135deg,#0A2B12,#1A6628)", lessons:44, hours:26, rating:4.8, reviews:4100,  level:"Intermediate", topic:"webdev",     tags:["Node","Express","REST","JWT"],                 badge:"",             free:false },
  { id:"fullstack",          title:"Fullstack: Next.js + Supabase",        author:"Priya Nair",   icon:"🚀", thumb:"linear-gradient(135deg,#001000,#003300)", lessons:60, hours:40, rating:4.9, reviews:3800,  level:"Intermediate", topic:"webdev",     tags:["Next.js","Supabase","Auth","Edge"],            badge:"new",          free:false },
  { id:"react-native",       title:"React Native — Mobile Apps",           author:"Elena Torres", icon:"📱", thumb:"linear-gradient(135deg,#001A33,#005588)", lessons:46, hours:28, rating:4.7, reviews:2400,  level:"Intermediate", topic:"webdev",     tags:["React Native","Expo","iOS","Android"],         badge:"",             free:false },
  { id:"python-fund",        title:"Python Fundamentals",                  author:"Aisha Bashir", icon:"🐍", thumb:"linear-gradient(135deg,#0A1A05,#1A5C0A)", lessons:52, hours:30, rating:4.9, reviews:11000, level:"Beginner",     topic:"data",       tags:["Python","OOP","File I/O"],                     badge:"most enrolled",free:true  },
  { id:"python-ai",          title:"Python for AI & Data Science",         author:"Kevin Park",   icon:"🤖", thumb:"linear-gradient(135deg,#001800,#004400)", lessons:58, hours:34, rating:4.9, reviews:5200,  level:"Beginner",     topic:"data",       tags:["Python","NumPy","Pandas","Matplotlib"],        badge:"hot",          free:true  },
  { id:"machine-learning",   title:"Machine Learning A-Z",                 author:"Aisha Bashir", icon:"⚙️", thumb:"linear-gradient(135deg,#0A0500,#331A00)", lessons:68, hours:44, rating:4.9, reviews:8900,  level:"Intermediate", topic:"data",       tags:["Scikit-learn","Regression","Classification"],   badge:"bestseller",   free:false },
  { id:"deep-learning",      title:"Deep Learning & Neural Networks",      author:"Kevin Park",   icon:"🧬", thumb:"linear-gradient(135deg,#0A0020,#1A0040)", lessons:62, hours:38, rating:4.8, reviews:4400,  level:"Advanced",     topic:"data",       tags:["PyTorch","TensorFlow","CNN","Transformers"],   badge:"",             free:false },
  { id:"nlp",                title:"Natural Language Processing",          author:"Yuki Tanaka",  icon:"💬", thumb:"linear-gradient(135deg,#001A00,#003300)", lessons:44, hours:26, rating:4.8, reviews:2200,  level:"Advanced",     topic:"data",       tags:["NLP","Transformers","BERT","LLMs"],            badge:"new",          free:false },
  { id:"sql",                title:"SQL for Data Analysis",                author:"Elena Torres", icon:"🗄️", thumb:"linear-gradient(135deg,#0A0500,#442200)", lessons:36, hours:18, rating:4.7, reviews:5600,  level:"Beginner",     topic:"data",       tags:["SQL","PostgreSQL","Analytics","Joins"],        badge:"",             free:true  },
  { id:"ethical-hacking",    title:"Ethical Hacking & Penetration Testing",author:"Rafael Méndez",icon:"🧑‍💻",thumb:"linear-gradient(135deg,#0A0010,#220033)", lessons:60, hours:38, rating:4.9, reviews:4200,  level:"Advanced",     topic:"security",   tags:["Ethical hacking","Kali Linux","OWASP","CTF"],  badge:"hot",          free:false },
  { id:"digital-biz",        title:"Build a Digital Business from Scratch",author:"Fatou Ndiaye", icon:"🏪", thumb:"linear-gradient(135deg,#1A0A00,#5C2200)", lessons:48, hours:28, rating:4.9, reviews:4800,  level:"Beginner",     topic:"business",   tags:["Business","Freelancing","SaaS","Revenue"],     badge:"hot",          free:false },
  { id:"sql-fundamentals",   title:"SQL & Relational Databases",           author:"Elena Torres", icon:"🗄️", thumb:"linear-gradient(135deg,#0A1520,#1A3A5C)", lessons:42, hours:22, rating:4.8, reviews:6200,  level:"Beginner",     topic:"databases",  tags:["SQL","PostgreSQL","MySQL","Joins","Indexing"],  badge:"most enrolled",free:true  },
  { id:"ai-ethics-fundamentals",title:"AI Ethics: Principles & Practice", author:"Amara Diallo", icon:"⚖️", thumb:"linear-gradient(135deg,#1A1200,#553C00)", lessons:36, hours:18, rating:4.8, reviews:3100,  level:"Beginner",     topic:"ethics",     tags:["AI Ethics","Bias","Fairness","Transparency"],  badge:"most enrolled",free:true  },
  { id:"fintech-fundamentals",title:"Fintech Fundamentals",                author:"Rafael Méndez",icon:"💳", thumb:"linear-gradient(135deg,#001A0A,#004D25)", lessons:38, hours:20, rating:4.8, reviews:2800,  level:"Beginner",     topic:"finance",    tags:["Fintech","Payments","Banking","Open Banking"],  badge:"hot",          free:true  },
];

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
};

function genericCurriculum(title: string): { overview: string[]; sections: Section[] } {
  return {
    overview:[
      `Build real skills in ${title} from the ground up`,
      "Hands-on projects throughout every module",
      "Learn at your own pace — no deadlines",
      "Certificate of completion included",
    ],
    sections:[
      { title:"Introduction & Setup",     lessons:["Welcome to the course","Setting up your environment","Core concepts overview","Your first hands-on exercise"] },
      { title:"Core Skills",             lessons:["Fundamentals deep dive","Working with real examples","Common patterns and best practices","Exercises and self-assessment"] },
      { title:"Intermediate Topics",     lessons:["Going deeper — intermediate concepts","Real-world use cases","Integrating with other tools","Mini-project"] },
      { title:"Advanced Applications",   lessons:["Advanced patterns and architectures","Performance and optimisation","Security considerations","Case study walkthrough"] },
      { title:"Capstone Project",        lessons:["Project brief and requirements","Building the project step by step","Review and refactoring","Deploying and sharing your work"] },
    ],
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

  const content = CURRICULUM[course.id] ?? genericCurriculum(course.title);
  const totalLessons = content.sections.reduce((s, sec) => s + sec.lessons.length, 0);
  const related = ALL_COURSES.filter((c) => c.topic === course.topic && c.id !== course.id).slice(0, 3);

  const badgeBg = course.badge === "bestseller" || course.badge === "most enrolled"
    ? "rgba(251,191,36,0.9)" : course.badge === "hot" ? "rgba(244,63,94,0.9)"
    : course.badge ? "rgba(0,212,255,0.9)" : "transparent";
  const badgeColor = course.badge === "hot" ? "#fff" : "#000";

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
            {course.badge && (
              <span style={{ padding:"3px 10px", borderRadius:6, fontSize:"0.65rem", fontWeight:800, textTransform:"uppercase", background:badgeBg, color:badgeColor }}>{course.badge}</span>
            )}
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
            <span style={{ color:"#FDE68A", fontWeight:700 }}>★ {course.rating}</span>
            <span>({course.reviews.toLocaleString()} reviews)</span>
            <span>·</span>
            <span>📚 {course.lessons} lessons</span>
            <span>·</span>
            <span>⏱ {course.hours} hours</span>
            <span>·</span>
            <span style={{ color:levelColor === "#16A34A" ? "#86EFAC" : levelColor === "#0284C7" ? "#7DD3FC" : "#C4B5FD" }}>{course.level}</span>
          </div>

          <div style={{ marginTop:14, fontSize:"0.85rem", color:"rgba(255,255,255,0.6)" }}>
            Instructor: <span style={{ color:"rgba(255,255,255,0.9)", fontWeight:600 }}>{course.author}</span>
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
                            <span style={{ marginLeft:"auto", fontSize:"0.72rem", color:"#94A3B8" }}>{Math.floor(Math.random() * 12 + 4)}:{String(Math.floor(Math.random() * 60)).padStart(2,"0")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div style={{ border:"1px solid rgba(15,23,42,0.1)", borderRadius:14, padding:"1.5rem", marginBottom:32 }}>
              <h2 style={{ fontSize:"1.1rem", fontWeight:800, marginBottom:14 }}>Your Instructor</h2>
              <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,#0284C7,#7C3AED)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:"1.1rem", flexShrink:0 }}>
                  {course.author.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:"1rem", marginBottom:4 }}>{course.author}</div>
                  <div style={{ fontSize:"0.82rem", color:"#64748B", marginBottom:8 }}>Senior Instructor · DigiLearn</div>
                  <p style={{ fontSize:"0.875rem", color:"#475569", lineHeight:1.65 }}>
                    {course.author.split(" ")[0]} is an industry practitioner with 10+ years of experience in {course.tags.slice(0,2).join(" and ")}. They&apos;ve taught over {(course.reviews / 10).toFixed(0)} students through real-world, project-based courses.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontSize:"1.1rem", fontWeight:800, marginBottom:16 }}>Student Reviews</h2>
              {[
                { name:"Alex T.",      text:`This course is exactly what I needed. ${course.author}'s teaching style made complex concepts click instantly.`, stars:5, date:"Jun 2026" },
                { name:"Priya M.",     text:`Best ${course.tags[0]} course I've taken. The hands-on projects are genuinely useful, not just toy examples.`, stars:5, date:"May 2026" },
                { name:"James O.",     text:"Clear, concise, and up-to-date. I applied what I learned on day one of the next section.", stars:4, date:"Apr 2026" },
              ].map((r) => (
                <div key={r.name} style={{ padding:"1.25rem 0", borderBottom:"1px solid rgba(15,23,42,0.07)" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#E2E8F0", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.82rem", color:"#475569" }}>{r.name[0]}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"0.875rem" }}>{r.name}</div>
                      <div style={{ fontSize:"0.72rem", color:"#94A3B8" }}>{r.date}</div>
                    </div>
                    <div style={{ marginLeft:"auto", color:"#FBBF24" }}>{"★".repeat(r.stars)}</div>
                  </div>
                  <p style={{ fontSize:"0.875rem", color:"#475569", lineHeight:1.65 }}>{r.text}</p>
                </div>
              ))}
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
                        <div style={{ fontSize:"0.72rem", color:"#64748B" }}>★ {r.rating} · {r.lessons} lessons</div>
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
