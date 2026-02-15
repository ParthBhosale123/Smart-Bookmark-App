# Smart Bookmark App

A simple and responsive bookmark manager built using **Next.js (App Router)** and **Supabase**.  
Users can sign in with Google, add bookmarks, view them in a clean dashboard, edit/delete bookmarks, and see real-time updates across tabs.

---

## 🚀 Live Demo
🔗 https://smart-bookmark-app-ivory-nine.vercel.app/

---

## 📂 GitHub Repository
🔗 https://github.com/ParthBhosale123/Smart-Bookmark-App

---

## 🛠 Tech Stack
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Realtime subscriptions

---

## ✨ Features
✅ Google Login (OAuth)  
✅ Add Bookmark (Title + URL)  
✅ View Bookmarks in responsive grid layout  
✅ Edit Bookmark  
✅ Delete Bookmark with confirmation modal  
✅ Pagination (backend-driven using Supabase range)  
✅ Bookmarks are private per user (RLS enabled)  
✅ Real-time updates (changes reflect automatically in multiple tabs)  
✅ Fully deployed on Vercel  

---

## 🔐 Security
This project uses **Supabase Row Level Security (RLS)** to ensure:
- Users can only view their own bookmarks
- Users can only insert/update/delete their own bookmarks

---

## ⚡ Real-Time Updates
The bookmark list updates automatically without refresh using **Supabase realtime channels**.  
If a bookmark is added/edited/deleted in one tab, it instantly updates in another tab.

---

## 📌 Problems Faced & How I Solved Them

### 1. Google OAuth Redirect Issue
**Problem:**  
Google login worked locally but failed after deployment on Vercel due to incorrect redirect URL.

**Solution:**  
Configured Supabase Auth settings:
- Added Vercel production URL in **Site URL**
- Added both localhost and production URL in **Redirect URLs**

---

### 2. Bookmarks Visibility (Privacy Issue)
**Problem:**  
Initially, bookmarks could be accessed by anyone if they queried the table.

**Solution:**  
Enabled **Row Level Security (RLS)** and created policies to allow only:
- `select` bookmarks where `user_id = auth.uid()`
- `insert/update/delete` only for the logged-in user

This ensured bookmarks remain private for each user.

---

### 3. Pagination Best Practices
**Problem:**  
Loading all bookmarks at once is not scalable and slows down UI for large data.

**Solution:**  
Implemented backend-driven pagination using Supabase:
- Used `.range(from, to)`
- Used `.select("*", { count: "exact" })` for total count
- Calculated total pages using `count`

This follows professional backend pagination practices.

---

### 4. Real-Time Sync Across Tabs
**Problem:**  
Requirement was to update bookmarks instantly without refresh when multiple tabs are open.

**Solution:**  
Implemented Supabase realtime listener using `postgres_changes`:
- Subscribed to insert/update/delete events
- Filtered by `user_id` so each user receives only their own updates
- Refetched the bookmarks automatically on every change

---

### 5. Delete Confirmation UI Issue
**Problem:**  
Using `window.confirm()` looked unprofessional and was not consistent with the UI.

**Solution:**  
Created a custom reusable `DeleteConfirmModal` component with Tailwind CSS, making the delete process more user-friendly and modern.

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/ParthBhosale123/Smart-Bookmark-App.git
cd Smart-Bookmark-App
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Setup Environment Variables
Create a .env.local file in the root folder:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
### 4️⃣ Run Project
```bash
npm run dev
```
