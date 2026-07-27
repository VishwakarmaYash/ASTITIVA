import { supabase } from '../config/database';

export interface Banner {
  id?: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

// Convert database banner row to model Banner interface
const mapRowToBanner = (row: any): Banner => ({
  id: row.id,
  title: row.title,
  description: row.description,
  imageUrl: row.image_url,
  buttonText: row.button_text,
  buttonLink: row.button_link,
  location: row.location,
  startDate: row.start_date,
  endDate: row.end_date,
  isActive: row.is_active,
  priority: Number(row.priority || 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getActiveBanners = async (location: string): Promise<Banner[]> => {
  try {
    const nowIso = new Date().toISOString();
    
    // Fetch active banners for specific location
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('location', location)
      .eq('is_active', true)
      .order('priority', { ascending: false }); // Show highest priority first

    if (error) throw error;
    if (!data) return [];

    // Client-side filtering for start_date & end_date to keep it robust
    return data
      .map(mapRowToBanner)
      .filter((banner) => {
        const startValid = !banner.startDate || new Date(banner.startDate) <= new Date(nowIso);
        const endValid = !banner.endDate || new Date(banner.endDate) >= new Date(nowIso);
        return startValid && endValid;
      });
  } catch (error) {
    console.error('getActiveBanners error:', error);
    throw error;
  }
};

export const getAllBanners = async (): Promise<Banner[]> => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('priority', { ascending: false }); // Highest priority first

    if (error) throw error;
    return (data || []).map(mapRowToBanner);
  } catch (error) {
    console.error('getAllBanners error:', error);
    throw error;
  }
};

export const createBanner = async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
  try {
    const dbPayload = {
      title: banner.title,
      description: banner.description,
      image_url: banner.imageUrl,
      button_text: banner.buttonText,
      button_link: banner.buttonLink,
      location: banner.location,
      start_date: banner.startDate || null,
      end_date: banner.endDate || null,
      is_active: banner.isActive,
      priority: banner.priority,
    };

    const { data, error } = await supabase
      .from('banners')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw error;
    return mapRowToBanner(data);
  } catch (error) {
    console.error('createBanner error:', error);
    throw error;
  }
};

export const updateBanner = async (id: string, banner: Partial<Banner>): Promise<Banner> => {
  try {
    const dbPayload: any = {};
    if (banner.title !== undefined) dbPayload.title = banner.title;
    if (banner.description !== undefined) dbPayload.description = banner.description;
    if (banner.imageUrl !== undefined) dbPayload.image_url = banner.imageUrl;
    if (banner.buttonText !== undefined) dbPayload.button_text = banner.buttonText;
    if (banner.buttonLink !== undefined) dbPayload.button_link = banner.buttonLink;
    if (banner.location !== undefined) dbPayload.location = banner.location;
    if (banner.startDate !== undefined) dbPayload.start_date = banner.startDate || null;
    if (banner.endDate !== undefined) dbPayload.end_date = banner.endDate || null;
    if (banner.isActive !== undefined) dbPayload.is_active = banner.isActive;
    if (banner.priority !== undefined) dbPayload.priority = banner.priority;
    
    dbPayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('banners')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapRowToBanner(data);
  } catch (error) {
    console.error('updateBanner error:', error);
    throw error;
  }
};

export const deleteBanner = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('deleteBanner error:', error);
    throw error;
  }
};
