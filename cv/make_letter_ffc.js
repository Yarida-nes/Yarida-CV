// Builds Yarida's Fremantle Football Club cover letter as a Word file, in the same style as the CV.
// usage: node make_letter_ffc.js out.docx
// Yellow text is a placeholder only Yarida can fill in.
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, BorderStyle } = require("docx");

const ACCENT = "093B5D", INK = "1A1A1A", FONT = "Calibri", SZ = 22;
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: SZ, color: INK, ...o });
const todo = (text) => run(text, { highlight: "yellow" });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [run(text, { color: ACCENT })] });
const p = (children, after = 200) => new Paragraph({ spacing: { after, line: 276 }, children: Array.isArray(children) ? children : [run(children)] });

const body = [
  [run("I am applying for the Unpaid Student Internship in performance analysis at Fremantle Football Club. "),
    todo("[your reason: one sentence on why Fremantle or sports performance analysis]")],
  "The role asks for knowledge of machine learning and data analysis methods. In a Curtin team of four, I built our machine learning workflow in Orange that scores 280 customers for churn risk. It found 77.5% of at-risk customers and automatically produces a weekly list of 14 to call. In a group credit risk project, I cleaned a 32,581-row loan dataset in R and trained a logistic regression model that predicts default with an AUC of 0.85 on unseen test data.",
  "You list R as a beneficial skill. In my own project, I mapped 142,875 Victorian crash records in R and QGIS and used a chi-square trend test to show that pedestrians hit on 80+ km/h roads are far more likely to be killed or seriously hurt than on 40 km/h roads (65% against 41%). I also compared five nested regression models of house price growth in R.",
  "The role includes extracting data and preparing reports. I built a soccer competition database in Oracle SQL that records every game, goal, card and best-on-ground award for a six-club season, and wrote 13 queries that produce the season ladder, top scorers and most valuable player. I also wrote a business analyst report from three linked Tableau dashboards.",
  "Beside group projects, I lead and train the team at a Perth restaurant, with around 5 staff per shift.",
  "I have not used SportsCode so far.",
  "I would welcome a conversation about the internship.",
];

const children = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [run("Yarida Kaewthong", { size: 44, bold: true, color: "111111" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [run("Perth, WA | "), link("nestyarida@gmail.com", "mailto:nestyarida@gmail.com")] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: INK, space: 6 } },
    children: [run("Portfolio: "), link("yarida-cv.vercel.app", "https://yarida-cv.vercel.app"), run(" | LinkedIn: "),
      link("linkedin.com/in/yarida-kaewthong", "https://www.linkedin.com/in/yarida-kaewthong")] }),
  p([run("Re: Unpaid Student Internship with Fremantle Football Club (performance analysis)", { bold: true })]),
  p("Dear Hiring Team,"),
  ...body.map((t) => p(t)),
  p("Yours sincerely,", 120),
  p("Yarida Kaewthong", 0),
];

const doc = new Document({
  creator: "Yarida Kaewthong",
  title: "Yarida Kaewthong cover letter, Fremantle Football Club",
  styles: { default: { document: { run: { font: FONT, size: SZ, color: INK } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } }, children }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(process.argv[2], buf); console.log("letter written", process.argv[2]); });
