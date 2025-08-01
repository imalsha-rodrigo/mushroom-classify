# Railway-Only Deployment Guide

## 🚂 Deploy Everything on Railway (No Vercel Needed!)

This guide shows you how to host both your frontend and backend on Railway.

## ✅ What You Get:
- **Single URL** for your entire app
- **No CORS issues** (frontend and backend on same domain)
- **Simpler deployment** (one service instead of two)
- **Cost effective** (only one hosting service)

## 🚀 Quick Deployment Steps:

### Step 1: Push Your Code
```bash
git add .
git commit -m "Configure for Railway-only deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Railway will automatically detect the configuration**
6. **Click "Deploy"**

### Step 3: Get Your URL
- Railway will provide a URL like: `https://your-app-name.railway.app`
- This URL serves both frontend and backend!

## 🔧 How It Works:

### Backend (Flask API):
- Serves `/predict` endpoint for mushroom classification
- Serves `/health` endpoint for health checks
- Handles all API requests

### Frontend (React App):
- Built during deployment process
- Served as static files by Flask
- All routes handled by Flask

### File Structure:
```
your-app/
├── backend/
│   ├── app.py (Flask server + static file serving)
│   ├── requirements.txt
│   └── dist/ (built frontend files)
├── src/ (React source code)
├── nixpacks.toml (build configuration)
└── railway.toml (deployment configuration)
```

## 🧪 Testing:

### Test Backend:
```
https://your-app-name.railway.app/health
```

### Test Frontend:
```
https://your-app-name.railway.app/
```

### Test Full App:
1. Visit your Railway URL
2. Upload a mushroom image
3. See the classification results

## 💰 Cost:
- **Railway Free Tier**: $5 credit/month
- **Total Cost**: $0 for small to medium usage
- **No Vercel needed**: Save money and complexity

## 🔍 Troubleshooting:

### Build Issues:
- Check Railway logs for build errors
- Ensure all dependencies are in `requirements.txt` and `package.json`

### Runtime Issues:
- Check Railway logs for runtime errors
- Verify the `/health` endpoint works

### Frontend Not Loading:
- Check if `dist` folder is being copied correctly
- Verify Flask routes are serving static files

## 🎉 Benefits of Railway-Only:

1. **Simpler**: One deployment instead of two
2. **Cheaper**: Only one hosting service
3. **No CORS**: Frontend and backend on same domain
4. **Easier**: Single URL to manage
5. **Faster**: No cross-domain requests

## 📝 Environment Variables:
No environment variables needed! The frontend automatically uses relative URLs.

Your app is now ready for Railway-only deployment! 🚀 