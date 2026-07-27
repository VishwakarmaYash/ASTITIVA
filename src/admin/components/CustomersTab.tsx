import { useState, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Plus, Mail, Phone, ChevronRight, X, Sparkles, PlusCircle, Check, Trash2 } from 'lucide-react';
import { Customer } from '../types';
import { authAPI } from '../../api/client';

interface CustomersTabProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  searchQuery: string;
}

const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgO9D3v3YqNKTYJUqWSDtMfdj_xnzjFKF0xVanoBJaIxDUI9grBk38uRdLU8LLT75heCHMvs9Dw1HjQmn8dCSQZtQbQJuoxWKlo3BEtunTvlZdg4yKogLZO6lgRU_yOQ7E-uSesP7ewu-zj2FR5zrCVxH-oAaAYY7OXoF-iGXLYv-wYDY0HV7-WNj2pAM45iBU5IhNoJ5JJP9YWxuoEbTZJiv02grE47j8vWtQUIiSlONM-rHRKRtd',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL4YJLqWEonb50hoDaALeX2-VMJogLH2bDyZRnyAKFVnEkt5t3QjxtEsK7FZYCJdX6mJW4oEW3cbrAYNyQdoxF9BaVpUFJYXIEG115xX_2GWd9Gd81-IGOnzUTHQ__XqokyTyO1-uD5z4DdnOIqW9PSbFvtgJWqJfv94dm3Tqer2U0_8WafsfJEuVSaAbgg_Oi3B7CyOcUIDDM99Cr6wRvns0M7GSsfdfkvIGnhwzZn0f0mP9it1Z',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBi3FHwaEpYy5dWU5nBsilHpeKGOAiIBAOy_cftLMAxYQvpPRiuFYkBfL18AiKGX0AUXzcYGqr5GDq-4dxQuKcXKvLvLYYKobxYpvC1_JACZKkg7ABbpTZZHcJbgICrUePPBkVy9nFwqcYayx0kxnnHiAupKZuaLX1DcYG65S5sygAnCZpsr8YZSj6Z_pGSD6l9hiRmiw_tVwvZlxxfUXaPwoZQajiub2zV65MbPwWRtUYJTlkBHN54',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbzrAG20H1KTY0u2keYaR-GFt1wIHr_8x2xC8YZ7y1WoxFd7Go0-rRg9MTFClLW9yhEvufiPGC-Ng6V42XKZIlPYMdKo8CDQ0ag0mlEbXckvrKtugmsXqA5KaZzCbSKjcPs3I1O1aAuK04X4i0ogHdITA6mcEREJANnunhZ-E3bzl25Ty8JIj9c-wgDBosbVAQ34vz8cDc0AdRNEYz4SFJaAT-kY8rEa41q9BY2v0UNkzAbzJPPmB',
];

export default function CustomersTab({ customers, setCustomers, searchQuery }: CustomersTabProps) {
  const [segmentFilter, setSegmentFilter] = useState<'All' | 'VIP' | 'Member'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add Customer Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState<'VIP' | 'Member'>('Member');
  const [newAvatar, setNewAvatar] = useState(PRESET_AVATARS[0]);
  const [newSpending, setNewSpending] = useState('');
  const [newOrdersCount, setNewOrdersCount] = useState('');

  const itemsPerPage = 5;

  // Filter based on segments & search
  const filteredCustomers = customers.filter((c) => {
    const matchesSegment =
      segmentFilter === 'All' || c.status === segmentFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSegment && matchesSearch;
  });

  // Pagination calculation
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddCustomerSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('MANUAL CUSTOMER ADDITION IS DISABLED; CLIENTS REGISTER THEMSELVES VIA SECURED SIGN-UP PROTOCOLS.');
    setIsAddModalOpen(false);
  };

  const handleDeleteCustomer = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to dismiss this customer profile from the registry?')) {
      try {
        await authAPI.deleteCustomer(id);
        setCustomers(customers.filter((c) => c.id !== id));
        if (selectedCustomer?.id === id) {
          setSelectedCustomer(null);
        }
      } catch (e: any) {
        alert('Failed to delete customer: ' + e.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-black">Customer Registry</h2>
          <p className="text-[#6E6E73] text-sm mt-1">Manage and monitor high-value relationships</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-black text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer text-sm shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2">Total Customers</p>
          <h3 className="text-3xl font-bold tracking-tight text-black">1,284</h3>
          <div className="flex items-center text-[#28CD41] gap-1 mt-2 font-semibold text-xs">
            <span>+12% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2">Avg. Lifetime Value</p>
          <h3 className="text-3xl font-bold tracking-tight text-[#005cba]">$4,250</h3>
          <div className="flex items-center text-[#28CD41] gap-1 mt-2 font-semibold text-xs">
            <span>+4% organic growth</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2">Retention Rate</p>
          <h3 className="text-3xl font-bold tracking-tight text-black">89.2%</h3>
          <div className="flex items-center text-[#005cba] gap-1 mt-2 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Luxury segment benchmark</span>
          </div>
        </div>
      </div>

      {/* Segment Selector & Filter Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#FBFBFC]">
          <div className="flex gap-2">
            {(['All', 'VIP', 'Member'] as const).map((segment) => {
              const isActive = segmentFilter === segment;
              return (
                <button
                  key={segment}
                  onClick={() => {
                    setSegmentFilter(segment);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    isActive ? 'bg-black text-white' : 'text-[#6E6E73] hover:text-black hover:bg-[#eeeef0]'
                  }`}
                >
                  {segment === 'All' ? 'All Customers' : segment === 'VIP' ? 'VIP Segment' : 'Standard Member'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer list table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#eeeef0] text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider border-b border-[#E5E7EB]">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4 text-right">Total Spending</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="group hover:bg-[#FBFBFC] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#E5E7EB] bg-gray-100 flex-shrink-0">
                          <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={c.avatar} alt={c.name} />
                        </div>
                        <div>
                          <p className="font-semibold text-black text-base">{c.name}</p>
                          <p className="text-xs text-[#6E6E73]">{c.joinedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-black flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {c.email}
                      </p>
                      <p className="text-xs text-[#6E6E73] mt-0.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {c.phone}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono font-medium text-black text-sm">{c.totalOrders}</span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-sm text-black font-semibold">
                      ${c.totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'VIP' ? 'bg-black text-white' : 'bg-[#eeeef0] text-[#6E6E73]'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-black transition-all" />
                        <button
                          onClick={(e) => handleDeleteCustomer(c.id, e)}
                          className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Remove Customer Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E6E73]">
                    No prestigious clients logged matching standard searches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex justify-between items-center text-sm text-[#6E6E73]">
          <p>
            Showing {filteredCustomers.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} clients
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#f3f3f5] disabled:opacity-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setCurrentPage(pNum)}
                className={`px-3.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  currentPage === pNum ? 'bg-black text-white' : 'hover:bg-[#f3f3f5] border border-[#E5E7EB]'
                }`}
              >
                {pNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#f3f3f5] disabled:opacity-50 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            <motion.aside
              initial={{ translateX: '100%' }}
              animate={{ translateX: '0%' }}
              exit={{ translateX: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
              className="fixed right-0 top-0 h-screen w-full max-w-[550px] glass-drawer border-l border-[#E5E7EB] shadow-2xl z-55 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-6 border-b border-[#E5E7EB] flex justify-between items-center bg-white/50">
                <h3 className="font-sans text-xl font-semibold text-black">Customer Profile</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Profile Identity */}
                <div className="flex gap-6 items-start">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB] bg-gray-50">
                    <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-sans text-xl font-bold text-black">{selectedCustomer.name}</h4>
                        <p className="text-sm text-[#6E6E73] font-medium">{selectedCustomer.email}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#141b2b] text-white text-[9px] font-bold tracking-wider uppercase">
                        {selectedCustomer.status}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => alert(`Symmetric secure message window established for client ${selectedCustomer.name}.`)}
                        className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-transform cursor-pointer"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => {
                          const updatedName = prompt('Update Profile Name:', selectedCustomer.name);
                          if (updatedName) {
                            setCustomers(
                              customers.map((c) => (c.id === selectedCustomer.id ? { ...c, name: updatedName } : c))
                            );
                            setSelectedCustomer({ ...selectedCustomer, name: updatedName });
                          }
                        }}
                        className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 p-4 rounded-xl border border-[#E5E7EB]">
                    <p className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1">Lifetime Value</p>
                    <p className="text-xl font-bold font-mono text-[#005cba]">${selectedCustomer.totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-xl border border-[#E5E7EB]">
                    <p className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1">Avg. Order Value</p>
                    <p className="text-xl font-bold font-mono text-black">
                      ${(selectedCustomer.totalSpending / (selectedCustomer.totalOrders || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-xl border border-[#E5E7EB]">
                    <p className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1">Total Orders</p>
                    <p className="text-xl font-bold font-mono text-black">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-xl border border-[#E5E7EB]">
                    <p className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1">Member Since</p>
                    <p className="text-base font-bold text-black pt-0.5">{selectedCustomer.joinedDate}</p>
                  </div>
                </div>

                {/* Recent Orders List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-semibold text-black text-sm">Recent Orders History</h5>
                    <span className="text-xs text-[#6E6E73]">{selectedCustomer.recentOrdersList?.length || 0} items logged</span>
                  </div>
                  <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white/50 divide-y divide-[#E5E7EB]">
                    {selectedCustomer.recentOrdersList && selectedCustomer.recentOrdersList.length > 0 ? (
                      selectedCustomer.recentOrdersList.map((ord, idx) => (
                        <div key={idx} className="p-4 flex justify-between items-center text-sm">
                          <div>
                            <p className="font-mono text-xs font-semibold text-black">{ord.id}</p>
                            <p className="text-xs text-[#6E6E73] mt-0.5">{ord.date}</p>
                          </div>
                          <p className="font-semibold text-black font-mono">
                            ${ord.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500">
                        No previous purchases logged.
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-black text-sm">Activity Timeline</h5>
                  <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-0 before:h-full before:w-[2px] before:bg-[#E5E7EB]">
                    {selectedCustomer.timeline && selectedCustomer.timeline.length > 0 ? (
                      selectedCustomer.timeline.map((act) => (
                        <div key={act.id} className="relative">
                          <div className={`absolute -left-[20px] top-1 w-4 h-4 rounded-full ring-4 ring-white ${
                            act.type === 'order' ? 'bg-[#005cba]' : act.type === 'loyalty' ? 'bg-amber-400' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="text-sm font-semibold text-black">{act.title}</p>
                            <p className="text-[#6E6E73] text-[11px] mt-0.5">{act.date}</p>
                            <p className="text-sm mt-1 italic text-[#6E6E73]">"{act.description}"</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <div className="absolute -left-[20px] top-1 w-4 h-4 rounded-full bg-[#005cba] ring-4 ring-white" />
                        <div>
                          <p className="text-sm font-semibold text-black">Member Catalogued</p>
                          <p className="text-[#6E6E73] text-[11px] mt-0.5">Account Setup Complete</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Add Customer Modal Popup */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-100 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddModalOpen(false)}
                className="fixed inset-0 transition-opacity bg-black cursor-pointer"
              />

              {/* Centered Modal contents */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl sm:align-middle"
              >
                <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB]">
                  <h3 className="text-lg font-bold text-black">Astitiva New Profile Entry</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full cursor-pointer text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddCustomerSubmit} className="space-y-4 mt-4">
                  {/* Avatar Picker */}
                  <div>
                    <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-2">
                      Profile Headshot
                    </label>
                    <div className="flex gap-3 justify-start">
                      {PRESET_AVATARS.map((av) => (
                        <button
                          type="button"
                          key={av}
                          onClick={() => setNewAvatar(av)}
                          className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                            newAvatar === av ? 'border-black scale-95 ring-2 ring-offset-2' : 'border-transparent'
                          }`}
                        >
                          <img referrerPolicy="no-referrer" src={av} className="w-full h-full object-cover" alt="headshot" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden"
                      placeholder="e.g. Julianne Vought"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden"
                      placeholder="j.vought@luxury.com"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden"
                      placeholder="+1 (555) 890-2431"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1">
                        Luxury Segment
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as 'VIP' | 'Member')}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm cursor-pointer"
                      >
                        <option value="Member">Member</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1">
                        Total Orders
                      </label>
                      <input
                        type="number"
                        value={newOrdersCount}
                        onChange={(e) => setNewOrdersCount(e.target.value)}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1">
                      Opening Total Spending ($)
                    </label>
                    <input
                      type="number"
                      value={newSpending}
                      onChange={(e) => setNewSpending(e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB] flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-2.5 border border-[#E5E7EB] rounded-lg text-xs font-semibold hover:bg-[#eeeef0] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-transform cursor-pointer"
                    >
                      Authorize Entry
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
