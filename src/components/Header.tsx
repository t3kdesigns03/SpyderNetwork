import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/spyder-logo.png"
            alt="Spyder Network"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="https://www.spydernetwork.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Main Site
          </a>
          <a
            href="https://www.facebook.com/SpyderNetwork-1444576605779205/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/spyder_network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Instagram
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="glass border-t border-border p-4 md:hidden flex flex-col gap-3">
          <a
            href="https://www.spydernetwork.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground"
          >
            Main Site
          </a>
          <a
            href="https://www.facebook.com/SpyderNetwork-1444576605779205/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/spyder_network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground"
          >
            Instagram
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
