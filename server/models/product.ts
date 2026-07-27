import { supabase } from '../config/database';

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  colorCode: string;
  category: string;
  image: string;
  features: string[];
  specs: string[];
  sizes: string[];
  inventory: number;
  images: string[];
}

export const getAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (product: Product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProductInventory = async (productId: string, quantity: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        inventory: quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
