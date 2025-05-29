"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // We'll still use this state to conditionally render children

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true);
      } else {
        // Redirect to login immediately if not authenticated
        router.replace(
          "/login?message=unauthenticated&redirect=" +
            encodeURIComponent(
              window.location.pathname + window.location.search
            )
        );
      }
    }
  }, [router]);

  return isAuthenticated ? <>{children}</> : null;
}
