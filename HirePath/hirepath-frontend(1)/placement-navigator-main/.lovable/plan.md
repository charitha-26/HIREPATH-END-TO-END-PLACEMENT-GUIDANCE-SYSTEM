

# 🎓 PlaceHub — College Placement Platform (Frontend Prototype)

A dark-themed, professional UI prototype showcasing all placement-related modules with static/mock data.

---

## Layout & Navigation
- **Dark theme** throughout with a sleek sidebar navigation
- Sidebar with icons for each module section, collapsible to mini mode
- Top header bar with role switcher (Student / Admin toggle) to preview both views
- Responsive design for desktop-first usage

---

## 1. Authentication Pages
- **Login page** with Student / Admin tab selector, email & password fields
- **Student registration page** with fields: Name, Email, College ID, Branch, Batch, CGPA
- Dark-themed, centered card layout with branding

## 2. Student Dashboard
- **Overview cards**: Upcoming drives count, applications submitted, offers received
- **Upcoming interviews** list with dates
- **Applied drives** with status badges (Applied / Shortlisted / Selected / Rejected)
- Quick links to key sections

## 3. Placement Drive Calendar
- **Calendar view** (month view) showing drive dates with color-coded markers
- **List view toggle** showing all drives chronologically
- Each drive shows: Company name, date, role, deadline, eligibility status badge (Eligible ✅ / Not Eligible ❌)
- Deadline indicators (e.g., "2 days left" warning badges)

## 4. Company Profiles
- **Company listing page** with search and filters (branch, CGPA, batch)
- **Company detail page** showing:
  - Company info, logo placeholder, roles offered
  - Eligibility criteria (CGPA, branch, batch)
  - Interview rounds breakdown (Aptitude → Coding → Technical → HR)
  - Past interview experiences (linked to experience repository)
  - Alumni from this company

## 5. Drive Application Flow
- Drive detail page with "Apply" button
- Eligibility auto-check based on mock student profile (CGPA, branch, batch)
- Shows "Eligible" or "Not Eligible" status with reason

## 6. Interview Experience Repository
- **Browse experiences** page with search, company filter, and year filter
- **Experience detail** cards showing: Company, role, rounds, questions, difficulty, tips
- **Submit experience form** for students with fields for company, role, rounds, questions asked, and tips
- "Pending Approval" badge for submitted experiences

## 7. Alumni Directory
- Company-wise alumni listing
- Each entry shows: Name, graduation year, role, company
- Filter by company or year

## 8. Notifications / Reminders Panel
- In-app notification bell icon in header
- Dropdown showing mock alerts: new drives, deadline reminders (2 days, today), application updates
- Color-coded by urgency

## 9. Admin Dashboard
- **Stats overview**: Total drives, total students, applications received, placed students count
- **Bar/pie charts** using Recharts for placement statistics
- Quick action buttons: Add Company, Add Drive

## 10. Admin — Manage Companies & Drives
- **Companies table** with Add/Edit/Delete actions (modal forms)
- **Drives table** with schedule, linked company, eligibility rules, status
- Form modals for adding/editing with relevant fields

## 11. Admin — Student Tracking
- **Student applications table**: Student name, drive, status (Applied/Shortlisted/Selected/Rejected)
- Filter by company, status, branch
- Bulk status update UI (dropdown to change status)

## 12. Admin — Approve Experiences
- List of submitted interview experiences pending approval
- Approve / Reject buttons with preview

## 13. Resume Upload (Student Profile)
- Student profile page with personal info display
- Resume upload area (drag & drop UI, file preview)
- Mock uploaded file display

---

## Design Details
- **Color palette**: Dark backgrounds with blue/purple accent colors for actions and highlights
- **Typography**: Clean, modern sans-serif
- **Cards & tables**: Subtle borders, glass-morphism effects
- **Animations**: Fade-in on page transitions, hover effects on cards
- **Status badges**: Color-coded (green for success, yellow for pending, red for rejected)
- All data is static/mock — no backend integration

