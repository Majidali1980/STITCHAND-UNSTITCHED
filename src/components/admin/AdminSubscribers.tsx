import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  MessageCircle,
  Send,
  Plus,
  Trash2,
  Search,
  Download,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Subscriber } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminSubscribers: React.FC = () => {
  const { addToast, settings } = useStore();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<'all' | 'whatsapp' | 'email'>('all');

  // Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState(
    '✨ Stitch & Unstitched Karachi Exclusive Drop: Our new Luxury Summer Lawn & Ready-to-Wear Eid Collection is now live! Enjoy free express delivery in Karachi: https://stitchandunstitched.pk'
  );
  const [broadcastChannel, setBroadcastChannel] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Add subscriber modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    city: 'Karachi',
    source: 'Admin Manual Entry',
  });

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const data = await api.getSubscribers();
      if (Array.isArray(data)) {
        setSubscribers(data);
      }
    } catch (err) {
      console.error('Failed to load subscribers', err);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not fetch subscriber records.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email && !formData.whatsapp) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide either an Email address or WhatsApp number.',
      });
      return;
    }

    try {
      const res = await api.subscribeNewsletter(formData);
      if (res && res.success) {
        addToast({
          type: 'success',
          title: 'Subscriber Added',
          message: `${formData.name || 'Subscriber'} has been registered successfully.`,
        });
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          email: '',
          whatsapp: '',
          city: 'Karachi',
          source: 'Admin Manual Entry',
        });
        loadSubscribers();
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Failed to Add',
        message: 'Could not save subscriber.',
      });
    }
  };

  const handleDeleteSubscriber = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove subscriber "${name}"?`)) return;

    try {
      const success = await api.deleteSubscriber(id);
      if (success) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        addToast({
          type: 'success',
          title: 'Subscriber Deleted',
          message: 'Subscriber removed from broadcast list.',
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete subscriber.',
      });
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      addToast({
        type: 'error',
        title: 'Message Empty',
        message: 'Please type a broadcast message before dispatching.',
      });
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await api.broadcastNewsletter({
        message: broadcastMessage,
        channel: broadcastChannel,
      });

      if (res && res.success) {
        addToast({
          type: 'success',
          title: 'Broadcast Dispatched!',
          message: res.message || `Broadcast delivered to ${res.count} active recipient(s).`,
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Broadcast Failed',
        message: 'Could not send broadcast. Please verify parameters.',
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,WhatsApp,City,Status,Source,CreatedAt'];
    const rows = subscribers.map(s =>
      `"${s.id}","${s.name || ''}","${s.email || ''}","${s.whatsapp || ''}","${s.city || ''}","${s.status}","${s.source || ''}","${s.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_karachi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyWhatsAppNumbers = () => {
    const numbers = subscribers
      .filter(s => !!s.whatsapp)
      .map(s => s.whatsapp)
      .join(', ');

    if (!numbers) {
      addToast({
        type: 'info',
        title: 'No WhatsApp Numbers',
        message: 'No subscribers with WhatsApp numbers found.',
      });
      return;
    }

    navigator.clipboard.writeText(numbers);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'All WhatsApp contact numbers copied for bulk broadcast.',
    });
  };

  const filteredSubscribers = subscribers.filter(s => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.whatsapp && s.whatsapp.includes(query)) ||
      (s.city && s.city.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (filterChannel === 'whatsapp') return !!s.whatsapp;
    if (filterChannel === 'email') return !!s.email;
    return true;
  });

  const whatsappCount = subscribers.filter(s => !!s.whatsapp).length;
  const emailCount = subscribers.filter(s => !!s.email).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#ea580c]" />
            <span>NEWSLETTER &amp; WHATSAPP BROADCASTS</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Manage captured storefront subscribers, dispatch WhatsApp VIP broadcasts, and export contact lists.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyWhatsAppNumbers}
            className="flex items-center gap-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copy WhatsApp List</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
            <span>Total Subscribers</span>
            <Users className="w-4 h-4 text-[#ea580c]" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-white">{subscribers.length}</div>
          <div className="text-[11px] text-[#71717a]">Captured from storefront &amp; footer</div>
        </div>

        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
            <span>WhatsApp Numbers</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-white">{whatsappCount}</div>
          <div className="text-[11px] text-emerald-400">Ready for instant WhatsApp broadcasts</div>
        </div>

        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
            <span>Email Subscribers</span>
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-white">{emailCount}</div>
          <div className="text-[11px] text-blue-400">Seasonal lookbooks &amp; digests</div>
        </div>
      </div>

      {/* Broadcast Message Composer (WhatsApp / Email) */}
      <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272a] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#ea580c]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Instant Broadcast Center
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a1a1aa] font-medium">Broadcast Channel:</span>
            <select
              value={broadcastChannel}
              onChange={e => setBroadcastChannel(e.target.value as any)}
              className="bg-[#18181b] border border-[#3f3f46] text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#ea580c]"
            >
              <option value="whatsapp">WhatsApp Broadcast (Preferred)</option>
              <option value="email">Email Campaign</option>
              <option value="both">Both (WhatsApp &amp; Email)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
            Broadcast Announcement &amp; Promotion Message:
          </label>
          <textarea
            rows={3}
            value={broadcastMessage}
            onChange={e => setBroadcastMessage(e.target.value)}
            className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-xs p-3 rounded-xl focus:outline-none focus:border-[#ea580c] resize-none"
            placeholder="Type your WhatsApp / Newsletter campaign message..."
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-[#a1a1aa] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Targeting {broadcastChannel === 'whatsapp' ? whatsappCount : broadcastChannel === 'email' ? emailCount : subscribers.length} active subscriber(s).</span>
          </div>

          <button
            onClick={handleSendBroadcast}
            disabled={isBroadcasting}
            className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
          >
            {isBroadcasting ? (
              <span>Dispatching...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send {broadcastChannel.toUpperCase()} Broadcast</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121214] p-4 rounded-2xl border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, WhatsApp, city..."
            className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterChannel('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterChannel === 'all' ? 'bg-[#ea580c] text-white' : 'bg-[#18181b] text-[#a1a1aa] hover:text-white'
            }`}
          >
            All ({subscribers.length})
          </button>
          <button
            onClick={() => setFilterChannel('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterChannel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-[#18181b] text-[#a1a1aa] hover:text-white'
            }`}
          >
            WhatsApp ({whatsappCount})
          </button>
          <button
            onClick={() => setFilterChannel('email')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterChannel === 'email' ? 'bg-blue-600 text-white' : 'bg-[#18181b] text-[#a1a1aa] hover:text-white'
            }`}
          >
            Email ({emailCount})
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#18181b] text-[#a1a1aa] uppercase tracking-wider font-semibold border-b border-[#27272a]">
              <tr>
                <th className="px-5 py-3.5">Subscriber Name</th>
                <th className="px-5 py-3.5">WhatsApp Contact</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">City / Region</th>
                <th className="px-5 py-3.5">Captured Source</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#a1a1aa]">
                    Loading subscribers...
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#a1a1aa]">
                    No subscribers found matching your query.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-[#18181b]/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {sub.name || 'Anonymous Shopper'}
                    </td>
                    <td className="px-5 py-3.5">
                      {sub.whatsapp ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{sub.whatsapp}</span>
                          <a
                            href={`https://wa.me/${sub.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(broadcastMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 hover:text-white"
                            title="Direct WhatsApp Chat"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[#52525b]">&mdash;</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {sub.email ? (
                        <div className="flex items-center gap-1.5 text-blue-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{sub.email}</span>
                        </div>
                      ) : (
                        <span className="text-[#52525b]">&mdash;</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#d4d4d8]">
                      {sub.city || 'Karachi'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#27272a] text-[#a1a1aa] px-2 py-0.5 rounded text-[10px] font-medium">
                        {sub.source || 'Storefront'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteSubscriber(sub.id, sub.name || sub.email || sub.whatsapp || 'Subscriber')}
                        className="p-1.5 text-[#a1a1aa] hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold text-white">
              Add New Subscriber
            </h3>

            <form onSubmit={handleAddSubscriber} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ayesha Siddiqui"
                  className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">
                  WhatsApp Number:
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="e.g. 03001234567"
                  className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ayesha@example.com"
                  className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1">
                    City:
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1">
                    Source:
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#a1a1aa] hover:bg-[#27272a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Save Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
