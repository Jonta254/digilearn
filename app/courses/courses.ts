// Single source of truth for the course catalogue.
// Only real, structural fields â€” no fabricated instructors, ratings, or review
// counts. Imported by both the listing (/courses) and the detail (/courses/[id])
// pages so every listed course resolves to a working detail page.

export type Course = {
  id: string;
  title: string;
  icon: string;
  thumb: string;
  lessons: number;
  hours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  topic: string;
  tags: string[];
  free: boolean;
};

export const COURSES: Course[] = [
  // â”€â”€ AI TOOLS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"chatgpt-mastery", title:"ChatGPT & GPT-4o Mastery", icon:"", thumb:"linear-gradient(135deg,#0A0F2E,#1A1060)", lessons:38, hours:20, level:"Beginner", topic:"ai-tools", tags:["ChatGPT","GPT-4o","Custom GPTs"], free:true },
  { id:"claude-mastery",  title:"Claude â€” Advanced AI Workflows", icon:"", thumb:"linear-gradient(135deg,#0D0A1A,#2D0A5A)", lessons:34, hours:18, level:"Intermediate", topic:"ai-tools", tags:["Claude","Long-context","API"], free:false },
  { id:"prompt-engineering", title:"Prompt Engineering Pro", icon:"", thumb:"linear-gradient(135deg,#0D001A,#6600CC)", lessons:44, hours:24, level:"Intermediate", topic:"ai-tools", tags:["Prompting","Chain-of-thought","RAG"], free:false },
  { id:"midjourney", title:"Midjourney & AI Image Generation", icon:"", thumb:"linear-gradient(135deg,#1A0010,#800040)", lessons:32, hours:16, level:"Beginner", topic:"ai-tools", tags:["Midjourney","DALLÂ·E 3","Stable Diffusion"], free:false },
  { id:"copilot-dev", title:"GitHub Copilot for Developers", icon:"", thumb:"linear-gradient(135deg,#0A1000,#1A3300)", lessons:28, hours:14, level:"Intermediate", topic:"ai-tools", tags:["Copilot","AI coding","Code review"], free:false },
  { id:"perplexity-gemini", title:"AI Research: Perplexity & Gemini", icon:"", thumb:"linear-gradient(135deg,#001A10,#003322)", lessons:24, hours:12, level:"Beginner", topic:"ai-tools", tags:["Perplexity","Gemini","AI search"], free:true },
  { id:"ai-writing", title:"AI Writing & Content Creation", icon:"", thumb:"linear-gradient(135deg,#0A0510,#330050)", lessons:30, hours:14, level:"Beginner", topic:"ai-tools", tags:["AI writing","Jasper","Copy.ai"], free:false },
  { id:"sora-video", title:"AI Video: Sora & RunwayML", icon:"", thumb:"linear-gradient(135deg,#1A0500,#660020)", lessons:26, hours:13, level:"Beginner", topic:"ai-tools", tags:["Sora","RunwayML","HeyGen"], free:false },
  { id:"ai-productivity", title:"AI Productivity System", icon:"", thumb:"linear-gradient(135deg,#001520,#003355)", lessons:22, hours:10, level:"Beginner", topic:"ai-tools", tags:["Notion AI","Copilot 365","AI workflow"], free:true },
  { id:"llm-agents", title:"Building AI Agents & LLM Apps", icon:"", thumb:"linear-gradient(135deg,#0A0020,#200055)", lessons:48, hours:26, level:"Advanced", topic:"ai-tools", tags:["LangChain","AutoGPT","Agents"], free:false },
  { id:"ai-audio", title:"AI Music & Audio Creation", icon:"", thumb:"linear-gradient(135deg,#0A0010,#440020)", lessons:20, hours:10, level:"Beginner", topic:"ai-tools", tags:["Suno","ElevenLabs","Mubert"], free:false },

  // â”€â”€ WEB DEVELOPMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"html-css", title:"HTML & CSS Mastery", icon:"", thumb:"linear-gradient(135deg,#001A33,#003366)", lessons:48, hours:24, level:"Beginner", topic:"webdev", tags:["HTML","CSS","Flexbox","Grid"], free:true },
  { id:"javascript", title:"JavaScript: Zero to Pro", icon:"", thumb:"linear-gradient(135deg,#1A0D00,#CC6200)", lessons:62, hours:36, level:"Beginner", topic:"webdev", tags:["JS","ES2024","Async","DOM"], free:false },
  { id:"react-nextjs", title:"React & Next.js 16", icon:"", thumb:"linear-gradient(135deg,#001520,#006080)", lessons:54, hours:32, level:"Intermediate", topic:"webdev", tags:["React","Next.js","App Router"], free:false },
  { id:"typescript", title:"TypeScript Deep Dive", icon:"", thumb:"linear-gradient(135deg,#0A0530,#2A1590)", lessons:38, hours:20, level:"Intermediate", topic:"webdev", tags:["TypeScript","Generics","Utility Types"], free:false },
  { id:"tailwind", title:"Tailwind CSS v4 Complete", icon:"", thumb:"linear-gradient(135deg,#001520,#004455)", lessons:32, hours:16, level:"Beginner", topic:"webdev", tags:["Tailwind","Components","UI"], free:true },
  { id:"node-api", title:"Node.js & REST APIs", icon:"", thumb:"linear-gradient(135deg,#0A2B12,#1A6628)", lessons:44, hours:26, level:"Intermediate", topic:"webdev", tags:["Node","Express","REST","JWT"], free:false },
  { id:"fullstack", title:"Fullstack: Next.js + Supabase", icon:"", thumb:"linear-gradient(135deg,#001000,#003300)", lessons:60, hours:40, level:"Intermediate", topic:"webdev", tags:["Next.js","Supabase","Auth","Edge"], free:false },
  { id:"react-native", title:"React Native â€” Mobile Apps", icon:"", thumb:"linear-gradient(135deg,#001A33,#005588)", lessons:46, hours:28, level:"Intermediate", topic:"webdev", tags:["React Native","Expo","iOS","Android"], free:false },

  // â”€â”€ PYTHON & DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"python-fund", title:"Python Fundamentals", icon:"", thumb:"linear-gradient(135deg,#0A1A05,#1A5C0A)", lessons:52, hours:30, level:"Beginner", topic:"data", tags:["Python","OOP","File I/O"], free:true },
  { id:"python-ai", title:"Python for AI & Data Science", icon:"", thumb:"linear-gradient(135deg,#001800,#004400)", lessons:58, hours:34, level:"Beginner", topic:"data", tags:["Python","NumPy","Pandas","Matplotlib"], free:true },
  { id:"machine-learning", title:"Machine Learning A-Z", icon:"", thumb:"linear-gradient(135deg,#0A0500,#331A00)", lessons:68, hours:44, level:"Intermediate", topic:"data", tags:["Scikit-learn","Regression","Classification","Clustering"], free:false },
  { id:"deep-learning", title:"Deep Learning & Neural Networks", icon:"", thumb:"linear-gradient(135deg,#0A0020,#1A0040)", lessons:62, hours:38, level:"Advanced", topic:"data", tags:["PyTorch","TensorFlow","CNN","Transformers"], free:false },
  { id:"nlp", title:"Natural Language Processing", icon:"", thumb:"linear-gradient(135deg,#001A00,#003300)", lessons:44, hours:26, level:"Advanced", topic:"data", tags:["NLP","Transformers","BERT","LLMs"], free:false },
  { id:"sql", title:"SQL for Data Analysis", icon:"", thumb:"linear-gradient(135deg,#0A0500,#442200)", lessons:36, hours:18, level:"Beginner", topic:"data", tags:["SQL","PostgreSQL","Analytics","Joins"], free:true },
  { id:"data-viz", title:"Data Visualization â€” Tableau & Python", icon:"", thumb:"linear-gradient(135deg,#001000,#1A3300)", lessons:32, hours:16, level:"Intermediate", topic:"data", tags:["Tableau","Plotly","Seaborn","Dashboards"], free:false },

  // â”€â”€ AUTOMATION & NO-CODE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"make-automation", title:"Make (Integromat) â€” Automate Everything", icon:"", thumb:"linear-gradient(135deg,#001A0D,#005533)", lessons:34, hours:18, level:"Beginner", topic:"automation", tags:["Make","Webhooks","API","Workflows"], free:false },
  { id:"n8n", title:"n8n Self-Hosted Automation", icon:"", thumb:"linear-gradient(135deg,#0A1000,#1A2200)", lessons:28, hours:14, level:"Intermediate", topic:"automation", tags:["n8n","Self-hosted","AI nodes"], free:false },
  { id:"zapier", title:"Zapier for Business Automation", icon:"", thumb:"linear-gradient(135deg,#1A0A00,#552200)", lessons:26, hours:12, level:"Beginner", topic:"automation", tags:["Zapier","Business","CRM","Email"], free:false },
  { id:"airtable", title:"Airtable â€” No-Code Database Apps", icon:"", thumb:"linear-gradient(135deg,#001A0D,#003311)", lessons:24, hours:12, level:"Beginner", topic:"automation", tags:["Airtable","No-code","Database","Views"], free:false },
  { id:"notion-system", title:"Notion â€” Build Your Second Brain", icon:"", thumb:"linear-gradient(135deg,#0A0A0A,#1A1A20)", lessons:20, hours:10, level:"Beginner", topic:"automation", tags:["Notion","PKM","Templates","AI"], free:true },
  { id:"webflow", title:"Webflow â€” No-Code Web Design", icon:"", thumb:"linear-gradient(135deg,#001A33,#003355)", lessons:36, hours:18, level:"Beginner", topic:"automation", tags:["Webflow","CMS","Interactions"], free:false },

  // â”€â”€ CYBERSECURITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"security-fundamentals", title:"Cybersecurity Fundamentals", icon:"", thumb:"linear-gradient(135deg,#150000,#440010)", lessons:46, hours:24, level:"Beginner", topic:"security", tags:["Security","Threats","Firewalls","OWASP"], free:false },
  { id:"ethical-hacking", title:"Ethical Hacking & Penetration Testing", icon:"", thumb:"linear-gradient(135deg,#0A0010,#220033)", lessons:60, hours:38, level:"Advanced", topic:"security", tags:["Ethical hacking","Kali Linux","OWASP","CTF"], free:false },
  { id:"network-security", title:"Network Security & Firewalls", icon:"", thumb:"linear-gradient(135deg,#001520,#003340)", lessons:38, hours:20, level:"Intermediate", topic:"security", tags:["Network","Firewalls","VPN","Zero Trust"], free:false },
  { id:"privacy-tools", title:"Digital Privacy & OPSEC", icon:"", thumb:"linear-gradient(135deg,#0A0510,#200035)", lessons:26, hours:13, level:"Beginner", topic:"security", tags:["Privacy","VPN","Tor","OPSEC"], free:true },
  { id:"cloud-security", title:"Cloud Security â€” AWS & GCP", icon:"", thumb:"linear-gradient(135deg,#001A33,#002244)", lessons:44, hours:24, level:"Intermediate", topic:"security", tags:["AWS","GCP","IAM","Zero Trust"], free:false },

  // â”€â”€ ENTREPRENEURSHIP & DIGITAL BUSINESS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"digital-biz", title:"Build a Digital Business from Scratch", icon:"", thumb:"linear-gradient(135deg,#1A0A00,#5C2200)", lessons:48, hours:28, level:"Beginner", topic:"business", tags:["Business","Freelancing","SaaS","Revenue"], free:false },
  { id:"freelance-dev", title:"Freelance Developer â€” Land Clients", icon:"", thumb:"linear-gradient(135deg,#0A1000,#1A3300)", lessons:32, hours:16, level:"Intermediate", topic:"business", tags:["Freelance","Proposals","Pricing","Clients"], free:false },
  { id:"saas-launch", title:"Launch a SaaS Product", icon:"", thumb:"linear-gradient(135deg,#001020,#002240)", lessons:42, hours:24, level:"Intermediate", topic:"business", tags:["SaaS","Stripe","Launch","Growth"], free:false },
  { id:"content-creator", title:"AI-Powered Content Creation Business", icon:"", thumb:"linear-gradient(135deg,#0A0020,#200040)", lessons:30, hours:16, level:"Beginner", topic:"business", tags:["Content","YouTube","Newsletter","AI"], free:false },
  { id:"ecommerce-ai", title:"E-Commerce with AI Tools", icon:"", thumb:"linear-gradient(135deg,#0A0800,#332200)", lessons:34, hours:18, level:"Beginner", topic:"business", tags:["Shopify","Dropshipping","AI ads","Analytics"], free:false },

  // â”€â”€ DATABASES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"sql-fundamentals", title:"SQL & Relational Databases", icon:"", thumb:"linear-gradient(135deg,#0A1520,#1A3A5C)", lessons:42, hours:22, level:"Beginner", topic:"databases", tags:["SQL","PostgreSQL","MySQL","Joins","Indexing"], free:true },
  { id:"postgresql-advanced", title:"PostgreSQL Deep Dive", icon:"", thumb:"linear-gradient(135deg,#001228,#003366)", lessons:38, hours:20, level:"Intermediate", topic:"databases", tags:["PostgreSQL","JSONB","Triggers","Performance"], free:false },
  { id:"nosql-mongodb", title:"NoSQL â€” MongoDB & Redis", icon:"", thumb:"linear-gradient(135deg,#001A00,#004D00)", lessons:34, hours:18, level:"Intermediate", topic:"databases", tags:["MongoDB","Redis","NoSQL","Caching","Atlas"], free:false },
  { id:"database-design", title:"Database Design & Modelling", icon:"", thumb:"linear-gradient(135deg,#1A0A20,#4A1A7A)", lessons:28, hours:14, level:"Beginner", topic:"databases", tags:["ERD","Normalisation","Schemas","Relationships"], free:true },
  { id:"vector-databases", title:"Vector Databases for AI Apps", icon:"", thumb:"linear-gradient(135deg,#0A0020,#280050)", lessons:24, hours:12, level:"Advanced", topic:"databases", tags:["Pinecone","Weaviate","pgvector","RAG","Embeddings"], free:false },
  { id:"data-warehousing", title:"Data Warehousing & BigQuery", icon:"", thumb:"linear-gradient(135deg,#0A0800,#2A1A00)", lessons:32, hours:16, level:"Intermediate", topic:"databases", tags:["BigQuery","Snowflake","dbt","Data Warehouse","ETL"], free:false },
  { id:"sql-for-finance", title:"SQL for Financial Analysis", icon:"", thumb:"linear-gradient(135deg,#001500,#003D00)", lessons:30, hours:15, level:"Intermediate", topic:"databases", tags:["SQL","Finance","Analytics","Window functions","Reporting"], free:true },

  // â”€â”€ AI ETHICS & SOCIETY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"ai-ethics-fundamentals", title:"AI Ethics: Principles & Practice", icon:"", thumb:"linear-gradient(135deg,#1A1200,#553C00)", lessons:36, hours:18, level:"Beginner", topic:"ethics", tags:["AI Ethics","Bias","Fairness","Accountability","Transparency"], free:true },
  { id:"responsible-ai", title:"Responsible AI Development", icon:"", thumb:"linear-gradient(135deg,#001A1A,#004040)", lessons:32, hours:16, level:"Intermediate", topic:"ethics", tags:["Responsible AI","Safety","Alignment","RLHF","Red-teaming"], free:true },
  { id:"ai-regulation", title:"AI Law, Policy & Regulation", icon:"", thumb:"linear-gradient(135deg,#1A0A00,#4A2000)", lessons:28, hours:14, level:"Beginner", topic:"ethics", tags:["EU AI Act","GDPR","Policy","Compliance","Governance"], free:true },
  { id:"algorithmic-bias", title:"Algorithmic Bias & Fairness", icon:"", thumb:"linear-gradient(135deg,#0A001A,#220040)", lessons:30, hours:15, level:"Intermediate", topic:"ethics", tags:["Bias","Fairness","Audit","ML Ethics","Disparate Impact"], free:true },
  { id:"data-privacy-ethics", title:"Data Privacy & Digital Rights", icon:"", thumb:"linear-gradient(135deg,#001520,#003340)", lessons:26, hours:12, level:"Beginner", topic:"ethics", tags:["Privacy","GDPR","Digital Rights","Surveillance","Consent"], free:true },
  { id:"ai-in-society", title:"AI's Impact on Work & Society", icon:"", thumb:"linear-gradient(135deg,#0A1000,#1E2800)", lessons:24, hours:12, level:"Beginner", topic:"ethics", tags:["Future of work","Automation","Inequality","AI society"], free:true },

  // â”€â”€ FINANCE & FINTECH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"fintech-fundamentals", title:"Fintech Fundamentals", icon:"", thumb:"linear-gradient(135deg,#001A0A,#004D25)", lessons:38, hours:20, level:"Beginner", topic:"finance", tags:["Fintech","Payments","Banking","Open Banking","APIs"], free:true },
  { id:"python-finance", title:"Python for Finance & Quant Analysis", icon:"", thumb:"linear-gradient(135deg,#001A05,#003D0A)", lessons:48, hours:28, level:"Intermediate", topic:"finance", tags:["Python","yfinance","NumPy","Portfolio","Quant"], free:false },
  { id:"blockchain-web3", title:"Blockchain & Web3 Development", icon:"", thumb:"linear-gradient(135deg,#0A0020,#200050)", lessons:42, hours:24, level:"Intermediate", topic:"finance", tags:["Blockchain","Solidity","DeFi","Smart Contracts","Web3"], free:false },
  { id:"ai-trading", title:"AI & Algorithmic Trading", icon:"", thumb:"linear-gradient(135deg,#001A00,#003300)", lessons:44, hours:26, level:"Advanced", topic:"finance", tags:["Algo trading","ML","Backtesting","QuantLib","Signals"], free:false },
  { id:"financial-modelling", title:"Financial Modelling with Excel & Python", icon:"", thumb:"linear-gradient(135deg,#0A0E00,#1E2E00)", lessons:36, hours:20, level:"Intermediate", topic:"finance", tags:["Financial modelling","Excel","DCF","Valuation","Python"], free:false },
  { id:"crypto-fundamentals", title:"Crypto & DeFi â€” No Hype Guide", icon:"", thumb:"linear-gradient(135deg,#0A0600,#2A1600)", lessons:28, hours:14, level:"Beginner", topic:"finance", tags:["Bitcoin","Ethereum","DeFi","Wallets","Risk"], free:true },

  // â”€â”€ HEALTHCARE & LIFE SCIENCES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"health-informatics", title:"Health Informatics & Digital Health", icon:"", thumb:"linear-gradient(135deg,#001A0A,#004020)", lessons:36, hours:18, level:"Beginner", topic:"healthcare", tags:["Health IT","EHR","FHIR","HL7","Telemedicine"], free:true },
  { id:"ai-in-healthcare", title:"AI in Healthcare & Diagnostics", icon:"", thumb:"linear-gradient(135deg,#001220,#002A4A)", lessons:40, hours:22, level:"Intermediate", topic:"healthcare", tags:["Medical AI","Imaging","Clinical NLP","FDA AI","Predictive models"], free:true },
  { id:"biomedical-data", title:"Biomedical Data Analysis with Python", icon:"", thumb:"linear-gradient(135deg,#0A1A10,#1A402A)", lessons:38, hours:20, level:"Intermediate", topic:"healthcare", tags:["BioPython","Genomics","Pandas","Clinical data","R"], free:false },
  { id:"health-data-privacy", title:"Healthcare Data Privacy & HIPAA", icon:"", thumb:"linear-gradient(135deg,#0A0010,#200028)", lessons:24, hours:12, level:"Beginner", topic:"healthcare", tags:["HIPAA","GDPR","PHI","Compliance","De-identification"], free:true },
  { id:"wearables-iot-health", title:"Wearables, IoT & Digital Health Devices", icon:"", thumb:"linear-gradient(135deg,#0A1200,#1A3000)", lessons:28, hours:14, level:"Intermediate", topic:"healthcare", tags:["Wearables","IoT","BLE","Health APIs","Fitbit SDK"], free:false },

  // â”€â”€ PUBLIC POLICY & CIVIC TECH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id:"civic-tech", title:"Civic Tech â€” Technology for Public Good", icon:"", thumb:"linear-gradient(135deg,#0A0A1A,#1A1A40)", lessons:30, hours:15, level:"Beginner", topic:"policy", tags:["Civic tech","Open data","Government","Digital services","APIs"], free:true },
  { id:"open-data-analysis", title:"Open Data Analysis for Policy", icon:"", thumb:"linear-gradient(135deg,#001A10,#003D25)", lessons:32, hours:16, level:"Beginner", topic:"policy", tags:["Open data","Python","Pandas","World Bank","Policy analysis"], free:true },
  { id:"ai-policy", title:"AI Policy: From Principles to Legislation", icon:"", thumb:"linear-gradient(135deg,#1A0A00,#4A2000)", lessons:26, hours:13, level:"Beginner", topic:"policy", tags:["AI policy","EU AI Act","US AI policy","Governance","Regulation"], free:true },
  { id:"data-journalism", title:"Data Journalism & Visual Storytelling", icon:"", thumb:"linear-gradient(135deg,#0A0A00,#252500)", lessons:34, hours:18, level:"Beginner", topic:"policy", tags:["Data journalism","D3.js","Datawrapper","Flourish","Narrative"], free:true },
  { id:"digital-government", title:"Digital Government & e-Services", icon:"", thumb:"linear-gradient(135deg,#001020,#002040)", lessons:28, hours:14, level:"Intermediate", topic:"policy", tags:["e-Government","Digital ID","GovTech","Open source","APIs"], free:true },
  { id:"climate-data-tech", title:"Climate Data, Tech & Sustainability", icon:"", thumb:"linear-gradient(135deg,#001800,#003800)", lessons:30, hours:15, level:"Beginner", topic:"policy", tags:["Climate data","Python","ESG","Carbon","Sustainability tech"], free:true },
];
