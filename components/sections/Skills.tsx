export function Skills() {
  return (
    <section className="py-32 px-8 bg-white text-black relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h2 className="text-6xl font-black mb-16 transform -rotate-2">
              SKILLS_
            </h2>
            
            <div className="space-y-8">
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:italic transition-all">FRONTEND</div>
                <div className="text-lg font-medium opacity-70 leading-tight">
                  REACT • NEXT.JS • TYPESCRIPT • JAVASCRIPT<br/>
                  HTML5 • CSS3 • WEB COMPONENTS
                </div>
              </div>
              
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:italic transition-all">STYLING</div>
                <div className="text-lg font-medium opacity-70 leading-tight">
                  TAILWIND CSS • SASS • FRAMER MOTION<br/>
                  STYLED COMPONENTS • CSS MODULES
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-32">
            <div className="space-y-8">
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:italic transition-all">ECOSYSTEM</div>
                <div className="text-lg font-medium opacity-70 leading-tight">
                  REDUX • ZUSTAND • REACT QUERY<br/>
                  VITE • WEBPACK • NPM/PNPM
                </div>
              </div>
              
              <div className="group">
                <div className="text-4xl font-black mb-2 group-hover:italic transition-all">TOOLS & PLATFORMS</div>
                <div className="text-lg font-medium opacity-70 leading-tight">
                  GIT • GITHUB • FIGMA • VERCEL<br/>
                  JIRA • RESPONSIVE DESIGN • ACCESSIBILITY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
