import { NavLink, Link } from 'react-router-dom';
import { ScanSearch } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/analyze', label: 'Analyze' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-paper-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-ink-900">
          <ScanSearch className="h-5 w-5 text-brass-600" aria-hidden="true" />
          LexiLens AI
        </Link>
        <nav aria-label="Primary" className="hidden gap-1 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-ink-900 bg-paper-200' : 'text-ink-600 hover:text-ink-900 hover:bg-paper-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/analyze"
          className="rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper-50 transition-colors hover:bg-ink-800"
        >
          Analyze document
        </Link>
      </div>
      {/* Mobile nav */}
      <nav aria-label="Primary mobile" className="flex gap-1 overflow-x-auto border-t border-ink-200/70 px-5 py-2 sm:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded px-3 py-1.5 text-sm font-medium ${
                isActive ? 'bg-paper-200 text-ink-900' : 'text-ink-600'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
