import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabaseImage = (path: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        
        // Get public URL for the image
        const { data } = supabase.storage
          .from('project-images')
          .getPublicUrl(path);

        if (data?.publicUrl) {
          // Verify the image is accessible
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setImageUrl(data.publicUrl);
          } else {
            throw new Error('Image not accessible');
          }
        } else {
          throw new Error('No public URL available');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load image'));
        // Set fallback image URL here if needed
        // setImageUrl('/fallback-image.png');
      } finally {
        setLoading(false);
      }
    };

    if (path) {
      fetchImage();
    }
  }, [path]);

  return { imageUrl, error, loading };
};