import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      stdio: 'inherit',
      env: process.env,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Script failed (${path.basename(scriptPath)}): exit ${code}`));
    });
  });
}

async function main() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  await fs.mkdir(publicDir, { recursive: true });

  const targets = [
    { name: 'sitemap.xml', generator: path.join(rootDir, 'scripts', 'generate-sitemap.mjs') },
    { name: 'robots.txt', generator: path.join(rootDir, 'scripts', 'generate-robots.mjs') },
  ];

  const missing = [];
  for (const t of targets) {
    const targetPath = path.join(publicDir, t.name);
    const exists = await fileExists(targetPath);
    if (!exists) missing.push(t);
  }

  if (missing.length === 0) {
    console.log('SEO files already present: public/sitemap.xml and public/robots.txt');
    return;
  }

  for (const t of missing) {
    console.log(`Missing public/${t.name} -> generating...`);
    await runNodeScript(t.generator);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

