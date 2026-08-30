import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Truck,
  Printer,
  CheckCircle2,
  X,
  MapPin,
  Phone,
  Scissors,
} from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminOrders: React.FC = () => {
  const { formatPrice, addToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast({
        type: 'success',
        title: 'Order Updated',
        message: `Order status changed to ${newStatus.toUpperCase()}`,
      });
      loadOrders();
    } catch {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update order status.',
      });
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white">
            ORDERS &amp; DISPATCH MANAGEMENT
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Track customer orders, manage courier riders, and update delivery statuses.
          </p>
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
            placeholder="Search by Order #, Customer Name, or Phone..."
            className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing (Tailoring)</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#d4d4d8]">
            <thead className="bg-[#18181b] text-[#a1a1aa] font-bold uppercase tracking-wider border-b border-[#27272a]">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">Customer &amp; Area</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total &amp; Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#71717a]">Loading orders...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#71717a]">No orders found.</td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-[#18181b]/50 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-[#ea580c]">
                      #{order.orderNumber}
                      <span className="block text-[10px] text-[#71717a] font-normal">{order.createdAt}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[10px] text-[#a1a1aa]">
                        {order.shippingAddress?.area || order.area || ''}{order.shippingAddress?.area || order.area ? ', ' : ''}{order.shippingAddress?.city || order.city || 'Karachi'}
                      </div>
                      <div className="text-[10px] text-[#71717a]">{order.customerPhone || order.phone || order.shippingAddress?.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-[#18181b] text-[#d4d4d8] font-bold px-2 py-0.5 rounded border border-[#27272a]">
                        {order.items.length} pcs
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">
                      <div className="text-white">{formatPrice(order.total)}</div>
                      <div className="text-[10px] text-[#a1a1aa]">{order.paymentMethod}</div>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={order.orderStatus || order.status || 'pending'}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="bg-[#18181b] border border-[#27272a] text-[11px] font-bold text-white px-2 py-1 rounded-lg focus:outline-none uppercase"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-4">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Order Details: #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-[#a1a1aa]">Placed on {selectedOrder.createdAt}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#a1a1aa] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#18181b] rounded-2xl border border-[#27272a]">
                <div>
                  <h4 className="font-bold text-white mb-1">Customer Details</h4>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-[#a1a1aa]">{selectedOrder.customerPhone || selectedOrder.phone || selectedOrder.shippingAddress?.phone}</p>
                  <p className="text-[#a1a1aa]">{selectedOrder.customerEmail || selectedOrder.email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Karachi Destination</h4>
                  <p>{selectedOrder.shippingAddress?.address || selectedOrder.address || 'Delivery Address'}</p>
                  <p className="text-[#ea580c] font-semibold">
                    {selectedOrder.shippingAddress?.area || selectedOrder.area || ''}{selectedOrder.shippingAddress?.area || selectedOrder.area ? ', ' : ''}{selectedOrder.shippingAddress?.city || selectedOrder.city || 'Karachi'}
                  </p>
                  {selectedOrder.shippingAddress?.landmark && (
                    <p className="text-[#71717a]">Landmark: {selectedOrder.shippingAddress?.landmark}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h4 className="font-bold text-white">Items in Order ({selectedOrder.items.length})</h4>
                <div className="divide-y divide-[#27272a] bg-[#18181b] rounded-2xl border border-[#27272a] p-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg border border-[#27272a]"
                        />
                        <div>
                          <h5 className="font-bold text-white">{item.productName}</h5>
                          <p className="text-[10px] text-[#a1a1aa]">
                            Size: {item.selectedSize} &bull; Qty: {item.quantity} &bull; {item.stitchChoice}
                          </p>
                          {item.customMeasurements && (
                            <p className="text-[9px] text-[#fed7aa]">
                              Chest: {item.customMeasurements.chest}&quot; | Shirt: {item.customMeasurements.shirtLength}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-[#ea580c]">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div className="p-4 bg-[#18181b] rounded-2xl border border-[#27272a] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Subtotal</span>
                  <span className="font-bold text-white">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Delivery Fee</span>
                  <span className="font-bold text-white">
                    {selectedOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#27272a]">
                  <span className="text-white">Total</span>
                  <span className="text-[#ea580c] font-cinzel">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
