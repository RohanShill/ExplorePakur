import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isImageKitConfigured, uploadToImageKit } from '@/lib/imagekit';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cookie = request.cookies.get('admin_token');
  const token = authHeader?.replace('Bearer ', '') || cookie?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'explorepakur2024';

  if (token !== adminPassword) {
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

    // 1. If ImageKit is configured in environment, upload directly to ImageKit cloud CDN!
    if (isImageKitConfigured) {
      const ikResult = await uploadToImageKit(buffer, file.name);
      if (ikResult) {
        return NextResponse.json({
          url: ikResult.url,
          fileId: ikResult.fileId,
          source: 'imagekit',
          message: 'Image uploaded to ImageKit Cloud CDN successfully!',
        });
      }
    }

    // 2. Fallback: Save to local filesystem in /public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || '.jpg';
    const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '') || 'image';
    const filename = `${Date.now()}_${cleanName}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      url: publicUrl,
      source: 'local',
      message: 'Uploaded locally to server (Add ImageKit keys to .env.local to use ImageKit CDN)',
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
