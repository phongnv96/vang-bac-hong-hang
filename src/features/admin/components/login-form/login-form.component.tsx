"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("admin-logged-in", "true");
        onSuccess();
      } else {
        setError(data.error || "Đăng nhập thất bại");
      }
    } catch {
      setError("Lỗi kết nối server");
    }
    setLoading(false);
  }

  return (
    <div className="bg-theme min-h-screen flex items-center justify-center">
      <div className={`rounded-2xl ${styles.loginBox}`}>
        <div className="text-center mb-[4vh]">
          <h1 className={`animate-shimmer uppercase font-black tracking-wider text-title mb-[1vh] ${styles.title}`}>
            Hồng Hằng
          </h1>
          <p className="uppercase tracking-widest color-gold text-sub">
            Quản lý bảng giá
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-[3vh]">
          <div className="flex flex-col gap-[1vh]">
            <label className="uppercase font-bold tracking-wider color-gold text-label">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              placeholder="Nhập tên đăng nhập..."
              autoFocus
              className={`${styles.inputPrice} w-full text-price color-gold-light`}
            />
          </div>
          <div className="flex flex-col gap-[1vh]">
            <label className="uppercase font-bold tracking-wider color-gold text-label">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Nhập mật khẩu..."
                className={`${styles.inputPrice} w-full text-price color-gold-light pr-[5vw]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-[1vw] top-1/2 -translate-y-1/2 cursor-pointer text-label ${styles.eyeButton}`}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div className={`text-center font-bold text-btn ${styles.errorText}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg font-black uppercase tracking-wider transition-all duration-200 hover:brightness-110 cursor-pointer th-gradient disabled:opacity-50 text-btn py-[2vh]">
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="text-center mt-[3vh]">
          <a href="/" className={`text-footer underline transition-colors ${styles.backLink}`}>
            ← Quay lại bảng giá
          </a>
        </div>
      </div>
    </div>
  );
}
