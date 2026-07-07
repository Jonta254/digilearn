"use client";
import { useState } from "react";
import Link from "next/link";

const ALL_COURSES = [
  // ── AI TOOLS ─────────────────────────────────────────────────────
  { id:"chatgpt-mastery", title:"ChatGPT & GPT-4o Mastery", author:"Nadia Osei", icon:"🤖", thumb:"linear-gradient(135deg,#0A0F2E,#1A1060)", lessons:38, hours:20, rating:4.9, reviews:8200, level:"Beginner", topic:"ai-tools", tags:["ChatGPT","GPT-4o","Custom GPTs"], badge:"bestseller", free:true },
  { id:"claude-mastery",  title:"Claude — Advanced AI Workflows", author:"Marcus Chen", icon:"🧬", thumb:"linear-gradient(135deg,#0D0A1A,#2D0A5A)", lessons:34, hours:18, rating:5.0, reviews:3100, level:"Intermediate", topic:"ai-tools", tags:["Claude","Long-context","API"], badge:"new", free:false },
  { id:"prompt-engineering", title:"Prompt Engineering Pro", author:"Yuki Tanaka", icon:"🧠", thumb:"linear-gradient(135deg,#0D001A,#6600CC)", lessons:44, hours:24, rating:5.0, reviews:5600, level:"Intermediate", topic:"ai-tools", tags:["Prompting","Chain-of-thought","RAG"], badge:"hot", free:false },
  { id:"midjourney", title:"Midjourney & AI Image Generation", author:"Sofia Reyes", icon:"🎨", thumb:"linear-gradient(135deg,#1A0010,#800040)", lessons:32, hours:16, rating:4.8, reviews:4100, level:"Beginner", topic:"ai-tools", tags:["Midjourney","DALL·E 3","Stable Diffusion"], badge:"", free:false },
  { id:"copilot-dev", title:"GitHub Copilot for Developers", author:"Leon Bauer", icon:"🤝", thumb:"linear-gradient(135deg,#0A1000,#1A3300)", lessons:28, hours:14, rating:4.7, reviews:2890, level:"Intermediate", topic:"ai-tools", tags:["Copilot","AI coding","Code review"], badge:"", free:false },
  { id:"perplexity-gemini", title:"AI Research: Perplexity & Gemini", author:"Amara Diallo", icon:"🔍", thumb:"linear-gradient(135deg,#001A10,#003322)", lessons:24, hours:12, rating:4.7, reviews:1800, level:"Beginner", topic:"ai-tools", tags:["Perplexity","Gemini","AI search"], badge:"new", free:true },
  { id:"ai-writing", title:"AI Writing & Content Creation", author:"Nadia Osei", icon:"✍️", thumb:"linear-gradient(135deg,#0A0510,#330050)", lessons:30, hours:14, rating:4.6, reviews:3300, level:"Beginner", topic:"ai-tools", tags:["AI writing","Jasper","Copy.ai"], badge:"", free:false },
  { id:"sora-video", title:"AI Video: Sora & RunwayML", author:"Marcus Chen", icon:"🎬", thumb:"linear-gradient(135deg,#1A0500,#660020)", lessons:26, hours:13, rating:4.8, reviews:2200, level:"Beginner", topic:"ai-tools", tags:["Sora","RunwayML","HeyGen"], badge:"new", free:false },
  { id:"ai-productivity", title:"AI Productivity System", author:"Yuki Tanaka", icon:"⚡", thumb:"linear-gradient(135deg,#001520,#003355)", lessons:22, hours:10, rating:4.9, reviews:6700, level:"Beginner", topic:"ai-tools", tags:["Notion AI","Copilot 365","AI workflow"], badge:"bestseller", free:true },
  { id:"llm-agents", title:"Building AI Agents & LLM Apps", author:"Leon Bauer", icon:"🤖", thumb:"linear-gradient(135deg,#0A0020,#200055)", lessons:48, hours:26, rating:4.8, reviews:1900, level:"Advanced", topic:"ai-tools", tags:["LangChain","AutoGPT","Agents"], badge:"hot", free:false },
  { id:"ai-audio", title:"AI Music & Audio Creation", author:"Sofia Reyes", icon:"🎵", thumb:"linear-gradient(135deg,#0A0010,#440020)", lessons:20, hours:10, rating:4.5, reviews:1200, level:"Beginner", topic:"ai-tools", tags:["Suno","ElevenLabs","Mubert"], badge:"new", free:false },

  // ── WEB DEVELOPMENT ───────────────────────────────────────────────
  { id:"html-css", title:"HTML & CSS Mastery", author:"Elena Torres", icon:"🌐", thumb:"linear-gradient(135deg,#001A33,#003366)", lessons:48, hours:24, rating:4.9, reviews:9100, level:"Beginner", topic:"webdev", tags:["HTML","CSS","Flexbox","Grid"], badge:"most enrolled", free:true },
  { id:"javascript", title:"JavaScript: Zero to Pro", author:"James Okafor", icon:"⚡", thumb:"linear-gradient(135deg,#1A0D00,#CC6200)", lessons:62, hours:36, rating:4.8, reviews:7800, level:"Beginner", topic:"webdev", tags:["JS","ES2024","Async","DOM"], badge:"", free:false },
  { id:"react-nextjs", title:"React & Next.js 16", author:"Priya Nair", icon:"⚛️", thumb:"linear-gradient(135deg,#001520,#006080)", lessons:54, hours:32, rating:4.9, reviews:6200, level:"Intermediate", topic:"webdev", tags:["React","Next.js","App Router"], badge:"hot", free:false },
  { id:"typescript", title:"TypeScript Deep Dive", author:"Leon Bauer", icon:"🔷", thumb:"linear-gradient(135deg,#0A0530,#2A1590)", lessons:38, hours:20, rating:4.7, reviews:2900, level:"Intermediate", topic:"webdev", tags:["TypeScript","Generics","Utility Types"], badge:"", free:false },
  { id:"tailwind", title:"Tailwind CSS v4 Complete", author:"Sofia Reyes", icon:"🌊", thumb:"linear-gradient(135deg,#001520,#004455)", lessons:32, hours:16, rating:4.8, reviews:3400, level:"Beginner", topic:"webdev", tags:["Tailwind","Components","UI"], badge:"", free:true },
  { id:"node-api", title:"Node.js & REST APIs", author:"James Okafor", icon:"🟢", thumb:"linear-gradient(135deg,#0A2B12,#1A6628)", lessons:44, hours:26, rating:4.8, reviews:4100, level:"Intermediate", topic:"webdev", tags:["Node","Express","REST","JWT"], badge:"", free:false },
  { id:"fullstack", title:"Fullstack: Next.js + Supabase", author:"Priya Nair", icon:"🚀", thumb:"linear-gradient(135deg,#001000,#003300)", lessons:60, hours:40, rating:4.9, reviews:3800, level:"Intermediate", topic:"webdev", tags:["Next.js","Supabase","Auth","Edge"], badge:"new", free:false },
  { id:"react-native", title:"React Native — Mobile Apps", author:"Elena Torres", icon:"📱", thumb:"linear-gradient(135deg,#001A33,#005588)", lessons:46, hours:28, rating:4.7, reviews:2400, level:"Intermediate", topic:"webdev", tags:["React Native","Expo","iOS","Android"], badge:"", free:false },

  // ── PYTHON & DATA ──────────────────────────────────────────────────
  { id:"python-fund", title:"Python Fundamentals", author:"Aisha Bashir", icon:"🐍", thumb:"linear-gradient(135deg,#0A1A05,#1A5C0A)", lessons:52, hours:30, rating:4.9, reviews:11000, level:"Beginner", topic:"data", tags:["Python","OOP","File I/O"], badge:"most enrolled", free:true },
  { id:"python-ai", title:"Python for AI & Data Science", author:"Kevin Park", icon:"🤖", thumb:"linear-gradient(135deg,#001800,#004400)", lessons:58, hours:34, rating:4.9, reviews:5200, level:"Beginner", topic:"data", tags:["Python","NumPy","Pandas","Matplotlib"], badge:"hot", free:true },
  { id:"machine-learning", title:"Machine Learning A-Z", author:"Aisha Bashir", icon:"⚙️", thumb:"linear-gradient(135deg,#0A0500,#331A00)", lessons:68, hours:44, rating:4.9, reviews:8900, level:"Intermediate", topic:"data", tags:["Scikit-learn","Regression","Classification","Clustering"], badge:"bestseller", free:false },
  { id:"deep-learning", title:"Deep Learning & Neural Networks", author:"Kevin Park", icon:"🧬", thumb:"linear-gradient(135deg,#0A0020,#1A0040)", lessons:62, hours:38, rating:4.8, reviews:4400, level:"Advanced", topic:"data", tags:["PyTorch","TensorFlow","CNN","Transformers"], badge:"", free:false },
  { id:"nlp", title:"Natural Language Processing", author:"Yuki Tanaka", icon:"💬", thumb:"linear-gradient(135deg,#001A00,#003300)", lessons:44, hours:26, rating:4.8, reviews:2200, level:"Advanced", topic:"data", tags:["NLP","Transformers","BERT","LLMs"], badge:"new", free:false },
  { id:"sql", title:"SQL for Data Analysis", author:"Elena Torres", icon:"🗄️", thumb:"linear-gradient(135deg,#0A0500,#442200)", lessons:36, hours:18, rating:4.7, reviews:5600, level:"Beginner", topic:"data", tags:["SQL","PostgreSQL","Analytics","Joins"], badge:"", free:true },
  { id:"data-viz", title:"Data Visualization — Tableau & Python", author:"Kevin Park", icon:"📊", thumb:"linear-gradient(135deg,#001000,#1A3300)", lessons:32, hours:16, rating:4.7, reviews:1900, level:"Intermediate", topic:"data", tags:["Tableau","Plotly","Seaborn","Dashboards"], badge:"", free:false },

  // ── AUTOMATION & NO-CODE ──────────────────────────────────────────
  { id:"make-automation", title:"Make (Integromat) — Automate Everything", author:"James Okafor", icon:"⚙️", thumb:"linear-gradient(135deg,#001A0D,#005533)", lessons:34, hours:18, rating:4.8, reviews:3100, level:"Beginner", topic:"automation", tags:["Make","Webhooks","API","Workflows"], badge:"hot", free:false },
  { id:"n8n", title:"n8n Self-Hosted Automation", author:"Marcus Chen", icon:"🔧", thumb:"linear-gradient(135deg,#0A1000,#1A2200)", lessons:28, hours:14, rating:4.7, reviews:1400, level:"Intermediate", topic:"automation", tags:["n8n","Self-hosted","AI nodes"], badge:"new", free:false },
  { id:"zapier", title:"Zapier for Business Automation", author:"Nadia Osei", icon:"⚡", thumb:"linear-gradient(135deg,#1A0A00,#552200)", lessons:26, hours:12, rating:4.6, reviews:2800, level:"Beginner", topic:"automation", tags:["Zapier","Business","CRM","Email"], badge:"", free:false },
  { id:"airtable", title:"Airtable — No-Code Database Apps", author:"Sofia Reyes", icon:"📋", thumb:"linear-gradient(135deg,#001A0D,#003311)", lessons:24, hours:12, rating:4.7, reviews:1600, level:"Beginner", topic:"automation", tags:["Airtable","No-code","Database","Views"], badge:"", free:false },
  { id:"notion-system", title:"Notion — Build Your Second Brain", author:"Yuki Tanaka", icon:"🧠", thumb:"linear-gradient(135deg,#0A0A0A,#1A1A20)", lessons:20, hours:10, rating:4.8, reviews:5400, level:"Beginner", topic:"automation", tags:["Notion","PKM","Templates","AI"], badge:"", free:true },
  { id:"webflow", title:"Webflow — No-Code Web Design", author:"Elena Torres", icon:"🎨", thumb:"linear-gradient(135deg,#001A33,#003355)", lessons:36, hours:18, rating:4.7, reviews:2100, level:"Beginner", topic:"automation", tags:["Webflow","CMS","Interactions"], badge:"new", free:false },

  // ── CYBERSECURITY ─────────────────────────────────────────────────
  { id:"security-fundamentals", title:"Cybersecurity Fundamentals", author:"Rafael Méndez", icon:"🔐", thumb:"linear-gradient(135deg,#150000,#440010)", lessons:46, hours:24, rating:4.7, reviews:3400, level:"Beginner", topic:"security", tags:["Security","Threats","Firewalls","OWASP"], badge:"", free:false },
  { id:"ethical-hacking", title:"Ethical Hacking & Penetration Testing", author:"Rafael Méndez", icon:"🧑‍💻", thumb:"linear-gradient(135deg,#0A0010,#220033)", lessons:60, hours:38, rating:4.9, reviews:4200, level:"Advanced", topic:"security", tags:["Ethical hacking","Kali Linux","OWASP","CTF"], badge:"hot", free:false },
  { id:"network-security", title:"Network Security & Firewalls", author:"Kevin Park", icon:"🛡️", thumb:"linear-gradient(135deg,#001520,#003340)", lessons:38, hours:20, rating:4.7, reviews:1800, level:"Intermediate", topic:"security", tags:["Network","Firewalls","VPN","Zero Trust"], badge:"", free:false },
  { id:"privacy-tools", title:"Digital Privacy & OPSEC", author:"Amara Diallo", icon:"🕵️", thumb:"linear-gradient(135deg,#0A0510,#200035)", lessons:26, hours:13, rating:4.6, reviews:2100, level:"Beginner", topic:"security", tags:["Privacy","VPN","Tor","OPSEC"], badge:"new", free:true },
  { id:"cloud-security", title:"Cloud Security — AWS & GCP", author:"Marcus Chen", icon:"☁️", thumb:"linear-gradient(135deg,#001A33,#002244)", lessons:44, hours:24, rating:4.7, reviews:1500, level:"Intermediate", topic:"security", tags:["AWS","GCP","IAM","Zero Trust"], badge:"", free:false },

  // ── ENTREPRENEURSHIP & DIGITAL BUSINESS ──────────────────────────
  { id:"digital-biz", title:"Build a Digital Business from Scratch", author:"Fatou Ndiaye", icon:"🏪", thumb:"linear-gradient(135deg,#1A0A00,#5C2200)", lessons:48, hours:28, rating:4.9, reviews:4800, level:"Beginner", topic:"business", tags:["Business","Freelancing","SaaS","Revenue"], badge:"hot", free:false },
  { id:"freelance-dev", title:"Freelance Developer — Land Clients", author:"James Okafor", icon:"💼", thumb:"linear-gradient(135deg,#0A1000,#1A3300)", lessons:32, hours:16, rating:4.8, reviews:3600, level:"Intermediate", topic:"business", tags:["Freelance","Proposals","Pricing","Clients"], badge:"", free:false },
  { id:"saas-launch", title:"Launch a SaaS Product", author:"Leon Bauer", icon:"🚀", thumb:"linear-gradient(135deg,#001020,#002240)", lessons:42, hours:24, rating:4.8, reviews:2200, level:"Intermediate", topic:"business", tags:["SaaS","Stripe","Launch","Growth"], badge:"new", free:false },
  { id:"content-creator", title:"AI-Powered Content Creation Business", author:"Nadia Osei", icon:"📱", thumb:"linear-gradient(135deg,#0A0020,#200040)", lessons:30, hours:16, rating:4.7, reviews:2900, level:"Beginner", topic:"business", tags:["Content","YouTube","Newsletter","AI"], badge:"", free:false },
  { id:"ecommerce-ai", title:"E-Commerce with AI Tools", author:"Fatou Ndiaye", icon:"🛒", thumb:"linear-gradient(135deg,#0A0800,#332200)", lessons:34, hours:18, rating:4.7, reviews:1900, level:"Beginner", topic:"business", tags:["Shopify","Dropshipping","AI ads","Analytics"], badge:"", free:false },

  // ── DATABASES ─────────────────────────────────────────────────────
  { id:"sql-fundamentals", title:"SQL & Relational Databases", author:"Elena Torres", icon:"🗄️", thumb:"linear-gradient(135deg,#0A1520,#1A3A5C)", lessons:42, hours:22, rating:4.8, reviews:6200, level:"Beginner", topic:"databases", tags:["SQL","PostgreSQL","MySQL","Joins","Indexing"], badge:"most enrolled", free:true },
  { id:"postgresql-advanced", title:"PostgreSQL Deep Dive", author:"Kevin Park", icon:"🐘", thumb:"linear-gradient(135deg,#001228,#003366)", lessons:38, hours:20, rating:4.8, reviews:2400, level:"Intermediate", topic:"databases", tags:["PostgreSQL","JSONB","Triggers","Performance"], badge:"", free:false },
  { id:"nosql-mongodb", title:"NoSQL — MongoDB & Redis", author:"Marcus Chen", icon:"🍃", thumb:"linear-gradient(135deg,#001A00,#004D00)", lessons:34, hours:18, rating:4.7, reviews:2100, level:"Intermediate", topic:"databases", tags:["MongoDB","Redis","NoSQL","Caching","Atlas"], badge:"new", free:false },
  { id:"database-design", title:"Database Design & Modelling", author:"Elena Torres", icon:"📐", thumb:"linear-gradient(135deg,#1A0A20,#4A1A7A)", lessons:28, hours:14, rating:4.8, reviews:1800, level:"Beginner", topic:"databases", tags:["ERD","Normalisation","Schemas","Relationships"], badge:"", free:true },
  { id:"vector-databases", title:"Vector Databases for AI Apps", author:"Aisha Bashir", icon:"🔮", thumb:"linear-gradient(135deg,#0A0020,#280050)", lessons:24, hours:12, rating:4.9, reviews:1200, level:"Advanced", topic:"databases", tags:["Pinecone","Weaviate","pgvector","RAG","Embeddings"], badge:"hot", free:false },
  { id:"data-warehousing", title:"Data Warehousing & BigQuery", author:"Kevin Park", icon:"🏗️", thumb:"linear-gradient(135deg,#0A0800,#2A1A00)", lessons:32, hours:16, rating:4.7, reviews:1500, level:"Intermediate", topic:"databases", tags:["BigQuery","Snowflake","dbt","Data Warehouse","ETL"], badge:"new", free:false },
  { id:"sql-for-finance", title:"SQL for Financial Analysis", author:"Rafael Méndez", icon:"💹", thumb:"linear-gradient(135deg,#001500,#003D00)", lessons:30, hours:15, rating:4.8, reviews:1900, level:"Intermediate", topic:"databases", tags:["SQL","Finance","Analytics","Window functions","Reporting"], badge:"", free:true },

  // ── AI ETHICS & SOCIETY ───────────────────────────────────────────
  { id:"ai-ethics-fundamentals", title:"AI Ethics: Principles & Practice", author:"Amara Diallo", icon:"⚖️", thumb:"linear-gradient(135deg,#1A1200,#553C00)", lessons:36, hours:18, rating:4.8, reviews:3100, level:"Beginner", topic:"ethics", tags:["AI Ethics","Bias","Fairness","Accountability","Transparency"], badge:"most enrolled", free:true },
  { id:"responsible-ai", title:"Responsible AI Development", author:"Yuki Tanaka", icon:"🛡️", thumb:"linear-gradient(135deg,#001A1A,#004040)", lessons:32, hours:16, rating:4.9, reviews:1800, level:"Intermediate", topic:"ethics", tags:["Responsible AI","Safety","Alignment","RLHF","Red-teaming"], badge:"new", free:true },
  { id:"ai-regulation", title:"AI Law, Policy & Regulation", author:"Fatou Ndiaye", icon:"⚖️", thumb:"linear-gradient(135deg,#1A0A00,#4A2000)", lessons:28, hours:14, rating:4.7, reviews:1200, level:"Beginner", topic:"ethics", tags:["EU AI Act","GDPR","Policy","Compliance","Governance"], badge:"", free:true },
  { id:"algorithmic-bias", title:"Algorithmic Bias & Fairness", author:"Amara Diallo", icon:"🔍", thumb:"linear-gradient(135deg,#0A001A,#220040)", lessons:30, hours:15, rating:4.8, reviews:1400, level:"Intermediate", topic:"ethics", tags:["Bias","Fairness","Audit","ML Ethics","Disparate Impact"], badge:"new", free:true },
  { id:"data-privacy-ethics", title:"Data Privacy & Digital Rights", author:"Rafael Méndez", icon:"🔒", thumb:"linear-gradient(135deg,#001520,#003340)", lessons:26, hours:12, rating:4.7, reviews:2200, level:"Beginner", topic:"ethics", tags:["Privacy","GDPR","Digital Rights","Surveillance","Consent"], badge:"", free:true },
  { id:"ai-in-society", title:"AI's Impact on Work & Society", author:"Fatou Ndiaye", icon:"🌍", thumb:"linear-gradient(135deg,#0A1000,#1E2800)", lessons:24, hours:12, rating:4.8, reviews:2900, level:"Beginner", topic:"ethics", tags:["Future of work","Automation","Inequality","AI society"], badge:"hot", free:true },

  // ── FINANCE & FINTECH ─────────────────────────────────────────────
  { id:"fintech-fundamentals", title:"Fintech Fundamentals", author:"Rafael Méndez", icon:"💳", thumb:"linear-gradient(135deg,#001A0A,#004D25)", lessons:38, hours:20, rating:4.8, reviews:2800, level:"Beginner", topic:"finance", tags:["Fintech","Payments","Banking","Open Banking","APIs"], badge:"hot", free:true },
  { id:"python-finance", title:"Python for Finance & Quant Analysis", author:"Kevin Park", icon:"📈", thumb:"linear-gradient(135deg,#001A05,#003D0A)", lessons:48, hours:28, rating:4.9, reviews:2200, level:"Intermediate", topic:"finance", tags:["Python","yfinance","NumPy","Portfolio","Quant"], badge:"bestseller", free:false },
  { id:"blockchain-web3", title:"Blockchain & Web3 Development", author:"Leon Bauer", icon:"⛓️", thumb:"linear-gradient(135deg,#0A0020,#200050)", lessons:42, hours:24, rating:4.7, reviews:1600, level:"Intermediate", topic:"finance", tags:["Blockchain","Solidity","DeFi","Smart Contracts","Web3"], badge:"", free:false },
  { id:"ai-trading", title:"AI & Algorithmic Trading", author:"Kevin Park", icon:"🤖", thumb:"linear-gradient(135deg,#001A00,#003300)", lessons:44, hours:26, rating:4.8, reviews:1400, level:"Advanced", topic:"finance", tags:["Algo trading","ML","Backtesting","QuantLib","Signals"], badge:"new", free:false },
  { id:"financial-modelling", title:"Financial Modelling with Excel & Python", author:"Rafael Méndez", icon:"📊", thumb:"linear-gradient(135deg,#0A0E00,#1E2E00)", lessons:36, hours:20, rating:4.8, reviews:1900, level:"Intermediate", topic:"finance", tags:["Financial modelling","Excel","DCF","Valuation","Python"], badge:"", free:false },
  { id:"crypto-fundamentals", title:"Crypto & DeFi — No Hype Guide", author:"Amara Diallo", icon:"🪙", thumb:"linear-gradient(135deg,#0A0600,#2A1600)", lessons:28, hours:14, rating:4.6, reviews:3400, level:"Beginner", topic:"finance", tags:["Bitcoin","Ethereum","DeFi","Wallets","Risk"], badge:"", free:true },

  // ── HEALTHCARE & LIFE SCIENCES ────────────────────────────────────
  { id:"health-informatics", title:"Health Informatics & Digital Health", author:"Aisha Bashir", icon:"🏥", thumb:"linear-gradient(135deg,#001A0A,#004020)", lessons:36, hours:18, rating:4.8, reviews:1600, level:"Beginner", topic:"healthcare", tags:["Health IT","EHR","FHIR","HL7","Telemedicine"], badge:"new", free:true },
  { id:"ai-in-healthcare", title:"AI in Healthcare & Diagnostics", author:"Aisha Bashir", icon:"🧬", thumb:"linear-gradient(135deg,#001220,#002A4A)", lessons:40, hours:22, rating:4.9, reviews:1400, level:"Intermediate", topic:"healthcare", tags:["Medical AI","Imaging","Clinical NLP","FDA AI","Predictive models"], badge:"hot", free:true },
  { id:"biomedical-data", title:"Biomedical Data Analysis with Python", author:"Kevin Park", icon:"🔬", thumb:"linear-gradient(135deg,#0A1A10,#1A402A)", lessons:38, hours:20, rating:4.8, reviews:1100, level:"Intermediate", topic:"healthcare", tags:["BioPython","Genomics","Pandas","Clinical data","R"], badge:"", free:false },
  { id:"health-data-privacy", title:"Healthcare Data Privacy & HIPAA", author:"Amara Diallo", icon:"🔐", thumb:"linear-gradient(135deg,#0A0010,#200028)", lessons:24, hours:12, rating:4.7, reviews:900, level:"Beginner", topic:"healthcare", tags:["HIPAA","GDPR","PHI","Compliance","De-identification"], badge:"", free:true },
  { id:"wearables-iot-health", title:"Wearables, IoT & Digital Health Devices", author:"Marcus Chen", icon:"⌚", thumb:"linear-gradient(135deg,#0A1200,#1A3000)", lessons:28, hours:14, rating:4.7, reviews:800, level:"Intermediate", topic:"healthcare", tags:["Wearables","IoT","BLE","Health APIs","Fitbit SDK"], badge:"new", free:false },

  // ── PUBLIC POLICY & CIVIC TECH ────────────────────────────────────
  { id:"civic-tech", title:"Civic Tech — Technology for Public Good", author:"Fatou Ndiaye", icon:"🏛️", thumb:"linear-gradient(135deg,#0A0A1A,#1A1A40)", lessons:30, hours:15, rating:4.8, reviews:900, level:"Beginner", topic:"policy", tags:["Civic tech","Open data","Government","Digital services","APIs"], badge:"new", free:true },
  { id:"open-data-analysis", title:"Open Data Analysis for Policy", author:"Amara Diallo", icon:"📂", thumb:"linear-gradient(135deg,#001A10,#003D25)", lessons:32, hours:16, rating:4.7, reviews:1100, level:"Beginner", topic:"policy", tags:["Open data","Python","Pandas","World Bank","Policy analysis"], badge:"", free:true },
  { id:"ai-policy", title:"AI Policy: From Principles to Legislation", author:"Fatou Ndiaye", icon:"📜", thumb:"linear-gradient(135deg,#1A0A00,#4A2000)", lessons:26, hours:13, rating:4.8, reviews:1300, level:"Beginner", topic:"policy", tags:["AI policy","EU AI Act","US AI policy","Governance","Regulation"], badge:"hot", free:true },
  { id:"data-journalism", title:"Data Journalism & Visual Storytelling", author:"Amara Diallo", icon:"📰", thumb:"linear-gradient(135deg,#0A0A00,#252500)", lessons:34, hours:18, rating:4.8, reviews:1700, level:"Beginner", topic:"policy", tags:["Data journalism","D3.js","Datawrapper","Flourish","Narrative"], badge:"new", free:true },
  { id:"digital-government", title:"Digital Government & e-Services", author:"Fatou Ndiaye", icon:"🌐", thumb:"linear-gradient(135deg,#001020,#002040)", lessons:28, hours:14, rating:4.7, reviews:700, level:"Intermediate", topic:"policy", tags:["e-Government","Digital ID","GovTech","Open source","APIs"], badge:"", free:true },
  { id:"climate-data-tech", title:"Climate Data, Tech & Sustainability", author:"Kevin Park", icon:"🌱", thumb:"linear-gradient(135deg,#001800,#003800)", lessons:30, hours:15, rating:4.9, reviews:1500, level:"Beginner", topic:"policy", tags:["Climate data","Python","ESG","Carbon","Sustainability tech"], badge:"new", free:true },
];

const TOPICS = [
  { id:"all",        label:"All Courses",     count:ALL_COURSES.length },
  { id:"ai-tools",   label:"AI Tools",        count:ALL_COURSES.filter(c=>c.topic==="ai-tools").length },
  { id:"webdev",     label:"Web Dev",         count:ALL_COURSES.filter(c=>c.topic==="webdev").length },
  { id:"data",       label:"Data Science",    count:ALL_COURSES.filter(c=>c.topic==="data").length },
  { id:"databases",  label:"Databases",       count:ALL_COURSES.filter(c=>c.topic==="databases").length },
  { id:"automation", label:"Automation",      count:ALL_COURSES.filter(c=>c.topic==="automation").length },
  { id:"security",   label:"Cybersecurity",   count:ALL_COURSES.filter(c=>c.topic==="security").length },
  { id:"ethics",     label:"AI Ethics",       count:ALL_COURSES.filter(c=>c.topic==="ethics").length },
  { id:"finance",    label:"Finance & Tech",  count:ALL_COURSES.filter(c=>c.topic==="finance").length },
  { id:"healthcare", label:"Healthcare",      count:ALL_COURSES.filter(c=>c.topic==="healthcare").length },
  { id:"policy",     label:"Policy & Civic",  count:ALL_COURSES.filter(c=>c.topic==="policy").length },
  { id:"business",   label:"Business",        count:ALL_COURSES.filter(c=>c.topic==="business").length },
];
const LEVELS = ["All","Beginner","Intermediate","Advanced"];

function DigiLearnLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="url(#dl-c-bg)"/>
      <circle cx="18" cy="18" r="8" stroke="url(#dl-c-ring)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="10" r="2.5" fill="#00D4FF"/><circle cx="10" cy="22" r="2.5" fill="#FF7A00"/><circle cx="26" cy="22" r="2.5" fill="#A855F7"/>
      <line x1="18" y1="12.5" x2="12" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="18" y1="12.5" x2="24" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="12.5" y1="22" x2="23.5" y2="22" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.4"/>
      <defs>
        <linearGradient id="dl-c-bg" x1="0" y1="0" x2="36" y2="36"><stop offset="0%" stopColor="#061A24"/><stop offset="100%" stopColor="#050508"/></linearGradient>
        <linearGradient id="dl-c-ring" x1="10" y1="10" x2="26" y2="26"><stop offset="0%" stopColor="#00D4FF"/><stop offset="100%" stopColor="#0077AA"/></linearGradient>
      </defs>
    </svg>
  );
}

export default function CoursesPage() {
  const [topic, setTopic]   = useState("all");
  const [level, setLevel]   = useState("All");
  const [search, setSearch] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = ALL_COURSES.filter((c) => {
    if (topic !== "all" && c.topic !== topic) return false;
    if (level !== "All" && c.level !== level) return false;
    if (freeOnly && !c.free) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)) || c.author.toLowerCase().includes(q) || c.topic.includes(q);
    }
    return true;
  });

  return (
    <div style={{ minHeight:"100svh", background:"var(--bg)" }}>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <DigiLearnLogo size={28} />
          <span style={{ fontWeight:800 }}>DigiLearn</span>
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/courses" className="nav-link active">Courses</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        </div>
        <Link href="/auth?mode=signup" className="nav-cta">Start free →</Link>
      </nav>

      {/* Header */}
      <div style={{ paddingTop:"5rem", background:"linear-gradient(180deg,rgba(0,212,255,0.06) 0%,transparent 100%)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"3rem 1.5rem" }}>
          <div className="section-tag tag-cyan" style={{ marginBottom:"1rem" }}>80+ courses · All free to browse</div>
          <h1 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:"1rem" }}>
            Every course you need to<br/><span className="cyan-text">thrive in the AI era</span>
          </h1>
          <p style={{ color:"var(--text-dim)", fontSize:"1rem", marginBottom:"2.25rem", maxWidth:560, lineHeight:1.8 }}>
            AI tools, web development, data science, automation, cybersecurity, and digital business — structured learning that translates directly into real skills and real income.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", maxWidth:600 }}>
            <div style={{ flex:1, position:"relative", minWidth:220 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--text-mute)", pointerEvents:"none" }}>🔍</span>
              <input value={search} onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search by topic, tool, or skill..."
                style={{ width:"100%", padding:"0.75rem 1rem 0.75rem 2.5rem", borderRadius:9, background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--text)", fontSize:"0.9rem", outline:"none", fontFamily:"inherit" }}
              />
            </div>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:"0.875rem", color:"var(--text-dim)", padding:"0.75rem 1rem", background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:9 }}>
              <input type="checkbox" checked={freeOnly} onChange={(e)=>setFreeOnly(e.target.checked)} style={{ accentColor:"var(--cyan)" }} />
              Free only
            </label>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1120, margin:"0 auto", padding:"2rem 1.5rem" }}>
        {/* Topic tabs */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1rem" }}>
          {TOPICS.map((t) => (
            <button key={t.id} onClick={()=>setTopic(t.id)} style={{
              padding:"0.45rem 1.1rem", borderRadius:100, fontSize:"0.8rem", fontWeight:600,
              cursor:"pointer", border:"1px solid", transition:"all 0.15s",
              background: topic===t.id ? "linear-gradient(135deg,var(--cyan),#0099CC)" : "transparent",
              borderColor: topic===t.id ? "transparent" : "var(--border2)",
              color: topic===t.id ? "#000" : "var(--text-dim)",
            }}>
              {t.label} <span style={{ opacity:0.6, fontSize:"0.7rem" }}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* Level pills */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1.75rem" }}>
          {LEVELS.map((l) => (
            <button key={l} onClick={()=>setLevel(l)} style={{
              padding:"0.35rem 0.9rem", borderRadius:100, fontSize:"0.78rem", fontWeight:600,
              cursor:"pointer", border:"1px solid", transition:"all 0.15s",
              background: level===l ? "rgba(var(--cyan-rgb),0.12)" : "transparent",
              borderColor: level===l ? "rgba(var(--cyan-rgb),0.4)" : "var(--border)",
              color: level===l ? "var(--cyan)" : "var(--text-mute)",
            }}>{l}</button>
          ))}
          <span style={{ fontSize:"0.8rem", color:"var(--text-mute)", marginLeft:"auto", alignSelf:"center" }}>
            <strong style={{ color:"var(--text)" }}>{filtered.length}</strong> courses
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem", color:"var(--text-mute)" }}>
            No courses match your filters.{" "}
            <button onClick={()=>{setTopic("all");setLevel("All");setSearch("");setFreeOnly(false);}} style={{ background:"none",border:"none",color:"var(--cyan)",cursor:"pointer",fontWeight:600 }}>Clear →</button>
          </div>
        ) : (
          <div className="course-grid">
            {filtered.map((c) => (
              <div key={c.id} className="course-card">
                <div className="course-thumb" style={{ background:c.thumb }}>
                  <span style={{ fontSize:"3.5rem", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{c.icon}</span>
                  {c.badge && (
                    <span style={{ position:"absolute", top:10, right:10, padding:"2px 9px", borderRadius:6, fontSize:"0.62rem", fontWeight:800, textTransform:"uppercase",
                      background: c.badge==="bestseller"||c.badge==="most enrolled" ? "rgba(251,191,36,0.9)" : c.badge==="hot" ? "rgba(244,63,94,0.9)" : "rgba(0,212,255,0.9)",
                      color: c.badge==="bestseller"||c.badge==="most enrolled" ? "#000" : c.badge==="hot" ? "#fff" : "#000" }}>
                      {c.badge}
                    </span>
                  )}
                  {c.free && <span style={{ position:"absolute", top:10, left:10, padding:"2px 9px", borderRadius:6, fontSize:"0.62rem", fontWeight:800, background:"rgba(34,197,94,0.9)", color:"#fff", textTransform:"uppercase" }}>FREE</span>}
                </div>
                <div className="course-body">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.5rem" }}>
                    <span className={`level-pill ${c.level==="Beginner"?"level-begin":c.level==="Intermediate"?"level-inter":"level-adv"}`}>{c.level}</span>
                    <span className="pill">{c.tags[0]}</span>
                  </div>
                  <div className="course-title">{c.title}</div>
                  <div className="course-author">by {c.author}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:"0.75rem" }}>
                    <span style={{ color:"var(--amber)", fontSize:"0.8rem" }}>★★★★★</span>
                    <span style={{ fontSize:"0.8rem", fontWeight:700, color:"var(--amber)" }}>{c.rating}</span>
                    <span style={{ fontSize:"0.75rem", color:"var(--text-mute)" }}>({c.reviews.toLocaleString()})</span>
                  </div>
                  <div className="course-meta">
                    <span className="course-meta-item">📚 {c.lessons} lessons</span>
                    <span className="course-meta-item">⏱ {c.hours}h</span>
                    <span className="course-meta-item" style={{ marginLeft:"auto", color:c.free?"var(--green)":"var(--text-dim)", fontWeight:c.free?700:400 }}>
                      {c.free?"Free":"Pro"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pro CTA */}
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem 5rem" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(0,212,255,0.12),rgba(168,85,247,0.08))", border:"1px solid rgba(0,212,255,0.2)", borderRadius:"var(--radius-lg)", padding:"3rem", textAlign:"center" }}>
          <h2 style={{ fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.25rem)", letterSpacing:"-0.03em", marginBottom:"0.75rem" }}>
            Unlock all {ALL_COURSES.length} courses with Pro
          </h2>
          <p style={{ color:"var(--text-dim)", fontSize:"1rem", marginBottom:"2rem", maxWidth:440, margin:"0 auto 2rem" }}>
            $16/month for unlimited access to every course, AI path, and project — cancel any time.
          </p>
          <Link href="/auth?mode=signup" className="btn-primary" style={{ margin:"0 auto" }}>Start 7-day free trial →</Link>
        </div>
      </div>
    </div>
  );
}
