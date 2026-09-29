import { Link } from "react-router-dom";
import ThemeToggle from "@/components/themeToggle";

export default function Navbar({ profile }) {
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Clear hash from URL after scroll
      setTimeout(() => {
        history.replaceState(null, "", window.location.pathname);
      }, 1000);
    }
  };

  return (
    <nav className="w-full py-4 md:py-6 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-foreground text-background flex items-center justify-center text-xs md:text-sm font-bold">
          ap
        </div>
        <span className="text-base md:text-lg font-bold tracking-tight whitespace-nowrap">
          {profile?.full_name || "ardi pratama"}
        </span>
      </Link>

      {/* Nav Links - Hidden on mobile, visible on md+ */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#work"
          onClick={(e) => handleNavClick(e, "work")}
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Work
        </a>
        <a
          href="#about"
          onClick={(e) => handleNavClick(e, "about")}
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          About
        </a>
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "contact")}
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Contact
        </a>
      </div>

      {/* Theme Toggle + CTA */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <ThemeToggle className="w-9 h-9 md:w-10 md:h-10" />

        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "contact")}
          className="flex items-center gap-2 text-xs md:text-sm font-semibold hover:text-accent transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span className="whitespace-nowrap">Let's talk</span>
        </a>
      </div>
    </nav>
  );
}
