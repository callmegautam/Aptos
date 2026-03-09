import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

type SavePublicFileOptions = {
  file: File;
  /**
   * Subdirectory under `public/`, e.g. `resumes` or `avatars`.
   * Must be a relative path without `..`.
   */
  publicSubdir: string;
};

function sanitizeSegment(input: string) {
  const cleaned = input.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
  return cleaned.length ? cleaned : 'file';
}

function assertSafePublicSubdir(publicSubdir: string) {
  if (!publicSubdir || path.isAbsolute(publicSubdir) || publicSubdir.includes('..')) {
    throw new Error('Invalid publicSubdir');
  }
}

export async function savePublicFile({ file, publicSubdir }: SavePublicFileOptions): Promise<string> {
  assertSafePublicSubdir(publicSubdir);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalName = path.basename(file.name || 'file');
  const ext = path.extname(originalName);
  const base = sanitizeSegment(path.basename(originalName, ext)).slice(0, 48);
  const rand = crypto.randomBytes(6).toString('hex');
  const fileName = `${Date.now()}-${rand}-${base}${ext}`;

  const dirOnDisk = path.join(process.cwd(), 'public', publicSubdir);
  const fileOnDisk = path.join(dirOnDisk, fileName);

  await fs.mkdir(dirOnDisk, { recursive: true });
  await fs.writeFile(fileOnDisk, buffer);

  return `/${publicSubdir}/${fileName}`;
}

export async function deletePublicFileByUrl(url: string): Promise<void> {
  if (!url || typeof url !== 'string' || !url.startsWith('/')) return;

  const publicRoot = path.resolve(process.cwd(), 'public');
  const diskPath = path.resolve(publicRoot, url.replace(/^\/+/, ''));

  // Prevent path traversal outside `public/`.
  if (!diskPath.startsWith(publicRoot + path.sep) && diskPath !== publicRoot) return;

  try {
    await fs.unlink(diskPath);
  } catch (err) {
    // Best-effort cleanup: ignore missing/unremovable file
    const code =
      err && typeof err === 'object' && 'code' in err ? (err as { code?: unknown }).code : null;
    if (code !== 'ENOENT') {
      console.warn('Failed to delete public file:', err);
    }
  }
}
