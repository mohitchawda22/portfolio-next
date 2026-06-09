'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EMAIL = 'mohitchawda22jan@gmail.com'
const GITHUB_URL = 'https://github.com/mohitchawda22'
const LINKEDIN_URL = 'https://www.linkedin.com/in/mohitchawda22'

const FULL_NAME = 'MOHIT CHAWDA'

const CHANNELS = [
  { label: 'GITHUB', href: GITHUB_URL },
  { label: 'LINKEDIN', href: LINKEDIN_URL },
  { label: 'EMAIL', href: `mailto:${EMAIL}` },
] as const

function FooterArcAura() {
  const beams = [
    { left: '18%', width: '12%', delay: 0, duration: 9 },
    { left: '42%', width: '16%', delay: 0.6, duration: 11 },
    { left: '68%', width: '11%', delay: 1.2, duration: 10 },
  ] as const

  return (
    <div className="footer-arc-aura pointer-events-none absolute inset-0" aria-hidden>
      <div className="footer-arc-vignette absolute inset-0" />
      <div className="footer-arc-stars absolute inset-0" />
      {beams.map((beam, index) => (
        <motion.div
          key={index}
          className="footer-arc-beam absolute bottom-0"
          style={{ left: beam.left, width: beam.width }}
          animate={{ opacity: [0.22, 0.42, 0.22] }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: beam.delay,
          }}
        />
      ))}
      <div className="footer-arc-glow absolute inset-x-0 bottom-0" />
    </div>
  )
}

function FooterColumnHeading({ children }: { children: string }) {
  return (
    <div className="mb-5 flex items-center gap-2.5 md:mb-6">
      <span className="h-px w-4 bg-white/30" aria-hidden />
      <span className="font-mono text-[10px] font-medium tracking-[0.32em] text-white/40">
        {children}
      </span>
    </div>
  )
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.16em] text-white/70 transition-colors duration-300 hover:text-white sm:text-sm"
    >
      {label}
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 opacity-40 transition-all duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-90"
        strokeWidth={2}
      />
    </a>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 -mt-px flex min-h-[min(48vh,480px)] flex-col overflow-hidden bg-[#030303] text-white">
      <FooterArcAura />

      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pb-4 pt-14 md:px-10 md:pb-6 md:pt-16 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/[0.08]">
          <div className="md:pr-10 lg:pr-14">
            <FooterColumnHeading>IDENTIFICATION</FooterColumnHeading>
            <ul className="space-y-1.5 font-mono tracking-[0.1em]">
              <li className="text-sm font-black text-white/90 sm:text-[15px]">{FULL_NAME}</li>
              <li className="text-[13px] font-semibold text-white/55 sm:text-sm">
                FRONTEND DEVELOPER
              </li>
              <li className="text-[12px] font-medium text-white/38 sm:text-[13px]">
                GUJARAT, INDIA
              </li>
            </ul>
          </div>

          <div className="md:px-10 lg:px-14">
            <FooterColumnHeading>CHANNELS</FooterColumnHeading>
            <ul className="space-y-2.5">
              {CHANNELS.map((channel) => (
                <li key={channel.label}>
                  <FooterLink label={channel.label} href={channel.href} />
                </li>
              ))}
            </ul>
          </div>

          <div className="md:pl-10 lg:pl-14">
            <FooterColumnHeading>COLOPHON</FooterColumnHeading>
            <ul className="space-y-2 font-mono text-[11px] font-medium leading-[1.65] tracking-[0.08em] text-white/42 sm:text-xs">
              <li>
                <span className="text-white/28">BUILT WITH</span>
                <span className="text-white/50"> — NEXT.JS / REACT / FRAMER / TAILWIND</span>
              </li>
              <li>
                <span className="text-white/28">TYPEFACE</span>
                <span className="text-white/50"> — GEIST / GEIST MONO</span>
              </li>
              <li>
                <span className="text-white/28">DEPLOYED ON</span>
                <span className="text-white/50"> — VERCEL</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.07] pt-6 md:mt-14 md:pt-7">
          <p className="text-center font-mono text-[10px] font-medium tracking-[0.14em] text-white/30">
            © {year} Mohit Chawda. All rights reserved.
          </p>
        </div>
      </div>

      <div
        className="footer-brand-watermark-wrap relative z-[1] mt-auto w-full overflow-hidden"
        aria-hidden
      >
        <p className="footer-brand-watermark select-none whitespace-nowrap text-center font-black">
          {FULL_NAME}
        </p>
      </div>
    </footer>
  )
}
