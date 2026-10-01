const items = [
  { href: "#top", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#tools", label: "Tools" },
  { href: "#contact", label: "Contact" },
];

/**
 * Floating pill nav. Real anchors, so it works without JS and is keyboard
 * navigable — the reference uses click handlers on list items, which is not.
 *
 * The pill is wider than a 320px phone, so the scroller lets it slide instead
 * of forcing the whole document wider.
 */
export default function Nav() {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-3"
    >
      <div className="max-w-full [scrollbar-width:none] overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max items-center gap-0 rounded-full border border-white/10 bg-neutral-950/60 p-1 backdrop-blur-xl sm:gap-1 sm:p-1.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block rounded-full px-2 py-1.5 text-[11px] font-medium whitespace-nowrap text-white/65 transition hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
