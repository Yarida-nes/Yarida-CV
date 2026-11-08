// Builds Yarida's SLB cover letter as a Word file, in the same style as the CV.
// usage: node make_letter_slb.js out.docx
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, BorderStyle } = require("docx");

const ACCENT = "7A2434", INK = "1A1A1A", FONT = "Calibri", SZ = 22;
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: SZ, color: INK, ...o });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [run(text, { color: ACCENT })] });
const p = (children, after = 200) => new Paragraph({ spacing: { after, line: 276 }, children: Array.isArray(children) ? children : [run(children)] });

const body = [
  "I am applying for SLB's Early Careers IT & Digital Internship in Perth. [your reason: one sentence on why SLB or this internship]",
  "The internship is open to students in data analytics, data science and related fields. I am studying a Master of Commerce (Artificial Intelligence and Business Analytics) at Curtin University, after a geography degree with First Class Honours.",
  "Most of my recent work is with data. In my own project on Melbourne road safety, I analysed 142,875 crash records in R and GIS and found that half of the pedestrian and cyclist crashes from 2021 to 2025 fell in just 6% of the area. For an ESG unit, I built a Tableau Story of three linked dashboards across 8 Asia-Pacific markets and wrote a report with recommendations for firms, investors and regulators.",
  "On the technical side, I built WeatherWise in Python, an app that pulls live forecasts from the OpenWeatherMap API and answers plain-English questions through an AI API. Before Curtin, I used SQL at THIKNET to maintain location data for a commercial navigation product, checking every record against its source before committing it.",
  "I also co-authored a GIS research paper presented at ACRS 2023, and I manage a restaurant team part-time in Leederville.",
  "I hold an Australian Student visa (subclass 500). My projects are at yarida-cv.vercel.app, and several have a live demo. I would welcome the chance to talk about the internship.",
];

const children = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [run("Yarida Kaewthong", { size: 44, bold: true, color: "111111" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [run("Perth, WA | "), link("nestyarida@gmail.com", "mailto:nestyarida@gmail.com")] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: INK, space: 6 } },
    children: [run("Portfolio: "), link("yarida-cv.vercel.app", "https://yarida-cv.vercel.app"), run(" | LinkedIn: "),
      link("linkedin.com/in/yarida-kaewthong", "https://www.linkedin.com/in/yarida-kaewthong")] }),
  p("[add: date]"),
  p([run("Re: Early Careers - IT & Digital Internships (Perth)", { bold: true })]),
  p("Dear Hiring Team,"),
  ...body.map((t) => p(t)),
  p("Kind regards,", 120),
  p("Yarida Kaewthong", 0),
];

const doc = new Document({
  creator: "Yarida Kaewthong",
  title: "Yarida Kaewthong cover letter, SLB",
  styles: { default: { document: { run: { font: FONT, size: SZ, color: INK } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } }, children }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(process.argv[2], buf); console.log("letter written", process.argv[2]); });
