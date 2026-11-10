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

const ACCENT = "093B5D", INK = "1A1A1A", GREY = "555555";
const FONT = "Calibri", SZ = 20;   // 10 pt

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: SZ, color: INK, ...o });
const link = (text, url, o = {}) => new ExternalHyperlink({ link: url, children: [run(text, { color: ACCENT, ...o })] });
const bare = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/^mailto:/, "").replace(/\/$/, "");
const SITE = "https://yarida-cv.vercel.app/";

const center = (children, after = 0) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after }, children });
const heading = (text) => new Paragraph({
  keepNext: true,
  spacing: { before: 110, after: 70 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: INK, space: 1 } },
  children: [run(text.toUpperCase(), { size: 24, bold: true, color: ACCENT, characterSpacing: 10 })],
});
const para = (children, after = 80) => new Paragraph({ spacing: { after }, children: Array.isArray(children) ? children : [run(children)] });
const bullet = (text, last) => new Paragraph({
  numbering: { reference: "bullets", level: 0 }, spacing: { after: last ? 80 : 10 }, children: [run(text)],
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
  para("Master of Commerce (Artificial Intelligence and Business Analytics) student at Curtin University, with First Class Honours in Geography and a co-authored GIS research paper (ACRS 2023). I analyse data in R, Python and SQL, map it in QGIS and ArcGIS, and present it in Tableau and Power BI. Before I report a pattern, I test whether it is real. Most recently I analysed 142,875 Victorian crash records to show where people walking and cycling in Melbourne are most at risk. Seeking a data analytics, business intelligence or GIS internship in Perth, and graduate roles from July 2027."),

  // ---- Skills ----
  heading("Skills"),
  ...[
    ["Programming and Data", "Python (APIs, Matplotlib), SQL (Oracle), R (tidyverse, sf, ggplot2, R Markdown), Microsoft Excel, data cleaning and validation."],
    ["Statistics", "Linear and logistic regression, hypothesis testing, chi-square trend tests, time-series analysis, model comparison (R squared, RMSE, MAE, ROC/AUC), sentiment analysis (Orange)."],
    ["Visualisation and BI", "Tableau (stories, dashboard actions, parameters, forecasting), Power BI (dashboards, DAX)."],
    ["GIS and Spatial", "QGIS and ArcGIS, hot-spot analysis (Getis-Ord Gi*), network analysis, location-allocation, spatial joins, map layout."],
    ["Communication", "Analyst reports, conference presentations, explaining data to non-technical people."],
  ].map(([n, d], i, all) => para([run(n + ": ", { bold: true }), run(d)], i === all.length - 1 ? 60 : 40)),

  // ---- Relevant Experience ----
  heading("Relevant Experience"),
  ...entry({ title: "Marketing Data Analyst", date: "Sep 2022 – Sep 2023", org: "Divana, Bangkok, Thailand | Full-time", bullets: [
    "Tracked revenue and sales for all 18 Divana branches in Excel and Power BI (DAX), cleaning the data in Excel and Python so every branch could be compared on the same basis.",
    "Compared sales of 23 products and found one was especially popular with a specific age group, then recommended a campaign aimed at that group, which lifted the product's sales by about 38% within 3 months.",
  ] }),
  ...entry({ title: "Data-Driven Marketing Intern", date: "Nov 2022 – Feb 2023", org: "Like Me X Co., Ltd. / Futureskill, Thailand", bullets: [
    "Analysed audience data in Facebook Ads and tracked campaign results in Excel.",
    "Ran A/B tests on different marketing posts and reported which content suited each type of customer, so the team could match each post to the right audience.",
  ] }),
  ...entry({ title: "Mapping and GIS Solution Intern", date: "Apr 2022 – Jun 2022", org: "THIKNET Co., Ltd., Thailand", bullets: [
    "Mapped EV charging stations on main roads in all 77 provinces of Thailand in ArcGIS and SQL for a navigation product.",
    "Found about 80% of charging stations were in central Thailand, meaning drivers elsewhere had few places to charge.",
    "Checked every record against its source before committing it, because one wrong point can send a driver the wrong way.",
  ] }),

  // ---- Projects ----
  heading("Projects"),
  ...entry({ title: "Walking and Cycling Safety in Melbourne", date: "Oct 2026", org: "Independent project | R (sf, dplyr, ggplot2), QGIS, hot-spot analysis",
    page: "melbourne-crash.html", bullets: [
    "Mapped 142,875 Victorian crash records (2012 to 2025) with hot-spot analysis in R and QGIS, and found that half of the 2021 to 2025 pedestrian and cyclist crashes happened in just 6% of metro Melbourne.",
    "Showed with a chi-square trend test that pedestrians hit on 80+ km/h roads are far more likely to be killed or seriously hurt than on 40 km/h roads (65% against 41%), a rise too large to be chance.",
    "Recommended 40 km/h zones, separated bike lanes and better street lighting for those hot-spot areas.",
  ] }),
  ...entry({ title: "Customer Feedback Text Analytics", date: "2026", org: "Curtin University, individual consultant report | Orange Data Mining, sentiment analysis, clustering", page: "cloudcore.html", bullets: [
    "Analysed 360 support tickets and 240 reviews in Orange and separated two problems: one product rated lowest in every region, and one region losing 49% of its customers.",
    "Tested two sentiment tools against customers' own scores and showed the better one found only 58% of unhappy customers against a 70% target, so I recommended staff keep reading negative tickets.",
  ] }),
  ...entry({ title: "ESG and Financial Analytics, Asia-Pacific", date: "May 2026", org: "Curtin University, individual project | Tableau", page: "esg.html", bullets: [
    "Built three linked Tableau dashboards on 15 years of ESG and financial data for 8 Asia-Pacific markets, and found ESG explains only about 2% of the difference in profit between firms, so a high ESG rating alone is a poor guide to profitability.",
    "Wrote a business analyst report recommending that firms, investors and regulators compare ESG scores under one reporting standard (ISSB), because ratings differ by market.",
  ] }),
  ...entry({ title: "WeatherWise: Python Weather Advisor", date: "Oct 2025", org: "Curtin University, individual project | Python, OpenWeatherMap API, Matplotlib", page: "weatherwise.html", bullets: [
    "Developed a Python app that pulls live five-day forecasts from the OpenWeatherMap API, turns 40 three-hourly readings into daily highs, lows and rainfall with Matplotlib charts, and answers plain-English questions through an AI API.",
  ] }),
  ...entry({ title: "Soccer Competition Database", date: "2026", org: "Curtin University, individual project | Oracle SQL, ERD, data dictionary", page: "soccer-database.html", bullets: [
    "Translated 18 business rules into a normalised 16-table Oracle schema with an entity relationship diagram and data dictionary, then wrote 13 SQL queries (joins, subqueries, aggregation) that produce the season ladder, top scorers and most valuable player.",
  ] }),
  ...entry({ title: "Credit Risk Analysis", date: "Oct 2025", org: "Curtin University, group of three | RStudio, R Markdown", page: "credit-risk.html", bullets: [
    "Cleaned a 32,581-row loan dataset in R, found about one in five loans had defaulted, and trained a logistic regression model that predicts default with an AUC of 0.85 on unseen test data. My part: cleaning, charts, regression and write-up.",
  ] }),
  ...entry({ title: "Australian Housing Price Regression", date: "May 2026", org: "Curtin University, individual project | RStudio, R Markdown", page: "housing.html", bullets: [
    "Compared five nested regression models of quarterly house price growth in five Australian states (2014 to 2025) in R, and found the COVID-19 period added about 2.6 percentage points to quarterly growth, while election years made no difference.",
  ] }),
  ...entry({ title: "Published Research: Drugstore Access in Thailand", date: "2023", org: "Co-author (field survey, network analysis, maps), ACRS 2023 | ArcGIS, network analysis, location-allocation",
    page: "drugstores.html", bullets: [
    "Assessed pharmacy access for 511 villages near Bangkok using GPS field survey data and ArcGIS network analysis of 433 drugstores: only 199 villages could reach a pharmacy, and 22 new sites found with location-allocation would bring that to 417.",
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
    "Track daily sales to spot best-selling dishes and suggest new menu items; these menu and service changes helped lift the restaurant's Google rating from 3.6 to 4.0 stars.",
    "Lead and train the restaurant team, including shift supervisors and around 5 staff per shift, and have trained around 8 new starters in service standards, ordering and payments.",
  ] }),

  // ---- Achievements ----
  heading("Achievements and Certifications"),
  bullet("Google Data Analytics Professional Certificate, Google / Coursera, 2026."),
  bullet("Conference presenter, 8th Annual International Academic Conference on Education and Technology, May 2026: presented a Curtin sustainability student project, recognised in the Curtin Vice-Chancellor's communications.", true),

  // ---- References ----
  heading("References"),
  ...(PUBLIC ? [para("Available on request.", 0)] :
    PRIVATE.referees.map((r, i, all) =>
      para([run(r.name, { bold: true }), run(", " + r.role + " | ", { color: GREY }), run(r.contact)], i === all.length - 1 ? 0 : 40))),
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
