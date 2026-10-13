# Work & Family Calendar

This app is intended to be placed in `work-family-calendar/` in the `anthonymacrae/anthony-budget-app` repository. It is separate from the existing budget app and does not replace its files.

## Features
- Monthly calendar with shift, training, family and personal events
- Overnight shifts and paid-hours entry
- Gross shift estimates and net estimates using a 26% planning deduction (74% retained; £13.50/hour becomes £9.99/hour)
- Payday-based shift forecasts
- Side-by-side conservative baselines and expected monthly take-home figures
- Manual actual-pay records and preview-based CSV wage import with duplicate checks
- Local JSON backup/restore and configurable sleep-in fixed payment

## Recorded assumptions
- Falcon House: 12.25 paid hours at £13.50 gross/hour; full calendar month, payday last Friday; baseline £2,000/month and expected take-home £2,000/month.
- AMG Rapid Response: 12 paid hours at £13.50 gross/hour for day/night; Monday–Sunday week paid Tuesday 9 days after Sunday, matching the example of 7–13 September paid 22 September; baseline £480/week and expected take-home £2,500/month.
- Voyage Saltbank: ordinary overnight 9 paid hours at £13.50 gross/hour; previous calendar month paid on the 15th; baseline £200/month and expected take-home £500/month. Sleep-in fixed amount remains unknown.
- Deduction estimate is 26%; this is a planning assumption, not a payroll/tax calculation.

## Privacy
The GitHub repository is public, so source code is public. Events and payment records are saved in browser local storage and are not sent to GitHub by this app. They are not encrypted by this app. Other people with access to the same device/browser profile may be able to view them. Exported backups contain private information and should be stored securely.

## Limitations
Google Calendar sync and automatic sync with the existing budget PWA are not connected. They require additional design and, for Google, secure OAuth consent. CSV import only suggests positive wage rows whose descriptions mention Falcon, AMG/Rapid Response, or Voyage/Saltbank/Caresom; preview and verify before importing. Actual receipts are stored separately; automatic matching/reconciliation against a specific forecast is not enabled in this first version, so compare the receipt with its forecast manually. Confirm pay-cycle behavior against payslips before relying on dates.
