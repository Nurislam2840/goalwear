// src/components/ProductReviews.tsx
"use client";

import { useState } from "react";
import { Star, ThumbsUp, User, X, CheckCircle2 } from "lucide-react";
import { Review } from "@/data/products";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

interface ProductReviewsProps {
  productId: number;
  reviews: Review[];
  rating: number;
  reviews_count: number;
}

export default function ProductReviews({
  productId,
  reviews = [],
  rating,
  reviews_count,
}: ProductReviewsProps) {
  const { addProductReview } = useSiteData();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);
  const safeReviewsCount = Math.max(reviews_count, 1);

  const distribution = [
    { stars: 5, count: reviews.filter((r) => r.rating === 5).length },
    { stars: 4, count: reviews.filter((r) => r.rating === 4).length },
    { stars: 3, count: reviews.filter((r) => r.rating === 3).length },
    { stars: 2, count: reviews.filter((r) => r.rating === 2).length },
    { stars: 1, count: reviews.filter((r) => r.rating === 1).length },
  ];

  const renderStars = (count: number, size: string = "w-3.5 h-3.5") => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${
            i <= count ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    setIsSubmitting(true);

    const newReview: Review = {
      name: formData.name.trim(),
      rating: formData.rating,
      comment: formData.comment.trim(),
      date: "Just now",
    };

    setTimeout(() => {
      addProductReview(productId, newReview);
      showToast("Review submitted successfully! 🎉", "success");
      setFormData({ name: user?.name || "", rating: 5, comment: "" });
      setShowForm(false);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 mt-16">
      <div className="border-t border-gray-100 dark:border-brand-border pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold dark:text-white">
              Customer Reviews
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Based on {reviews_count} {reviews_count === 1 ? "review" : "reviews"}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            <Star className="w-4 h-4" strokeWidth={2.5} /> Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Rating Summary */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-brand-card rounded-2xl p-6 border border-gray-100 dark:border-brand-border">
              <div className="text-center mb-5">
                <p className="text-5xl font-extrabold dark:text-white">{rating}</p>
                <div className="flex justify-center mt-2">
                  {renderStars(Math.round(rating), "w-5 h-5")}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {reviews_count} reviews
                </p>
              </div>

              <div className="space-y-2">
                {distribution.map((d) => {
                  const percent = (d.count / safeReviewsCount) * 100;
                  return (
                    <div key={d.stars} className="flex items-center gap-2">
                      <span className="text-xs font-bold dark:text-white w-3">
                        {d.stars}
                      </span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-brand-dark rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-green rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                        {d.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
                <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-bold dark:text-white mb-1">No reviews yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Be the first to review this product
                </p>
              </div>
            ) : (
              <>
                {displayedReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-brand-card rounded-2xl p-5 border border-gray-100 dark:border-brand-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-green text-black flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold dark:text-white text-sm">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                        <div className="mt-1.5">{renderStars(review.rating)}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-3 hover:text-brand-green transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {reviews.length > 2 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full bg-gray-100 dark:bg-brand-card text-sm font-bold dark:text-white py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
                  >
                    {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowForm(false)}
          ></div>

          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <div>
                <h3 className="text-lg font-bold dark:text-white">Write a Review</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Share your experience
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full"
              >
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold dark:text-white">
                    {formData.rating}.0
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Your Review *
                </label>
                <textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-green text-black font-bold py-3.5 rounded-full flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}