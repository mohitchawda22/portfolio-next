import { CursorFollower } from '@/components/CursorFollower'
import { Hero } from '@/components/sections/Hero'
import { Background } from '@/components/sections/Background'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'

export default function BoldDeveloperPortfolio() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CursorFollower />
      <Hero />
      <Background />
      <Projects />
      <Skills />
      <Contact />
    </div>
  )
}

