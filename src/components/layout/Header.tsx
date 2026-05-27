import { ExternalLink } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-kx-darker border-b border-kx-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* KoinX Logo SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#3B82F6"/>
                <path d="M8 8L14 16L8 24H12L16 18.5L20 24H24L18 16L24 8H20L16 13.5L12 8H8Z" fill="white"/>
              </svg>
              <span className="text-white font-bold text-xl tracking-tight">KoinX</span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-kx-border" />
            <h1 className="hidden sm:block text-kx-muted text-sm font-medium">
              Tax Harvesting
            </h1>
          </div>

          {/* How it works link */}
          <a
            href="https://koinx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-kx-blue hover:text-blue-400 transition-colors duration-200 text-sm font-medium group"
          >
            <span>How it works?</span>
            <ExternalLink
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
