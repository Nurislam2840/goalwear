// src/components/ProductReviews.tsx
"use client";

import { useState } from "react";
import { Star, User, X, CheckCircle2, Loader2, Camera } from "lucide-react";
import { Review } from "@/data/products";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

interface ExtendedReview extends Review {
  image_url?: string;
}

interface ProductReviewsProps {
  productId: number;
  reviews: ExtendedReview[];
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
  const { user, isAuthenticated } = useAuth();

  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    rating: 5,
    comment: "",
    image_url: "",
  });

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const safeReviewsCount = Math.max(reviews_count, 1);

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const renderStars = (count: number, size: string = "w-4 h-4") => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${i <= count ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        />
      ))}
    </div>
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, image_url: event.target?.result as string });
      setIsUploading(false);
    };
    reader.onerror = () => {
      showToast("Failed to read image", "error");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview: ExtendedReview = {
        name: formData.name.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        image_url: formData.image_url,
      };

      await addProductReview(productId, newReview);
      
      showToast("Review submitted successfully! 🎉", "success");
      setFormData({ name: user?.name || "", rating: 5, comment: "", image_url: "" });
      setShowForm(false);
    } catch (err: any) {
      showToast(err.message || "Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 mt-16 pb-10">
      <div className="border-t border-gray-100 dark:border-brand-border pt-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold dark:text-white">Customer Reviews</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Based on {reviews_count} {reviews_count === 1 ? "review" : "reviews"}
            </p>
          </div>
          
          {isAuthenticated ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <Star className="w-4 h-4" strokeWidth={2.5} /> Write a Review
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-brand-card text-gray-800 dark:text-gray-200 font-bold px-5 py-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-brand-border transition-colors text-sm"
            >
              Login to Review
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-brand-card rounded-3xl p-6 border border-gray-100 dark:border-brand-border sticky top-24">
              <div className="text-center mb-6">
                <p className="text-5xl font-extrabold dark:text-white">{rating.toFixed(1)}</p>
                <div className="flex justify-center mt-2">
                  {renderStars(Math.round(rating), "w-5 h-5")}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {reviews_count} Total Reviews
                </p>
              </div>

              <div className="space-y-2">
                {distribution.map((d) => {
                  const percent = (d.count / safeReviewsCount) * 100;
                  return (
                    <div key={d.stars} className="flex items-center gap-2">
                      <span className="text-xs font-bold dark:text-white w-3">{d.stars}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-brand-dark rounded-full overflow-hidden">
                        <div className="h-full bg-brand-green rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{d.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-brand-card rounded-3xl border border-gray-100 dark:border-brand-border">
                <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-bold dark:text-white mb-1">No reviews yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Be the first to share your experience!</p>
              </div>
            ) : (
              <>
                {displayedReviews.map((review, idx) => (
                  <div key={idx} className="bg-white dark:bg-brand-card rounded-2xl p-5 border border-gray-100 dark:border-brand-border hover:border-brand-green/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-green text-black flex items-center justify-center font-bold text-sm flex-shrink-0 border border-brand-green/30">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold dark:text-white text-sm">{review.name}</p>
                          <p className="text-[10px] font-medium text-gray-400 bg-gray-50 dark:bg-brand-dark px-2 py-1 rounded-full">{review.date}</p>
                        </div>
                        <div className="mt-1.5">{renderStars(review.rating, "w-3.5 h-3.5")}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                          {review.comment}
                        </p>

                        {review.image_url && (
                          <div className="mt-3 w-32 h-32 relative rounded-xl overflow-hidden border border-gray-100 dark:border-brand-border">
                            <Image
                              src={review.image_url}
                              alt="Review photo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full bg-gray-100 dark:bg-brand-card text-sm font-bold dark:text-white py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-brand-border transition-colors"
                  >
                    {showAll ? "Show Less" : `View All ${reviews.length} Reviews`}
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowForm(false)}></div>

          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md shadow-2xl animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <div>
                <h3 className="text-lg font-bold dark:text-white">Write a Review</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Share your experience with others</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Your Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="transition-transform hover:scale-110">
                      <Star className={`w-9 h-9 ${star <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-700"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Your Review *</label>
                <textarea
                  required value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="What did you like or dislike about this product?"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Add a Photo (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border hover:border-brand-green rounded-xl px-4 py-3 flex items-center justify-center gap-2 w-full transition-colors">
                    {isUploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin text-brand-green" /> <span className="text-xs font-bold">Uploading...</span></>
                    ) : (
                      <><Camera className="w-4 h-4 text-gray-400" /> <span className="text-xs font-bold dark:text-gray-300">Choose Image</span></>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                  {formData.image_url && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                      <button type="button" onClick={() => setFormData({ ...formData, image_url: "" })} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting || isUploading} className="w-full bg-brand-green text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> Submit Review</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}