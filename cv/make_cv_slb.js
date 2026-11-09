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
  para("Master of Commerce (Artificial Intelligence and Business Analytics) student at Curtin University, with First Class Honours in Geography and a co-authored GIS research paper (ACRS 2023). I work with data in R, Python and SQL, map it in QGIS and ArcGIS, and test whether a pattern is real before I report it. Most recently I analysed 142,875 Victorian crash records to show where people walking and cycling in Melbourne are most at risk. Several projects at yarida-cv.vercel.app have a live demo you can try. Seeking an IT and digital internship in Perth, and graduate roles from July 2027."),

  // ---- Skills ----
  heading("Skills"),
  ...[
    ["Programming and Data", "Python (APIs, Matplotlib), SQL, R (tidyverse, sf, ggplot2, R Markdown), Microsoft Excel, data cleaning and validation."],
    ["Statistics", "Linear and logistic regression, hypothesis testing, chi-square trend tests, time-series trend and seasonal analysis, model comparison (R squared, RMSE, MAE, ROC/AUC)."],
    ["Visualisation and BI", "Tableau (stories, dashboard actions, parameters, forecasting), Power BI (dashboards, DAX)."],
    ["GIS and Spatial", "QGIS and ArcGIS, hot-spot analysis (Getis-Ord Gi*), network analysis, location-allocation, spatial joins, map layout."],
    ["Communication", "Analyst reports, conference presentations, explaining data to non-technical people."],
  ].map(([n, d], i, all) => para([run(n + ": ", { bold: true }), run(d)], i === all.length - 1 ? 60 : 40)),

  // ---- Relevant Experience ----
  heading("Relevant Experience"),
  ...entry({ title: "Marketing Data Analyst", date: "Sep 2022 – Sep 2023", org: "Divana, Bangkok, Thailand | Full-time", bullets: [
    "Tracked revenue and sales for all 18 Divana branches, cleaning the data in Excel and Python so every branch could be compared on the same basis.",
    "Compared sales of 23 products and found one was especially popular with a specific age group, then recommended the marketing team build a campaign aimed at that group.",
    "Built Excel and Power BI reports and wrote recommendations for the marketing team, using the results to decide what content to produce next.",
  ] }),
  ...entry({ title: "Data-Driven Marketing Intern", date: "Nov 2022 – Feb 2023", org: "Like Me X Co., Ltd. / Futureskill, Thailand | Remote", bullets: [
    "Built Excel and Power BI dashboards on content and audience data that the marketing team used to plan campaigns.",
    "Reviewed campaign results and wrote reports with recommendations for the marketing team.",
  ] }),
  ...entry({ title: "Mapping and GIS Solution Intern", date: "Apr 2022 – Jun 2022", org: "THIKNET Co., Ltd., Thailand", bullets: [
    "Maintained location data in SQL for a commercial navigation product, updating road and route records for every province in Thailand and adding EV charging stations.",
    "Checked every record against its source before committing it, because one wrong point can send a driver the wrong way.",
  ] }),

  // ---- Projects ----
  heading("Projects"),
  ...entry({ title: "Walking and Cycling Safety in Melbourne", date: "Oct 2026", org: "Independent project | R (sf, dplyr, ggplot2), QGIS, hot-spot analysis",
    page: "melbourne-crash.html", bullets: [
    "Mapped 142,875 Victorian crash records (2012 to 2025) with hot-spot analysis in R and QGIS, and found that half of the 2021 to 2025 pedestrian and cyclist crashes happened in just 6% of metro Melbourne.",
    "Tested injury severity across speed zones with a chi-square trend test, showing pedestrians hit on 80+ km/h roads are far more likely to be killed or seriously hurt than on 40 km/h roads (65% against 41%), meaning the risk rises with speed and is not due to chance.",
    "Recommended three targeted fixes (40 km/h zones, separated bike lanes and better street lighting), so councils can focus road safety money on the few areas where most crashes happen.",
  ] }),
  ...entry({ title: "ESG and Financial Analytics, Asia-Pacific", date: "May 2026", org: "Curtin University, individual project | Tableau", page: "esg.html", bullets: [
    "Measured how ESG score relates to return on assets across 8 Asia-Pacific markets, and found ESG explains only about 2% of the difference in profit between firms, so a high ESG rating alone is a poor guide to profitability.",
    "Built three linked Tableau dashboards on 15 years of ESG and financial data, showing average ESG scores rose by about a fifth, with China more than doubling.",
    "Wrote a business analyst report with recommendations for firms, investors and regulators, so investors compare ESG scores under one reporting standard (ISSB) instead of ratings that differ by market.",
  ] }),
  ...entry({ title: "WeatherWise: Python Weather Advisor", date: "Oct 2025", org: "Curtin University, individual project | Python, OpenWeatherMap API, Matplotlib", page: "weatherwise.html", bullets: [
    "Developed a Python app that pulls live five-day forecasts from the OpenWeatherMap API and turns 40 raw three-hourly readings into simple daily highs, lows and rainfall totals.",
    "Added Matplotlib charts and plain-English questions such as \"Will it rain tomorrow in Perth?\", answered by an AI API, so people who don't read charts still get a clear answer.",
  ] }),
  ...entry({ title: "Credit Risk Analysis", date: "Oct 2025", org: "Curtin University, group of three | RStudio, R Markdown", page: "credit-risk.html", bullets: [
    "Cleaned a 32,581-row loan dataset in R and found about one in five loans had defaulted. My part: cleaning, charts, regression and write-up.",
    "Trained a logistic regression model to predict loan default, reaching an AUC of 0.85 on unseen test data, so a lender can see which borrower details signal risk before approving a loan.",
  ] }),
  ...entry({ title: "Australian Housing Price Regression", date: "May 2026", org: "Curtin University, individual project | RStudio, R Markdown", page: "housing.html", bullets: [
    "Analysed quarterly data for five Australian states (2014 to 2025) in R to find what drives house price growth: interest rates, inflation, migration and the COVID-19 period all mattered, while household income did not.",
    "Compared five nested regression models and found the COVID-19 period added about 2.6 percentage points to quarterly price growth, while election years made no difference.",
  ] }),
  ...entry({ title: "Published Research: Drugstore Access in Thailand", date: "2023", org: "Co-author (field survey, network analysis, maps), ACRS 2023 | ArcGIS, network analysis, location-allocation",
    page: "drugstores.html", bullets: [
    "Assessed pharmacy access for 511 villages near Bangkok using GPS field survey data and ArcGIS network analysis of 433 drugstores, and found only 199 villages could reach a pharmacy in the medicine pick-up scheme.",
    "Located 22 new pharmacy sites with location-allocation that would bring 417 villages within reach, so health planners have a ready shortlist of where to add pharmacies.",
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
  bullet("Conference presenter, 8th Annual International Academic Conference on Education and Technology, May 2026: presented a Curtin sustainability student project, recognised in the Curtin Vice-Chancellor's communications.", true),

  // ---- References ----
  heading("References"),
  ...(PUBLIC ? [para("Available on request.", 0)] :
    PRIVATE.referees.flatMap((r, i, all) => [
      new Paragraph({ keepNext: true, spacing: { after: 0 }, children: [run(r.name, { bold: true })] }),
      para([run(r.role + " | ", { italics: true, color: GREY }), run(r.contact)], i === all.length - 1 ? 0 : 60),
    ])),
];

const doc = new Document({
  creator: "Yarida Kaewthong",
  title: "Yarida Kaewthong CV",
  styles: { default: { document: { run: { font: FONT, size: SZ, color: INK }, paragraph: { spacing: { line: 240 } } } } },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 300, hanging: 200 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 567, bottom: 567, left: 850, right: 850 } } }, children }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log((PUBLIC ? "public" : "private") + " CV written:", OUT);
});
