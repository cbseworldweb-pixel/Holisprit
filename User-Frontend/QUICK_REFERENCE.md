# Quick Reference Guide

## 🚀 30-Second Setup

```bash
cd User-Frontend
npm install
cp .env.example .env
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Key Files & Their Purpose

### Core Application
| File | Purpose |
|------|---------|
| `src/App.jsx` | Router configuration & main layout |
| `src/main.jsx` | React entry point |
| `src/App.css` | Global styles + Tailwind imports |

### Authentication
| File | Purpose |
|------|---------|
| `src/context/AuthContext.jsx` | Auth state & functions |
| `src/hooks/useAuth.js` | Custom hook to access auth |
| `src/pages/Login.jsx` | Login page |
| `src/pages/Register.jsx` | Registration page |
| `src/components/ProtectedRoute.jsx` | Route guard for auth |

### API & Services
| File | Purpose |
|------|---------|
| `src/services/api.js` | Axios instance + all API calls |
| `src/utils/loadScript.js` | Razorpay script loader |

### Pages
| File | Purpose |
|------|---------|
| `src/pages/Home.jsx` | Movie listing + category filter |
| `src/pages/MovieDetail.jsx` | Movie details + Razorpay payment |
| `src/pages/WatchMovie.jsx` | Video player page |
| `src/pages/MyMovies.jsx` | User rentals + transactions |
| `src/pages/Profile.jsx` | User profile management |

### Components
| File | Purpose |
|------|---------|
| `src/components/Header.jsx` | Navigation & user menu |
| `src/components/MovieCard.jsx` | Reusable movie card |
| `src/components/PaymentModal.jsx` | Payment summary modal |

---

## 🌐 Navigation Structure

```
/
├── /login                 # Public
├── /register              # Public
├── /                       # Protected - Movie listing
├── /movie/:movieId        # Protected - Movie details
├── /watch/:movieId        # Protected - Video player
├── /my-movies             # Protected - User rentals
├── /profile               # Protected - User profile
└── * (catch-all)          # → /
```

---

## 💾 Local Storage Keys

```javascript
localStorage.getItem('authToken')  // JWT token
localStorage.getItem('user')       // User object JSON
```

---

## 🔌 API Endpoints Used

### Authentication
```
POST   /auth/register        # New user
POST   /auth/login          # Email login
GET    /auth/me             # Current user
POST   /auth/demo/user      # Demo login
```

### Movies
```
GET    /movies              # List with pagination
GET    /movies/:movieId     # Details
GET    /user/watch/:movieId # Watch access
```

### Payments
```
POST   /movies/:movieId/rent    # Create order
POST   /payment/verify          # Verify payment
GET    /payment/order/:orderId  # Order status
```

### User
```
GET    /user/profile            # Profile info
PUT    /user/profile            # Update profile
GET    /user/my-movies          # All rentals
GET    /user/transactions       # Purchase history
```

### Browse
```
GET    /categories              # List categories
GET    /tags                    # List tags
```

---

## 🎨 Component Tree

```
App
├── Header
│   └── Profile Dropdown
├── Routes
│   ├── Login (public)
│   ├── Register (public)
│   ├── Home (protected)
│   │   └── MovieCard × 20
│   ├── MovieDetail (protected)
│   │   └── PaymentModal
│   ├── WatchMovie (protected)
│   │   └── Video Player
│   ├── MyMovies (protected)
│   │   ├── MovieCard × N
│   │   └── Transaction Table
│   └── Profile (protected)
│       └── Form / Display
```

---

## 📊 State Management

### AuthContext
```javascript
{
  user: {id, name, email, mobile, role},
  token: "JWT_TOKEN",
  isAuthenticated: boolean,
  loading: boolean,
  error: string,
  register: (name, email, password) => Promise,
  login: (email, password) => Promise,
  logout: () => void,
  demoLogin: () => Promise
}
```

---

## 🎯 Testing Command Reference

```bash
# Start dev
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

---

## ⚙️ Environment Variables

```env
VITE_API_BASE_URL=https://dummy-nj2d.onrender.com/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 💡 Common Tasks

### Add New Page
1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Import in App.jsx

### Add New Component
1. Create `src/components/NewComponent.jsx`
2. Import where needed
3. Use like `<NewComponent />`

### Add API Call
1. Add function in `src/services/api.js`
2. Use in component: `import { movieApi } from '../services/api'`
3. Call in effect: `movieApi.listMovies()`

### Make a Protected Route
1. Wrap with `<ProtectedRoute>`
2. Hook with `useAuth()` in component
3. Check `isAuthenticated`

---

## 🔍 Browser Console Tips

```javascript
// Check auth state
console.log(localStorage.getItem('user'))
console.log(localStorage.getItem('authToken'))

// Clear all data
localStorage.clear()

// Check last API response
// Open Network tab in DevTools (F12)
```

---

## 📱 Responsive Classes

```
sm: < 640px
md: 640px - 1024px
lg: > 1024px
xl: > 1280px
```

---

## 🎯 Testing Checklist - Quick Version

- [ ] Setup
- [ ] Register
- [ ] Login
- [ ] Browse movies
- [ ] Filter category
- [ ] View details
- [ ] Rent movie
- [ ] Watch movie
- [ ] Check My movies
- [ ] View transactions
- [ ] Edit profile
- [ ] Logout

---

## 🚨 Error Messages

| Error | Solution |
|-------|----------|
| Token invalid | Re-login |
| Movie not found | Try different movie |
| Payment failed | Check Razorpay keys |
| Video won't play | Check purchase status |
| Profile update fails | Check email isn't taken |

---

## 📞 Quick Debugging

### If page doesn't load:
```javascript
// 1. Check console (F12)
// 2. Check Network tab
// 3. Verify .env is correct
// 4. Restart: npm run dev
```

### If API fails:
```javascript
// Check Network tab (F12) → Response
// Look for error message from backend
// Verify token in headers
```

### If payment doesn't work:
```javascript
// Check Razorpay Key ID in .env
// Verify script loads: window.Razorpay
// Check network requests
```

---

## 🎓 Important Code Patterns

### Using Auth
```javascript
const { user, token, isAuthenticated } = useAuth();
```

### Making API Call
```javascript
const { data } = await movieApi.listMovies(1, 20);
```

### Protected Component
```javascript
<ProtectedRoute>
  <MyComponent />
</ProtectedRoute>
```

### Loading State
```javascript
{loading ? <p>Loading...</p> : <div>{content}</div>}
```

---

## 📈 File Size Targets

- Bundle: ~150-200 KB (gzipped)
- CSS: ~30-40 KB (Tailwind)
- JS: ~100-150 KB (code + deps)

---

## 🔐 Security Checklist

- ✅ Tokens in localStorage (could use secure cookie)
- ✅ Protected routes work
- ✅ 401 redirects to login
- ✅ No sensitive data logged
- ✅ CORS handled

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| README.md | Setup & features |
| TESTING_GUIDE.md | Step-by-step tests |
| FRONTEND_SETUP_SUMMARY.md | Overall summary |
| USER_API_DOCUMENTATION.md | API reference (root) |
| QUICK_REFERENCE.md | This file |

---

## 🎬 Sample Test Flow (2 minutes)

```
1. npm run dev (runs on :3000)
   ↓
2. Click "Demo Login"
   ↓
3. Browse movies (you're logged in!)
   ↓
4. Click any movie
   ↓
5. Click "Rent Now"
   ↓
6. Complete test payment
   ↓
7. Click "Watch Now"
   ↓
8. Video plays! ✅
```

---

**Last Updated:** March 2026  
**Difficulty:** Easy  
**Time to Setup:** 2 minutes  
**Time to First Test:** 5 minutes  

---
