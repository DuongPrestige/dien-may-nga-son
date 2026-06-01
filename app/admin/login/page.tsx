import type { Metadata } from "next";

import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị | Điện Máy Nga Sơn",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] bg-[#F8FAFC] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-[#0284C7]">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#111827]">
            Đăng nhập quản trị
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            Sử dụng tài khoản quản trị đã được tạo trong hệ thống.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
