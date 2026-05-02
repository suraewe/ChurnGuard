import { useState } from 'react';

const NavLink = ({ children, href = '#', isDark }) => (
  <a
    href={href}
    className="transition-colors duration-200 text-sm font-medium relative group"
    style={{ color: isDark ? '#a1a1a6' : '#6e6e73' }}
    onMouseEnter={(e) => e.target.style.color = isDark ? '#f5f5f7' : '#1d1d1f'}
    onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1a6' : '#6e6e73'}
  >
    {children}
  </a>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
      fill="#007AFF"
      opacity="0.15"
      stroke="#007AFF"
      strokeWidth="1.5"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const HamburgerIcon = ({ open }) => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
);

export default function Navbar({ isDark, toggleTheme, onAnalyzeClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: isDark ? 'rgba(0,0,0,0.72)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <ShieldIcon />
            <span
              className="font-semibold text-base tracking-tight"
              style={{ color: isDark ? '#f5f5f7' : '#1d1d1f' }}
            >
              ChurnGuard
              <span style={{ color: 'var(--apple-blue)', marginLeft: '2px' }}>AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink href="#hero" isDark={isDark}>Home</NavLink>
            <NavLink href="#form" isDark={isDark}>Analyze</NavLink>
            <NavLink href="#results" isDark={isDark}>Results</NavLink>
            <NavLink href="#" isDark={isDark}>Docs</NavLink>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-200"
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: isDark ? '#a1a1a6' : '#6e6e73',
              }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* CTA */}
            <button
              onClick={onAnalyzeClick}
              className="btn-primary px-5 py-2 text-sm"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full"
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: isDark ? '#a1a1a6' : '#6e6e73',
              }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full"
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: isDark ? '#a1a1a6' : '#6e6e73',
              }}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden pb-4 animate-slide-down"
            style={{ borderTop: `0.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}
          >
            <div className="flex flex-col gap-1 pt-3">
              {['Home', 'Analyze', 'Results', 'Docs'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: isDark ? '#a1a1a6' : '#6e6e73',
                  }}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onAnalyzeClick?.(); }}
                className="btn-primary px-5 py-2.5 text-sm mt-2 mx-3"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
