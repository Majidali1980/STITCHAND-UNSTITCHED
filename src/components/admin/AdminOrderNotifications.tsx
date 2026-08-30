import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  MessageCircle,
  Package,
  ShoppingBag,
  Volume2,
  VolumeX,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

interface AdminOrderNotificationsProps {
  onSelectOrder?: (order: Order) => void;
  onNavigateToOrders?: () => void;
}

export const AdminOrderNotifications: React.FC<AdminOrderNotificationsProps> = ({
  onSelectOrder,
  onNavigateToOrders,
}) => {
  const { formatPrice, addToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [readOrderIds, setReadOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('su_read_order_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('su_order_chime') !== 'false';
  });
  const prevCountRef = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Play subtle luxury notification chime using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio context might require user interaction first
    }
  };

  const fetchOrders = async (isInitial = false) => {
    try {
      const data = await api.getOrders();
      if (Array.isArray(data)) {
        setOrders(data);

        // Check if new order arrived
        if (!isInitial && prevCountRef.current > 0 && data.length > prevCountRef.current) {
          if (soundEnabled) {
            playChime();
          }
          addToast({
            type: 'info',
            title: 'New Order Received! 🛍️',
            message: `Order #${data[0]?.orderNumber} from ${data[0]?.customerName} (${data[0]?.area || 'Karachi'})`,
          });
        }
        prevCountRef.current = data.length;
      }
    } catch (err) {
      console.warn('Could not fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('su_order_chime', String(next));
    if (next) playChime();
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = orders.map(o => o.id);
    setReadOrderIds(allIds);
    localStorage.setItem('su_read_order_notifications', JSON.stringify(allIds));
  };

  const markSingleAsRead = (id: string) => {
    if (!readOrderIds.includes(id)) {
      const updated = [...readOrderIds, id];
      setReadOrderIds(updated);
      localStorage.setItem('su_read_order_notifications', JSON.stringify(updated));
    }
  };

  // Unread orders (or pending status)
  const unreadOrders = orders.filter(
    o => !readOrderIds.includes(o.id) || o.status === 'pending' || o.orderStatus === 'pending'
  );
  const unreadCount = unreadOrders.length;

  const handleOrderClick = (order: Order) => {
    markSingleAsRead(order.id);
    setIsOpen(false);
    if (onSelectOrder) {
      onSelectOrder(order);
    } else if (onNavigateToOrders) {
      onNavigateToOrders();
    }
  };

  const handleWhatsAppCustomer = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    const phone = (
      order.customerPhone ||
      order.phone ||
      order.shippingAddress?.phone ||
      ''
    ).replace(/[^0-9]/g, '');

    const area = order.shippingAddress?.area || order.area || 'Karachi';
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! Stitch & Unstitched Karachi here regarding your Order #${order.orderNumber} (Rs. ${order.total}). Your delivery destination is confirmed as ${area}. Would you like to track your order dispatch status?`
    );

    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Notification Trigger Button */}
      <button
        id="admin-notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-[#d4d4d8] hover:text-white border border-[#27272a] transition-all flex items-center justify-center focus:outline-none"
        title="New Order Alerts & Notifications"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-[#ea580c]' : 'text-[#a1a1aa]'}`} />

        {/* Highlighted Badge / Pulse Animation */}
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea580c] opacity-75" />
              <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-[#ea580c] text-[9px] font-bold text-white shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          </>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121214] border border-[#27272a] rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
          {/* Header */}
          <div className="p-3.5 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ea580c]/20 text-[#ea580c] flex items-center justify-center font-bold">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-cinzel text-xs font-bold text-white">
                  ORDER NOTIFICATIONS
                </h4>
                <p className="text-[10px] text-[#a1a1aa]">
                  {unreadCount} unread / pending dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSound}
                className="p-1 text-[#a1a1aa] hover:text-white rounded-md hover:bg-[#27272a] transition-colors"
                title={soundEnabled ? 'Disable sound chime' : 'Enable sound chime'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#71717a]" />
                )}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-[#ea580c] hover:text-[#fed7aa] font-semibold px-1.5 py-0.5 rounded hover:bg-[#ea580c]/10 transition-colors flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Read all</span>
                </button>
              )}
            </div>
          </div>

          {/* Orders List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#27272a]">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-[#71717a] space-y-1">
                <ShoppingBag className="w-8 h-8 mx-auto opacity-40 text-[#a1a1aa]" />
                <p className="font-semibold text-white">No incoming orders</p>
                <p className="text-[11px]">Orders placed on storefront will appear here live.</p>
              </div>
            ) : (
              orders.slice(0, 8).map(order => {
                const isUnread = !readOrderIds.includes(order.id);
                const isPending = order.status === 'pending' || order.orderStatus === 'pending';

                return (
                  <div
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className={`p-3.5 transition-colors cursor-pointer hover:bg-[#18181b] flex items-start justify-between gap-3 ${
                      isUnread || isPending
                        ? 'bg-[#ea580c]/5 border-l-2 border-l-[#ea580c]'
                        : 'opacity-85'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-[11px]">
                          #{order.orderNumber}
                        </span>
                        {isPending && (
                          <span className="bg-amber-950/80 text-amber-300 border border-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            Pending
                          </span>
                        )}
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#ea580c] inline-block animate-pulse" />
                        )}
                      </div>

                      <div className="text-white font-medium mt-0.5 truncate">
                        {order.customerName}
                      </div>

                      <div className="text-[10px] text-[#a1a1aa] flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#fed7aa] font-medium">
                          {order.shippingAddress?.area || order.area || 'Karachi'}
                        </span>
                        <span>&bull;</span>
                        <span>{order.items.length} item(s)</span>
                        <span>&bull;</span>
                        <span className="text-[#71717a]">{order.createdAt}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1.5">
                      <div className="font-bold text-[#ea580c]">
                        {formatPrice(order.total)}
                      </div>
                      <button
                        onClick={e => handleWhatsAppCustomer(e, order)}
                        className="p-1 bg-emerald-950/80 text-emerald-400 hover:text-white hover:bg-emerald-700 rounded-md border border-emerald-800 transition-colors inline-flex items-center gap-1 text-[10px] px-1.5"
                        title="Quick WhatsApp Status"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#18181b] border-t border-[#27272a] text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigateToOrders) onNavigateToOrders();
              }}
              className="w-full py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Open All Orders &amp; Dispatch ({orders.length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
