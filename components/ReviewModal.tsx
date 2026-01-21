
import React, { useState } from 'react';
import { Review } from '../types';

interface ReviewModalProps {
  onSubmit: (review: Partial<Review>) => void;
  onCancel: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Chef's Kiss!</h2>
          <p className="text-slate-500">How did your culinary creation turn out?</p>
          
          <div className="flex justify-center gap-2 my-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea 
            placeholder="Write a short review... (optional)"
            className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none mb-8"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
            >
              Skip
            </button>
            <button 
              onClick={() => onSubmit({ rating, comment })}
              className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition-all"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
