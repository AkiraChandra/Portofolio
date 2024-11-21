// src/utils/supabase-helpers.ts

import { supabase } from '@/lib/supabase';

export const getProjectImages = async (projectId: string) => {
  try {
    const { data: images, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Transform the images data
    return images.map(img => ({
      ...img,
      url: ensureValidImageUrl(img.url),
    }));
  } catch (error) {
    console.error('Error fetching project images:', error);
    return [];
  }
};

const ensureValidImageUrl = (url: string): string => {
  try {
    // Check if URL is already a valid Supabase storage URL
    if (url.includes('storage/v1/object/public')) {
      return url;
    }

    // If it's just a storage path, convert to public URL
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(url);

    return data?.publicUrl || url;
  } catch {
    // Return original URL if transformation fails
    return url;
  }
};