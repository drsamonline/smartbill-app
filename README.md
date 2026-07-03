# SmartBill India 🇮🇳 🧾

SmartBill India is a lightweight, single-page billing and invoicing application designed specifically for Indian businesses. Built entirely with frontend technologies, it runs directly in your browser and saves all data locally without needing a backend database.

## ✨ Features
* **100% Serverless & Private:** All data (Master settings, invoices) is stored locally on your device using IndexedDB.
* **GST Ready:** Built-in fields for HSN/SAC, CGST, SGST, State Codes, and Reverse Charge mechanics.
* **Proforma & Tax Invoices:** Generate multiple document types with strict grid alignments.
* **Smart Master Data:** Save company profiles, bank details, signatures, and QR codes for quick reuse.
* **Data Portability:** Export your entire database as a `.json` backup and restore it on any device.
* **Print & Export:** Print directly in A4 format or export to Microsoft Word (`.doc`).

## 🛠️ Tech Stack
* **Framework:** Vue.js 3 (CDN)
* **Styling:** Tailwind CSS
* **Icons:** Font Awesome
* **Database:** Native IndexedDB

## 🚀 How to Use (Live Demo)
You can use the app directly from your browser without downloading anything!
**[Link to Live App]** *(Add your GitHub pages link here once it is live)*

## 💻 Local Setup
Since this is a single HTML file, there is no build step required.
1. Download `index.html` to your computer.
2. Double-click the file to open it in any modern web browser (Chrome, Edge, Firefox, Safari).
3. Start billing!

## ⚠️ Important Note on Storage
Because this app uses your browser's local storage, **clearing your browser data will delete your invoices**. Always use the "Download Backup" feature in the Master Settings tab to save your data safely to your computer.
