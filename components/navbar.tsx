import { NavbarContent } from "./navbar-content";

export function Navbar() {
  return (
    <nav className="bg-background/40 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <NavbarContent />
    </nav>
  );
}
