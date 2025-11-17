# McCoy’s Terminology Clinic

A lightweight, Star Trek–flavoured web app (no back end) that helps you assess the health of your terminology source and generate a short “Medical Log” (PDF) with risks and a treatment plan.

## What it does
- Quick intake (organization, source, age, revisions)
- Checks common “symptoms” (duplicates, no owner, poor linking, etc.)
- Produces a clear status and key risks
- Suggests a practical treatment plan
- Exports a PDF report (client-side via jsPDF)

## Tech
- Static: HTML + CSS + vanilla JS
- No data leaves the browser
- Optional sounds for scan/red alert
- Safe, original SVG icons (no trademarks)

## Files

/ (repo root) index.html style.css app.js assets/ icon-tricorder.svg icon-scanner.svg icon-badge.svg icon-alert.svg icon-link.svg scan-beep.mp3        (optional) red-alert.mp3        (optional)

## Usage
- Open `index.html` locally, or
- Publish with GitHub Pages:
  - Settings → Pages → Branch: `main` / Folder: `/root`

## Notes
- The theme is playful, the advice is real: ownership, cadence, linking, logging, user focus.
- Replace the SVG icons if you want a different style; they are simple and safe to modify.
