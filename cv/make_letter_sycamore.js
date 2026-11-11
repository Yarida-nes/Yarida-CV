// Builds Yarida's Sycamore Civil Group (Admin Site Manager Assistant) cover letter as a Word file.
// Follows the Curtin Careers Cover Letter Workbook structure: contact, date, addressee, salutation,
// subject line, five paragraphs (purpose, why this job, specialist skills, transferable skills, closing),
// sign-off with a signature gap, Enc. Resume. Calibri 11 pt, margins over 2 cm, one page.
// usage: node make_letter_sycamore.js out.docx      (phone comes from private.json)
// Yellow text is a placeholder only Yarida can fill in.
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun } = require("docx");

let PRIVATE = {};
try { PRIVATE = JSON.parse(fs.readFileSync(path.join(__dirname, "private.json"), "utf8")); } catch {}

const INK = "1A1A1A", FONT = "Calibri", SZ = 22;
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: SZ, color: INK, ...o });
const todo = (text) => run(text, { highlight: "yellow" });
const p = (children, after = 180) => new Paragraph({ spacing: { after, line: 264 }, children: Array.isArray(children) ? children : [run(children)] });
const lines = (arr, after = 240) => arr.map((t, i) => p(t, i === arr.length - 1 ? after : 0));

const DATE = "11 November 2026";

const children = [
  // Contact
  ...lines(["Yarida Kaewthong", "nestyarida@gmail.com", ...(PRIVATE.phone ? [PRIVATE.phone] : [])]),
  // Date
  p(DATE, 240),
  // Addressee (no name in the advert, so "The Manager" for a small company, as the workbook suggests)
  ...lines(["The Manager", "Sycamore Civil Group", "East Perth WA"], 300),
  // Salutation and subject
  p("Dear Hiring Manager"),
  p([run("Re: Administration and Site Manager Assistant Internship", { bold: true })], 220),

  // Paragraph 1: purpose
  p("I am writing to apply for the Administration and Site Manager Assistant internship with Sycamore Civil Group, as advertised through UniHub at Curtin University."),

  // Paragraph 2: why this job
  p([run("Sycamore Civil Group focuses on sustainable waste management, material recovery and recycling. "),
    todo("[your reason: one sentence on why you want to work for Sycamore]"),
    run(" In May 2026, I presented a Curtin sustainability student project at an international conference, and in an individual Curtin project I analysed 15 years of ESG data for 8 Asia-Pacific markets and wrote a business analyst report on the findings.")]),

  // Paragraph 3: specialist skills
  p("I am studying a Master of Commerce (Artificial Intelligence and Business Analytics) at Curtin University. The role involves keeping accurate records and updating Excel spreadsheets and reports. As a Marketing Data Analyst at Divana, I tracked revenue and sales for all 18 branches in Excel and Power BI, cleaning the data so every branch could be compared on the same basis. As a GIS intern at THIKNET, I mapped EV charging stations on main roads in all 77 provinces of Thailand and checked every record against its source before committing it. For a co-authored research paper, I worked with GPS field survey data. I have not used Xero so far."),

  // Paragraph 4: transferable skills
  p("Since September 2023, I have worked part-time as a restaurant manager in Leederville. I lead and train the team, including shift supervisors and around 5 staff per shift, and have trained around 8 new starters in service standards, ordering and payments. I also track daily sales to spot best-selling dishes."),

  // Paragraph 5: closing
  p("Thank you for your time and consideration. I have attached my resume, and I am available full-time from 16 November 2026 to 5 February 2027. I would welcome the opportunity to discuss my application further.", 240),

  // Close and sign off (gap for signature), attachments
  p("Yours faithfully", 600),
  p("Yarida Kaewthong", 0),
  p("nestyarida@gmail.com", 240),
  p("Enc. Resume", 0),
];

const doc = new Document({
  creator: "Yarida Kaewthong",
  title: "Yarida Kaewthong cover letter, Sycamore Civil Group",
  styles: { default: { document: { run: { font: FONT, size: SZ, color: INK } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1247, right: 1247 } } }, children }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(process.argv[2], buf); console.log("letter written", process.argv[2]); });
