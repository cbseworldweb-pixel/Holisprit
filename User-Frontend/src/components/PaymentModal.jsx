import React from 'react';

export default function PaymentModal({ movie, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Rental Summary</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">{movie.title}</span>
            <span className="text-white font-semibold">₹{movie.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Validity</span>
            <span className="text-white">{movie.validityDays} days</span>
          </div>

          <div className="border-t border-slate-600 pt-4">
            <div className="flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-green-400 font-bold text-lg">
                ₹{movie.price}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded transition"
          >
            Cancel
          </button>
          <button
            onClick={onSuccess}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
