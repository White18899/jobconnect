import { Env } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';

export async function putR2Object(
  bucket: R2Bucket,
  key: string,
  data: ArrayBuffer | Uint8Array,
  contentType: string,
  customMetadata: Record<string, string> = {}
): Promise<R2Object> {
  return await bucket.put(key, data, {
    httpMetadata: { contentType },
    customMetadata,
  });
}

export async function getR2Object(
  bucket: R2Bucket,
  key: string
): Promise<R2ObjectBody | null> {
  return await bucket.get(key);
}

export function generateStorageKey(
  category: 'workers' | 'employers' | 'shops' | 'payments' | 'docs',
  userId: string,
  filename: string
): string {
  const ext = filename.split('.').pop() || 'bin';
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now();
  return `${category}/${userId}_${timestamp}_${randomSuffix}.${ext}`;
}
