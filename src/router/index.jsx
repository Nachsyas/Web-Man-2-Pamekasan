import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import routes from "./config";

let navigateResolver;

// Digunakan jika ada fungsi helper di luar komponen React yang butuh pindah halaman
export const navigatePromise = new Promise((resolve) => {
  navigateResolver = resolve;
});

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();

  useEffect(() => {
    // Menyimpan fungsi navigate ke global objek (dibutuhkan oleh arsitektur asli)
    window.REACT_APP_NAVIGATE = navigate;
    if (typeof navigateResolver === 'function') {
      navigateResolver(navigate);
    }
  }, [navigate]);

  return element;
}