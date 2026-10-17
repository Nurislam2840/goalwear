// src/app/admin/reviews/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";
import { Star, Trash2, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";

interface DBReview {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<DBReview | null>(null);

  // Fetch reviews from Supabase
  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err: any) {
        showToast("Failed to load reviews: " + err.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [showToast]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", deleteConfirm.id);

      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== deleteConfirm.id));
      showToast("Review deleted!", "success");
      setDeleteConfirm(null);
    } catch (err: any) {
      showToast("Failed to delete review", "error");
    }
  };

  const renderStars = (count: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= count ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Customer Reviews
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage all product reviews ({reviews.length} total)
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No reviews yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customer reviews will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold dark:text-white text-sm">
                    {review.user_name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-brand-dark px-2 py-1 rounded text-[10px] font-bold dark:text-gray-300">
                  ID: #{review.id}
                </div>
              </div>

              <div className="mb-2">{renderStars(review.rating)}</div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed mb-4">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-brand-border">
                <Link
                  href={`/product/${review.product_id}`}
                  target="_blank"
                  className="text-xs font-bold text-brand-green hover:underline"
                >
                  View Product →
                </Link>
                <button
                  onClick={() => setDeleteConfirm(review)}
                  className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold dark:text-white text-center mb-2">
              Delete Review?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete the review by{" "}
              <span className="font-bold dark:text-white">"{deleteConfirm.user_name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}