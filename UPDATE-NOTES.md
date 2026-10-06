# Proposal layout update

## Apply this update to your existing Vercel project

1. Extract the ZIP and replace your repository source with the contents of `vercel-project-desk` (keep `package.json` at the repository root).
2. Push the changes or redeploy the updated source to your existing Vercel project.
3. Keep your existing Supabase environment variables. **No new Supabase project, SQL migration or re-import is needed for this layout update.** Existing database records remain in your database.
4. Open your existing proposal and edit its cover details. Enter a line break in **Document title** with **Shift + Enter**. For example:

   Digital Marketing &
   Social Media Management

5. Set **Cover line / prepared for** to any text you need, such as “Proposal for Vooket”. If blank, the app derives it from the available client/company/project name.
6. Investment, proposal duration and footer note are optional new fields. Empty fields are omitted. Example: `₹12,000 + GST / Month`, `3 Months`.
7. For older pasted body text, click **Compact all**, review the preview and **Save draft**. Newly pasted content is compacted automatically.

## Layout and paste fixes

- Reference-style left-aligned title and recipient; larger logo and Waplia lettering.
- User-entered title line breaks survive preview, save and export. Content-page headers flatten the same title to one line.
- Contact details, project name, prepared by/company and date remain editable.
- Clipboard fonts, margins and redundant empty paragraphs are removed; headings, bold/italic, lists and tables are retained.
- Plain-text Markdown headings and bullet lists become formatted content.
- A normal pasted divider is a small line in the document. It no longer forces every service onto another page. Only the **Page break** toolbar button explicitly starts a new page.
- Paragraph, bullet and heading spacing is smaller and consistent. Long proposals still paginate automatically.
- Updated package lock verified with `npm ci --dry-run` to avoid the earlier missing-dependency lock error.

`examples/Proposal-Layout-Preview.pdf` is a layout demonstration, not a final client proposal. Your own commercial terms and body content stay under your control.
