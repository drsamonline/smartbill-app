# 🚀 SMARTBILL INDIA - PRO BILLING v1.0

[![License: Dual](https://img.shields.io/badge/License-Custom%20Dual-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20Browser-0078D4.svg)]()
[![Creator](https://img.shields.io/badge/Creator-Coding%20For%20Fun-blueviolet.svg)](https://about.me/drsohil)

> A comprehensive, serverless, single-page billing and invoicing application built with Vue.js, tailored specifically for Indian businesses. Features local IndexedDB storage, robust master settings, and complete export capabilities.

---

## ✨ Features

- **100% Mobile Responsive:** Designed with a mobile-first approach using Tailwind CSS. Seamlessly switch between creating invoices on a desktop, tablet, or smartphone.
- **100% Serverless & Private Storage:** 
  - All data is saved directly on your device using native browser IndexedDB.
  - No backend database required.
- **GST & Tax Ready:** 
  - Built-in fields for HSN/SAC, CGST, SGST, State Codes, and Reverse Charge mechanics.
- **Document Generation:**
  - Create Tax Invoices, Quotations, and Proforma Invoices.
  - Strict grid alignments for professional A4 printing.
- **Advanced Master Settings:**
  - Save Company Profiles, Bank Details, and Terms & Conditions.
  - Upload and store Company Logos, Authorized Signatures, and Payment QR Codes.
  - Pre-load Product/Service items with default rates, HSN codes, and tax brackets.
- **System Utilities:**
  - Complete Data Backup (.json export) and Restore functionality.
  - One-click export to Microsoft Word (.doc).
  - Direct-to-printer formatting.
- **Responsive UI:** Built with Tailwind CSS for a clean, modern interface.

---

## 🚀 Getting Started

These instructions will guide you through setting up and using the SmartBill application on your local machine or hosting it on GitHub Pages.

### 📋 Prerequisites

- A modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari).
- No server, Node.js, or backend setup is required.

### 💻 Installation

1. Download the ZIP package from the releases or clone this repository.
2. Extract the files to a folder of your choice.
3. Simply double-click the `index.html` (or `billing8.html`) file to open it in your browser.
*(Alternatively, host the file via GitHub Pages to access it from anywhere).*

### 🛠️ Usage

1. **Master Setup:** Upon first launch, navigate to the `Master & Settings` tab. Fill in your company details, upload your logo/signature, and add your frequent products. Click **Save Master Settings**.
2. **Create Invoices:** Navigate to the `New Invoice` tab to generate a bill. Use the dropdowns to auto-fill items from your master list.
3. **Save & History:** Click **Save to History** to store the invoice in your local browser database. View past documents in the `History` tab.
4. **Export:** Go to `Preview & Export` to print the A4 document or download it as a Word file.
5. **Backup:** Regularly use the `Download Backup (.json)` button in the Master Settings to save a physical copy of your database to your hard drive.

---

## 📁 File Structure

```text
SmartBill_India_v1.0/
│
├── index.html               # The complete application (HTML/JS/CSS)
├── README.md                # This documentation file
└── LICENSE                  # Custom Dual-License file

🤝 Contributing
Contributions are welcome! Please fork the repository and submit pull requests.

Follow coding style and consistency (Vue 3 Composition API structure).

Test your changes thoroughly before submission.

Include descriptive commit messages.

🎧 Support
For issues, commercial licensing, or inquiries, reach out via:

Email: sohilmomin2000@gmail.com

Creator Profile: about.me/drsohil

GitHub Issues: github.com/DrSamOnline/SmartBill-India/issues

⚖️ License
This project is licensed under a Custom Dual License — free for individual/non-commercial use, but requires a paid license for commercial/business use. See the LICENSE file for details.

🙌 Acknowledgments
Built using Vue.js 3 for reactivity.

Styled entirely with Tailwind CSS.

Icons provided by Font Awesome.

Thanks to all contributors and users who provide feedback.

⚠️ Disclaimer
Data Storage Warning: This application uses your browser's local storage (IndexedDB). Clearing your browser data, cache, or running strict system cleaners will permanently delete your saved invoices and master settings. Always back up your data frequently using the built-in .json backup tool. Use this software at your own risk.

Happy Billing! 🚀
