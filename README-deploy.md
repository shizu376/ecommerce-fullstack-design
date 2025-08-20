Deployment quickstart

Backend (Render):
- Root: server/
- Environment variables: set MONGODB_URI, ADMIN_API_KEY, JWT_SECRET, DEMO_USER_EMAIL, DEMO_USER_PASSWORD

Frontend (Render Static):
- Root: project root
- Build command: npm install && npm run build
- Publish directory: dist

Local dev:
- Start API: cd server && npm install && npm run dev
- Start web: npm install && npm run dev (proxy to :5000 already set in vite.config.js)

