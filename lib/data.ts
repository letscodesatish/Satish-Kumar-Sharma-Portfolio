/* =========================================================
   PORTFOLIO DATA — edit this file to update the site content
   ========================================================= */

export const PROFILE = {
  name: "Satish Kumar Sharma",
  firstName: "Satish Kumar",
  lastName: "Sharma",
  roles: ["AI/ML & Full-Stack Developer", "AI Agent Builder", "Machine Learning Enthusiast", "Next.js & Python Developer"],
  tagline:
    "B.Tech Computer Science student at CSJMU, Kanpur. I build AI agents, machine learning models and web applications, and I'm looking for a Software Development or AI/ML internship.",
  email: "satish.21.buv@gmail.com",
  phone: "+91 63872 24435",
  phoneHref: "tel:+916387224435",
  location: "UIET, CSJM University, Kanpur, U.P., India",
  github: "https://github.com/letscodesatish",
  githubUser: "letscodesatish",
  linkedin: "https://www.linkedin.com/in/satishkumarsharma14/",
  leetcode: "https://leetcode.com/u/letscodesatish18/",
  leetcodeUser: "letscodesatish18",
  instagram: "https://www.instagram.com/satish10142/",
  instagramUser: "satish10142",
  youtube: "https://www.youtube.com/@satishkumarsharma10142",
  resume: "/assets/resume/Satish_Kumar_Sharma_Resume.pdf",
  badge: "Open to internships",
};

const GH = "https://github.com/letscodesatish/";

export type ServiceIcon = "agent" | "ml" | "web" | "data" | "dsa";
export const SERVICES: { title: string; text: string; icon: ServiceIcon }[] = [
  { icon: "agent", title: "AI Agents & RAG", text: "LLM-powered agents with multi-step planning, tool use and memory, plus retrieval-augmented generation pipelines." },
  { icon: "ml", title: "Machine Learning", text: "Regression and recommender models with Scikit-learn, Pandas and NumPy, from feature engineering and cross-validation to deployment." },
  { icon: "web", title: "Web Development", text: "Web apps with Next.js and interactive ML front-ends with Streamlit, deployed on Vercel." },
  { icon: "data", title: "Data Analysis & Visualisation", text: "Turning raw data into insights with Pandas, NumPy, Matplotlib, Seaborn and interactive maps." },
  { icon: "dsa", title: "Problem Solving & DSA", text: "Regular data structures and algorithms practice on LeetCode, with live stats and a daily streak further down this page." },
];

export type ProjectCat = "ai" | "ml" | "web" | "fun";
export const CAT_LABEL: Record<ProjectCat, string> = { ai: "AI & Agents", ml: "ML & Data", web: "Web & Apps", fun: "Games & Tools" };

export type Project = { title: string; date: string; cat: ProjectCat; desc: string; tags: string[]; repo: string; live?: string };
export const PROJECTS: Project[] = [
  {
    title: "PG Orchestrator — AI Booking Agent", date: "Coderva Internship", cat: "ai",
    desc: "Production-ready autonomous AI agent for PG accommodation discovery and booking near UIET, CSJMU. Multi-step planning, conversation memory, real-time filtering by budget, room type and food, plus automated booking emails via AWS SES.",
    tags: ["Groq Llama 3.3 70B", "JavaScript", "AWS SES", "Agents"], repo: GH + "PG_Booking_Agent",
  },
  {
    title: "Sehat-Sarthi — AI Virtual Village Clinic", date: "2026", cat: "ai",
    desc: "Offline-first, AI-assisted clinical decision-support PWA for rural health workers. Patient queue, red-flag symptom intake, rule-based triage, first-aid guidance, doctor tele-consult and analytics, in Hindi, Marathi and English.",
    tags: ["TypeScript", "PWA", "AI Triage", "i18n"], repo: GH + "Sehat-Sarthi",
  },
  {
    title: "VedCode — AI for Bharat Hackathon", date: "AWS × Hack2skill · 2026", cat: "ai",
    desc: "Qualified hackathon prototype that uses generative-AI tools on AWS to solve real-world challenges for India. Built for the AI for Bharat Hackathon.",
    tags: ["TypeScript", "AWS", "Generative AI"], repo: GH + "vedcode-ai4bharat",
  },
  {
    title: "Retrieval-Augmented Generation", date: "2026", cat: "ai",
    desc: "End-to-end RAG pipeline that indexes documents, retrieves the relevant chunks and grounds LLM answers in them. Packaged with uv and explored in notebooks.",
    tags: ["Python", "RAG", "LLM", "uv"], repo: GH + "Retrieval_Augmented_Generation",
  },
  {
    title: "Attendify — Attendance App", date: "2026", cat: "web",
    desc: "Cross-platform mobile app for managing class attendance, built with React Native and Expo and set up for Android builds with EAS.",
    tags: ["React Native", "Expo", "TypeScript"], repo: GH + "Attendify",
  },
  {
    title: "House Pricing Prediction Model", date: "2025", cat: "ml",
    desc: "Regression model that predicts California housing prices using feature engineering and cross-validation. Achieved an R² score of 0.85 and identified median income as the strongest price predictor.",
    tags: ["Python", "Scikit-learn", "Pandas", "NumPy", "Seaborn"], repo: GH + "House-pricing-prediction-model",
  },
  {
    title: "Movie Recommendation System", date: "2026", cat: "ml",
    desc: "Content-based recommender that suggests 5 similar movies using text vectorization and cosine similarity on the TMDB 5000 dataset. Serialized with Pickle and deployed end-to-end as an interactive Streamlit app.",
    tags: ["Python", "Scikit-learn", "Streamlit", "Pickle"], repo: GH + "Movie_Recommendation_System",
  },
  {
    title: "Air Pollution (PM2.5) Predictor", date: "2025", cat: "ml",
    desc: "Regression model that predicts PM2.5 levels from PM10, CO, NO₂, SO₂, ozone and city. Includes EDA notebook and a Streamlit front-end.",
    tags: ["Python", "Joblib", "Streamlit"], repo: GH + "Air_Pollution_Predictor",
  },
];
