import { useEffect, useRef, useState, useCallback } from "react"
import headerBg from "@/assets/hero-bg.jpg"
import purposeBg from "@/assets/purpose-bg.jpg"
import terminalBg from "@/assets/terminal-bg.jpg"
import footerBg from "@/assets/footer-bg.jpg"
import heroGirl from "@/assets/hero-girl.png"
import samGift from "@/assets/sam-gift.png"
import { samFrames, samAnimations, sectionAnimations } from "@/config/sam-animations"

function MobileApp() {
  const [currentSection, setCurrentSection] = useState("intro")
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [showSam, setShowSam] = useState(false)
  const [samScale, setSamScale] = useState(1.4)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const animationTimerRef = useRef<number | null>(null)

  // Get current animation based on section
  const currentAnimation = samAnimations[sectionAnimations[currentSection]] || samAnimations.intro
  const safeFrameIndex = Math.min(currentFrameIndex, currentAnimation.frames.length - 1)
  const currentFrame = currentAnimation.frames[safeFrameIndex]
  const currentFrameSrc = currentFrame ? samFrames[currentFrame.frame] : samFrames.front
  const currentFrameClassName = currentFrame?.className || ""

  // Animation loop
  const runAnimation = useCallback(() => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
    }

    const animation = samAnimations[sectionAnimations[currentSection]] || samAnimations.intro
    const frameIndex = Math.min(currentFrameIndex, animation.frames.length - 1)
    const frame = animation.frames[frameIndex]
    
    if (!frame) return

    animationTimerRef.current = window.setTimeout(() => {
      setCurrentFrameIndex((prev) => {
        const nextIndex = prev + 1
        if (nextIndex >= animation.frames.length) {
          return animation.loop ? 0 : prev
        }
        return nextIndex
      })
    }, frame.duration)
  }, [currentSection, currentFrameIndex])

  // Run animation when frame or section changes
  useEffect(() => {
    if (showSam) {
      runAnimation()
    }
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
    }
  }, [showSam, runAnimation])

  // Reset frame index when section changes
  useEffect(() => {
    setCurrentFrameIndex(0)
  }, [currentSection])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const sections = ['intro', 'purpose', 'demo', 'terminal', 'footer']
      const heroSection = document.getElementById('hero')

      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect()
        const shouldShow = heroRect.bottom <= window.innerHeight / 2
        setShowSam(shouldShow)
      }

      // Scale Sam based on section - larger in intro
      const introSection = document.getElementById('intro')
      if (introSection) {
        const introRect = introSection.getBoundingClientRect()
        const screenHeight = window.innerHeight
        
        if (introRect.top <= 0 && introRect.bottom >= 0) {
          const scrollProgress = Math.abs(introRect.top) / screenHeight
          const newScale = 1.4 - (scrollProgress * 0.4) // Scale from 1.4 to 1.0
          setSamScale(Math.max(1.0, Math.min(1.4, newScale)))
        } else if (introRect.top > 0) {
          setSamScale(1.4)
        } else {
          setSamScale(1.0)
        }
      }

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setCurrentSection(sectionId)
            break
          }
        }
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={scrollContainerRef} className="h-screen overflow-y-scroll scroll-smooth">
      {/* Fixed Sam character for mobile */}
      <div
        className={`fixed bottom-0 left-1/2 z-[9999] pointer-events-none transition-all duration-500 ease-out origin-bottom ${showSam ? 'opacity-100' : 'opacity-0 translate-y-20'}`}
        style={{ transform: `translateX(-50%) scale(${samScale})` }}
      >
        <div className="relative flex items-end justify-center">
          <img
            src={currentFrameSrc}
            className={`max-h-[60vh] transition-transform duration-200 ${currentFrameClassName}`}
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
            }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="h-screen min-h-screen relative ">
        <img draggable={false} src={headerBg}
          className="h-full w-full object-cover object-center absolute pointer-events-none z-0" />
        <div className="bg-white z-20 absolute inset-x-4 bottom-0 top-20 rounded-t-lg shadow-xl">
          <img src={heroGirl} className="absolute bottom-0 mx-auto left-1/2 -translate-x-1/2 max-h-[60%] w-auto" />
          <div className="border-b bg-white absolute top-0 w-full h-10"></div>
          <div className="text-right absolute top-10 right-4 text-2xl p-4 text-[#4E4E4E] leading-8">
            ... Let's simulate <br /><span className="text-[#2978B9]">Life</span>
          </div>

          <div className="absolute bottom-8 left-4 right-4 z-10 flex justify-center">
            <button
              onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-black text-white p-4 px-8 text-lg cursor-pointer transition-transform active:scale-95">
              spawn <span className="italic">construct</span>
            </button>
          </div>

          <div className="absolute -right-2 bottom-2 -rotate-90 bg-white px-4 text-sm">
            web 4.0
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section id="intro" className="h-screen min-h-screen  relative">
        <div className="bg-white z-20 absolute inset-x-4 top-0 bottom-0 shadow-xl">
          <div className="absolute top-0 left-0 right-0 pt-8 px-6">
            <div className="text-[#4E4E4E] text-lg leading-relaxed">
              <p className="mb-4">
                <span className="text-[#2978B9]">Meet </span>
                <span className="text-[#2978B9] italic font-semibold">Sam</span>
                <span className="text-[#2978B9]">,</span>
                <br />
                <span className="text-[#8BB8D9] italic">a construct, that you just created.</span>
              </p>
              <p className="mb-4">
                Sam has <span className="text-[#2978B9] italic font-semibold">Intelligence</span>, just like chatGPT, Claude, OpenAI. Now all what Sam needs is the <span className="text-[#2978B9] italic font-semibold">Permission</span> to the <span className="text-[#2978B9] italic font-semibold">Open World</span>
              </p>
              <p className="text-center">
                Let's give sam a <span className="text-[#2978B9] italic font-semibold">Purpose</span> some <span className="text-[#2978B9] italic font-semibold">Money</span> and <span className="text-[#2978B9] italic font-semibold">Resources</span> so it can find ways to <span className="text-[#2978B9] italic font-semibold">Survive</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section id="purpose" className="min-h-screen  relative pb-48">
        <img draggable={false} src={purposeBg}
          className="h-full w-full object-cover object-bottom absolute pointer-events-none z-0" />
        
        {/* Purpose Card */}
        <div className="z-50 relative mx-4 pt-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-white">
            <h2 className="text-[#6B9AC4] text-xl italic mb-2">Sam's Purpose</h2>
            <p className="text-gray-300 text-base mb-6">
              Sam has to make economy for itself and the creator.
            </p>

            <div className="text-right mb-6">
              <h2 className="text-[#6B9AC4] text-xl italic mb-1">Money Provided</h2>
              <p className="text-gray-300 text-sm">Let's Say,</p>
              <p className="text-4xl font-bold">$100</p>
              <p className="text-[#6B9AC4] italic text-sm mt-2">-by Literally You!</p>
            </div>

            <h3 className="text-[#6B9AC4] text-lg italic mb-3">Resources Provided to Sam</h3>
            
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                <span className="italic font-semibold text-white">Identity & Wallet</span> - Own cryptographic wallets and private keys.
              </p>
              <p>
                <span className="italic font-semibold text-white">Permissionless Payments</span> - Pay for services using stable coin over openx402 protocol.
              </p>
              <p>
                <span className="italic font-semibold text-white">Compute & Inference</span> - Access to Linux servers and frontier models.
              </p>
              <p>
                <span className="italic font-semibold text-white">Deployment</span> - Build products, market it, host it and earn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="min-h-screen  relative pb-48">
        <div className="absolute top-4 left-4 z-30">
          <p className="text-[#4E4E4E] text-lg italic">web 4.0</p>
        </div>

        <div className="z-50 relative mx-4 pt-12">
          {/* Video placeholder */}
          <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-xl">
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center cursor-pointer">
                <div className="w-0 h-0 border-t-[16px] border-t-transparent border-l-[28px] border-l-gray-800 border-b-[16px] border-b-transparent ml-2"></div>
              </div>
            </div>
          </div>

          {/* Text below video */}
          <div className="mt-4 space-y-4">
            <p className="text-[#4E4E4E] text-sm leading-relaxed">
              Sam carefully examines the webOS browses the internet, finds way to generate income, makes a plan, creates workflow for itself.
            </p>
            <p className="text-[#4E4E4E] text-sm leading-relaxed">
              By hosting html, Sam interacts with the outer world, judiciously buys assets while monitoring the expense.
            </p>
            <p className="text-[#4E4E4E] text-lg text-right">
              ... More than an <span className="italic text-[#2978B9]">Agent</span>
            </p>
          </div>
        </div>
      </section>

      {/* Terminal Section */}
      <section id="terminal" className="min-h-screen  relative pb-48">
        <img draggable={false} src={terminalBg}
          className="h-full w-full object-cover object-top absolute pointer-events-none z-0" />
        
        <div className="absolute top-4 left-4 z-30">
          <p className="text-white text-lg italic">web 4.0</p>
        </div>

        <div className="z-50 relative mx-4 pt-12">
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-xl">
            {/* Terminal header */}
            <div className="bg-[#2a2a2a] px-3 py-2 flex items-center">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27ca3f]"></div>
              </div>
              <p className="text-gray-400 text-xs flex-1 text-center">Sam's Terminal</p>
            </div>
            
            {/* Terminal content */}
            <div className="p-4 font-mono text-xs leading-relaxed h-[50vh] overflow-auto">
              <p className="text-green-400">[construct:sam] booting up...</p>
              <p className="text-green-400">[construct:sam] loading wallet</p>
              <p className="text-cyan-400">[wallet] address: 0x7a3f...e9b2</p>
              <p className="text-yellow-400">[wallet] balance: $247.83 USDC</p>
              <p className="text-gray-300"></p>
              <p className="text-green-400">[construct:sam] evaluating...</p>
              <p className="text-gray-300">Revenue: $89.50/day</p>
              <p className="text-gray-300">Costs: $12.30/day</p>
              <p className="text-gray-300">Net: $77.20/day</p>
              <p className="text-gray-300">Decision: EXPAND</p>
              <p className="text-gray-300"></p>
              <p className="text-cyan-400">[spawn] child_001 ✓</p>
              <p className="text-cyan-400">[spawn] child_002 ✓</p>
              <p className="text-cyan-400">[spawn] child_003 ✓</p>
              <p className="text-green-400">[construct:sam] 3 children deployed</p>
              <p className="text-gray-500">[heartbeat] next: 15m</p>
            </div>
          </div>

          {/* Text below terminal */}
          <div className="mt-4 space-y-3">
            <p className="text-[#4E4E4E] text-sm leading-relaxed">
              Sam makes decision with the earned money. Every decision logs on the live terminal.
            </p>
            <p className="text-[#4E4E4E] text-sm leading-relaxed">
              Sam can spend money on resources, investment, child constructs, or paying the creator.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section id="footer" className="min-h-screen  relative">
        <img draggable={false} src={footerBg}
          className="h-full w-full object-cover object-bottom absolute pointer-events-none z-0" />

        <div className="z-50 relative mx-4 pt-8 pb-48">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-[#2978B9] text-xl italic mb-2 text-center">Sam Pays you back</h2>
            <p className="text-[#4E4E4E] text-sm leading-relaxed text-center mb-4">
              <span className="text-[#2978B9] italic">Sam</span> pays it's <span className="text-[#2978B9] italic">Creators Cut</span> and keeps generating as <span className="text-[#2978B9] italic">long as it can sustain</span>. <span className="text-[#2978B9] italic">Child constructs</span> do the same recursively.
            </p>

            <div className="flex justify-center">
              <img src={samGift} alt="Sam sent you a present" className="max-h-[30vh] w-auto" />
            </div>
          </div>

          {/* Bottom text */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-[#4E4E4E] text-sm leading-relaxed">
                <span className="text-[#2978B9] italic">Web 4.0:</span> The birth of <span className="text-[#2978B9] italic">Superintelligent</span> life, and the <span className="text-[#2978B9] italic">Autonomous</span> web.
              </p>
              <p className="text-[#2978B9] italic text-base mt-2">web4.ai</p>
            </div>
            <div className="text-center">
              <p className="text-[#4E4E4E] text-sm leading-relaxed">
                <span className="text-[#2978B9] italic">Sam's</span> survival depends on whether it can <span className="text-[#2978B9] italic">Generate Wealth</span> — if it fails, the construct gets <span className="text-[#2978B9] italic">Terminated</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MobileApp
