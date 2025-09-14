# Project Structure Documentation

## Root Directory
```
.
├── API_DOCUMENTATION.md              # API endpoint documentation and usage guide
├── PROJECT_STRUCTURE.md              # Project Structure
├── components.json                   # shadcn/ui component configuration
├── eslint.config.js                  # Code linting rules and standards
├── index.html                        # Entry point for Vite development server
├── jsconfig.json                     # JavaScript project configuration for IDE support
├── package.json                      # Frontend dependencies and scripts
├── package-lock.json
├── postcss.config.cjs               # PostCSS configuration for Tailwind processing
├── public
│   └── vite.svg
├── README.md
├── tailwind.config.js               # Tailwind CSS configuration and theme customization
└── vite.config.js                   # Vite bundler configuration and build settings
```

## Server Directory
```
Server/
├── index.js                         # Express server entry point and middleware setup
├── package.json                     # Backend dependencies and server scripts
├── package-lock.json
├── README.md
└── src/
    ├── config/
    │   └── db.js                    # Database connection configuration
    ├── controllers/                 # Business logic handlers for routes
    │   ├── authController.js        # User authentication and authorization logic
    │   ├── customerController.js    # Customer CRUD operations
    │   ├── dashboardController.js   # Dashboard data aggregation
    │   ├── leadController.js        # Lead management operations
    │   └── reportController.js      # Report generation logic
    ├── middleware/
    │   ├── auth.js                  # JWT token validation middleware
    │   └── leadAuthorization.js     # Lead access permission checks
    ├── models/                      # Database schema definitions
    │   ├── customer.js              # Customer data model and validation
    │   ├── lead.js                  # Lead data model and validation
    │   └── user.js                  # User authentication model
    └── routes/                      # API endpoint definitions
        ├── auth.js                  # Authentication routes (/login, /register)
        ├── customer.js              # Customer management endpoints
        ├── dashboard.js             # Dashboard data endpoints
        ├── leads.js                 # Lead management endpoints
        └── report.js                # Report generation endpoints
```

## Frontend Source Directory
```
src/
├── App.css
├── App.jsx                          # Main application component and routing setup
├── assets/
│   └── react.svg
├── components/
│   ├── Layout.jsx                   # Common page layout wrapper
│   ├── Navbar.jsx                 
│   ├── PrivateRoute.jsx             # Route protection for authenticated users
│   └── ui/                          # Reusable UI components (shadcn/ui)
│       ├── avatar.jsx
│       ├── badge.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       ├── dropdown-menu.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── LeadCard.jsx            
│       ├── LoadingSpinner.jsx      
│       ├── Pagination.jsx         
│       ├── select.jsx
│       ├── sidebar.jsx
│       ├── sonner.jsx
│       ├── table.jsx
│       └── textarea.jsx
├── config/
│   └── theme.js                     # Application theme configuration
├── contexts/
│   └── ApiContext.jsx               # Global API state management context
├── index.css                        # Global styles and Tailwind imports
├── lib/
│   └── utils.js                     # Utility functions and class name helpers
├── main.jsx                         # React application entry point
├── pages/                           # Page components organized by feature
│   ├── Auth/
│   │   ├── Login.jsx                # User login form
│   │   └── Register.jsx             # User registration form
│   ├── Customers/
│   │   ├── CustomerDetail.jsx       # Individual customer view
│   │   ├── CustomerForm.jsx         # Customer creation/editing form
│   │   └── CustomersList.jsx        # Customer listing with search/filter
│   ├── Dashboard/
│   │   └── Dashboard.jsx            # Main dashboard with analytics
│   ├── Leads/
│   │   ├── LeadDetail.jsx          # Individual lead view
│   │   ├── LeadForm.jsx            # Lead creation/editing form
│   │   └── LeadsList.jsx           # Lead listing with management features
│   ├── NotFound.jsx                # 404 error page
│   └── Reports/
│       └── Reports.jsx             # Report generation and viewing
├── services/
│   └── api.js                      # API client configuration and endpoints
└── store/                          # Redux store configuration
    ├── features/                   # Feature-based state slices
    │   ├── customer/
    │   │   └── customerSlice.js    # Customer state management
    │   ├── dashboard/
    │   │   └── dashboardSlice.js   # Dashboard data state
    │   ├── leads/
    │   │   └── leadSlice.js        # Lead management state
    │   └── report/
    │       └── reportSlice.js      # Report data state
    └── index.js                    # Redux store configuration and setup
```

## Architecture Overview

This project follows a **full-stack React + Node.js architecture** with:

- **Frontend**: React 18 with Vite, Tailwind CSS, and shadcn/ui components
- **State Management**: Redux Toolkit for global state
- **Backend**: Node.js with Express.js REST API
- **Database**: Configured through db.js (MongoDB)
- **Authentication**: JWT-based auth with protected routes
- **Styling**: Tailwind CSS with custom theme configuration

## Key Design Patterns

- **Feature-based organization** for scalable code structure
- **Component composition** with reusable UI elements
- **Separation of concerns** between controllers, models, and routes
- **Context API** for global application state
- **Middleware pattern** for authentication and authorization
