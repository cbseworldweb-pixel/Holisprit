import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieApi } from '../services/api';

export default function WatchMovie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovieAndStream();
  }, [movieId]);

  const loadMovieAndStream = async () => {
    setLoading(true);
    setError('');

    try {
      // Get movie details and stream data in parallel
      const [detailResponse, streamResponse] = await Promise.all([
        movieApi.getMovieDetails(movieId),
        movieApi.streamMovie(movieId),
      ]);

      setMovie(detailResponse.data.data);
      setStreamData(streamResponse.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load movie. Make sure you have purchased it.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-400">Loading movie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-500 rounded p-6 max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const videoUrl =
    streamData?.playlist?.[0]?.url || streamData?.watchLink;

  return (
    <div className="min-h-screen bg-slate-900">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 text-gray-400 hover:text-white z-10"
      >
        ← Back
      </button>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl">
          {/* Video Player */}
          <div className="relative w-full bg-black" style={{ aspectRatio: '16 / 9' }}>
            {videoUrl ? (
              <video
                controls
                autoPlay
                className="w-full h-full"
                controlsList="nodownload"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400">Video not available</p>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {movie?.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-4 text-gray-400">
              <span>⭐ {movie?.rating?.toFixed(1) || 'N/A'}</span>
              <span>🌍 {movie?.language}</span>
              <span>📺 {streamData?.watchType}</span>
            </div>

            <p className="text-gray-300 mb-6 max-w-3xl">
              {movie?.description}
            </p>

            {/* Playlist if multiple parts */}
            {streamData?.playlist && streamData.playlist.length > 1 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Playlist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {streamData.playlist.map((part) => (
                    <div
                      key={part.chunkIndex || part.part}
                      className="bg-slate-700 p-4 rounded hover:bg-slate-600 transition cursor-pointer"
                    >
                      <p className="text-white font-semibold mb-2">
                        Part {part.part}
                      </p>
                      {part.size && (
                        <p className="text-gray-400 text-sm">
                          Size: {(part.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Watch Info */}
            <div className="mt-8 bg-slate-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                About This Rental
              </h3>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Genre</p>
                  <p>{movie?.genres?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Cast</p>
                  <p>{movie?.actors?.slice(0, 2).join(', ') || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
