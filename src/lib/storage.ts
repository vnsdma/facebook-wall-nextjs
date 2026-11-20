import { supabase, isSupabaseConfigured } from './supabase';

export const STORAGE_BUCKET = 'wall-photos';
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export interface UploadResult {
  url: string | null;
  error: string | null;
  isFallback?: boolean;
}

/**
 * Validates whether the given file is an acceptable image.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPG, PNG, GIF, or WebP).',
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size exceeds 5 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }
  return { valid: true };
}

/**
 * Helper to convert a file to a Base64 data URL for offline/fallback storage.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Supabase Storage bucket 'wall-photos'.
 * If the bucket doesn't exist or Supabase is not configured, returns
 * a fallback Base64 data URL so the user experience is uninterrupted.
 */
export async function uploadPostPhoto(file: File): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { url: null, error: validation.error || 'Invalid file' };
  }

  // If Supabase is not configured, fallback to Base64
  if (!isSupabaseConfigured || !supabase) {
    try {
      const dataUrl = await fileToDataUrl(file);
      return { url: dataUrl, error: null, isFallback: true };
    } catch {
      return { url: null, error: 'Failed to read image locally.' };
    }
  }

  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `wall_${Date.now()}_${cleanName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Supabase storage upload failed, falling back to local data URL:', error.message);
      // Fallback to data URL so the post still succeeds
      const fallbackUrl = await fileToDataUrl(file);
      return {
        url: fallbackUrl,
        error: `Supabase Storage Notice: ${error.message} (Stored locally as fallback)`,
        isFallback: true,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      error: null,
      isFallback: false,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    console.warn('Storage exception, falling back:', message);
    try {
      const fallbackUrl = await fileToDataUrl(file);
      return { url: fallbackUrl, error: message, isFallback: true };
    } catch {
      return { url: null, error: message };
    }
  }
}
