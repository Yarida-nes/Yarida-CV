// Builds Yarida's CV as a Word file (.docx) with the "docx" package.
//
//   node make_cv.js                 -> private CV (phone + referees) if private.json exists
//   node make_cv.js --public        -> public CV ("References available on request")
//   node make_cv.js out.docx        -> choose the output file
//
// private.json (never committed; see private.example.json) holds the phone
// number and referees. Without it the build is always the public version.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, BorderStyle,
  LevelFormat, PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
} = require("docx");

let PRIVATE = null;
try { PRIVATE = JSON.parse(fs.readFileSync(path.join(__dirname, "private.json"), "utf8")); } catch {}
const ARGS = process.argv.slice(2).filter(a => !a.startsWith("--"));
const PUBLIC = process.env.CV_PUBLIC === "1" || process.argv.includes("--public") || !PRIVATE;
const OUT = ARGS[0] || path.join(__dirname, PUBLIC ? "Yarida_Kaewthong_CV_public.docx" : "Yarida_Kaewthong_CV_2026.docx");

const NAVY = "10233F", TEAL = "0563C1", GREY = "555B66", BODY = 21;
const FONT = "Calibri";

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || BODY, bold: o.bold, italics: o.italics, color: o.color || "000000" });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [new TextRun({ text, font: FONT, size: BODY, color: TEAL, underline: {} })] });
const sep = () => run(" | ");

const heading = (text) => new Paragraph({
  keepNext: true,
  spacing: { before: 160, after: 60 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 1 } },
  children: [run(text.toUpperCase(), { size: 21, bold: true, color: NAVY })],
});

// Title on the left, date pushed to the right margin
const titleLine = (left, right, sub) => new Paragraph({
  spacing: { before: sub ? 0 : 80, after: sub ? 20 : 0 },
  keepNext: true,
  children: [
    ...left,
    new TextRun({ children: [new PositionalTab({ alignment: PositionalTabAlignment.RIGHT, relativeTo: PositionalTabRelativeTo.MARGIN, leader: PositionalTabLeader.NONE })] }),
    run(right, { color: GREY }),
  ],
});

const bullet = (parts, keepNext = false) => new Paragraph({
  keepNext,
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 30 },
  children: (Array.isArray(parts) ? parts : [parts]).map(p => typeof p === "string" ? run(p) : p),
});
const b = (t) => run(t, { bold: true });

const plain = (children, after = 40) => new Paragraph({ spacing: { after }, children });

// Tools line under a project title, with the link to its case study
const toolsLine = (tools, page) => titleLine([run(tools + "  ·  ", { italics: true, color: GREY }),
  link("yarida-cv.vercel.app/" + page, "https://yarida-cv.vercel.app/" + page)], "", true);

const children = [
  // ---- Header ----
  new Paragraph({ spacing: { after: 0 }, children: [run("Yarida Kaewthong", { size: 40, bold: true, color: NAVY })] }),
  new Paragraph({ spacing: { after: 20 }, children: [b("Master of Commerce | Artificial Intelligence and Business Analytics")] }),
  new Paragraph({ spacing: { after: 0 }, children: [run("Perth, WA"), sep(), ...(PUBLIC ? [] : [run(PRIVATE.phone), sep()]),
      link("nestyarida@gmail.com", "mailto:nestyarida@gmail.com")] }),
  new Paragraph({ spacing: { after: 0 }, children: [run("Portfolio: "), link("https://yarida-cv.vercel.app/", "https://yarida-cv.vercel.app"), sep(),
      run("LinkedIn: "), link("www.linkedin.com/in/yarida-kaewthong", "https://www.linkedin.com/in/yarida-kaewthong")] }),
  new Paragraph({ spacing: { after: 60 }, children: [run("GitHub: "), link("https://github.com/Yarida-nes", "https://github.com/Yarida-nes")] }),

  // ---- Profile ----
  heading("Profile"),
  plain([run("Data analytics student at Curtin University with a GIS background and a co-authored research paper (ACRS 2023). I work with R, SQL, Python, Tableau, Power BI and GIS, and most recently analysed 30,000+ real crash records to find where people walking and cycling are most at risk in Melbourne. Seeking an internship in data analytics, business intelligence or GIS.")]),

  // ---- Education ----
  heading("Education"),
  titleLine([b("Master of Commerce (Artificial Intelligence and Business Analytics)")], "2025 – June 2027 (expected)"),
  titleLine([b("Curtin University, Perth, Australia")], "", true),
  bullet("Faculty of Business and Law Academic Performance Recognition, Semester 2, 2025"),
  titleLine([b("Bachelor of Social Science, Major in Geography (First Class Honours)")], "2019 – 2022"),
  titleLine([b("Kasetsart University, Thailand")], "", true),
  bullet("Co-authored a GIS research paper presented at the 2023 Asian Conference on Remote Sensing (ACRS 2023)"),

  // ---- Skills ----
  heading("Key Skills"),
  bullet([b("Data analysis: "), "R (tidyverse, sf, R Markdown), SQL, Python, Microsoft Excel"]),
  bullet([b("Statistics: "), "linear and logistic regression, hypothesis testing, confidence intervals, model evaluation (R², RMSE, ROC/AUC)"]),
  bullet([b("Visualisation and BI: "), "Tableau (stories, dashboard actions, parameters), Power BI (dashboards), Excel"]),
  bullet([b("GIS and spatial: "), "hot-spot analysis (Getis-Ord Gi*), network analysis, location-allocation, spatial joins, map layout"]),
  bullet([b("Digital marketing: "), "SEO, keyword research, copywriting, social media analytics, campaign performance reporting"]),

  // ---- Projects ----
  heading("Projects"),
  titleLine([b("Walking and Cycling Safety in Melbourne")], "Independent project, Oct 2026"),
  toolsLine("R (sf, dplyr, ggplot2), GIS, hot-spot analysis", "melbourne-crash.html"),
  bullet(["Analysed ", b("142,875 real Victorian injury crash records (2012–2025)"), ", focusing on 30,469 involving a pedestrian or cyclist."], true),
  bullet(["Found statistically significant hot spots with Getis-Ord Gi* on a 1 km hexagon grid: ", b("49% of 2021–2025 crashes occur in 6% of the area"), "."], true),
  bullet(["Showed a pedestrian's chance of serious injury or death rises from ", b("41% in 40 km/h zones to 65% in 80+ km/h zones"), " (95% confidence intervals, χ² trend test, p < 0.001)."]),

  titleLine([b("Published Research: Drugstore Access in Thailand")], "ACRS 2023, co-author"),
  toolsLine("GIS, nearest-neighbour analysis, network analysis, location-allocation", "drugstores.html"),
  bullet(["My part: field survey (GPS), network analysis, service-area maps and writing. Mapped ", b("433 drugstores"), " and showed they cluster (Z = −19.71)."], true),
  bullet(["Modelled coverage by road distance: adding 22 well-placed pharmacies raises coverage from ", b("199 to 417 of 511 villages"), "."], true),
  bullet(["Showed each participating pharmacist serves about ", b("13,451 people"), ", above the NHSO guideline of 10,000."]),

  titleLine([b("ESG and Financial Analytics, Asia-Pacific")], "Curtin University, May 2026"),
  toolsLine("Tableau", "esg.html"),
  bullet(["Built a Tableau Story of three linked dashboards on ", b("16,752 company-year records across 8 Asia-Pacific markets"), ", using parameters, dashboard actions and forecasting."]),
  bullet(["Found average ESG scores rose from 36.5 to 43.7 (2010–2024), with China more than doubling from ", b("20.7 to 44.4"), "."]),
  bullet("Wrote a business analyst report with recommendations on ESG, governance and financial performance."),

  titleLine([b("Credit Risk Analysis")], "Curtin University, group of three, Oct 2025"),
  toolsLine("RStudio, R Markdown", "credit-risk.html"),
  bullet(["Cleaned ", b("32,581 loan records to 28,578"), " (21.6% defaulted). My part: cleaning, charts, regression, write-up."]),
  bullet("Built a logistic regression model with forward stepwise selection to predict loan default, evaluated with accuracy, sensitivity, specificity and ROC/AUC."),

  titleLine([b("Australian Housing Price Regression")], "Curtin University, May 2026"),
  toolsLine("RStudio, R Markdown", "housing.html"),
  bullet(["Built five regression models of housing price growth using macroeconomic, seasonal and COVID-19 variables, and compared them on adjusted R², RMSE and MAE; adjusted R² improved from ", b("0.049 to 0.238"), "."]),
  bullet(["Found COVID-19 was the largest single effect (", b("+2.63 percentage points"), " of quarterly growth, p < 0.001), and rejected a fifth model because adjusted R² fell."]),

  titleLine([b("WeatherWise: Python Weather Advisor")], "Curtin University, Oct 2025"),
  toolsLine("Python, OpenWeatherMap API, Matplotlib", "weatherwise.html"),
  bullet(["Built a console weather advisor that pulls a five-day forecast from the OpenWeatherMap API and summarises ", b("40 three-hourly readings into 5 daily"), " highs, lows and rainfall totals."]),
  bullet("Charted temperature and rainfall with Matplotlib and passed plain-English questions to a language model."),

  // ---- Experience ----
  heading("Work Experience"),
  titleLine([b("Manager")], "September 2023 – Present"),
  titleLine([run("Six Senses Gourmet Thai, Leederville, Perth WA · Part-time", { color: GREY })], "", true),
  bullet("Track daily sales to identify best-selling dishes, and use this data to recommend new menu items to the owners."),
  bullet(["Helped lift the customer rating from ", b("3.6 to 4.0 stars"), " through menu and service improvements."]),
  bullet("Train and lead staff, coordinate daily workflow and stock, and resolve customer issues on the spot."),

  titleLine([b("Digital Marketing Executive")], "September 2022 – September 2023"),
  titleLine([run("Divana, Bangkok, Thailand · Full-time", { color: GREY })], "", true),
  bullet("Created SEO-focused content for the website (divanawellness.com), Instagram and digital marketing campaigns."),
  bullet("Researched keywords and customer interests to improve content relevance and online visibility."),
  bullet(["Tracked social media and campaign performance in ", b("Excel and Power BI"), " reports, using the results to plan which content to produce next."]),

  titleLine([b("Data-Driven Marketing Intern")], "November 2022 – February 2023"),
  titleLine([run("Like Me X Co., Ltd. / Futureskill, Thailand · Remote", { color: GREY })], "", true),
  bullet(["Built ", b("Excel and Power BI dashboards"), " on online content and audience data to guide campaign planning."]),
  bullet("Reviewed campaign results and wrote reports with recommendations for the marketing team."),
  bullet("Researched online content trends and prepared short content for digital platforms."),

  titleLine([b("Mapping and GIS Solution Intern")], "April 2022 – June 2022"),
  titleLine([run("THIKNET Co., Ltd., Thailand", { color: GREY })], "", true),
  bullet(["Used ", b("SQL"), " to maintain location data for a commercial navigation and mapping product."]),
  bullet(["Updated road, route and turn-restriction records for ", b("every province in Thailand"), ", and added EV charging station locations."]),
  bullet("Checked every record against its source before committing, since a wrong point sends drivers the wrong way."),

  // ---- Achievements ----
  heading("Achievements and Certifications"),
  bullet([b("Google Data Analytics Professional Certificate"), ", Google / Coursera, 2026: completed the full program, covering data cleaning, analysis, visualisation, SQL, R and a capstone case study."]),
  bullet([b("Conference presenter"), ", 8th Annual International Academic Conference on Education and Technology, May 2026: presented a Curtin sustainability student project, recognised in the Curtin Vice-Chancellor's communications."]),
  bullet([b("NSO Data Camp 2023"), ", “Branding is All About Counting”, February 2023: data and business case study pitch using the Business Model Canvas."]),

  // ---- References ----
  heading("References"),
  ...(PUBLIC ? [plain([run("Available on request.", { color: GREY })], 0)] :
    PRIVATE.referees.map((r, i, all) => plain([b(r.name), run(", " + r.role + " · "), run(r.contact, { color: GREY })], i === all.length - 1 ? 0 : 40))),
];

const doc = new Document({
  creator: "Yarida Kaewthong",
  title: "Yarida Kaewthong CV",
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 360, hanging: 360 } } } }] }] },
  sections: [{ properties: { page: { margin: { top: 600, bottom: 600, left: 1020, right: 1020 } } }, children }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log((PUBLIC ? "public" : "private") + " CV written:", OUT);
});
