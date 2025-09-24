import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { lazyImport } from "./lazyImport";
import { LoadingFallback } from "./LoadingFallback";
import { routes } from "./routesConfig.js";
import NotFoundPage from "../pages/NotFoundPage";

const renderRoutes = (routesArray) =>
  routesArray.map(
    ({ path, importPath, name, protected: isProtected, children, index }) => {
      const Component = lazyImport(importPath, name);
      const element = (
        <Suspense fallback={<LoadingFallback routeName={name} />}>
          {isProtected ? (
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
          ) : (
            <Component />
          )}
        </Suspense>
      );

      if (children?.length) {
        return (
          <Route key={path} path={path} element={element}>
            {renderRoutes(children)}
          </Route>
        );
      }

      return <Route key={path} path={path} element={element} index={index} />;
    }
  );

export const AppRoutes = () => (
  <Routes>
    {renderRoutes(routes)}
    {/* Fallback 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
