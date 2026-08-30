import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Scissors,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, Product } from '../../types';
import { api } from '../../services/api';

export const AccountPage: React.FC = () => {
  const {
    customer,
    loginCustomer,
    logoutCustomer,
    wishlist,
    toggleWishlist,
    addToCart,
    navigate,
    viewParams,
    formatPrice,
    toggleAdminMode,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(
    viewParams.tab || 'orders'
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');

  useEffect(() => {
    if (viewParams.tab) {
      setActiveTab(viewParams.tab);
    }
  }, [viewParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await api.getOrders();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    await loginCustomer(loginEmail.trim());
    setLoginEmail('');
  };

  const getOrderStatusIndex = (status: string) => {
    const sequence = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const idx = sequence.indexOf(status.toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center text-xl font-bold font-cinzel border border-[#fed7aa]">
              {customer?.name ? customer.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1c1917]">
                  {customer ? customer.name : 'Guest Customer Account'}
                </h1>
                <span className="bg-orange-100 text-[#c2410c] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Karachi Privé Member
                </span>
              </div>
              <p className="text-xs text-[#78716c] mt-0.5">
                {customer?.email || 'Sign in to access your order histories & personalized sizes.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => toggleAdminMode(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fed7aa] bg-[#292524] hover:bg-[#3f3f46] px-3.5 py-2 rounded-xl border border-[#44403c] transition-colors"
              title="Open Store Administration Console"
            >
              <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
              <span>Admin Portal</span>
            </button>

            {customer ? (
              <button
                onClick={logoutCustomer}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <form onSubmit={handleLogin} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="bg-[#faf8f5] border border-[#d6cfc4] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#1c1917] text-white shadow-xs'
                : 'bg-white text-[#57534e] hover:bg-[#ede8dc] border border-[#f0ece1]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders &amp; Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'bg-[#1c1917] text-white shadow-xs'
                : 'bg-white text-[#57534e] hover:bg-[#ede8dc] border border-[#f0ece1]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-[#1c1917] text-white shadow-xs'
                : 'bg-white text-[#57534e] hover:bg-[#ede8dc] border border-[#f0ece1]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Karachi Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#1c1917] text-white shadow-xs'
                : 'bg-white text-[#57534e] hover:bg-[#ede8dc] border border-[#f0ece1]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Measurements</span>
          </button>
        </div>

        {/* Tab 1: Orders & Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <div className="text-center py-16 text-xs text-[#78716c]">Loading order histories...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#f0ece1] space-y-3">
                <Package className="w-10 h-10 text-[#a8a29e] mx-auto" />
                <h3 className="font-cinzel text-lg font-bold text-[#1c1917]">No Orders Yet</h3>
                <p className="text-xs text-[#78716c]">You haven&apos;t placed any orders yet.</p>
                <button
                  onClick={() => navigate('shop')}
                  className="bg-[#ea580c] text-white text-xs font-bold uppercase px-6 py-2.5 rounded-full"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map(order => {
                const currentIdx = getOrderStatusIndex(order.status);
                const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

                return (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-3xl border border-[#f0ece1] shadow-xs space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0ece1]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1c1917]">
                            Order #{order.orderNumber}
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#78716c] mt-0.5">
                          Placed on {order.createdAt} &bull; Payment: {order.paymentMethod}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-cinzel text-lg font-bold text-[#ea580c]">
                          {formatPrice(order.total)}
                        </span>
                        <span className="text-[11px] text-[#78716c] block">
                          ({order.items.length} items)
                        </span>
                      </div>
                    </div>

                    {/* Progress Tracker Steps */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#78716c] mb-4">
                        Dispatch &amp; Delivery Progress
                      </h4>
                      <div className="grid grid-cols-5 gap-2 relative">
                        {steps.map((step, idx) => {
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={step} className="flex flex-col items-center text-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  isDone
                                    ? 'bg-[#ea580c] text-white shadow-xs'
                                    : 'bg-[#f5f2eb] text-[#a8a29e] border border-[#e5dfd3]'
                                } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                                  isDone ? 'text-[#1c1917]' : 'text-[#a8a29e]'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="pt-4 border-t border-[#f0ece1] space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                        Items in this shipment:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-[#faf8f5] rounded-xl border border-[#f0ece1]">
                            <img
                              src={item.productImage}
                              alt=""
                              className="w-12 h-14 object-cover rounded-lg border border-[#e5dfd3]"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <h5 className="font-bold text-[#1c1917] truncate">{item.productName}</h5>
                              <p className="text-[10px] text-[#78716c]">
                                Size: {item.selectedSize} &bull; Qty: {item.quantity} &bull; {item.stitchChoice}
                              </p>
                              <span className="font-bold text-[#ea580c] text-[11px]">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#f0ece1] space-y-3">
                <Heart className="w-10 h-10 text-[#a8a29e] mx-auto" />
                <h3 className="font-cinzel text-lg font-bold text-[#1c1917]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#78716c]">Save items you love to keep track of seasonal discounts.</p>
                <button
                  onClick={() => navigate('shop')}
                  className="bg-[#ea580c] text-white text-xs font-bold uppercase px-6 py-2.5 rounded-full"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map(product => (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-2xl border border-[#f0ece1] shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-[#faf8f5]">
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white text-red-600 shadow-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#ea580c]">
                        {product.category}
                      </span>
                      <h4 className="font-bold text-xs text-[#1c1917] truncate">{product.name}</h4>
                      <span className="font-cinzel font-bold text-sm text-[#ea580c] block">
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, product.sizes[0] || 'Standard');
                      }}
                      className="mt-3 w-full bg-[#1c1917] hover:bg-[#ea580c] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0ece1]">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#1c1917]">Karachi Delivery Address Book</h3>
                <p className="text-xs text-[#78716c]">Saved delivery locations for fast 1-click checkout.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border-2 border-[#ea580c] bg-[#fffbf5] space-y-1 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#ea580c] uppercase">Home (Default)</span>
                  <span className="bg-[#ea580c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                </div>
                <p className="font-bold text-[#1c1917]">Ayesha Siddiqui</p>
                <p>Apartment 4B, Creek Vistas, Phase 8</p>
                <p className="font-semibold text-[#9a3412]">DHA Phase 8, Karachi</p>
                <p>Phone: +92 321 8472910</p>
              </div>

              <div className="p-4 rounded-2xl border border-[#d6cfc4] bg-[#faf8f5] space-y-1 text-xs opacity-75">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#57534e] uppercase">Office (Clifton)</span>
                </div>
                <p className="font-bold text-[#1c1917]">Ayesha Siddiqui</p>
                <p>Suite 302, Ocean Mall Tower, Block 9</p>
                <p className="font-semibold text-[#57534e]">Clifton, Karachi</p>
                <p>Phone: +92 321 8472910</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Profile & Measurements */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-[#1c1917] pb-3 border-b border-[#f0ece1]">
              Saved Measurements for Karachi Custom Tailoring
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece1]">
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Standard Size</span>
                <span className="font-bold text-[#1c1917] text-sm">Medium (M)</span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece1]">
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Shirt Length</span>
                <span className="font-bold text-[#1c1917] text-sm">42 Inches</span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece1]">
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Chest</span>
                <span className="font-bold text-[#1c1917] text-sm">38 Inches</span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece1]">
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Trouser Style</span>
                <span className="font-bold text-[#1c1917] text-sm">Straight Cigarette Pants</span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece1]">
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Neckline Preference</span>
                <span className="font-bold text-[#1c1917] text-sm">Mandarin / Boat Neck</span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece1]">
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Atelier Notes</span>
                <span className="font-bold text-[#1c1917] text-sm">Extra 2&quot; margin on sides</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
