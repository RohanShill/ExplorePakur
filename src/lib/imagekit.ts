import ImageKit from 'imagekit';

export const isImageKitConfigured = Boolean(
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
);

let imagekitClient: ImageKit | null = null;

export function getImageKit(): ImageKit | null {
  if (!isImageKitConfigured) return null;

  if (!imagekitClient) {
    imagekitClient = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  }

  return imagekitClient;
}

export async function uploadToImageKit(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = '/explore-pakur'
): Promise<{ url: string; fileId: string } | null> {
  const ik = getImageKit();
  if (!ik) return null;

  try {
    const result = await ik.upload({
      file: fileBuffer,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return null;
  }
}
