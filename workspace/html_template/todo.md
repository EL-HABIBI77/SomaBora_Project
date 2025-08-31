# SomaBora MVP Development Plan

## Core Files to Create/Modify:

### Frontend Files:
1. **index.html** - Main dashboard with timer, motivational quotes, and navigation
2. **style.css** - Bright, clean theme with responsive design
3. **script.js** - Core functionality for timer, goals, and data management
4. **auth.html** - Login/signup page
5. **reports.html** - Weekly performance reports with charts
6. **premium.html** - Premium upgrade page with IntaSend integration

### Backend Files:
7. **app.py** - FastAPI backend with REST endpoints
8. **database.sql** - Supabase schema setup

## MVP Features Implementation:
- ✅ Study timer (start/pause/stop)
- ✅ Daily goals setting and tracking
- ✅ Motivational quotes rotation
- ✅ Local storage for offline functionality
- ✅ Basic weekly reports with Chart.js
- ✅ Premium upgrade flow (UI only for MVP)
- ✅ Responsive design with clean theme

## Simplified for MVP:
- Using localStorage for data persistence (Supabase integration noted for future)
- Basic reminder system using browser notifications
- Static motivational quotes array
- Simple chart visualization
- Payment integration UI (backend webhook for future implementation)

## File Relationships:
- index.html → Main app interface
- auth.html → Entry point for new users
- reports.html → Analytics dashboard
- premium.html → Upgrade flow
- style.css → Shared styling across all pages
- script.js → Core app logic and data management