# CV builder

`make_cv.js` holds the full text of Yarida's CV and builds it as a Word file.
The website's download, `../Yarida-Kaewthong-CV.pdf`, is made from the public build.

## Two versions

| Build | Command | Contains |
| --- | --- | --- |
| Public | `node make_cv.js --public` | email, links, "References available on request" |
| Private | `node make_cv.js` (needs `private.json`) | also phone number and referees |

`private.json` is ignored by git and stays on Yarida's laptop. Copy
`private.example.json` to make one. Without it the build is always public.

## Rebuild the PDFs on the laptop (Windows, Word installed)

Open a terminal in this `cv` folder, then:

```bash
npm install
```

```bash
node make_cv.js --public && node make_cv.js
```

```bash
powershell -ExecutionPolicy Bypass -File topdf.ps1
```

The public PDF lands at the repo root as `Yarida-Kaewthong-CV.pdf`; commit and push it
to update the website's download. Both PDFs are also placed in the Desktop folder
`Yarida CV\1 Current CV`, which is the folder to attach from when applying.

## Where the other CV files live

Everything outside this repo sits in `Desktop\Yarida CV`:

| Folder | Contents |
| --- | --- |
| `1 Current CV` | The two latest PDFs (private and public) |
| `2 Applications` | One subfolder per job applied for, with the CV and cover letter sent |
| `3 Old versions` | Earlier CVs and drafts, kept for reference |
| `4 Website work` | Charts, screenshots and planning notes for the website |

## Rules for editing the text

- Only facts that are true and already proven somewhere (a project page, a repo, a certificate).
- No numbers that were not measured. If a figure is unknown, leave it out.
- Keep both versions to two pages.
