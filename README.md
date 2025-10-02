# Colloq - Event Management System

## Overview

Colloq is a modern event management web application built with **Next.js (App Router)** and **MongoDB**, featuring secure authentication via **NextAuth**. It enables users to browse, create, and register for events through a responsive and performant interface.



## Features

- **Authentication:** NextAuth with credentials provider  
- **Event Browsing:** Filter by type, format, date, ticket type, tags  
- **Event Details:** Venue, platform, tickets, schedules, notes  
- **Event Registration:** User-specific registrations  
- **Dashboard:** Personalized list of registered events  
- **Responsive UI:** Tailwind CSS with adaptive layouts and mobile sidebar  
- **Design System:** Gradient themes, glassmorphism, cohesive styling  



## Tech Stack

- **Framework:** Next.js 13+ (App Router)  
- **Auth:** NextAuth.js  
- **Database:** MongoDB (native driver)  
- **Styling:** Tailwind CSS  
- **Language:** TypeScript  



## Project Structure

- `src/app/` — application routes (dashboard, events, create-event, login, signup)  
- `src/app/api/` — API endpoints (auth, signup, events, registers)  
- `src/lib/mongodb.ts` — MongoDB connection logic  



## Setup

### Prerequisites
- Node.js 18+  
- MongoDB connection URI  
- NextAuth secret key  

### Installation
```bash
git clone https://github.com/your-repo/colloq.git
cd colloq
npm install
```

### Environment
Create `.env.local` with:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Run Dev
```bash
npm run dev
```
App runs at `http://localhost:3000`.



## Code Highlights

- Secure session-based auth with JWT strategy  
- MongoDB ObjectId ⇔ string conversion handling  
- Clear separation of server components (data fetching) and client components (UI)  
- Utility-first design with Tailwind  
- Form validation & error handling  



## Roadmap

- User profiles & editing  
- OAuth (Google, GitHub)  
- Event calendar & reminders  
- Advanced search & multi-select filters  
- Infinite scrolling & pagination  



## License

MIT License
