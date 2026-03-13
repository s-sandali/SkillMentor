import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ToastProvider, ToastViewport } from "./ui/toast";
import type { ReactNode } from "react";
import { useLocation } from "react-router";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <ToastProvider>
      <section className="min-h-screen flex flex-col">
        {!isHomePage && <Navigation />}
        <main>{children}</main>
        {!isHomePage && <Footer />}
      </section>
      <ToastViewport />
    </ToastProvider>
  );
}
