import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Filter, Eye, Trash2, X, ShoppingBag, DollarSign } from 'lucide-react';
import { Order } from '../types';

interface OrdersTabProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  searchQuery: string;
}

export default function OrdersTab({ orders, setOrders, searchQuery }: OrdersTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const itemsPerPage = 5;

  // Filter orders based on status & search
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === 'All Statuses' || o.orderStatus === statusFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Pagination calculation
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteOrder = (id: string) => {
    if (confirm('Are you sure you want to retract this transaction record?')) {
      setOrders(orders.filter((o) => o.id !== id));
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  const handleUpdateOrderStatus = (id: string, newStatus: Order['orderStatus']) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, orderStatus: newStatus } : o
    );
    setOrders(updated);
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Order ID,Customer,Email,Date,Amount,Payment,Status',
        ...filteredOrders.map(
          (o) =>
            `"${o.id}","${o.customerName}","${o.email}","${o.date}",${o.amount},"${o.paymentStatus}","${o.orderStatus}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'luxury_orders_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-black">Orders</h2>
          <p className="text-[#6E6E73] text-sm mt-1">Manage and track high-value client transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold hover:opacity-95 active:scale-95 transition-all duration-150 cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter and tab bar */}
      <div className="bg-[#FBFBFC] border border-[#E5E7EB] rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-2">
          {['All Statuses', 'Processing', 'Shipped', 'Delivered', 'On Hold'].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-[#6E6E73] hover:text-black hover:bg-[#eeeef0]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setStatusFilter('All Statuses');
            setCurrentPage(1);
            alert('Filters reset to default.');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-black cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          Clear Filter
        </button>
      </div>

      {/* Orders Table Card */}
      <div className="bg-[#FBFBFC] border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#eeeef0] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((o) => {
                  let badgeStatus = '';
                  switch (o.orderStatus) {
                    case 'Delivered':
                      badgeStatus = 'bg-[#28CD41]/10 text-[#28CD41]';
                      break;
                    case 'Shipped':
                      badgeStatus = 'bg-[#005cba]/10 text-[#005cba]';
                      break;
                    case 'Processing':
                      badgeStatus = 'bg-amber-100 text-[#55442c]';
                      break;
                    case 'On Hold':
                      badgeStatus = 'bg-gray-100 text-gray-700';
                      break;
                    default:
                      badgeStatus = 'bg-gray-100 text-gray-700';
                  }

                  const payBadge =
                    o.paymentStatus === 'Paid'
                      ? 'bg-[#28CD41]/10 text-[#28CD41]'
                      : o.paymentStatus === 'Pending'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-gray-100 text-gray-500';

                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-white transition-colors duration-150 group cursor-pointer"
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs text-black font-semibold">{o.id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                            <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={o.customerAvatar} alt={o.customerName} />
                          </div>
                          <div>
                            <p className="font-semibold text-black text-sm">{o.customerName}</p>
                            <p className="text-xs text-[#6E6E73] mt-0.5">{o.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[#6E6E73]">{o.date}</td>
                      <td className="px-6 py-5 font-mono text-sm text-black font-semibold">
                        ${o.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${payBadge}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeStatus}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-2 hover:bg-[#eeeef0] rounded-full text-[#6E6E73] hover:text-black transition-colors cursor-pointer"
                            title="Inspect Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="p-2 hover:bg-red-50 rounded-full text-[#6E6E73] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                            title="Void Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#6E6E73]">
                    No high-value transactions matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex justify-between items-center text-sm text-[#6E6E73]">
          <p>
            Showing {filteredOrders.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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
                  currentPage === pNum
                    ? 'bg-black text-white'
                    : 'hover:bg-[#f3f3f5] border border-[#E5E7EB]'
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

      {/* Order Inspect Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            <motion.aside
              initial={{ translateX: '100%' }}
              animate={{ translateX: '0%' }}
              exit={{ translateX: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
              className="fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white border-l border-[#E5E7EB] shadow-2xl z-55 overflow-hidden flex flex-col"
            >
              <div className="px-6 py-6 bg-[#FBFBFC] border-b border-[#E5E7EB] flex justify-between items-center">
                <div>
                  <h3 className="font-sans text-xl font-semibold text-black">Order Invoice</h3>
                  <p className="text-xs font-mono text-gray-500 mt-1">Receipt Ref: {selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-[#eeeef0] rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Status selector */}
                <div className="bg-[#eeeef0] rounded-xl p-4 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6E6E73]">Status Flow</span>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) =>
                      handleUpdateOrderStatus(selectedOrder.id, e.target.value as Order['orderStatus'])
                    }
                    className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-[#005cba] cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                {/* Client Profile */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#005cba] uppercase tracking-wider">Client Information</p>
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-[#E5E7EB]">
                      <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={selectedOrder.customerAvatar} alt={selectedOrder.customerName} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black text-base">{selectedOrder.customerName}</h4>
                      <p className="text-xs text-[#6E6E73]">{selectedOrder.email}</p>
                      <p className="text-xs text-[#6E6E73] mt-0.5">{selectedOrder.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Items Purchased */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-[#005cba] uppercase tracking-wider">Purchased Pieces</p>
                  <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#E5E7EB]">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="p-4 flex justify-between items-center bg-white">
                          <div>
                            <p className="font-semibold text-sm text-black">{item.productName}</p>
                            <p className="text-xs text-[#6E6E73] font-mono mt-0.5">SKU: {item.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-black">
                              ${item.price.toLocaleString('en-US')}
                            </p>
                            <p className="text-xs text-[#6E6E73] mt-0.5">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 flex justify-between items-center bg-white">
                        <div>
                          <p className="font-semibold text-sm text-black">Exquisite Curated Package</p>
                          <p className="text-xs text-[#6E6E73] font-mono mt-0.5">Standard Selection</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-black">${selectedOrder.amount.toLocaleString()}</p>
                          <p className="text-xs text-[#6E6E73] mt-0.5">Qty: 1</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Calculation Summary */}
                <div className="bg-[#FBFBFC] rounded-xl border border-[#E5E7EB] p-4 space-y-2.5">
                  <div className="flex justify-between text-xs text-[#6E6E73]">
                    <span>Subtotal</span>
                    <span>${(selectedOrder.amount * 0.9).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#6E6E73]">
                    <span>Premium Insured Shipping</span>
                    <span className="text-[#28CD41] font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#6E6E73]">
                    <span>Taxes & Duties (Luxury Seg.)</span>
                    <span>${(selectedOrder.amount * 0.1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="h-[1px] bg-[#E5E7EB] my-1" />
                  <div className="flex justify-between text-sm font-bold text-black">
                    <span>Total Amount Paid</span>
                    <span className="font-mono">${selectedOrder.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#FBFBFC] border-t border-[#E5E7EB] flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Receipt forwarded to ${selectedOrder.email}.`);
                  }}
                  className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Email Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 border border-[#E5E7EB] rounded-lg text-sm font-semibold hover:bg-[#eeeef0] transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
