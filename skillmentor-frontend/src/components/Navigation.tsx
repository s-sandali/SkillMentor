import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useAuth, SignInButton, UserButton } from "@clerk/clerk-react";
import SkillMentorLogo from "@/assets/logo.webp";
import { Compass, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const navItems = [
  { label: "Tutors", to: "/" },
  { label: "About Us", to: "/" },
  { label: "Resources", to: "/" },
];

export function Navigation() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        mobile && "flex-col items-stretch gap-2",
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className={cn(
            "rounded-full px-4 py-2 text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white",
            mobile &&
              "flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
          )}
          onClick={() => mobile && setIsOpen(false)}
        >
          <span>{item.label}</span>
          {mobile ? <Compass className="size-4 text-white/50" /> : null}
        </Link>
      ))}
    </nav>
  );

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-2",
        mobile && "flex-col items-stretch gap-4 w-full",
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
                "rounded-full border border-white/10 text-white hover:bg-white/10 hover:text-white",
                mobile && "h-11 w-full rounded-2xl"
              )}
            >
              Dashboard
            </Button>
          </Link>
          <div
            className={cn(
              "flex items-center",
              mobile && "w-full justify-center",
            )}
          >
            <div className="rounded-full border border-white/10 bg-white/5 p-1">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
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
              elements: {
                formButtonPrimary: "bg-primary",
              },
            }}
          >
            <Button
              variant="ghost"
              className={cn(
                "rounded-full text-white/80 hover:bg-white/10 hover:text-white",
                mobile && "h-11 w-full rounded-2xl border border-white/10"
              )}
            >
              Login
            </Button>
          </SignInButton>
          <Link to="/login" className={cn(mobile && "w-full")}>
            <Button
              className={cn(
                "rounded-full bg-white text-black shadow-[0_12px_30px_-16px_rgba(255,255,255,0.9)] hover:bg-white/90",
                mobile && "h-11 w-full rounded-2xl",
              )}
            >
              <Sparkles className="size-4" />
              Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/10 bg-black/95 px-4 py-3 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.7)] backdrop-blur supports-[backdrop-filter]:bg-black/80 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={SkillMentorLogo}
              alt="SkillMentor Logo"
              className="size-11 rounded-full ring-1 ring-white/10"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-none">
                SkillMentor
              </span>
              <span className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
                Learn with experts
              </span>
            </div>
          </Link>
          <div className="ml-4 hidden rounded-full border border-white/10 bg-white/[0.04] p-1 md:block">
            <NavItems />
          </div>
        </div>

        <div className="hidden md:block">
          <AuthButtons />
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
              >
                <Menu className="size-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] border-l border-white/10 bg-black p-6 text-white"
            >
              <div className="flex flex-col h-full">
                <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
                  <Link
                    to="/"
                    className="flex items-center space-x-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <img
                      src={SkillMentorLogo}
                      alt="SkillMentor Logo"
                      className="size-11 rounded-full ring-1 ring-white/10"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">SkillMentor</span>
                      <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                        Learn with experts
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="space-y-6 flex-1">
                  <NavItems mobile />
                </div>

                <div className="pt-6 border-t border-white/10">
                  <AuthButtons mobile />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
