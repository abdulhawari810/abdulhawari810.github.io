export default function Footer({ profile }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full py-6 px-4 md:px-8 border-t border-border-custom/30">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-xs text-secondary-text tracking-[0.15em] uppercase">
          &copy; {new Date().getFullYear()} {profile?.full_name || "Ardi Pratama"}
        </span>
        <span className="text-xs text-secondary-text tracking-[0.15em] uppercase">
          Made with Intention
        </span>
        <button
          onClick={scrollToTop}
          className="text-xs text-secondary-text tracking-[0.15em] uppercase hover:text-accent transition-colors flex items-center gap-1"
        >
          Back to top
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}
