// Mock student profile
export const currentStudent = {
  id: "s1",
  name: "Rahul Sharma",
  email: "rahul.sharma@college.edu",
  collegeId: "CSE2023045",
  branch: "CSE",
  batch: "2024",
  cgpa: 8.5,
  resumeUploaded: true,
  resumeName: "Rahul_Sharma_Resume.pdf",
};

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo: string;
  description: string;
  website: string;
  roles: string[];
  eligibility: { minCGPA: number; branches: string[]; batches: string[] };
  interviewRounds: string[];
  packageLPA: string;
}

export const companies: Company[] = [
  { id: "c1", name: "Google", industry: "Technology", logo: "G", description: "Leading tech giant specializing in search, cloud computing, and AI.", website: "google.com", roles: ["SDE Intern", "SDE-1"], eligibility: { minCGPA: 8.0, branches: ["CSE", "IT", "ECE"], batches: ["2024", "2025"] }, interviewRounds: ["Online Assessment", "Coding Round", "Technical Interview", "HR Interview"], packageLPA: "30-45" },
  { id: "c2", name: "Microsoft", industry: "Technology", logo: "M", description: "Global technology company known for software, cloud, and enterprise solutions.", website: "microsoft.com", roles: ["SDE Intern", "SDE-1", "PM Intern"], eligibility: { minCGPA: 7.5, branches: ["CSE", "IT", "ECE", "EE"], batches: ["2024", "2025"] }, interviewRounds: ["Online Assessment", "Group Discussion", "Technical Interview 1", "Technical Interview 2", "HR"], packageLPA: "25-42" },
  { id: "c3", name: "Amazon", industry: "E-Commerce / Cloud", logo: "A", description: "E-commerce and cloud computing leader with AWS.", website: "amazon.com", roles: ["SDE-1", "Data Analyst"], eligibility: { minCGPA: 7.0, branches: ["CSE", "IT"], batches: ["2024"] }, interviewRounds: ["Online Assessment", "Coding Round", "Technical + LP Interview", "Bar Raiser"], packageLPA: "28-40" },
  { id: "c4", name: "Infosys", industry: "IT Services", logo: "I", description: "Global IT consulting and services company.", website: "infosys.com", roles: ["Systems Engineer", "Digital Specialist"], eligibility: { minCGPA: 6.0, branches: ["CSE", "IT", "ECE", "EE", "ME"], batches: ["2024", "2025"] }, interviewRounds: ["Aptitude Test", "Technical Interview", "HR Interview"], packageLPA: "6-9" },
  { id: "c5", name: "TCS", industry: "IT Services", logo: "T", description: "Tata Consultancy Services — India's largest IT services company.", website: "tcs.com", roles: ["Developer", "Ninja"], eligibility: { minCGPA: 6.0, branches: ["CSE", "IT", "ECE", "EE", "ME", "CE"], batches: ["2024"] }, interviewRounds: ["TCS NQT", "Technical Interview", "Managerial", "HR"], packageLPA: "4-7" },
  { id: "c6", name: "Flipkart", industry: "E-Commerce", logo: "F", description: "India's leading e-commerce marketplace.", website: "flipkart.com", roles: ["SDE-1"], eligibility: { minCGPA: 7.5, branches: ["CSE", "IT"], batches: ["2024"] }, interviewRounds: ["Online Coding", "Machine Coding", "Problem Solving", "HR"], packageLPA: "22-35" },
];

export interface Drive {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  date: string;
  deadline: string;
  status: "upcoming" | "ongoing" | "completed";
  eligibility: { minCGPA: number; branches: string[]; batches: string[] };
}

export const drives: Drive[] = [
  { id: "d1", companyId: "c1", companyName: "Google", role: "SDE Intern", date: "2026-02-20", deadline: "2026-02-15", status: "upcoming", eligibility: { minCGPA: 8.0, branches: ["CSE", "IT", "ECE"], batches: ["2024", "2025"] } },
  { id: "d2", companyId: "c2", companyName: "Microsoft", role: "SDE-1", date: "2026-02-25", deadline: "2026-02-18", status: "upcoming", eligibility: { minCGPA: 7.5, branches: ["CSE", "IT", "ECE", "EE"], batches: ["2024", "2025"] } },
  { id: "d3", companyId: "c3", companyName: "Amazon", role: "SDE-1", date: "2026-03-05", deadline: "2026-02-28", status: "upcoming", eligibility: { minCGPA: 7.0, branches: ["CSE", "IT"], batches: ["2024"] } },
  { id: "d4", companyId: "c4", companyName: "Infosys", role: "Systems Engineer", date: "2026-03-10", deadline: "2026-03-05", status: "upcoming", eligibility: { minCGPA: 6.0, branches: ["CSE", "IT", "ECE", "EE", "ME"], batches: ["2024", "2025"] } },
  { id: "d5", companyId: "c5", companyName: "TCS", role: "Developer", date: "2026-02-12", deadline: "2026-02-10", status: "ongoing", eligibility: { minCGPA: 6.0, branches: ["CSE", "IT", "ECE", "EE", "ME", "CE"], batches: ["2024"] } },
  { id: "d6", companyId: "c6", companyName: "Flipkart", role: "SDE-1", date: "2026-03-15", deadline: "2026-03-10", status: "upcoming", eligibility: { minCGPA: 7.5, branches: ["CSE", "IT"], batches: ["2024"] } },
];

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  driveId: string;
  companyName: string;
  role: string;
  status: "Applied" | "Shortlisted" | "Selected" | "Rejected";
  appliedDate: string;
  branch: string;
}

export const applications: Application[] = [
  { id: "a1", studentId: "s1", studentName: "Rahul Sharma", driveId: "d5", companyName: "TCS", role: "Developer", status: "Applied", appliedDate: "2026-02-08", branch: "CSE" },
  { id: "a2", studentId: "s1", studentName: "Rahul Sharma", driveId: "d1", companyName: "Google", role: "SDE Intern", status: "Shortlisted", appliedDate: "2026-02-10", branch: "CSE" },
  { id: "a3", studentId: "s2", studentName: "Priya Patel", driveId: "d1", companyName: "Google", role: "SDE Intern", status: "Applied", appliedDate: "2026-02-09", branch: "IT" },
  { id: "a4", studentId: "s3", studentName: "Amit Kumar", driveId: "d2", companyName: "Microsoft", role: "SDE-1", status: "Selected", appliedDate: "2026-02-07", branch: "CSE" },
  { id: "a5", studentId: "s4", studentName: "Sneha Gupta", driveId: "d5", companyName: "TCS", role: "Developer", status: "Rejected", appliedDate: "2026-02-06", branch: "ECE" },
  { id: "a6", studentId: "s5", studentName: "Vikram Singh", driveId: "d3", companyName: "Amazon", role: "SDE-1", status: "Shortlisted", appliedDate: "2026-02-08", branch: "CSE" },
  { id: "a7", studentId: "s6", studentName: "Neha Reddy", driveId: "d4", companyName: "Infosys", role: "Systems Engineer", status: "Applied", appliedDate: "2026-02-09", branch: "EE" },
];

export interface Experience {
  id: string;
  studentName: string;
  companyName: string;
  companyId: string;
  role: string;
  year: string;
  rounds: { name: string; questions: string[]; difficulty: "Easy" | "Medium" | "Hard" }[];
  tips: string;
  approved: boolean;
}

export const experiences: Experience[] = [
  { id: "e1", studentName: "Ankit Verma", companyName: "Google", companyId: "c1", role: "SDE Intern", year: "2025", rounds: [{ name: "Online Assessment", questions: ["Two Sum", "Binary Tree Level Order Traversal"], difficulty: "Medium" }, { name: "Technical Interview", questions: ["Design a URL shortener", "Explain time complexity of your approach"], difficulty: "Hard" }], tips: "Focus on DSA and system design basics. Practice LeetCode medium-hard problems.", approved: true },
  { id: "e2", studentName: "Riya Mehta", companyName: "Microsoft", companyId: "c2", role: "SDE-1", year: "2025", rounds: [{ name: "Online Assessment", questions: ["Sliding Window Maximum", "Graph traversal"], difficulty: "Medium" }, { name: "Technical Interview 1", questions: ["LRU Cache implementation", "OS concepts"], difficulty: "Hard" }, { name: "Technical Interview 2", questions: ["Design a chat system", "Database indexing"], difficulty: "Hard" }], tips: "Be thorough with OS, DBMS, and networking. Communication matters a lot.", approved: true },
  { id: "e3", studentName: "Karan Shah", companyName: "Amazon", companyId: "c3", role: "SDE-1", year: "2024", rounds: [{ name: "Online Assessment", questions: ["Merge K Sorted Lists", "Optimized search"], difficulty: "Hard" }, { name: "Technical + LP", questions: ["Tell me about a time you disagreed with a teammate", "Design an e-commerce cart"], difficulty: "Medium" }], tips: "Amazon values Leadership Principles. Prepare STAR method answers.", approved: true },
  { id: "e4", studentName: "Pooja Iyer", companyName: "TCS", companyId: "c5", role: "Developer", year: "2025", rounds: [{ name: "TCS NQT", questions: ["Aptitude questions", "Basic coding - arrays, strings"], difficulty: "Easy" }, { name: "Technical Interview", questions: ["OOP concepts", "SQL queries"], difficulty: "Easy" }], tips: "NQT is straightforward. Focus on basic concepts and aptitude.", approved: true },
  { id: "e5", studentName: "Rahul Sharma", companyName: "Flipkart", companyId: "c6", role: "SDE-1", year: "2025", rounds: [{ name: "Online Coding", questions: ["Dynamic Programming", "Graph algorithms"], difficulty: "Hard" }], tips: "Flipkart rounds are tough. Practice competitive programming.", approved: false },
];

export interface Notification {
  id: string;
  type: "drive" | "deadline" | "update";
  title: string;
  message: string;
  time: string;
  read: boolean;
  urgency: "low" | "medium" | "high";
}

export const notifications: Notification[] = [
  { id: "n1", type: "drive", title: "New Drive: Google", message: "Google is hiring SDE Interns. Apply before Feb 15!", time: "2 hours ago", read: false, urgency: "medium" },
  { id: "n2", type: "deadline", title: "Deadline Tomorrow!", message: "TCS Developer application closes tomorrow.", time: "5 hours ago", read: false, urgency: "high" },
  { id: "n3", type: "update", title: "Application Update", message: "You've been shortlisted for Google SDE Intern!", time: "1 day ago", read: false, urgency: "medium" },
  { id: "n4", type: "deadline", title: "Deadline in 2 Days", message: "Google SDE Intern deadline is Feb 15.", time: "1 day ago", read: true, urgency: "medium" },
  { id: "n5", type: "drive", title: "New Drive: Flipkart", message: "Flipkart SDE-1 drive scheduled for March 15.", time: "3 days ago", read: true, urgency: "low" },
  { id: "n6", type: "update", title: "Drive Completed", message: "TCS Developer drive results will be announced soon.", time: "4 days ago", read: true, urgency: "low" },
];

// Admin stats
export const adminStats = {
  totalDrives: 12,
  totalStudents: 486,
  applicationsReceived: 1284,
  studentsPlaced: 198,
  placementRate: 40.7,
};

export const placementByBranch = [
  { branch: "CSE", placed: 82, total: 120 },
  { branch: "IT", placed: 45, total: 90 },
  { branch: "ECE", placed: 35, total: 100 },
  { branch: "EE", placed: 20, total: 80 },
  { branch: "ME", placed: 16, total: 96 },
];

export const placementByCompany = [
  { company: "Google", count: 8 },
  { company: "Microsoft", count: 12 },
  { company: "Amazon", count: 15 },
  { company: "Infosys", count: 65 },
  { company: "TCS", count: 78 },
  { company: "Flipkart", count: 6 },
  { company: "Others", count: 14 },
];
