"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "../../components/login-form";
import { AdminDashboard } from "../../components/admin-dashboard";

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem("admin-logged-in");
    if (session === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onSuccess={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
}
