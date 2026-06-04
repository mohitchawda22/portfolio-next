import { ExternalLink, ArrowRight } from 'lucide-react'

export function Projects() {
  return (
    <section className="py-32 px-8 bg-black text-white relative z-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl font-black mb-20 text-right transform rotate-1">
          _PROJECTS
        </h2>
        
        <div className="grid grid-cols-12 gap-4 h-screen">
          {/* Project 1 - Large */}
          <div className="col-span-7 row-span-2 bg-white text-black p-8 flex flex-col justify-between group hover:bg-black hover:text-white transition-all duration-500 border-4 border-white">
            <div>
              <div className="text-xs font-black tracking-widest mb-4 opacity-50">01</div>
              <h3 className="text-4xl font-black mb-4 leading-tight">
                CLUBMATCH
              </h3>
              <p className="text-lg font-medium mb-6">
                DYNAMIC PLATFORM SERVING COMMUNITIES WITH REAL-TIME INTERACTIONS AND SEAMLESS MATCHING
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-xs font-black tracking-widest opacity-70">
                React.js / TAILWIND / React Query
              </div>
              <ExternalLink className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </div>
          </div>

          {/* Project 2 - Medium */}
          <div className="col-span-5 bg-white text-black p-6 flex flex-col justify-between group hover:bg-black hover:text-white transition-all duration-500 border-4 border-white">
            <div>
              <div className="text-xs font-black tracking-widest mb-4 opacity-50">02</div>
              <h3 className="text-2xl font-black mb-4">
                ZADWALLETS
              </h3>
              <p className="text-sm font-medium">
                SECURE WALLET PLATFORM WITH REAL-TIME TRANSACTIONS
              </p>
            </div>
            <div className="text-xs font-black tracking-widest opacity-70 mt-4">
              React.js / TAILWIND / WEB3 / JAVASCRIPT 
            </div>
          </div>

          {/* Project 3 - Small */}
          <div className="col-span-3 bg-white text-black p-6 flex flex-col justify-between group hover:bg-black hover:text-white transition-all duration-500 border-4 border-white">
            <div>
              <div className="text-xs font-black tracking-widest mb-4 opacity-50">03</div>
              <h3 className="text-xl font-black mb-4">
                THREADSTONE
              </h3>
            </div>
            <div className="text-xs font-black tracking-widest opacity-70">
              React.js / Tailwind CSS / INTERACTIVE UI
            </div>
          </div>

          {/* Project 4 - Wide */}
          <div className="col-span-9 bg-white text-black p-6 flex items-center justify-between group hover:bg-black hover:text-white transition-all duration-500 border-4 border-white">
            <div>
              <div className="text-xs font-black tracking-widest mb-2 opacity-50">04</div>
              <h3 className="text-3xl font-black">INTERACTIVE PORTFOLIO</h3>
            </div>
            <div className="text-right">
              <div className="text-xs font-black tracking-widest opacity-70 mb-2">
                React.js / Next.js / Typescript / TAILWIND / FRAMER MOTION
              </div>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
