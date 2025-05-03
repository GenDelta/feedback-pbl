# Feedback System

A comprehensive feedback management system built with Next.js for educational institutions to collect, manage, and analyze feedback from students, faculty, and guests.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## Overview

This feedback system allows educational institutions to efficiently collect and analyze feedback from students about faculty, curriculum, and guest lectures. It features role-based access control, analytics dashboards, and export capabilities.

## Features

- **Role-based access** for students, faculty, coordinators, and administrators
- **Faculty feedback** collection and analysis
- **Curriculum feedback** from both students and faculty
- **Guest lecture feedback** collection
- **Analytics dashboards** with visual representations
- **Export functionality** for feedback data to CSV
- **Mobile-responsive** design

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js
- **Visualizations**: Recharts
- **Styling**: TailwindCSS
- **Animations**: GSAP

## Project Structure

```
src/
├── app/                     # Next.js App Router files
│   ├── admin/               # Admin dashboard and features
│   ├── api/                 # API routes and authentication
│   ├── components/          # Shared components
│   ├── coordinator/         # Coordinator dashboard and features
│   │   ├── actions/         # Server actions for coordinators
│   │   └── components/      # Coordinator-specific components
│   ├── faculty/             # Faculty dashboard and features
│   │   ├── actions/         # Server actions for faculty
│   │   └── components/      # Faculty-specific components
│   ├── guest/               # Guest feedback pages
│   ├── student/             # Student dashboard and features
│   │   ├── actions/         # Server actions for students
│   │   ├── curriculum-feedback/  # Curriculum feedback pages
│   │   ├── faculty-feedback/     # Faculty feedback pages
│   │   └── guest-feedback/       # Guest feedback pages
│   └── team/                # Team information page
├── prisma/                  # Prisma schema and migrations
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/feedback-pbl.git
   cd feedback-pbl
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
# Database
DATABASE_URL="file:./dev.db"

# Google Auth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-secret-key"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL=http://localhost:3000/
```

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## User Roles

### 1. Student

- Submit feedback for faculty and subjects
- Submit curriculum feedback
- Submit guest lecture feedback
- View submission status

### 2. Faculty

- View feedback analytics for their courses
- Access additional text feedback
- Submit curriculum feedback
- View overall performance metrics

### 3. Coordinator

- Download reports for faculty feedback
- Download reports for curriculum feedback
- Manage students and faculty
- View branch-specific analytics
- Export data as CSV files

### 4. Administrator

- Manage all users
- Upload subject and specialization data
- Configure system settings
- Access all feedback data

### 5. Guest

- Submit curriculum feedback

## Database Schema

The main entities in the database include:

- **User**: Base user information
- **Student**: Student-specific data
- **Faculty**: Faculty-specific data
- **Subject**: Course information
- **Faculty_Subject**: Many-to-many relationship between faculty and subjects
- **Feedback**: Individual feedback entries
- **Feedback_Name**: Types of feedback (Faculty, Curriculum, Guest)
- **Questions**: Questions for different feedback types
- **Remarks**: Additional text feedback

## API Routes

The application uses Next.js API routes for authentication and server actions for data operations:

- `/api/auth/[...nextauth]`: Authentication endpoints
- `/api/auth/logout`: Logout endpoint

### Middleware

The application uses Next.js middleware for:

- Route protection based on user roles
- Authentication verification
- Redirecting unauthenticated users
- Access control for different sections of the application

Server actions are organized by role:

- Student actions: Submitting feedback, checking submission status
- Faculty actions: Getting analytics, submitting curriculum feedback
- Coordinator actions: Generating reports, managing users
- Admin actions: System configuration

## Deployment

The application can be deployed using Vercel or any other Next.js compatible hosting:

```bash
npm run build
# or
yarn build
```

For production deployment, use:

```bash
npm run start
# or
yarn start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The ideation for this project was done by Dr. Deepali Vora, Head CS IT, Symbiosis Institute of Technology, Pune.
- This project was built under the mentorship of Dr.Sonali Kothari, Department of Computer Science and Engineering, Pune.
- This project was developed by Ankush Dutta, Mitiksha Paliwal, and Tanvee Patil from the Department of Computer Science and Engineering at Symbiosis Institute of Technology, Pune.
