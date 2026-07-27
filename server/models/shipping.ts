import { supabase } from '../config/database';

export interface SystemConfig {
  baseShippingFee: number;
  freeShippingThreshold: number;
  announcementText: string;
  announcementBgColor: string;
  announcementTextColor: string;
  announcementIsActive: boolean;
  popupTitle: string;
  popupDescription: string;
  popupImageUrl: string;
  popupButtonText: string;
  popupIsActive: boolean;
  popupDiscountCode: string;
  couponTitle: string;
  couponSubtitle: string;
  couponCode: string;
  couponDescription: string;
  couponIsActive: boolean;
}

export const getShippingConfig = async (): Promise<SystemConfig> => {
  try {
    const { data, error } = await supabase
      .from('shipping_configurations')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        const defaultConfig = {
          id: 'default',
          base_shipping_fee: 50.00,
          free_shipping_threshold: 1000.00,
          announcement_text: 'FREE SHIPPING ON ORDERS OVER Rs. 1000',
          announcement_bg_color: '#ccff00',
          announcement_text_color: '#000000',
          announcement_is_active: true,
          popup_title: 'EXCLUSIVE VIP ACCESS',
          popup_description: 'Join the ASTITVA mailing list for priority drop notifications and 10% off.',
          popup_image_url: '/images/astitva_white_tee.png',
          popup_button_text: 'JOIN CLUB',
          popup_is_active: true,
          popup_discount_code: 'VAULT10',
          coupon_title: 'Get 10% Off',
          coupon_subtitle: 'Up To Rs. 100 Off*',
          coupon_code: 'ASTITIVA10',
          coupon_description: 'On Your First Order | T&C Apply',
          coupon_is_active: true
        };
        const { data: inserted, error: insertError } = await supabase
          .from('shipping_configurations')
          .insert([defaultConfig])
          .select()
          .single();

        if (insertError) throw insertError;
        return mapDatabaseToConfig(inserted);
      }
      throw error;
    }

    return mapDatabaseToConfig(data);
  } catch (error) {
    console.error('getShippingConfig error, returning fallback:', error);
    return {
      baseShippingFee: 50.00,
      freeShippingThreshold: 1000.00,
      announcementText: 'FREE SHIPPING ON ORDERS OVER Rs. 1000',
      announcementBgColor: '#ccff00',
      announcementTextColor: '#000000',
      announcementIsActive: true,
      popupTitle: 'EXCLUSIVE VIP ACCESS',
      popupDescription: 'Join the ASTITVA mailing list for priority drop notifications and 10% off.',
      popupImageUrl: '/images/astitva_white_tee.png',
      popupButtonText: 'JOIN CLUB',
      popupIsActive: true,
      popupDiscountCode: 'VAULT10',
      couponTitle: 'Get 10% Off',
      couponSubtitle: 'Up To Rs. 100 Off*',
      couponCode: 'ASTITIVA10',
      couponDescription: 'On Your First Order | T&C Apply',
      couponIsActive: true
    };
  }
};

const mapDatabaseToConfig = (data: any): SystemConfig => {
  return {
    baseShippingFee: Number(data.base_shipping_fee),
    freeShippingThreshold: Number(data.free_shipping_threshold),
    announcementText: data.announcement_text ?? 'FREE SHIPPING ON ORDERS OVER Rs. 1000',
    announcementBgColor: data.announcement_bg_color ?? '#ccff00',
    announcementTextColor: data.announcement_text_color ?? '#000000',
    announcementIsActive: data.announcement_is_active ?? true,
    popupTitle: data.popup_title ?? 'EXCLUSIVE VIP ACCESS',
    popupDescription: data.popup_description ?? 'Join the ASTITVA mailing list for priority drop notifications and 10% off.',
    popupImageUrl: data.popup_image_url ?? '/images/astitva_white_tee.png',
    popupButtonText: data.popup_button_text ?? 'JOIN CLUB',
    popupIsActive: data.popup_is_active ?? true,
    popupDiscountCode: data.popup_discount_code ?? 'VAULT10',
    couponTitle: data.coupon_title ?? 'Get 10% Off',
    couponSubtitle: data.coupon_subtitle ?? 'Up To Rs. 100 Off*',
    couponCode: data.coupon_code ?? 'ASTITIVA10',
    couponDescription: data.coupon_description ?? 'On Your First Order | T&C Apply',
    couponIsActive: data.coupon_is_active ?? true
  };
};

export const updateShippingConfig = async (
  config: Partial<SystemConfig>
): Promise<SystemConfig> => {
  try {
    const payload: any = {
      updated_at: new Date().toISOString()
    };

    if (config.baseShippingFee !== undefined) payload.base_shipping_fee = Number(config.baseShippingFee);
    if (config.freeShippingThreshold !== undefined) payload.free_shipping_threshold = Number(config.freeShippingThreshold);
    if (config.announcementText !== undefined) payload.announcement_text = config.announcementText;
    if (config.announcementBgColor !== undefined) payload.announcement_bg_color = config.announcementBgColor;
    if (config.announcementTextColor !== undefined) payload.announcement_text_color = config.announcementTextColor;
    if (config.announcementIsActive !== undefined) payload.announcement_is_active = config.announcementIsActive;
    if (config.popupTitle !== undefined) payload.popup_title = config.popupTitle;
    if (config.popupDescription !== undefined) payload.popup_description = config.popupDescription;
    if (config.popupImageUrl !== undefined) payload.popup_image_url = config.popupImageUrl;
    if (config.popupButtonText !== undefined) payload.popup_button_text = config.popupButtonText;
    if (config.popupIsActive !== undefined) payload.popup_is_active = config.popupIsActive;
    if (config.popupDiscountCode !== undefined) payload.popup_discount_code = config.popupDiscountCode;
    if (config.couponTitle !== undefined) payload.coupon_title = config.couponTitle;
    if (config.couponSubtitle !== undefined) payload.coupon_subtitle = config.couponSubtitle;
    if (config.couponCode !== undefined) payload.coupon_code = config.couponCode;
    if (config.couponDescription !== undefined) payload.coupon_description = config.couponDescription;
    if (config.couponIsActive !== undefined) payload.coupon_is_active = config.couponIsActive;

    const { data, error } = await supabase
      .from('shipping_configurations')
      .update(payload)
      .eq('id', 'default')
      .select()
      .single();

    if (error) throw error;
    return mapDatabaseToConfig(data);
  } catch (error) {
    console.error('updateShippingConfig error:', error);
    throw error;
  }
};
