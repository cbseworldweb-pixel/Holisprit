import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieApi, paymentApi } from '../services/api';
import { loadScript } from '../utils/loadScript';
import PaymentModal from '../components/PaymentModal';

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  const loadMovie = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await movieApi.getMovieDetails(movieId);
      setMovie(response.data.data);
    } catch (err) {
      setError('Failed to load movie details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = async () => {
    setProcessingPayment(true);
    setError('');

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!isScriptLoaded) {
        setError('Failed to load payment gateway');
        setProcessingPayment(false);
        return;
      }

      // Create order
      const orderResponse = await paymentApi.createOrder(movieId);
      const {
        orderId,
        amount,
        keyId,
        movie: movieData,
      } = orderResponse.data.data;

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        order_id: orderId,
        name: 'Holisprit OTT',
        description: `Rent: ${movieData.title}`,
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              setMovie((prev) => ({
                ...prev,
                purchaseStatus: {
                  purchased: true,
                  purchaseDate: verifyResponse.data.data.purchaseDate,
                  expiryDate: verifyResponse.data.data.expiryDate,
                  status: 'paid',
                },
              }));

              alert('Payment successful! You can now watch the movie.');
              setShowPayment(false);
            }
          } catch (err) {
            setError('Payment verification failed');
            console.error(err);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      console.error(err);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-400">Loading movie details...</p>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  const imageUrl =
    movie.posterUrl ||
    movie.coverImageUrl ||
    'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="min-h-screen bg-slate-900">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 text-gray-400 hover:text-white z-10"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <img
              src={imageUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>

          {/* Movie Details */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
              <div>
                <span className="text-yellow-400 font-bold">
                  ★ {movie.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <div>Language: {movie.language}</div>
              <div>Released: {new Date(movie.createdAt).getFullYear()}</div>
              <div className="text-green-400">
                Views: {movie.totalViews?.toLocaleString()}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Synopsis</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {movie.description}
              </p>
            </div>

            {movie.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-slate-700 text-gray-300 px-4 py-2 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.actors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                <p className="text-gray-300">{movie.actors.join(', ')}</p>
              </div>
            )}

            {movie.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded p-4 mb-6 text-red-400">
                {error}
              </div>
            )}

            {/* Rental Info & CTA */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Rental Price</p>
                  <p className="text-4xl font-bold text-green-400 mb-2">
                    ₹{movie.price}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Valid for {movie.validityDays} days
                  </p>
                </div>
              </div>

              {movie.purchaseStatus?.purchased ? (
                <div className="space-y-4">
                  <div className="bg-green-900/30 border border-green-500 rounded p-4 text-green-400">
                    <p className="font-semibold mb-2">✓ Already Rented</p>
                    <p className="text-sm">
                      Expires: {new Date(movie.purchaseStatus.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/watch/${movieId}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
                  >
                    Watch Now
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRentClick}
                  disabled={processingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded transition"
                >
                  {processingPayment ? 'Processing...' : 'Rent Now'}
                </button>
              )}
            </div>

            <div className="text-gray-400 text-sm space-y-1">
              <p>📊 {movie.totalPurchases} rentals</p>
              <p>💰 Revenue: ₹{movie.totalRevenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          movie={movie}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            loadMovie();
          }}
        />
      )}
    </div>
  );
}
