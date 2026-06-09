import { CursorFollower } from '@/components/CursorFollower'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ThemeTransitionShell } from '@/components/ThemeTransitionProvider'
import { Hero } from '@/components/sections/Hero'
import { Background } from '@/components/sections/Background'
import { Projects } from '@/components/sections/Projects'
import { SkillsPhilosophy } from '@/components/sections/SkillsPhilosophy'
import { Skills } from '@/components/sections/Skills'
import { AboutMetrics } from '@/components/sections/AboutMetrics'
import { Contact } from '@/components/sections/Contact'
import { SiteFooter } from '@/components/sections/SiteFooter'

export default function BoldDeveloperPortfolio() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-portfolio-cream text-portfolio-ink transition-colors duration-500 dark:bg-black dark:text-white">
      <ThemeSwitcher />
      <ThemeTransitionShell>
        <CursorFollower />
        <Hero />
        <Background />
        <AboutMetrics />
        <Projects />
        <SkillsPhilosophy />
        <Skills />
        <Contact />
        <SiteFooter />
      </ThemeTransitionShell>
    </div>
  )
}

