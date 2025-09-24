import { lazy } from "react";

const lazyCache = new Map();

export const lazyImport = (importPath, name) => {
  const key = `${importPath}#${name}`;
  if (!lazyCache.has(key)) {
    lazyCache.set(
      key,
      lazy(() =>
        import(/* @vite-ignore */ importPath).then((mod) => ({
          default: mod[name],
        }))
      )
    );
  }
  return lazyCache.get(key);
};
