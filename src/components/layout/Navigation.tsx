import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { menuNav, primaryNav } from "@/content/site";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

/**
 * Fixed site header. Transparent over the dark page heroes; gains a solid
 * background and inline links once the user scrolls. The hamburger button
 * opens a full-page menu overlay on every breakpoint.
 */
export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const onDark = !isScrolled;

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          isScrolled ? "border-b border-border bg-background shadow-md" : "bg-transparent"
        )}
      >
        <div
          className={cn(
            "container flex items-center justify-between transition-all duration-500",
            isScrolled ? "h-20" : "h-28"
          )}
        >
          <Logo onDark={onDark} />

          {/* Inline links appear only in the compact, scrolled state */}
          <div
            className={cn(
              "ml-auto mr-3 hidden items-center gap-6 transition-opacity duration-500 lg:flex",
              isScrolled ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/join">
              <Button size="sm" className="px-6">
                JOIN US
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            className="relative z-50 flex h-14 w-14 cursor-pointer flex-col items-center justify-center gap-2"
          >
            {/* Three bars morph into an X when the menu is open */}
            <span
              className={cn(
                "block h-1 w-8 transition-all duration-300",
                onDark && !isMenuOpen ? "bg-white" : "bg-foreground",
                isMenuOpen && "translate-y-3 rotate-45 bg-foreground"
              )}
            />
            <span
              className={cn(
                "block h-1 w-8 transition-all duration-300",
                onDark && !isMenuOpen ? "bg-white" : "bg-foreground",
                isMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-1 w-8 transition-all duration-300",
                onDark && !isMenuOpen ? "bg-white" : "bg-foreground",
                isMenuOpen && "-translate-y-3 -rotate-45 bg-foreground"
              )}
            />
          </button>
        </div>
      </nav>

      {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} />}
    </>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  // Mount in the hidden state, then animate in on the next frame.
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className={cn(
          "absolute inset-0 bg-background transition-opacity duration-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "relative flex h-full transition-transform duration-500 ease-out",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full flex-col justify-center px-8 py-20 md:w-1/2 md:px-12">
          <h2 className="mb-12 font-serif text-4xl font-bold text-foreground md:text-5xl">Menu</h2>
          <nav className="space-y-6">
            {menuNav.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "block font-serif text-2xl font-light text-foreground transition-all duration-300 hover:text-primary md:text-3xl",
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                )}
                style={{ transitionDelay: isVisible ? `${(index + 1) * 80}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className={cn(
            "hidden w-1/2 flex-col justify-center bg-muted px-12 py-20 transition-opacity duration-700 md:flex",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="max-w-md">
            <h3 className="mb-4 font-serif text-3xl font-bold text-foreground">Stay Connected</h3>
            <p className="mb-8 text-lg font-light text-foreground/70">
              Join us for updates on events, articles, and initiatives.
            </p>
            <Link to="/join" onClick={onClose}>
              <Button size="lg" className="w-full">
                Join Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
