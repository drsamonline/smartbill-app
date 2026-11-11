# SmartBill India — user guide

**Version 1.0.1 · PolyForm Noncommercial 1.0.0**

GST-ready invoicing that runs entirely in the browser. No backend, no account: your data is stored on
your device in IndexedDB.

## What it does

- **Tax documents**: Tax Invoices, Quotations and Proforma Invoices, with strict grid alignment for
  professional A4 printing.
- **GST fields built in**: HSN/SAC codes, CGST and SGST, state codes, and reverse-charge mechanics —
  rather than a blank table you have to make compliant yourself.
- **Master settings**: save company profiles, bank details and terms & conditions; upload and store
  the company logo, authorised signature and payment QR code; pre-load products and services with
  default rates, HSN codes and tax brackets.
- **Utilities**: a complete `.json` backup and restore, one-click export to Microsoft Word (`.doc`),
  and direct-to-printer formatting.
- **Mobile-first**: create an invoice on a phone, a tablet or a desktop with the same interface.

## Your data lives on your device

There is no server and no account, which is the point — and it also means the browser is the whole
database. Two habits follow:

1. **Back up before you clear anything.** The `.json` export is the backup; without it, clearing site
   data is a lost ledger.
2. **Restore deliberately.** Importing a backup replaces what is there, so export the current state
   first if you are unsure.

## Printing

The A4 layout is the product: a tax invoice that prints with the columns where the tax officer
expects them. Use the browser's print dialog and keep the default margins — the grid is measured for
A4, not for whatever paper is in the tray.

## Licence

PolyForm Noncommercial 1.0.0. See [LICENSE](../LICENSE).
