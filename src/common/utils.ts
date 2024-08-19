import { cache } from '@overextended/ox_lib';

export function LoadFile(path: string) {
  return LoadResourceFile(cache.resourceName, path);
}

export function LoadJsonFile(path: string) {
  return JSON.parse(LoadFile(path));
}
