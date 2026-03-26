import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function MyMovies() {
  const [movies, setMovies] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'movies') {
      loadMyMovies();
    } else {
      loadTransactions();
    }
  }, [activeTab]);

  const loadMyMovies = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await userApi.getMyMovies();
      setMovies(response.data.data);
    } catch (err) {
      setError('Failed to load your movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await userApi.getTransactions(1, 50);
      setTransactions(response.data.data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-8"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'movies'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Movies
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'transactions'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Transaction History
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : activeTab === 'movies' ? (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-lg">
                <p className="text-gray-400 mb-4">You haven't rented any movies yet</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <div
                    key={movie.movieId}
                    onClick={() => navigate(`/watch/${movie.movieId}`)}
                    className="cursor-pointer"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-lg">
                <p className="text-gray-400">No transactions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-4 text-gray-400 font-semibold">
                        Movie
                      </th>
                      <th className="px-4 py-4 text-gray-400 font-semibold">
                        Amount
                      </th>
                      <th className="px-4 py-4 text-gray-400 font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-4 text-gray-400 font-semibold">
                        Purchased
                      </th>
                      <th className="px-4 py-4 text-gray-400 font-semibold">
                        Expires
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-slate-700 hover:bg-slate-800 transition"
                      >
                        <td className="px-4 py-4 text-white">
                          {transaction.movieTitle}
                        </td>
                        <td className="px-4 py-4 text-green-400 font-semibold">
                          ₹{transaction.amount}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              transaction.paymentStatus === 'paid'
                                ? 'bg-green-500/30 text-green-400'
                                : 'bg-yellow-500/30 text-yellow-400'
                            }`}
                          >
                            {transaction.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {new Date(transaction.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {new Date(transaction.expiryDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
