import bcrypt from 'bcryptjs';
import { supabase } from '../config/database';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export const createUser = async (email: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('createUser error:', error.message, error.code);
      throw error;
    }
    return data;
  } catch (error: any) {
    console.error('createUser catch:', error.message, error.code);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    // These error codes mean the table doesn't exist or user wasn't found
    if (error && (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('Could not find the table'))) {
      return null;
    }
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('getUserByEmail error:', error.message, error.code);
    // If it's a table not found error, return null instead of throwing
    if (error.message?.includes('Could not find the table') || error.code?.includes('PGRST')) {
      return null;
    }
    throw error;
  }
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        address: updates.address,
        city: updates.city,
        country: updates.country,
        postal_code: updates.postalCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
