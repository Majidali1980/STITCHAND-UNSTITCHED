import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Filter,
  Eye,
  Plus,
  MessageSquare,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Review, Product } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminReviews: React.FC = () => {
  const { addToast } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New review form state
  const [newReview, setNewReview] = useState({
    productId: '',
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: 'Exquisite stitching and luxury fabric!',
    comment: 'The embroidery is so delicate and looks even more stunning in person. Delivery to Karachi was within 24 hours.',
    verified: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [revData, prodData] = await Promise.all([
        api.getReviews(),
        api.getProducts({ limit: 100 }),
      ]);
      if (Array.isArray(revData)) {
        setReviews(revData);
      }
      if (prodData && prodData.products) {
        setProducts(prodData.products);
        if (prodData.products.length > 0 && !newReview.productId) {
          setNewReview(prev => ({ ...prev, productId: prodData.products[0].id }));
        }
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateReviewStatus(reviewId, status);
      setReviews(prev =>
        prev.map(r => (r.id === reviewId ? { ...r, status } : r))
      );
      addToast({
        type: 'success',
        title: `Review ${status.toUpperCase()}`,
        message: `Review has been marked as ${status}. Product star ratings recalculated automatically.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update review status.',
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      await api.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      addToast({
        type: 'info',
        title: 'Review Deleted',
        message: 'The review was removed permanently.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete review.',
      });
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prod = products.find(p => p.id === newReview.productId);
      const payload: Partial<Review> = {
        ...newReview,
        productName: prod?.name || 'Luxury Ensemble',
        status: 'approved',
      };

      const created = await api.createReview(payload);
      setReviews(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      addToast({
        type: 'success',
        title: 'Review Published',
        message: 'New verified customer review added and approved.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not add review.',
      });
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.productName && r.productName.toLowerCase().includes(q)) ||
      (r.comment && r.comment.toLowerCase().includes(q)) ||
      (r.title && r.title.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Star className="w-6 h-6 text-[#ea580c]" />
            CUSTOMER REVIEWS &amp; MODERATION
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Approve, moderate, and manage verified customer feedback across the catalog.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a] flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-wider">Total Reviews</p>
            <p className="font-cinzel text-xl font-bold text-white mt-0.5">{reviews.length}</p>
          </div>
          <MessageSquare className="w-6 h-6 text-[#ea580c]" />
        </div>

        <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a] flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-wider">Awaiting Approval</p>
            <p className="font-cinzel text-xl font-bold text-amber-400 mt-0.5">{pendingCount}</p>
          </div>
          <Clock className="w-6 h-6 text-amber-400" />
        </div>

        <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a] flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#a1a1aa] tracking-wider">Approved &amp; Live</p>
            <p className="font-cinzel text-xl font-bold text-emerald-400 mt-0.5">{approvedCount}</p>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#121214] p-4 rounded-2xl border border-[#27272a] flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search reviews by customer name, product, or keyword..."
            className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-[#ea580c] text-white'
                  : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] border border-[#27272a]'
              }`}
            >
              {st} {st === 'pending' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#a1a1aa]">Loading customer reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717a]">
            No reviews matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-[#27272a]">
            {filteredReviews.map(review => {
              const prod = products.find(p => p.id === review.productId);
              return (
                <div key={review.id} className="p-4 sm:p-5 hover:bg-[#18181b]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      {/* Rating & Status Badge */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#3f3f46]'
                              }`}
                            />
                          ))}
                        </div>

                        {review.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/50">
                            Pending Approval
                          </span>
                        )}
                        {review.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            Approved &amp; Live
                          </span>
                        )}
                        {review.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800/50">
                            Rejected
                          </span>
                        )}

                        {review.verified && (
                          <span className="text-[10px] text-[#fed7aa] bg-[#27272a] px-2 py-0.5 rounded-md font-medium">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>

                      {/* Title & Comment */}
                      {review.title && (
                        <h4 className="text-sm font-bold text-white">{review.title}</h4>
                      )}
                      <p className="text-xs text-[#d4d4d8] leading-relaxed max-w-3xl">
                        &ldquo;{review.comment}&rdquo;
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-[11px] text-[#a1a1aa] pt-1">
                        <span className="font-semibold text-white flex items-center gap-1">
                          <User className="w-3 h-3 text-[#ea580c]" />
                          {review.customerName}
                        </span>
                        {review.customerEmail && <span>• {review.customerEmail}</span>}
                        <span>• {new Date(review.createdAt).toLocaleDateString()}</span>
                        <span className="text-[#ea580c] font-medium">
                          • Product: {review.productName || prod?.name || 'Catalog Item'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-start">
                      {review.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(review.id, 'approved')}
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          title="Approve Review and Display on Product Page"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {review.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(review.id, 'rejected')}
                          className="flex items-center gap-1 bg-[#27272a] hover:bg-red-950 text-red-400 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border border-[#3f3f46]"
                          title="Reject / Hide Review"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1.5 text-[#71717a] hover:text-red-400 hover:bg-[#27272a] rounded-lg transition-colors"
                        title="Delete Review Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Verified Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121214] border border-[#27272a] w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ea580c]" />
                ADD VERIFIED CUSTOMER REVIEW
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#a1a1aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                  Product
                </label>
                <select
                  value={newReview.productId}
                  onChange={e => setNewReview({ ...newReview, productId: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newReview.customerName}
                    onChange={e => setNewReview({ ...newReview, customerName: e.target.value })}
                    placeholder="e.g. Ayesha Siddiqui"
                    className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                    Customer Email / City
                  </label>
                  <input
                    type="text"
                    value={newReview.customerEmail}
                    onChange={e => setNewReview({ ...newReview, customerEmail: e.target.value })}
                    placeholder="e.g. DHA Karachi"
                    className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                  Star Rating (1 to 5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        newReview.rating >= star
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-[#18181b] border-[#27272a] text-[#71717a]'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. Luxury fabric with gorgeous fall"
                  className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                  Review Feedback Text
                </label>
                <textarea
                  rows={4}
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Customer's experience with fabric quality, stitching, fitting, and delivery..."
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272a] text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold transition-colors"
                >
                  Publish &amp; Approve Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
