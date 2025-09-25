import { lazy } from 'react';

const lazyCache = new Map();

export const lazyImport = (importPath: string, name: string) => {
  const key = `${importPath}#${name}`;
  if (!lazyCache.has(key)) {
    lazyCache.set(
      key,
      lazy(() =>
        import(/* @vite-ignore */ importPath).then((mod) => ({
          default: mod[name],
        })),
      ),
    );
  }
  return lazyCache.get(key);
};
