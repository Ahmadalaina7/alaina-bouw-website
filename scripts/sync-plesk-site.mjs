import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDirectory = path.join(
  workspaceRoot,
  'artifacts',
  'alaina-bouw-website',
  'dist',
  'public',
);

const entries = await readdir(buildDirectory);

for (const entry of entries) {
  const source = path.join(buildDirectory, entry);
  const destination = path.join(workspaceRoot, entry);
  const isGeneratedDirectory = entry === 'assets' || entry === 'project-photos';

  if (isGeneratedDirectory) {
    await rm(destination, { recursive: true, force: true });
  } else {
    await rm(destination, { force: true });
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

console.log(`Synced ${entries.length} built website entries to the repository root.`);
