import React from 'react';

export default function MovieCard({ movie }) {
  const imageUrl =
    movie.posterUrl || movie.coverImageUrl || 'https://via.placeholder.com/300x400?text=No+Image';

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105">
      <div className="relative h-60 overflow-hidden bg-slate-700">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition flex items-center justify-center">
          <span className="text-white opacity-0 hover:opacity-100 text-2xl">▶</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 truncate">
          {movie.title}
        </h3>

        <div className="flex justify-between items-center mb-3">
          <span className="text-yellow-400 font-medium">
            ★ {movie.rating?.toFixed(1) || 'N/A'}
          </span>
          <span className="text-gray-400 text-sm">{movie.language}</span>
        </div>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {movie.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-green-400 font-bold text-lg">
            ₹{movie.price}
          </span>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
            {movie.validityDays} days
          </span>
        </div>

        {movie.purchaseStatus?.purchased && (
          <div className="mt-2 text-xs text-green-400 bg-green-900/30 p-2 rounded text-center">
            ✓ Already Purchased
          </div>
        )}
      </div>
    </div>
  );
}
