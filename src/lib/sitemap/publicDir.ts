import { promises as fs } from 'fs';
import path from 'path';

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve the directory that is actually serving `public/` in production.
 *
 * - In normal `next start`, it is usually `${process.cwd()}/public`.
 * - In standalone deployments, the server may run from `.next/standalone`,
 *   so we also probe parent directories.
 */
export async function resolvePublicDir(): Promise<string> {
  const cwd = process.cwd();

  const candidates = [
    path.join(cwd, 'public'),
    path.join(cwd, '..', 'public'),
    path.join(cwd, '..', '..', 'public'),
    path.join(cwd, '..', '..', '..', 'public'),
  ];

  for (const candidate of candidates) {
    if (await exists(candidate)) {
      return candidate;
    }
  }

  return path.join(cwd, 'public');
}
