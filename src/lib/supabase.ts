import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key (for admin operations)
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.warn('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Storage uploads will not work.');
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// Public Supabase client (read-only, for client components if needed)
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

// Upload image to Supabase Storage and return public URL
export async function uploadImageToStorage(
  file: Buffer,
  fileName: string,
  contentType: string,
  bucket: string = 'spot-images'
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  // Generate unique file path
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}-${safeName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error('[Supabase Storage] Upload error:', error.message);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// Delete image from Supabase Storage
export async function deleteImageFromStorage(
  imageUrl: string,
  bucket: string = 'spot-images'
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  // Extract file path from the public URL
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length < 2) return false;

    const filePath = pathParts[1];
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('[Supabase Storage] Delete error:', error.message);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
