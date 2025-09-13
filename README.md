# Mini CRM Frontend

A lightweight Customer Relationship Management (CRM) frontend built with **React, Vite, Tailwind CSS, and ShadCN UI**.  
This project is designed to manage customers and leads with a clean dashboard, authentication, and reporting features.

---

## Overview

This application provides a simple interface for managing customers and tracking leads.  
It is built to be scalable, responsive, and easy to integrate with a backend API (Node.js + Express + MongoDB).

---

## Features

- **Authentication**
  - Login and registration pages
  - JWT-based authentication (token stored in localStorage)

- **Dashboard**
  - KPI cards for total customers, active leads, and converted leads
  - Charts for visualizing leads by status

- **Customers**
  - Table view with pagination and search
  - Add, edit, and delete customer records
  - Customer detail page with associated leads

- **Leads**
  - Manage leads inside customer details
  - Filter leads by status (New, Contacted, Converted, Lost)
  - Add, edit, and delete leads

- **Reports**
  - Basic charts summarizing lead values by status

- **UI/UX**
  - Sidebar navigation with responsive design
  - Navbar with profile and logout
  - Consistent design using **ShadCN UI** and **Tailwind CSS**
  - Teal + Purple theme with subtle accent colors

---

## Tech Stack

- **Frontend Framework**: React (Vite)
- **Styling**: Tailwind CSS + ShadCN UI + MagicUI
- **Routing**: React Router DOM
- **State Management**: Context API
- **Charts**: Recharts
- **HTTP Client**: Axios

---

## Project Structure

```bash
src/
├── assets/           # Images, logos
├── components/       # Shared UI components (Navbar, Sidebar, Cards, etc.)
├── pages/            # Page-level components
│   ├── Auth/         # Login, Register
│   ├── Dashboard/    # Dashboard
│   ├── Customers/    # Customers list, detail, form
│   ├── Leads/        # Leads list and forms
│   ├── Reports/      # Reports and charts
├── context/          # Auth and global context
├── services/         # API layer (axios setup, API functions)
├── lib/              # ShadCN helpers and utilities
├── styles/           # Global styles
├── App.jsx           # Route setup
├── main.jsx          # App entry point
```
---

## Theme

- **Primary**: Teal-500 (`#14b8a6`) – buttons, highlights
- **Secondary**: Violet-600 (`#7c3aed`) – sidebar background
- **Accent**: Orange-500 (`#f97316`) – alerts, warnings
- **Background**: Gray-50 (`#f1f5f9`)
- **Text**: Slate-900 (`#0f172a`) headings, Slate-600 (`#64748b`) muted text

---
