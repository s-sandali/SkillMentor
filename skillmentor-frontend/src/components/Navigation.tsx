import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import { useAuth, SignInButton, UserButton } from "@clerk/clerk-react";
import SkillMentorLogo from "@/assets/logo.webp";
import { Compass, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const navItems = [
  { label: "Tutors", to: "/mentors" },
  { label: "About Us", to: "/" },
  { label: "Resources", to: "/" },
];

export function Navigation() {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Scroll awareness
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated active indicator
  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.to === location.pathname);
    const activeEl = linkRefs.current[activeIndex];
    const container = navRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
    }
  }, [location.pathname]);

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      className={cn(
        "flex items-center gap-1 text-sm font-medium",
        mobile && "flex-col items-stretch gap-2"
      )}
    >
      {navItems.map((item, i) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.label}
            to={item.to}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            className={cn(
              "relative z-10 rounded-full px-4 py-2 text-sm transition-all duration-200",
              isActive
                ? "text-white font-semibold"
                : "text-white/60 hover:text-white/90",
              mobile &&
                "flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
            )}
            onClick={() => mobile && setIsOpen(false)}
          >
            <span>{item.label}</span>
            {mobile ? <Compass className="size-4 text-white/40" /> : null}
          </Link>
        );
      })}
    </nav>
  );

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-2",
        mobile && "flex-col items-stretch gap-3 w-full"
      )}
    >
      {isSignedIn ? (
        <>
          <Link
            to="/dashboard"
            className={cn(mobile && "w-full")}
            onClick={() => mobile && setIsOpen(false)}
          >
            <Button
              variant="ghost"
              className={cn(
                "rounded-full border border-white/10 text-white/80 hover:bg-white/10 hover:text-white gap-1.5",
                mobile && "h-11 w-full rounded-2xl"
              )}
            >
              <LayoutDashboard className="size-3.5" />
              Dashboard
            </Button>
          </Link>
          <div
            className={cn(
              "flex items-center",
              mobile && "w-full justify-center"
            )}
          >
            <div className="rounded-full border border-white/10 bg-white/5 p-1">
              <UserButton
                appearance={{
                  elements: { avatarBox: "w-8 h-8" },
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <SignInButton
            forceRedirectUrl="/dashboard"
            mode="modal"
            appearance={{
              elements: { formButtonPrimary: "bg-primary" },
            }}
          >
            <Button
              variant="ghost"
              className={cn(
                "rounded-full text-white/70 hover:bg-white/10 hover:text-white",
                mobile && "h-11 w-full rounded-2xl border border-white/10"
              )}
            >
              Log in
            </Button>
          </SignInButton>
          <Link to="/login" className={cn(mobile && "w-full")}>
            <Button
              className={cn(
                "rounded-full bg-white text-black font-semibold shadow-[0_8px_24px_-8px_rgba(255,255,255,0.6)] hover:bg-white/90 hover:shadow-[0_8px_32px_-8px_rgba(255,255,255,0.8)] transition-all gap-1.5",
                mobile && "h-11 w-full rounded-2xl"
              )}
            >
              <Sparkles className="size-3.5" />
              Get Started
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <div
        className={cn(
          "relative w-full max-w-6xl flex items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "border-white/[0.12] bg-black/90 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-white/[0.08] bg-black/75 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md"
        )}
      >
        {/* Subtle top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <img
              src={SkillMentorLogo}
              alt="SkillMentor Logo"
              className="size-9 rounded-full ring-1 ring-white/15"
            />
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-sm" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold text-white tracking-tight">
              SkillMentor
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.2em] text-white/40 mt-0.5">
              Learn · Grow · Excel
            </span>
          </div>
        </Link>

        {/* Center nav pill — desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
          <div
            ref={navRef}
            className="relative flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-1.5 py-1"
          >
            {/* Animated active highlight */}
            <div
              className="absolute top-1 bottom-1 rounded-full bg-white/[0.12] transition-all duration-300 ease-out"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
            />
            <NavItems />
          </div>
        </div>

        {/* Right — auth buttons (desktop) + mobile menu */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <AuthButtons />
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-white/10 bg-white/[0.06] text-white hover:bg-white/10 size-9"
                >
                  <Menu className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] border-l border-white/10 bg-[#080808] p-0 text-white"
              >
                <div className="flex flex-col h-full">
                  {/* Sheet header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
                    <Link
                      to="/"
                      className="flex items-center gap-2.5"
                      onClick={() => setIsOpen(false)}
                    >
                      <img
                        src={SkillMentorLogo}
                        alt="SkillMentor Logo"
                        className="size-8 rounded-full ring-1 ring-white/15"
                      />
                      <span className="text-[15px] font-bold text-white">SkillMentor</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-white/50 hover:text-white hover:bg-white/10 size-8"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  {/* Nav links */}
                  <div className="flex-1 px-4 py-6">
                    <p className="text-[11px] uppercase tracking-widest text-white/30 px-4 mb-3">
                      Navigation
                    </p>
                    <NavItems mobile />
                  </div>

                  {/* Auth section */}
                  <div className="px-4 pb-8 pt-4 border-t border-white/[0.07]">
                    <AuthButtons mobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
