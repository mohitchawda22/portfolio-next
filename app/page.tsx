import { CursorFollower } from '@/components/CursorFollower'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ThemeTransitionShell } from '@/components/ThemeTransitionProvider'
import { Hero } from '@/components/sections/Hero'
import { Background } from '@/components/sections/Background'
import { Projects } from '@/components/sections/Projects'
import { SkillsPhilosophy } from '@/components/sections/SkillsPhilosophy'
import { Contact } from '@/components/sections/Contact'

export default function BoldDeveloperPortfolio() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-portfolio-cream text-portfolio-ink transition-colors duration-500 dark:bg-black dark:text-white">
      <ThemeSwitcher />
      <ThemeTransitionShell>
        <CursorFollower />
        <Hero />
        <Background />
        <Projects />
        <SkillsPhilosophy />
        <Contact />
      </ThemeTransitionShell>
    </div>
  )
}

