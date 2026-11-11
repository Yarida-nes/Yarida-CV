// Builds Yarida's Bethanie AI & Automation Internship cover letter as a Word file, in the same style as the CV.
// usage: node make_letter_bethanie.js out.docx
// Yellow text is a placeholder only Yarida can fill in.
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, BorderStyle } = require("docx");

const ACCENT = "093B5D", INK = "1A1A1A", FONT = "Calibri", SZ = 22;
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: SZ, color: INK, ...o });
const todo = (text) => run(text, { highlight: "yellow" });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [run(text, { color: ACCENT })] });
const p = (children, after = 200) => new Paragraph({ spacing: { after, line: 276 }, children: Array.isArray(children) ? children : [run(children)] });

const body = [
  [run("I am applying for the AI & Automation Internship in Bethanie's Service Design and Digital Enablement team. I am studying a Master of Commerce (Artificial Intelligence and Business Analytics) at Curtin University. "),
    todo("[your reason: one sentence on why Bethanie or this role]")],
  "The role includes documenting AI use cases with their benefits, risks and next steps. In my individual consultant report for a Curtin unit, I tested sentiment AI on 360 support tickets and 240 reviews, and showed that two tools found at most 58% of unhappy customers against a 70% target, so they were not fit to automate. In a team of four, I then built our machine learning workflow that scores 280 customers for churn risk and produces a weekly list of 14 to call, with each customer's own tickets attached. A person still makes every decision. When I tested a lower cut-off, the list grew to 101 names and only 53% were right, so we set it to fit the 10 to 15 reviews the team can do each week. Our report set out the tool's limits and recommended a staged pilot, not full deployment.",
  "I also developed WeatherWise, a Python app that answers plain-English questions through an AI API. At Divana, I tracked revenue and sales for 18 branches in Excel and Power BI.",
  "You ask for someone who can explain things simply to people with varying technical experience. As a restaurant manager, I have trained around 8 new starters in service standards, ordering and payments. I have also written analyst reports and presented a Curtin student project at an international conference in May 2026.",
  "On attention to detail: at THIKNET, I checked every EV charging station record against its source before committing it.",
  "I have not used Copilot, Power Automate or Power Apps so far.",
  "I would welcome a conversation about the internship.",
];

const children = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [run("Yarida Kaewthong", { size: 44, bold: true, color: "111111" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [run("Perth, WA | "), link("nestyarida@gmail.com", "mailto:nestyarida@gmail.com")] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: INK, space: 6 } },
    children: [run("Portfolio: "), link("yarida-cv.vercel.app", "https://yarida-cv.vercel.app"), run(" | LinkedIn: "),
      link("linkedin.com/in/yarida-kaewthong", "https://www.linkedin.com/in/yarida-kaewthong")] }),
  p([run("Re: AI & Automation Internship, Bethanie (via ACS Foundation)", { bold: true })]),
  p("Dear Sarah Maiden,"),
  ...body.map((t) => p(t)),
  p("Kind regards,", 120),
  p("Yarida Kaewthong", 0),
];

const doc = new Document({
  creator: "Yarida Kaewthong",
  title: "Yarida Kaewthong cover letter, Bethanie AI & Automation Internship",
  styles: { default: { document: { run: { font: FONT, size: SZ, color: INK } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } } }, children }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(process.argv[2], buf); console.log("letter written", process.argv[2]); });
