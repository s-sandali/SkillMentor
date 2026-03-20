import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ToastProvider, ToastViewport } from "./ui/toast";
import type { ReactNode } from "react";
import { useLocation } from "react-router";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <ToastProvider>
      <section className="min-h-screen flex flex-col">
        {!isHomePage && !isAdminPage && <Navigation />}
        <main>{children}</main>
        {!isHomePage && !isAdminPage && <Footer />}
      </section>
      <ToastViewport />
    </ToastProvider>
  );
}
