'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-10 flex flex-col items-center justify-center text-center py-6 px-4 text-fg text-sm gap-1">
      <span className="text-fg/70">
        Made with <span className="text-accent">❤</span> by{' '}
        <span className="text-accent font-medium">asteria</span>
      </span>

      <span className="text-fg/70 flex flex-wrap items-center gap-2">
        Site licensed under
        <Link
          href="https://github.com/asteriau/asteria.cat?tab=GPL-3.0-1-ov-file"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent"
        >
          GPL v3
        </Link>
        <span>|</span>
        <Link
          href="https://github.com/asteriau/asteria.cat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent"
        >
          Site Source
        </Link>
      </span>
    </footer>
  )
}
