// All tax constants, SAC codes, plan limits, and compliance dates

// SAC Codes mapping
export const SAC_CODES = {
  software_development: "998314",
  web_development: "998314",
  app_development: "998314",
  graphic_design: "998313",
  ui_ux_design: "998313",
  digital_marketing: "998361",
  content_writing: "998390",
  consulting: "998319",
  data_analytics: "998346",
} as const;

export const SAC_OPTIONS = [
  { value: "998314", label: "Information Technology (IT) Design and Development Services" },
  { value: "998313", label: "Information Technology (IT) Consulting and Support Services" },
  { value: "998319", label: "Other professional, technical and business services" },
  { value: "998361", label: "Advertising Services" },
  { value: "998390", label: "Other professional, technical and business services n.e.c." },
] as const;

// GST Rates
export const GST_RATE_OPTIONS = [
  { value: 0, label: "0% (Export/LUT)" },
  { value: 18, label: "18% (Standard)" },
] as const;

// Indian States for GST (Place of Supply)
export const INDIAN_STATES = [
  { code: "27", name: "Maharashtra" },
  { code: "29", name: "Karnataka" },
  { code: "07", name: "Delhi" },
  { code: "33", name: "Tamil Nadu" },
  { code: "36", name: "Telangana" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "19", name: "West Bengal" },
  { code: "00", name: "Other (Export)" },
] as const;

// Plan Limits
export const PLAN_LIMITS = {
  free: {
    invoices_per_month: 3,
    contracts: true,
    efira: true,
    reminders: false,
    support: "community",
  },
  pro: {
    invoices_per_month: Infinity,
    contracts: true,
    efira: true,
    reminders: true,
    support: "email",
  },
  agency: {
    invoices_per_month: Infinity,
    contracts: true,
    efira: true,
    reminders: true,
    support: "priority",
  },
} as const;

// Subscription Plans (shown on landing/pricing)
export const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Freelancer Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started with compliance basics",
    features: [
      "3 GST invoices / month",
      "Domestic invoices only",
      "Contract templates",
      "e-FIRA tracker",
      "Compliance dashboard",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Freelancer Pro",
    monthlyPrice: 299,
    yearlyPrice: 249, // per month when billed yearly
    yearlyTotal: 2999,
    description: "Everything you need, unlimited",
    features: [
      "Unlimited invoices",
      "Domestic + Export (LUT)",
      "Contract templates + PDF",
      "e-FIRA drag-drop + CSV",
      "Email compliance reminders",
      "GST filing reminders",
    ],
    cta: "Start 1st Month Free",
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 499,
    yearlyPrice: 399, // per month when billed yearly
    yearlyTotal: 4799,
    description: "For multi-client freelance studios",
    features: [
      "Everything in Pro",
      "Priority support",
      "Bulk invoice generation",
      "Advanced analytics",
      "Early access to new features",
    ],
    cta: "Start 1st Month Free",
    highlighted: false,
  },
] as const;

// Compliance dates
export const GSTR1_DUE_DAY = 11; // 11th of following month
export const GSTR3B_DUE_DAY = 20;
export const ITR_DUE_DATE = "July 31"; // FY end
export const ADVANCE_TAX_QUARTERS = [
  { name: "Q1", due: "June 15" },
  { name: "Q2", due: "September 15" },
  { name: "Q3", due: "December 15" },
  { name: "Q4", due: "March 15" },
] as const;

// Profession types
export const PROFESSION_TYPES = [
  "Software Developer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Graphic Designer",
  "Digital Marketer",
  "Content Writer",
  "Video Editor",
  "SEO Specialist",
  "Data Analyst",
  "DevOps Engineer",
  "Consultant",
  "Other",
] as const;

// Turnover brackets
export const TURNOVER_BRACKETS = [
  "Under ₹6 Lakh",
  "₹6L – ₹20L",
  "₹20L – ₹50L",
  "₹50L – ₹1 Crore",
  "Above ₹1 Crore",
] as const;

export type SacCode = keyof typeof SAC_CODES;
export type ProfessionType = (typeof PROFESSION_TYPES)[number];
export type TurnoverBracket = (typeof TURNOVER_BRACKETS)[number];
