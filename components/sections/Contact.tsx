import { Github, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Contact() {
  return (
    <section className="py-32 px-8 bg-black text-white relative z-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-8xl font-black mb-16">
          LET'S BUILD_
        </h2>
        
        <div className="flex justify-center space-x-16 mb-16">
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-xl font-black px-8 py-4 transform hover:rotate-2"
          >
            <Github className="mr-4 h-6 w-6" />
            GITHUB
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-xl font-black px-8 py-4 transform hover:-rotate-2"
          >
            <Mail className="mr-4 h-6 w-6" />
            EMAIL
          </Button>
        </div>
        
        <div className="text-2xl font-black tracking-widest opacity-50">
          MOHITCHAWDA22JAN@GMAIL.COM
        </div>
      </div>
    </section>
  )
}
