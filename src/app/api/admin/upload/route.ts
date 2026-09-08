import { verifyAdminAuth } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isImageKitConfigured, uploadToImageKit } from '@/lib/imagekit';
import { uploadImageToStorage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized: Please login as admin' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, GIF' },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 15MB allowed.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Primary: If ImageKit is configured, upload directly to ImageKit cloud CDN!
    if (isImageKitConfigured) {
      try {
        const ikResult = await uploadToImageKit(buffer, file.name);
        if (ikResult?.url) {
          return NextResponse.json({
            url: ikResult.url,
            fileId: ikResult.fileId,
            source: 'imagekit',
            message: 'Image uploaded to ImageKit Cloud CDN successfully!',
          });
        }
      } catch (ikErr) {
        console.error('[Upload] ImageKit upload error:', ikErr);
      }
    }

    // 2. Secondary Cloud Fallback: Upload to Supabase Storage if configured
    try {
      const supabaseUrl = await uploadImageToStorage(buffer, file.name, file.type);
      if (supabaseUrl) {
        return NextResponse.json({
          url: supabaseUrl,
          source: 'supabase',
          message: 'Image uploaded to Supabase Storage successfully!',
        });
      }
    } catch (sbErr) {
      console.error('[Upload] Supabase Storage upload error:', sbErr);
    }

    // 3. Development local filesystem fallback (Not supported on Vercel read-only filesystem)
    if (process.env.NODE_ENV !== 'production') {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(file.name) || '.jpg';
        const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '') || 'image';
        const filename = `${Date.now()}_${cleanName}${ext}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, buffer);

        return NextResponse.json({
          url: `/uploads/${filename}`,
          source: 'local',
          message: 'Uploaded locally to server',
        });
      } catch (localErr) {
        console.error('[Upload] Local filesystem write error:', localErr);
      }
    }

    // If all cloud providers failed or are unconfigured on Vercel
    return NextResponse.json(
      {
        error:
          'ImageKit keys missing in Vercel. Please add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT to Vercel Environment Variables.',
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('[Upload] Fatal Error:', error);
    return NextResponse.json({ error: 'Upload failed due to server error' }, { status: 500 });
  }
}
