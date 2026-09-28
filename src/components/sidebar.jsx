import { Link } from "react-router-dom";

export default function Sidebar({ profile }) {
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", count: "01" },
    { id: "projects", label: "Projects", count: "03" },
    { id: "profile", label: "Profile", count: "1" },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border-custom min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
          ap
        </div>
        <span className="text-lg font-bold tracking-tight">
          {profile?.full_name || "ardi pratama"}
        </span>
      </Link>

      {/* Workspace Label */}
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-secondary-text mb-4">
        Workspace
      </span>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-secondary-text hover:text-foreground hover:bg-border-custom/20 transition-colors"
          >
            <span>{item.label}</span>
            <span className="text-xs opacity-60">{item.count}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
