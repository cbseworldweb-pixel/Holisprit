# Holisprit User Frontend

A comprehensive React-based frontend for the Holisprit OTT platform with complete user functionality testing.

## 🎯 Features

✅ **Authentication**
- Email/Password registration & login
- OTP-based mobile authentication
- Demo quick login for testing
- Secure token management

✅ **Movie Management**
- Browse movies with pagination
- Filter by categories
- Detailed movie information
- Search and filtering capabilities

✅ **Payment Integration**
- Razorpay payment gateway integration
- Secure payment verification
- Order tracking

✅ **User Experience**
- Watch rented movies with video streaming
- My Movies section with all rentals
- Transaction history
- User profile management
- Real-time purchase status

## 📋 Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Razorpay** - Payment gateway

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd User-Frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

### Configuration

Update `.env` with your credentials:

```env
VITE_API_BASE_URL=https://dummy-nj2d.onrender.com/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running the Application

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### Building for Production

```bash
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Header.jsx       # Navigation header
│   ├── MovieCard.jsx    # Movie card component
│   ├── ProtectedRoute.jsx # Route protection
│   └── PaymentModal.jsx # Payment modal
├── pages/               # Page components
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── Home.jsx         # Movie listing
│   ├── MovieDetail.jsx  # Movie details with Razorpay
│   ├── WatchMovie.jsx   # Video player
│   ├── MyMovies.jsx     # User's rentals
│   └── Profile.jsx      # User profile
├── services/            # API services
│   └── api.js          # Axios instance & API calls
├── context/             # React context
│   └── AuthContext.jsx  # Authentication state
├── hooks/               # Custom hooks
│   └── useAuth.js      # Auth hook
├── utils/               # Utility functions
│   └── loadScript.js   # Script loader
├── App.jsx              # Main app component
├── App.css              # Global styles
└── main.jsx             # Entry point
```

## 🔄 Complete User Testing Flow

### 1. **Authentication Testing**

```
Login Flow:
1. Navigate to /login or /register
2. Create account OR use demo login
3. Token auto-saved to localStorage
4. Redirected to movie listing

Optional - Test OTP:
- Send OTP with mobile number
- Verify OTP (5-minute validity)
```

### 2. **Browse & Filter Movies**

```
1. View movies in grid (20 per page)
2. Filter by categories
3. Paginate through results
4. Click movie for details
```

### 3. **Movie Purchase Flow**

```
1. Click "Rent Now" on movie detail
2. Razorpay payment modal opens
3. Complete payment (uses test keys)
4. Payment verified on backend
5. Movie appears in "My Movies"
```

### 4. **Watch Movie**

```
1. Go to "My Movies" tab
2. Click purchased movie
3. Video player loads with streaming URL
4. Watch with video controls
5. Check expiry date in transaction history
```

### 5. **Track Purchases**

```
1. Open "My Movies" → "Transaction History"
2. View all past rentals
3. Check payment status
4. Track expiry dates
```

### 6. **Profile Management**

```
1. Click profile dropdown (top right)
2. Edit personal information
3. Update email, username, bio
4. Add profile avatar
5. Changes saved to backend
```

## 💳 Payment Gateway Setup

### For Testing:

1. **Razorpay Test Keys:**
   - Navigate to Razorpay Dashboard
   - Get test API keys
   - Update `.env` with test Key ID

2. **Test Payments:**
   - Amount is automatically calculated
   - Uses Razorpay test environment
   - Full signature verification

3. **Test Cards:**
   - Razorpay provides test credit card numbers
   - Check Razorpay docs for test credentials

## 🔐 Security Features

✅ Secure token storage
✅ Protected routes with authentication
✅ HTTP-only cookie support
✅ CORS handling
✅ Payment signature verification
✅ Automatic token refresh on 401
✅ XSS prevention with React

## 📊 API Integration

All endpoints integrated from backend:

| Feature | Endpoints |
|---------|-----------|
| Auth | /auth/register, /auth/login, /auth/otp/send, /auth/otp/verify |
| Movies | /movies, /movies/:id, /user/watch/:id |
| Payment | /movies/:id/rent, /payment/verify |
| User | /user/profile, /user/my-movies, /user/transactions |
| Categories | /categories, /tags |

**Reference:** See `USER_API_DOCUMENTATION.md` for full API details

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Try demo login
- [ ] Browse all movies
- [ ] Filter by category
- [ ] Paginate results
- [ ] View movie details
- [ ] Initiate payment
- [ ] Verify payment success
- [ ] Watch purchased movie
- [ ] Check my movies list
- [ ] View transaction history
- [ ] Update profile
- [ ] Logout and re-login

## ⚙️ Environment Variables

```env
VITE_API_BASE_URL          # Backend API URL
VITE_RAZORPAY_KEY_ID       # Razorpay public key
```

## 🐛 Troubleshooting

### Payment Not Loading
- Check Razorpay script loads (F12 Console)
- Verify Key ID in .env
- Check CORS settings

### Video Not Playing
- Ensure movie has active status in backend
- Check purchase is "paid" status
- Verify video URL is accessible

### Login Issues
- Clear localStorage: `localStorage.clear()`
- Check token expiry
- Re-login to get new token

### API Errors
- Check network tab (F12)
- Verify base URL in .env
- Check backend is running

## 📝 Notes for Development

1. **Storage:** User data stored in localStorage (for testing only)
2. **Caching:** Movie lists cached for 30 seconds
3. **Rate Limiting:** Backend has rate limits on auth endpoints
4. **Token:** JWT tokens expire based on backend config
5. **Images:** Falls back to placeholder if unavailable

## 🤝 Contributing

For local testing:
1. Create feature branch
2. Test thoroughly
3. Follow code structure
4. Update this README if needed

## 📞 Support

For backend API issues, refer to: `USER_API_DOCUMENTATION.md`

---

**Last Updated:** March 2026
**Version:** 1.0.0
**Status:** Testing Ready ✅
