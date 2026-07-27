import React, { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Calendar, Layout, ToggleLeft, ToggleRight, ArrowUpDown, Image as ImageIcon } from 'lucide-react';
import { bannersAPI } from '../../api/client';
import { Banner } from '../types';

const LOCATIONS = ['homepage', 'category_page', 'promo_banner'];

const PRESET_BANNER_IMAGES = [
  { name: 'Astitva Rider', url: '/images/astitva_rider.jpg' },
  { name: 'Back Graphic Edit', url: '/images/collusion_collab.png' },
  { name: 'Minimalist White Tee', url: '/images/astitva_white_tee.png' },
  { name: 'Hero Banner', url: '/images/astitva_hero_banner.jpg' },
];

export default function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formButtonText, setFormButtonText] = useState('Shop Now');
  const [formButtonLink, setFormButtonLink] = useState('/');
  const [formLocation, setFormLocation] = useState('homepage');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formPriority, setFormPriority] = useState('0');

  // Filter States
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannersAPI.getAllAdmin();
      setBanners(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load banners:', err);
      setError('Failed to load banners. Please verify API server status.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateDrawer = () => {
    setEditingBanner(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl(PRESET_BANNER_IMAGES[0].url);
    setFormButtonText('Shop Now');
    setFormButtonLink('/');
    setFormLocation('homepage');
    setFormStartDate('');
    setFormEndDate('');
    setFormIsActive(true);
    setFormPriority('0');
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (banner: Banner) => {
    setEditingBanner(banner);
    setFormTitle(banner.title || '');
    setFormDescription(banner.description || '');
    setFormImageUrl(banner.imageUrl);
    setFormButtonText(banner.buttonText);
    setFormButtonLink(banner.buttonLink);
    setFormLocation(banner.location);
    // Format timestamp string to input date local string format YYYY-MM-DDThh:mm
    setFormStartDate(banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '');
    setFormEndDate(banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '');
    setFormIsActive(banner.isActive);
    setFormPriority(banner.priority.toString());
    setIsDrawerOpen(true);
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Are you sure you want to remove this campaign banner from active rotation?')) {
      try {
        await bannersAPI.deleteBanner(id);
        setBanners(banners.filter((b) => b.id !== id));
      } catch (err: any) {
        alert('Failed to delete banner: ' + err.message);
      }
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      const updatedStatus = !banner.isActive;
      await bannersAPI.updateBanner(banner.id!, { isActive: updatedStatus });
      setBanners(
        banners.map((b) => (b.id === banner.id ? { ...b, isActive: updatedStatus } : b))
      );
    } catch (err: any) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  const handleSaveBanner = async (e: FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      alert('Please provide a Banner Image URL.');
      return;
    }

    const payload = {
      title: formTitle.trim() || null,
      description: formDescription.trim() || null,
      imageUrl: formImageUrl,
      buttonText: formButtonText.trim() || 'Shop Now',
      buttonLink: formButtonLink.trim() || '/',
      location: formLocation,
      startDate: formStartDate || null,
      endDate: formEndDate || null,
      isActive: formIsActive,
      priority: parseInt(formPriority) || 0,
    };

    try {
      if (editingBanner) {
        // Edit mode
        const updated = await bannersAPI.updateBanner(editingBanner.id!, payload);
        setBanners(banners.map((b) => (b.id === editingBanner.id ? updated : b)));
        alert('Banner configuration updated successfully.');
      } else {
        // Create mode
        const created = await bannersAPI.createBanner(payload);
        setBanners([created, ...banners]);
        alert('New campaign banner created.');
      }
      setIsDrawerOpen(false);
    } catch (err: any) {
      alert('Failed to save banner: ' + err.message);
    }
  };

  const filteredBanners = banners.filter((b) => {
    return selectedLocation === 'All Locations' || b.location === selectedLocation;
  });

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-black">Campaign Banners</h2>
          <p className="text-[#6E6E73] text-sm mt-1">Manage scheduled marketing banners and priority showcases.</p>
        </div>
        <button
          onClick={openCreateDrawer}
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 shadow-xs cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Banner
        </button>
      </div>

      {/* Controls & Filters Bar */}
      <div className="bg-[#FBFBFC] border border-[#E5E7EB] rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex gap-3 items-center">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#005cba] outline-hidden cursor-pointer"
          >
            <option>All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-[#6E6E73] font-medium font-sans">
          Total Banners: {filteredBanners.length}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#6E6E73] font-sans">Loading campaign schedule...</div>
      ) : filteredBanners.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center shadow-xs">
          <Layout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-1">No campaigns active</h3>
          <p className="text-xs text-[#6E6E73] max-w-sm mx-auto mb-6">
            Create a custom banner with display priorities and active dates to engage your visitors.
          </p>
          <button
            onClick={openCreateDrawer}
            className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Create Your First Banner
          </button>
        </div>
      ) : (
        /* Banners Table */
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm text-[#141b2b]">
              <thead>
                <tr className="bg-[#F5F5F7] border-b border-[#E5E7EB]">
                  <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Preview</th>
                  <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Placement</th>
                  <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[#6E6E73] text-[11px] font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-[#FBFBFC] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden border border-[#E5E7EB]">
                        <img
                          referrerPolicy="no-referrer"
                          src={banner.imageUrl}
                          alt={banner.title || 'Banner'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <h4 className="font-semibold text-black truncate">{banner.title || 'Untitled Banner'}</h4>
                        <p className="text-xs text-[#6E6E73] line-clamp-1 mt-0.5">{banner.description || 'No description provided.'}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 text-[10px] rounded font-mono">
                          Link: {banner.buttonLink} ({banner.buttonText})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                        {banner.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-black">
                      Priority {banner.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#6E6E73]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Start: {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'Immediate'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>End: {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'Forever'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(banner)}
                        className="flex items-center gap-1 text-xs font-semibold cursor-pointer outline-hidden"
                      >
                        {banner.isActive ? (
                          <div className="flex items-center gap-1 text-green-700">
                            <ToggleRight className="w-6 h-6 fill-green-100" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400">
                            <ToggleLeft className="w-6 h-6" />
                            <span>Disabled</span>
                          </div>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditDrawer(banner)}
                          className="p-1.5 text-[#005cba] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Banner"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id!)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          {/* Overlay backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Drawer sheet container */}
          <div className="relative w-full max-w-lg h-full bg-[#F5F5F7] border-l border-[#E5E7EB] shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 bg-white border-b border-[#E5E7EB] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-black">
                  {editingBanner ? 'Edit Banner Configuration' : 'Create Campaign Banner'}
                </h3>
                <p className="text-xs text-[#6E6E73] mt-1">Configure layout, priority, and date schedules.</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-black font-semibold text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Scrollable form */}
            <form onSubmit={handleSaveBanner} className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Image config */}
              <section className="space-y-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-2xs">
                <p className="text-[10px] font-bold text-[#005cba] uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Banner Media
                </p>
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Custom Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                      placeholder="https://example.com/banner-image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2.5 block">
                      Quick Preset Images
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {PRESET_BANNER_IMAGES.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setFormImageUrl(preset.url)}
                          className={`flex items-center gap-2 p-2 bg-gray-50 border rounded-lg text-left text-xs transition-all ${
                            formImageUrl === preset.url
                              ? 'border-black bg-black/5 font-semibold text-black'
                              : 'border-[#E5E7EB] text-[#575f65] hover:bg-gray-100'
                          }`}
                        >
                          <div className="w-10 h-7 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img referrerPolicy="no-referrer" src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Text content */}
              <section className="space-y-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-2xs">
                <p className="text-[10px] font-bold text-[#005cba] uppercase tracking-widest">Text Content</p>
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                      placeholder="e.g. ASTITVA WINTER DROP"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm resize-none"
                      placeholder="Enter a brief marketing description for this campaign..."
                    />
                  </div>
                </div>
              </section>

              {/* Action Button & Location */}
              <section className="space-y-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-2xs">
                <p className="text-[10px] font-bold text-[#005cba] uppercase tracking-widest flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5" />
                  Button & Placement
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Button Text
                    </label>
                    <input
                      type="text"
                      required
                      value={formButtonText}
                      onChange={(e) => setFormButtonText(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                      placeholder="Shop Now"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Button Link
                    </label>
                    <input
                      type="text"
                      required
                      value={formButtonLink}
                      onChange={(e) => setFormButtonLink(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                      placeholder="/"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Placement Location
                    </label>
                    <select
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm cursor-pointer"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Priority & Scheduling */}
              <section className="space-y-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-2xs">
                <p className="text-[10px] font-bold text-[#005cba] uppercase tracking-widest flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Priority & Schedule
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Display Priority (Integer)
                    </label>
                    <input
                      type="number"
                      required
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                      placeholder="0"
                    />
                    <span className="text-[10px] text-[#6E6E73] mt-1 block">Highest priority displays first.</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-2 block">
                      Active Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormIsActive(!formIsActive)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-black text-left cursor-pointer outline-hidden"
                    >
                      {formIsActive ? (
                        <>
                          <ToggleRight className="w-7 h-7 text-green-600 fill-green-50" />
                          <span>Active / Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-7 h-7 text-gray-400" />
                          <span>Disabled / Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      Start Date & Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mb-1 block">
                      End Date & Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-[#005cba] outline-hidden text-sm"
                    />
                  </div>
                </div>
              </section>
            </form>

            {/* Footer actions */}
            <div className="p-6 bg-white border-t border-[#E5E7EB] flex items-center gap-3">
              <button
                type="submit"
                onClick={handleSaveBanner}
                className="flex-grow py-3 bg-black text-white rounded-lg font-semibold hover:opacity-90 active:scale-98 transition-all text-sm cursor-pointer text-center"
              >
                {editingBanner ? 'Save Configuration' : 'Deploy Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
