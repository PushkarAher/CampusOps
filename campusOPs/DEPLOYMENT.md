# CampusOps Cloud Deployment Guide (Vercel + Render)

This guide walks you through deploying **CampusOps** to **Render** (Backend API & Intelligence Service) and **Vercel** (Frontend Client).

---

## Architecture Overview

- **Frontend Client**: Hosted on **Vercel** (Static HTML, CSS, JavaScript).
- **Backend API**: Hosted on **Render** (Node.js Express Server).
- **Intelligence Microservice**: Hosted on **Render** (FastAPI Python Service - Optional/Recommended).
- **Database**: Cloud **Supabase** instance.

---

## Step 1: Deploy Backend API on Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub / GitLab repository.
3. Configure the service:
   - **Name**: `campusops-backend` (or your preferred name)
   - **Root Directory**: `campusOPs/server` (or `server` depending on repo root)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Add the following **Environment Variables**:
   | Variable | Value | Description |
   |---|---|---|
   | `SUPABASE_URL` | `https://crzufetchqgkbhesytms.supabase.co` | Your Supabase project URL |
   | `SUPABASE_KEY` | *(your Supabase anon key)* | Your Supabase API key |
   | `INTELLIGENCE_URL` | `https://your-intelligence-service.onrender.com` | *(Optional, if intelligence service is deployed)* |
5. Click **Create Web Service**.
6. Once deployed, copy your Render Web Service URL (e.g., `https://campusops-backend.onrender.com`).
   - Test by opening `https://campusops-backend.onrender.com/health` in your browser. It should return `{"status":"ok"}`.

> **Note on Render Free Tier**:
> Render free instances spin down after 15 minutes of inactivity. When you make a request after sleep, it takes ~30–50 seconds to boot. The CampusOps login screen has built-in detection and notifies users gracefully if the backend is waking up.

---

## Step 2 (Optional): Deploy Intelligence Service on Render

If you wish to run semantic similarity ticket deduplication and AI priority scoring:

1. Click **New +** -> **Web Service** on Render.
2. Select your repository.
3. Configure:
   - **Name**: `campusops-intelligence`
   - **Root Directory**: `campusOPs/intelligence` (or `intelligence`)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. Once deployed, copy its URL and paste it into the `INTELLIGENCE_URL` environment variable of your `campusops-backend` service.

---

## Step 3: Deploy Frontend on Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. In the project setup:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click "Edit" and choose `campusOPs/client` (or `client`).
4. Click **Deploy**.
5. Once deployment completes, your site will be live at `https://<your-project>.vercel.app`.

### Option B: Point Frontend to your Render Backend

You have two easy ways to connect your Vercel frontend to your Render backend:

#### Method 1: Update `client/js/config.js` (Permanent)
Open `campusOPs/client/js/config.js` and set:
```javascript
const DEFAULT_PRODUCTION_API_URL = 'https://YOUR-BACKEND.onrender.com/api';
```
Commit and push to GitHub. Vercel will automatically redeploy.

#### Method 2: On-the-Fly via Browser UI (Instant Testing)
1. Open your deployed Vercel site in your browser.
2. At the bottom of `login.html`, click **"Set Render API URL"**.
3. Enter your Render backend URL:
   ```
   https://YOUR-BACKEND.onrender.com/api
   ```
4. Done! This saves to `localStorage` in that browser session and immediately connects without any redeployment.

---

## Local Development (Unchanged)

When running locally:
- Frontend on `localhost` or `127.0.0.1` automatically connects to `http://localhost:5000/api`.
- Backend server defaults to port `5000`.
- Python intelligence defaults to port `8000`.
No manual changes are required when testing on your machine!
