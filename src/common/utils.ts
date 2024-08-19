import { cache } from '@overextended/ox_lib';

export function LoadFile(path: string) {
  return LoadResourceFile(cache.resource, path);
}

export function LoadJsonFile<T = unknown>(path: string): T {
  return JSON.parse(LoadFile(path)) as T;
}
