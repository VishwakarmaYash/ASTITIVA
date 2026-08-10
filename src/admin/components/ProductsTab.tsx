import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Plus, Edit, Trash2, X, Upload, Check } from 'lucide-react';
import { Product } from '../types';
import { productsAPI } from '../../api/client';

interface ProductsTabProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const CATEGORIES = ['Accessories', 'Timepieces', 'Footwear'];

// Preset product image URLs for users to quickly select when creating a mock product!
const PRESET_IMAGES = [
  { name: 'Luxury Bag', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl1GEylk7fe00zTCibl360397qKbW4fpUIkowXKVv4k_mIOt99VKRGQs5uLlFYdJaY8f9NQlTXcG9OxwEu1SLs0yHSeaZygQLS6-nwKkAcAlNpgFjhwIHN_41_zH5pRxXcClPXD_JX5cF0NkCTVeT_yNnM0A3aevEfnEL2TRQ5vPIJCdVhp4gPJTZp_qCEzSSd3G24bNlY1Fw1xsAchslNctwBG0RHawoxY7vf2DsL4myZ6x-cBQ7w' },
  { name: 'Swiss Chrono', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwbTNJBEFE8ftbJFP0Yl3XZQ8Ps3o5c2__sxNzi2dFbOZfkee-JKIs4LvHDH6nYy3bzDDHeAAZLL7QO7eM2h90tTW-9HOt5gsoz_FW3QRs8y82LuiLMmfUHqvcE8chFawctDpQVFJEy3m2V7WL2WcZKK7N3EFporVWQdtlfsXWCrqosdueSoifOV2MRZDAbNlF9IDGrVF2eM52PQnV1hVGVPdfHju7vBiIeECLU_AidprU6E3SBvgx' },
  { name: 'Midnight Watch', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkj6GKeEfy4ba9nbHOjBPwpeWe8aFcMNSggjFfx6SRc90Y4qAtGHE6dBl_yuiogLPvuteCtDlYB3voF9MPYBAecSvnzlQ0xwXLnPyxeDt3E0tJ-1Sg6GLbub_M5mbhxzzKc-uPreEHBIekyBehLe1OCLVrt9_G8D-Clyan9AvYgnNb2SrfoIVc-khwuROaVRE4HHmGCrSggTsL4wYm_vQPavDQXBywK9FpVYpPomwoGhJSGiTCdbb-' },
  { name: 'AeroSound', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdNuWlEki3rbDfyXB880pQLE1xBy6Je7Y3RRGZZY7gDFi7dsWcykXA1A8XbCv71wYSeE-ZiMyBFEgMPQNyAqSGL5ZgJaYJxQUEgV0_us7zjAtE_fFfyX2goDv7UeUZtJS0mBQSw8wNyMPAY58VWXgm2oBoAO5wfgwsGO3maVd4DZ-k09qOEcc8HKvJB0GEnHa8P9KFI4h_FUYsgoSonr80S9wwzCrfNje-APQFN_cUTLQen299S9Sc' },
  { name: 'Cedar Candle', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2iPNRik6yCNrwfZ42QZbeIWMZrNk4k6pog3yhhymSaYRxrGl7l5LOIEGj2hQYPI_dCjzmHhLbHR35F2BqpvehVbH7F8xhGaeqSmecdX5io4ayDuT9MXNAaNpM_g8Z_klxeJ-_kitH7b6vOk5Bn2OCUJmBGGQRV4YP8fHPvnRcHVcSBuLVOsCHtWosqbaqpNow3TdpTpA0SZ19oKtlrUNYmuFcVw_p4eZnrFdhsaxL2Kgsw8qyyo-S' },
  { name: 'Gold Glasses', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNDKpqpeZZnUTJPhw2ssYnjNDNpKM1D3BcBhtQFCiW_ilJVNZ7rNRLl4fZlcJ50KU8mk6AkN-pymExL-H77sqNCl_KhzFUNsUHOwvuNeKKKIOF8hNZvfU4zJW7HstOszDWhEKWHTTkxccNa_T-toQkOplRY-E_IgW_KL_08AKD_Ta3jA9E8tJL_Hv3NsD6mQMgxseyA3e6gJH1WM_9anY5FhvzwsBFHot0RS2gmf3sWq9maop_mExl' },
];

export default function ProductsTab({ products, setProducts }: ProductsTabProps) {
  // Filtering & Pagination State
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('Status: All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Accessories');
  const [formPrice, setFormPrice] = useState('');
  const [formCompareAtPrice, setFormCompareAtPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Draft'>('Active');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>(['M']);
  const [formColors, setFormColors] = useState<string[]>(['#000000']);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState<string>('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formSpecs, setFormSpecs] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState<string>('');
  const [specInput, setSpecInput] = useState<string>('');

  // Filters calculation
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'Status: All' ||
      (selectedStatus === 'Active' && p.status === 'Active') ||
      (selectedStatus === 'Draft' && p.status === 'Draft') ||
      (selectedStatus === 'Archived' && p.status === 'Archived');

    return matchesCategory && matchesStatus;
  });

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Actions
  const openCreateDrawer = () => {
    setEditingProduct(null);
    setFormName('');
    // auto-generate SKU
    setFormSku(`VL-${Math.floor(10000 + Math.random() * 90000)}`);
    setFormCategory('Accessories');
    setFormPrice('');
    setFormCompareAtPrice('');
    setFormStock('');
    setFormStatus('Active');
    setFormImage(PRESET_IMAGES[0].url);
    setFormDescription('');
    setFormSizes(['M']);
    setFormColors(['#000000']);
    setFormImages([]);
    setGalleryUrlInput('');
    setFormFeatures([]);
    setFormSpecs([]);
    setFeatureInput('');
    setSpecInput('');
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormCompareAtPrice(product.compareAtPrice ? product.compareAtPrice.toString() : '');
    setFormStock(product.stock.toString());
    setFormStatus(product.status === 'Active' ? 'Active' : 'Draft');
    setFormImage(product.image);
    setFormDescription(product.description);
    setFormSizes(product.sizes);
    setFormColors(product.colors);
    setFormImages(product.images || []);
    setGalleryUrlInput('');
    setFormFeatures((product as any).features || []);
    setFormSpecs((product as any).specs || []);
    setFeatureInput('');
    setSpecInput('');
    setIsDrawerOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this exquisite product from the luxury inventory?')) {
      try {
        await productsAPI.deleteProduct(id);
        const updated = products.filter((p) => p.id !== id);
        setProducts(updated);
      } catch (e: any) {
        alert('Failed to delete product: ' + e.message);
      }
    }
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      alert('Please fill out Product Name and Price.');
      return;
    }

    const priceNum = parseFloat(formPrice) || 0;
    const compareAtPriceNum = formCompareAtPrice.trim() ? parseFloat(formCompareAtPrice) || 0 : undefined;
    const stockNum = parseInt(formStock) || 0;

    // Auto-append any untracked text in galleryUrlInput
    let finalImages = [...formImages];
    if (galleryUrlInput.trim()) {
      finalImages.push(galleryUrlInput.trim());
      setFormImages(finalImages);
      setGalleryUrlInput('');
    }

    if (editingProduct) {
      // Edit mode
      const updatedProd = {
        id: editingProduct.id,
        name: formName,
        price: priceNum,
        compareAtPrice: compareAtPriceNum,
        description: formDescription,
        category: formCategory,
        image: formImage || PRESET_IMAGES[0].url,
        colorCode: formColors[0] || '',
        features: formFeatures,
        specs: formSpecs,
        sizes: formSizes,
        inventory: stockNum,
        images: finalImages
      };

      try {
        await productsAPI.updateProduct(editingProduct.id, updatedProd);
        const updated = products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formName,
                sku: formSku,
                category: formCategory,
                price: priceNum,
                compareAtPrice: compareAtPriceNum,
                stock: stockNum,
                status: formStatus,
                image: formImage || PRESET_IMAGES[0].url,
                description: formDescription,
                sizes: formSizes,
                colors: formColors,
                images: finalImages,
                features: formFeatures,
                specs: formSpecs
              }
            : p
        );
        setProducts(updated);
        alert('Product updated successfully.');
        setIsDrawerOpen(false);
      } catch (e: any) {
        alert('Failed to update product: ' + e.message);
      }
    } else {
      // Create mode
      const generatedId = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newProductPayload = {
        id: generatedId,
        name: formName,
        price: priceNum,
        compareAtPrice: compareAtPriceNum,
        description: formDescription,
        category: formCategory,
        image: formImage || PRESET_IMAGES[0].url,
        colorCode: formColors[0] || '',
        features: formFeatures,
        specs: formSpecs,
        sizes: formSizes,
        inventory: stockNum,
        images: finalImages
      };

      try {
        await productsAPI.createProduct(newProductPayload);
        const newProduct: Product = {
          id: generatedId,
          name: formName,
          sku: formSku,
          category: formCategory,
          price: priceNum,
          compareAtPrice: compareAtPriceNum,
          stock: stockNum,
          status: formStatus,
          image: formImage || PRESET_IMAGES[0].url,
          description: formDescription,
          sizes: formSizes,
          colors: formColors,
          images: finalImages,
          features: formFeatures,
          specs: formSpecs
        };
        setProducts([newProduct, ...products]);
        alert('Product created and cataloged in Astitiva.');
        setIsDrawerOpen(false);
      } catch (e: any) {
        alert('Failed to create product: ' + e.message);
      }
    }
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'SKU,Name,Category,Price,Stock,Status',
        ...filteredProducts.map(
          (p) => `"${p.sku}","${p.name}","${p.category}",${p.price},${p.stock},"${p.status}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'luxury_products_inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preset Colors selection
  const COLOR_PALETTE = [
    { name: 'Obsidian Noir', hex: '#000000' },
    { name: 'Pure Platinum', hex: '#E5E7EB' },
    { name: '18k Gold Frame', hex: '#D4AF37' },
    { name: 'Tuscan Tan', hex: '#D2B48C' },
    { name: 'Ocean Navy', hex: '#002D61' },
    { name: 'Deep Emerald', hex: '#047857' },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-black">Product Management</h2>
          <p className="text-[#6E6E73] text-sm mt-1">Oversee your luxury inventory and curated collections.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E7EB] text-black rounded-lg font-semibold hover:bg-[#eeeef0] active:scale-95 transition-all duration-150 cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={openCreateDrawer}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 shadow-xs cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Controls & Filters Bar */}
      <div className="bg-[#FBFBFC] border border-[#E5E7EB] rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden cursor-pointer"
          >
            <option>All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden cursor-pointer"
          >
            <option>Status: All</option>
            <option>Active</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="text-[#6E6E73] text-xs font-medium">
          Showing <span className="text-black font-semibold">{totalItems}</span> Products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#FBFBFC] border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#eeeef0] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isOut = p.stock === 0;
                  const isLow = p.stock <= 2 && p.stock > 0;

                  return (
                    <tr key={p.id} className="hover:bg-white transition-colors duration-150 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-[#eeeef0] rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                            <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={p.image} alt={p.name} />
                          </div>
                          <div>
                            <p className="font-semibold text-black text-sm">{p.name}</p>
                            <p className="text-xs text-[#6E6E73] font-mono mt-0.5">SKU: {p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-[#eeeef0] px-2.5 py-1 rounded text-xs font-semibold text-black">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#141b2b] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-black">
                            Rs. {p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {p.compareAtPrice && p.compareAtPrice > p.price && (
                            <span className="text-xs text-[#6E6E73] line-through font-normal">
                              Rs. {p.compareAtPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${isOut || isLow ? 'text-[#ba1a1a] font-semibold' : 'text-black'}`}>
                            {p.stock}
                          </span>
                          {isOut && (
                            <span className="text-[9px] bg-red-100 text-[#ba1a1a] font-bold px-1.5 py-0.5 rounded">
                              OUT
                            </span>
                          )}
                          {isLow && (
                            <span className="text-[9px] bg-red-100 text-[#ba1a1a] font-bold px-1.5 py-0.5 rounded">
                              LOW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            p.status === 'Active'
                              ? 'bg-[#28CD41]/10 text-[#28CD41]'
                              : 'bg-[#eeeef0] text-[#6E6E73]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'Active' ? 'bg-[#28CD41]' : 'bg-[#6E6E73]'
                            }`}
                          ></span>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditDrawer(p)}
                            className="p-2 hover:bg-[#eeeef0] rounded-full text-[#6E6E73] hover:text-black transition-colors cursor-pointer"
                            title="Edit Luxury Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 hover:bg-red-50 rounded-full text-[#6E6E73] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                            title="Delete Product"
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
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E6E73]">
                    No exquisite products cataloged matching these conditions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex justify-between items-center text-sm text-[#6E6E73]">
          <p>
            Showing {filteredProducts.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
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

      {/* Right Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Product Creation Drawer */}
            <motion.aside
              initial={{ translateX: '100%' }}
              animate={{ translateX: '0%' }}
              exit={{ translateX: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
              className="fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white border-l border-[#E5E7EB] shadow-2xl z-55 overflow-hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 flex justify-between items-center bg-[#FBFBFC] border-b border-[#E5E7EB]">
                <div>
                  <h3 className="font-sans text-xl font-semibold text-black">
                    {editingProduct ? 'Edit Luxury Product' : 'Add New Product'}
                  </h3>
                  <p className="text-[#6E6E73] text-xs mt-1">
                    {editingProduct
                      ? 'Amend luxury craftsmanship specifications.'
                      : 'Create a new entry in the luxury collection.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-[#eeeef0] rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* General Info */}
                <section className="space-y-4">
                  <p className="text-xs font-bold text-[#005cba] uppercase tracking-wider">General Information</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                        placeholder="e.g. Zenith Silver Chronograph"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                        SKU Reference
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formSku}
                        className="w-full bg-[#f3f3f5] border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-gray-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                        Description
                      </label>
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm resize-none"
                        placeholder="Describe the fine luxury materials and high craftsmanship..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                          Category
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm cursor-pointer focus:ring-1 focus:ring-[#005cba] outline-hidden"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                          Status
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs">Draft</span>
                          <button
                            type="button"
                            onClick={() => setFormStatus(formStatus === 'Active' ? 'Draft' : 'Active')}
                            className={`w-11 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                              formStatus === 'Active' ? 'bg-[#28CD41]' : 'bg-[#e2e2e4]'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full bg-white block shadow-xs transition-transform transform ${
                                formStatus === 'Active' ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span className={`text-xs font-semibold ${formStatus === 'Active' ? 'text-[#28CD41]' : ''}`}>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Media Select / Upload */}
                <section className="space-y-4">
                  <p className="text-xs font-bold text-[#005cba] uppercase tracking-wider">Media Assets</p>
                  <p className="text-xs text-[#6E6E73] mb-2">Select a preset high-fidelity design portrait:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {PRESET_IMAGES.map((img) => {
                      const isSelected = formImage === img.url;
                      return (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => setFormImage(img.url)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-[#f3f3f5] ${
                            isSelected ? 'border-[#005cba] scale-95 shadow-sm' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img referrerPolicy="no-referrer" src={img.url} className="w-full h-full object-cover" alt={img.name} />
                          {isSelected && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                              <span className="bg-[#005cba] text-white rounded-full p-1 shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 mt-3 block">
                      Or Custom Image URL
                    </label>
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                      placeholder="https://example.com/luxury-image.jpg"
                    />
                  </div>

                  {/* Additional Photos URL List */}
                  <div className="space-y-3 mt-4">
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider block">
                      Additional Photos (URLs)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        placeholder="https://example.com/gallery-image.jpg"
                        className="flex-grow bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (galleryUrlInput.trim()) {
                              setFormImages([...formImages, galleryUrlInput.trim()]);
                              setGalleryUrlInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (galleryUrlInput.trim()) {
                            setFormImages([...formImages, galleryUrlInput.trim()]);
                            setGalleryUrlInput('');
                          }
                        }}
                        className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {/* List of registered image previews */}
                    <div className="flex flex-wrap gap-2.5 p-2 bg-[#FBFBFC] border border-[#E5E7EB] rounded-lg min-h-[50px]">
                      {formImages.map((url, index) => (
                        <div key={index} className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200 group animate-fadeIn">
                          <img referrerPolicy="no-referrer" src={url} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormImages(formImages.filter((_, i) => i !== index))}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {formImages.length === 0 && (
                        <span className="text-xs text-[#6E6E73]/50 italic self-center">No additional photos added.</span>
                      )}
                    </div>
                  </div>
                </section>

                {/* Pricing & Stock */}
                <section className="space-y-4">
                  <p className="text-xs font-bold text-[#005cba] uppercase tracking-wider">Pricing & Inventory</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                        Base Price (Rs) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                        Compare At Price (Rs)
                      </label>
                      <input
                        type="number"
                        value={formCompareAtPrice}
                        onChange={(e) => setFormCompareAtPrice(e.target.value)}
                        className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                        placeholder="e.g. 2499"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                        Stock Count
                      </label>
                      <input
                        type="number"
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </section>

                {/* Specifications & Unique Features Section */}
                <section className="space-y-4">
                  <p className="text-xs font-bold text-black uppercase tracking-wider font-mono">Specifications & Features</p>
                  
                  {/* Unique Features */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider block font-mono">
                      Unique Features
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="e.g. 300GSM ultra-heavyweight organic cotton"
                        className="flex-grow bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (featureInput.trim()) {
                              setFormFeatures([...formFeatures, featureInput.trim()]);
                              setFeatureInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (featureInput.trim()) {
                            setFormFeatures([...formFeatures, featureInput.trim()]);
                            setFeatureInput('');
                          }
                        }}
                        className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {/* List of features */}
                    <div className="flex flex-wrap gap-2 p-2.5 bg-[#FBFBFC] border border-[#E5E7EB] rounded-lg min-h-[40px]">
                      {formFeatures.map((feat, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-none text-xs font-mono font-medium">
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => setFormFeatures(formFeatures.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                            title="Remove feature"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {formFeatures.length === 0 && (
                        <span className="text-xs text-[#6E6E73]/50 italic self-center">No unique features added yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider block font-mono">
                      Specifications
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={specInput}
                        onChange={(e) => setSpecInput(e.target.value)}
                        placeholder="e.g. Material: 100% Organic Cotton"
                        className="flex-grow bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (specInput.trim()) {
                              setFormSpecs([...formSpecs, specInput.trim()]);
                              setSpecInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (specInput.trim()) {
                            setFormSpecs([...formSpecs, specInput.trim()]);
                            setSpecInput('');
                          }
                        }}
                        className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {/* List of specs */}
                    <div className="flex flex-wrap gap-2 p-2.5 bg-[#FBFBFC] border border-[#E5E7EB] rounded-lg min-h-[40px]">
                      {formSpecs.map((spec, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-none text-xs font-mono font-medium">
                          <span>{spec}</span>
                          <button
                            type="button"
                            onClick={() => setFormSpecs(formSpecs.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                            title="Remove spec"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {formSpecs.length === 0 && (
                        <span className="text-xs text-[#6E6E73]/50 italic self-center">No specifications added yet.</span>
                      )}
                    </div>
                  </div>
                </section>

                {/* Variants Customization */}
                <section className="space-y-4">
                  <p className="text-xs font-bold text-black uppercase tracking-wider font-mono">Variants</p>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2 block font-mono">
                      Sizes Included
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL'].map((sz) => {
                        const included = formSizes.includes(sz);
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => {
                              if (included) {
                                setFormSizes(formSizes.filter((s) => s !== sz));
                              } else {
                                setFormSizes([...formSizes, sz]);
                              }
                            }}
                            className={`px-4 py-2 border-2 border-black rounded-none text-xs font-mono font-bold tracking-widest cursor-pointer transition-all shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                              included
                                ? 'bg-[#e2e8dd] text-black font-extrabold shadow-[2px_2px_0px_#000]'
                                : 'bg-white text-[#141b2b] hover:bg-neutral-50 shadow-[2px_2px_0px_#000]'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2 block">
                      Colors Included
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_PALETTE.map((col) => {
                        const included = formColors.includes(col.hex);
                        return (
                          <button
                            type="button"
                            key={col.hex}
                            onClick={() => {
                              if (included) {
                                setFormColors(formColors.filter((c) => c !== col.hex));
                              } else {
                                setFormColors([...formColors, col.hex]);
                              }
                            }}
                            className={`w-8 h-8 rounded-full border relative cursor-pointer ring-offset-2 ${
                              included ? 'ring-2 ring-[#005cba]' : 'hover:scale-105 border-gray-300'
                            }`}
                            style={{ backgroundColor: col.hex }}
                            title={col.name}
                          >
                            {included && (
                              <Check className="w-4 h-4 text-white mx-auto stroke-[3] drop-shadow-xs" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </form>

              {/* Drawer Footer */}
              <div className="p-6 bg-[#FBFBFC] border-t border-[#E5E7EB] flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 py-3 border border-[#E5E7EB] rounded-lg font-semibold hover:bg-[#eeeef0] transition-colors cursor-pointer text-sm"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer text-sm"
                >
                  Save Product
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
