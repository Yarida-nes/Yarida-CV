// Builds Yarida's CV as a Word file (.docx) with the "docx" package.
//
//   node make_cv.js                 -> private CV (phone + referees) if private.json exists
//   node make_cv.js --public        -> public CV ("References available on request")
//   node make_cv.js out.docx        -> choose the output file
//
// private.json (never committed; see private.example.json) holds the phone
// number and referees. Without it the build is always the public version.
//
// Layout: bold centred name, centred contact lines, claret uppercase section
// headings over a black rule, "Title | Date" heads, grey italic organisation
// lines and claret "Project:" links. Calibri 10 pt, A4.
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, BorderStyle, LevelFormat } = require("docx");

let PRIVATE = null;
try { PRIVATE = JSON.parse(fs.readFileSync(path.join(__dirname, "private.json"), "utf8")); } catch {}
const ARGS = process.argv.slice(2).filter(a => !a.startsWith("--"));
const PUBLIC = process.env.CV_PUBLIC === "1" || process.argv.includes("--public") || !PRIVATE;
const OUT = ARGS[0] || path.join(__dirname, PUBLIC ? "Yarida_Kaewthong_CV_public.docx" : "Yarida_Kaewthong_CV_2026.docx");

const ACCENT = "7A2434", INK = "1A1A1A", GREY = "555555";
const FONT = "Calibri", SZ = 20;   // 10 pt

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: SZ, color: INK, ...o });
const link = (text, url, o = {}) => new ExternalHyperlink({ link: url, children: [run(text, { color: ACCENT, ...o })] });
const bare = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/^mailto:/, "").replace(/\/$/, "");
const SITE = "https://yarida-cv.vercel.app/";

const center = (children, after = 0) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after }, children });
const heading = (text) => new Paragraph({
  keepNext: true,
  spacing: { before: 160, after: 80 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: INK, space: 1 } },
  children: [run(text.toUpperCase(), { size: 24, bold: true, color: ACCENT, characterSpacing: 10 })],
});
const para = (children, after = 80) => new Paragraph({ spacing: { after }, children: Array.isArray(children) ? children : [run(children)] });
const bullet = (text, last) => new Paragraph({
  numbering: { reference: "bullets", level: 0 }, spacing: { after: last ? 100 : 20 }, children: [run(text)],
});

// One entry: "Title | Date", grey italic line, note lines, "Project:" link, bullets
const entry = ({ title, date, org, notes = [], page, bullets = [] }) => {
  const out = [];
  const tail = notes.length || page || bullets.length;
  out.push(new Paragraph({ keepNext: true, spacing: { after: 0 },
    children: [run(title, { bold: true }), ...(date ? [run(" | "), run(date, { bold: true, color: ACCENT })] : [])] }));
  if (org) out.push(new Paragraph({ keepNext: !!tail, spacing: { after: tail ? 0 : 100 }, children: [run(org, { italics: true, color: GREY })] }));
  notes.forEach((n, i) => out.push(new Paragraph({ keepNext: true,
    spacing: { after: i === notes.length - 1 && !page && !bullets.length ? 100 : 0 }, children: [run(n)] })));
  if (page) out.push(new Paragraph({ keepNext: true, spacing: { after: bullets.length ? 40 : 100 },
    children: [run("Project: ", { color: ACCENT }), link(bare(SITE) + "/" + page, SITE + page)] }));
  bullets.forEach((b, i) => out.push(bullet(b, i === bullets.length - 1)));
  return out;
};

const children = [
  // ---- Header ----
  center([run("Yarida Kaewthong", { size: 44, bold: true, color: "111111" })], 60),
  center([run("Perth, WA | "), ...(PUBLIC ? [] : [run(PRIVATE.phone + " | ")]),
    link("nestyarida@gmail.com", "mailto:nestyarida@gmail.com"), run("")]),
  center([run("Portfolio: "), link("yarida-cv.vercel.app", "https://yarida-cv.vercel.app"), run(" | LinkedIn: "),
    link("linkedin.com/in/yarida-kaewthong", "https://www.linkedin.com/in/yarida-kaewthong"), run(" | GitHub: "),
    link("github.com/Yarida-nes", "https://github.com/Yarida-nes")]),
  center([run("Student visa (subclass 500) | Available full-time 16 Nov 2026 to 5 Feb 2027")], 40),

  // ---- Professional Summary ----
  heading("Professional Summary"),
  para("Master of Commerce (Artificial Intelligence and Business Analytics) student at Curtin University, with First Class Honours in Geography and a co-authored GIS research paper (ACRS 2023). I work with data in R, Python and SQL, map it in GIS, and test whether a pattern is real before I report it. Most recently I analysed 142,875 Victorian crash records to show where people walking and cycling in Melbourne are most at risk. Several projects at yarida-cv.vercel.app have a live demo you can try. Seeking an IT and digital internship in Perth, and graduate roles from July 2027."),

  // ---- Skills ----
  heading("Skills"),
  ...[
    ["Programming and Data", "Python (APIs, Matplotlib), SQL, R (tidyverse, sf, R Markdown), Microsoft Excel."],
    ["Visualisation and BI", "Tableau (stories, dashboard actions, parameters), Power BI (dashboards)."],
    ["Statistics", "Linear and logistic regression, hypothesis testing, confidence intervals, model evaluation (R squared, RMSE, ROC/AUC)."],
    ["GIS and Spatial", "Hot-spot analysis (Getis-Ord Gi*), network analysis, location-allocation, spatial joins, map layout."],
    ["AI Tools", "ChatGPT and Gemini for drafting and testing code; an AI API for answering plain-English questions in an app."],
  ].map(([n, d], i, all) => para([run(n + ": ", { bold: true }), run(d)], i === all.length - 1 ? 60 : 40)),

  // ---- Projects ----
  heading("Projects"),
  ...entry({ title: "Walking and Cycling Safety in Melbourne", date: "Oct 2026", org: "Independent project | R (sf, dplyr, ggplot2), GIS, hot-spot analysis",
    page: "melbourne-crash.html", bullets: [
    "Analysed 142,875 Victorian crash records in R and GIS to find where and when people walking and cycling in Melbourne are most at risk.",
    "Found that half of the pedestrian and cyclist crashes from 2021 to 2025 fell in just 6% of the area, so councils know where to act first.",
    "Showed pedestrians are far more likely to be seriously hurt on faster roads (41% at 40 km/h against 65% at 80+ km/h) and on unlit roads, and recommended 40 km/h zones, separated bike lanes and better lighting.",
  ] }),
  ...entry({ title: "ESG and Financial Analytics, Asia-Pacific", date: "May 2026", org: "Curtin University, individual project | Tableau", page: "esg.html", bullets: [
    "Built an interactive Tableau Story of three linked dashboards on ESG and financial data for 8 Asia-Pacific markets, 2010 to 2024.",
    "Found that higher ESG scores barely relate to profitability, so a strong rating alone is a weak guide for investors.",
    "Wrote a business analyst report with recommendations for firms, investors and regulators.",
  ] }),
  ...entry({ title: "WeatherWise: Python Weather Advisor", date: "Oct 2025", org: "Curtin University, individual project | Python, OpenWeatherMap API, Matplotlib", page: "weatherwise.html", bullets: [
    "Built a Python app that pulls live five-day forecasts from the OpenWeatherMap API and turns them into daily summaries and charts.",
    "Added plain-English questions, such as \"Will it rain tomorrow in Perth?\", answered by an AI API from the same forecast data.",
    "Used ChatGPT and Gemini to draft and test the code, and logged the AI conversations as a record of how it was built.",
  ] }),
  ...entry({ title: "Credit Risk Analysis", date: "Oct 2025", org: "Curtin University, group of three | RStudio, R Markdown", page: "credit-risk.html", bullets: [
    "Cleaned a 32,581-row loan dataset in R and found about one in five loans had defaulted. My part: cleaning, charts, regression and write-up.",
    "Built an income regression and flagged a predictor calculated from income itself, so its effect should not be over-read.",
    "Built a logistic regression model with forward stepwise selection to predict loan default, evaluated with accuracy, sensitivity, specificity and ROC/AUC.",
  ] }),
  ...entry({ title: "Australian Housing Price Regression", date: "May 2026", org: "Curtin University, individual project | RStudio, R Markdown", page: "housing.html", bullets: [
    "Compared five regression models of house price growth across five Australian states, and chose the one with the best balance of accuracy and simplicity.",
    "Found the COVID-19 period added about 2.6 percentage points to quarterly price growth, while household income and election years made no clear difference.",
  ] }),
  ...entry({ title: "Published Research: Drugstore Access in Thailand", date: "2023", org: "Co-author, ACRS 2023 | GIS, network analysis, location-allocation",
    page: "drugstores.html", bullets: [
    "Co-authored a peer-reviewed conference paper: took part in the GPS field survey, ran the network analysis and helped make the service-area maps.",
    "Showed only 199 of 511 villages were within reach of a pharmacy in the medicine pick-up scheme, and that 22 more well-placed pharmacies would more than double that.",
  ] }),

  // ---- Relevant Experience ----
  heading("Relevant Experience"),
  ...entry({ title: "Digital Marketing Executive", date: "Sep 2022 – Sep 2023", org: "Divana, Bangkok, Thailand | Full-time", bullets: [
    "Tracked campaign performance in Excel and Power BI reports, and used the results to decide what content to make next.",
    "Wrote SEO-focused content for divanawellness.com and Instagram, based on keyword and customer-interest research.",
  ] }),
  ...entry({ title: "Data-Driven Marketing Intern", date: "Nov 2022 – Feb 2023", org: "Like Me X Co., Ltd. / Futureskill, Thailand | Remote", bullets: [
    "Built Excel and Power BI dashboards on content and audience data that the marketing team used to plan campaigns.",
    "Reviewed campaign results and wrote reports with recommendations for the marketing team.",
  ] }),
  ...entry({ title: "Mapping and GIS Solution Intern", date: "Apr 2022 – Jun 2022", org: "THIKNET Co., Ltd., Thailand", bullets: [
    "Used SQL to maintain location data for a commercial navigation product, updating road and route records for every province in Thailand and adding EV charging stations.",
    "Checked every record against its source before committing it, because one wrong point can send a driver the wrong way.",
  ] }),

  // ---- Education ----
  heading("Education"),
  ...entry({ title: "Master of Commerce (Artificial Intelligence and Business Analytics)", date: "2025 – Present",
    org: "Curtin University, Perth, Australia", notes: ["Expected graduation: June 2027"] }),
  ...entry({ title: "Bachelor of Social Science", date: "2019 – 2022", org: "Kasetsart University, Thailand", notes: [
    "Major: Geography | First Class Honours",
  ] }),

  // ---- Work Experience ----
  heading("Work Experience"),
  ...entry({ title: "Restaurant Manager", date: "Sep 2023 – Present", org: "Six Senses Gourmet Thai, Leederville, Perth WA | Part-time", bullets: [
    "Track daily sales to spot best-selling dishes and suggest new menu items, part of the menu and service changes that helped lift the restaurant's Google rating from 3.6 to 4.0 stars.",
    "Train and lead around 5 staff per shift, and explain decisions clearly to people without time for the detail.",
  ] }),

  // ---- Achievements ----
  heading("Achievements and Certifications"),
  bullet("Google Data Analytics Professional Certificate, Google / Coursera, 2026."),
  bullet("Conference presenter, 8th Annual International Academic Conference on Education and Technology, May 2026: presented a Curtin sustainability student project, recognised in the Curtin Vice-Chancellor's communications."),
  bullet("NSO Data Camp, Feb 2023: \"Branding is All About Counting\", a data and business case pitch.", true),

  // ---- References ----
  heading("References"),
  ...(PUBLIC ? [para("Available on request.", 0)] :
    PRIVATE.referees.flatMap((r, i, all) => [
      new Paragraph({ keepNext: true, spacing: { after: 0 }, children: [run(r.name, { bold: true })] }),
      new Paragraph({ keepNext: true, spacing: { after: 0 }, children: [run(r.role, { italics: true, color: GREY })] }),
      para(r.contact, i === all.length - 1 ? 0 : 100),
    ])),
];

const doc = new Document({
  creator: "Yarida Kaewthong",
  title: "Yarida Kaewthong CV",
  styles: { default: { document: { run: { font: FONT, size: SZ, color: INK }, paragraph: { spacing: { line: 240 } } } } },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 300, hanging: 200 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 624, bottom: 624, left: 850, right: 850 } } }, children }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log((PUBLIC ? "public" : "private") + " CV written:", OUT);
});
