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

