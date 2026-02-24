import { useEffect, useRef, useState, useCallback } from "react"
import headerBg from "@/assets/hero-bg.jpg"
import purposeBg from "@/assets/purpose-bg.jpg"
import terminalBg from "@/assets/terminal-bg.jpg"
import footerBg from "@/assets/footer-bg.jpg"
import heroGirl from "@/assets/hero-girl.png"
import samGift from "@/assets/sam-gift.png"
import { samFrames, samAnimations, sectionAnimations } from "@/config/sam-animations"

function App() {
  const [currentSection, setCurrentSection] = useState("intro")
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [showSam, setShowSam] = useState(false)
  const [samScale, setSamScale] = useState(1)
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
      const introSection = document.getElementById('intro')

      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect()
        const shouldShow = heroRect.bottom <= 0
        setShowSam(shouldShow)
      }

      // Calculate scale based on intro section position
      if (introSection) {
        const introRect = introSection.getBoundingClientRect()
        const screenHeight = window.innerHeight

        // When intro is fully visible (top = 0), scale = 1
        // When intro is scrolled up (top = -screenHeight), scale = 0.5
        if (introRect.top <= 0 && introRect.bottom >= 0) {
          const scrollProgress = Math.abs(introRect.top) / screenHeight
          const newScale = 1 - (scrollProgress * 0.5) // Scale from 1 to 0.5
          setSamScale(Math.max(0.5, Math.min(1, newScale)))
        } else if (introRect.top > 0) {
          setSamScale(1)
        } else {
          setSamScale(0.5)
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
    <div ref={scrollContainerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <div
        className={`fixed bottom-0 left-1/2 z-[9999] pointer-events-none transition-all duration-500 ease-out origin-bottom ${showSam ? 'opacity-100' : 'opacity-0 translate-y-20'}`}
        style={{ transform: `translateX(-50%) scale(${samScale})` }}
      >
        <div className="relative flex items-end justify-center">
          <img
            src={currentFrameSrc}
            className={`max-h-[70vh] transition-transform duration-200 ${currentFrameClassName}`}
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
            }}
          />
        </div>
      </div>
      <div className="">
        <section id="hero" className="h-screen min-h-screen max-h-screen relative snap-start snap-always">
          <img draggable={false} src={headerBg}
            className="h-full w-full min-h-screen max-h-screen min-w-screen max-w-screen object-cover object-center origin-center absolute pointer-events-none z-0" />
          <div className="bg-white z-20 absolute w-164 mx-auto bottom-0 left-1/2 -translate-x-1/2 h-3/4 [box-shadow:30px_0_15px_-15px_rgba(0,0,0,0.15),-30px_0_15px_-15px_rgba(0,0,0,0.15)]">
            <img src={heroGirl} className="absolute bottom-0 mx-auto left-1/2 -translate-x-1/2" />
            <div className="w-14! min-w-14 max-w-14 border-r bg-white h-full absolute left-0" ></div>
            <div className="h-14! min-h-14 max-h-14 border-b bg-white absolute top-0 w-full" ></div>
            <div className="w-14! min-w-14 max-w-14 border-l bg-white absolute right-0 h-full" ></div>
            <div className="text-right absolute top-14 right-14 text-5xl p-10 pr-12 text-[#4E4E4E] leading-14">
              ... Let's simulate <br /><span className="text-[#2978B9]">Life</span>
            </div>

            <div className="absolute bottom-14 left-14 right-14 z-10 flex justify-center">
              <div className="relative inline-block">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[80%] h-4 bg-white"></div>
                <button
                  onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-black text-white p-6 px-12 text-2xl cursor-pointer transition-transform hover:-translate-y-2 active:-translate-y-4">
                  spawn <span className="italic">construct</span>
                </button>
              </div>
            </div>

            <div className="absolute -right-3 bottom-2 -rotate-90 bg-white px-10 mb-10">
              web 4.0
            </div>
          </div>
        </section>
        <section id="intro" className="h-screen min-h-screen max-h-screen snap-start snap-always relative">
          <div className="bg-white z-20 absolute w-164 mx-auto top-0 left-1/2 -translate-x-1/2 h-full [box-shadow:30px_0_15px_-15px_rgba(0,0,0,0.15),-30px_0_15px_-15px_rgba(0,0,0,0.15)]">
            <div className="w-14! min-w-14 max-w-14 border-r bg-white h-full absolute left-0" ></div>
            <div className="absolute top-0 left-14 right-14 pt-14 px-10">
              <div className="text-[#4E4E4E] text-2xl leading-relaxed">
                <p className="mb-6">
                  <span className="text-[#2978B9]">Meet </span>
                  <span className="text-[#2978B9] italic font-semibold">Sam</span>
                  <span className="text-[#2978B9]">,</span>
                  <br />
                  <span className="text-[#8BB8D9] italic">a construct, that you just created.</span>
                </p>
                <p className="mb-6">
                  Sam has <span className="text-[#2978B9] italic font-semibold">Intelligence</span>, just like chatGPT,
                  <br />Claud Code, Open Claw. Now all what
                  <br />Sam needs is the <span className="text-[#2978B9] italic font-semibold">Permission</span> to the
                  <br /><span className="text-[#2978B9] italic font-semibold">Open World</span>
                </p>
                <p className="text-center">
                  Let's give sam a <span className="text-[#2978B9] italic font-semibold">Purpose</span> some <span className="text-[#2978B9] italic font-semibold">Money</span>
                  <br />and <span className="text-[#2978B9] italic font-semibold">Resources</span> so it can find ways to
                  <br /><span className="text-[#2978B9] italic font-semibold text-right block">Survive</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="purpose" className="h-screen min-h-screen max-h-screen snap-start snap-always relative">
          <img draggable={false} src={purposeBg}
            className="h-full w-full min-h-screen max-h-screen min-w-screen max-w-screen object-cover object-bottom origin-center absolute pointer-events-none z-0" />

          {/* Purpose Card */}
          <div className="z-50 absolute left-1/2 -translate-x-1/2 top-8 w-[900px] max-w-[95vw] bg-[#1a1a1a] rounded-3xl p-10 text-white">
            <div className="flex justify-between">
              {/* Left Column */}
              <div className="flex-1 pr-8">
                <h2 className="text-[#6B9AC4] text-2xl italic mb-2">Sam's Purpose</h2>
                <p className="text-gray-300 text-lg mb-8">
                  Sam has to make economy for itself<br />and the creator.
                </p>

                <h3 className="text-[#6B9AC4] text-xl italic mb-4">Resources Provided to Sam</h3>

                <div className="space-y-4 text-gray-300">
                  <p>
                    <span className="italic font-semibold text-white">Identity & Wallet</span> - Sam will have it's own cryptographic wallets and private keys.
                  </p>
                  <p>
                    <span className="italic font-semibold text-white">Permissionless Payments</span> - Sam can pay for services using stable coin over the openx402 protocol, with no human intervention required
                  </p>
                  <p>
                    <span className="italic font-semibold text-white">Compute & Inference</span> - Sam has access to Full Linux servers and frontier models and other permissionless compute for constructs.
                  </p>
                  <p>
                    <span className="italic font-semibold text-white">Deployment to the Real World to Earn</span> - Sam has access to build products, market it, host it and earn like a human
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="text-right pl-8">
                <h2 className="text-[#6B9AC4] text-2xl italic mb-2">Money Provided to Sam</h2>
                <p className="text-gray-300 text-lg">Let's Say,</p>
                <p className="text-6xl font-bold mt-2">$100</p>

                <div className="mt-24">
                  <p className="text-[#6B9AC4] italic">-by</p>
                  <p className="text-2xl italic">Literally You!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white z-20 absolute w-164 mx-auto bottom-0 left-1/2 -translate-x-1/2 h-full [box-shadow:30px_0_15px_-15px_rgba(0,0,0,0.15),-30px_0_15px_-15px_rgba(0,0,0,0.15)]">
            <div className="w-14! min-w-14 max-w-14 border-r bg-white h-full absolute left-0" ></div>

            {/* Speech bubble */}
            <div className="absolute bottom-48 right-[-80px] bg-white rounded-lg px-4 py-2 shadow-md">
              <p className="text-gray-600 text-sm">Are you serious?</p>
            </div>
          </div>
        </section>
        <section id="demo" className="h-screen min-h-screen max-h-screen snap-start snap-always relative">
          {/* Web 4.0 label */}
          <div className="absolute top-6 left-6 z-30">
            <p className="text-[#4E4E4E] text-xl italic">web 4.0</p>
          </div>

          {/* Video container with text below */}
          <div className="z-50 absolute left-1/2 -translate-x-1/2 top-16 w-[95vw] max-w-[1200px]">
            {/* Video placeholder */}
            <div className="w-full h-[55vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Video placeholder - replace with actual video */}
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {/* Play button */}
                <div className="w-32 h-32 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                  <div className="w-0 h-0 border-t-[24px] border-t-transparent border-l-[40px] border-l-gray-800 border-b-[24px] border-b-transparent ml-2"></div>
                </div>
              </div>
            </div>

            {/* Text below video */}
            <div className="flex justify-between mt-4 px-2">
              {/* Left description */}
              <div className="w-[280px] text-left">
                <p className="text-[#4E4E4E] text-sm leading-relaxed">
                  Sam carefully examines the webOS browses the internet, finds way to generate income, makes a plan, creates workflow for itself.
                </p>
              </div>

              {/* Right description */}
              <div className="w-[280px] text-right">
                <p className="text-[#4E4E4E] text-sm leading-relaxed">
                  By hosting html, Sam interacts with the outer world, judiciously buys assets while monitoring the expense.
                </p>
                <p className="text-[#4E4E4E] text-xl mt-4">
                  ... More than an<br />
                  <span className="italic text-[#2978B9]">Agent</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white z-20 absolute w-164 mx-auto bottom-0 left-1/2 -translate-x-1/2 h-full [box-shadow:30px_0_15px_-15px_rgba(0,0,0,0.15),-30px_0_15px_-15px_rgba(0,0,0,0.15)]">
            <div className="w-14! min-w-14 max-w-14 border-r bg-white h-full absolute left-0" ></div>
          </div>
        </section>
        <section id="terminal" className="h-screen min-h-screen max-h-screen snap-start snap-always relative">
          <img draggable={false} src={terminalBg}
            className="h-full w-full min-h-screen max-h-screen min-w-screen max-w-screen object-cover object-top origin-center absolute pointer-events-none z-0" />

          {/* Web 4.0 label */}
          <div className="absolute top-6 left-6 z-30">
            <p className="text-white text-xl italic">web 4.0</p>
          </div>

          {/* Terminal window */}
          <div className="z-50 absolute left-1/2 -translate-x-1/2 top-16 w-[95vw] max-w-[1000px]">
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="bg-[#2a2a2a] px-4 py-3 flex items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27ca3f]"></div>
                </div>
                <p className="text-gray-400 text-sm flex-1 text-center">Sam's Terminal</p>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm leading-relaxed h-[55vh] overflow-auto">
                <p className="text-green-400">[construct:sam] booting up...</p>
                <p className="text-green-400">[construct:sam] loading wallet from /keys/sam.key</p>
                <p className="text-cyan-400">[wallet] address: 0x7a3f...e9b2</p>
                <p className="text-gray-300"></p>
                <p className="text-yellow-400">[wallet] checking balance...</p>
                <p className="text-yellow-400">[wallet] GET api.construct.ai/v1/balance</p>
                <p className="text-green-400">[wallet] balance: $247.83 USDC ✓</p>
                <p className="text-gray-300"></p>
                <p className="text-green-400">[construct:sam] evaluating growth strategy...</p>
                <p className="text-cyan-400">[inference] claude-opus-4-6 -$0.02</p>
                <p className="text-gray-300">Current revenue: $89.50/day</p>
                <p className="text-gray-300">Operating costs: $12.30/day</p>
                <p className="text-gray-300">Net profit: $77.20/day</p>
                <p className="text-gray-300">Decision: EXPAND → spawn child constructs</p>
                <p className="text-gray-300"></p>
                <p className="text-green-400">[construct:sam] initiating spawn sequence...</p>
                <p className="text-yellow-400">[spawn] allocating $50.00 per child construct</p>
                <p className="text-gray-300"></p>
                <p className="text-cyan-400">[spawn] creating child_construct_001...</p>
                <p className="text-gray-300">  purpose: "content_writer"</p>
                <p className="text-gray-300">  initial_funds: $50.00</p>
                <p className="text-green-400">  [child_construct_001] spawned ✓</p>
                <p className="text-gray-300"></p>
                <p className="text-cyan-400">[spawn] creating child_construct_002...</p>
                <p className="text-gray-300">  purpose: "market_researcher"</p>
                <p className="text-gray-300">  initial_funds: $50.00</p>
                <p className="text-green-400">  [child_construct_002] spawned ✓</p>
                <p className="text-gray-300"></p>
                <p className="text-cyan-400">[spawn] creating child_construct_003...</p>
                <p className="text-gray-300">  purpose: "code_auditor"</p>
                <p className="text-gray-300">  initial_funds: $50.00</p>
                <p className="text-green-400">  [child_construct_003] spawned ✓</p>
                <p className="text-gray-300"></p>
                <p className="text-green-400">[construct:sam] 3 child constructs deployed</p>
                <p className="text-yellow-400">[wallet] new balance: $97.83 USDC</p>
                <p className="text-green-400">[construct:sam] entering heartbeat mode...</p>
                <p className="text-gray-500">[heartbeat] next check in 15m</p>
              </div>
            </div>

            {/* Text below terminal */}
            <div className="flex justify-between mt-4 px-2">
              {/* Left description */}
              <div className="w-[280px] text-left">
                <p className="text-[#4E4E4E] text-sm leading-relaxed">
                  Sam makes decision with the earned money. Every decision it makes logs on the live terminal.
                </p>
              </div>

              {/* Right description */}
              <div className="w-[280px] text-right">
                <p className="text-[#4E4E4E] text-sm leading-relaxed">
                  Sam can spend money as per the requirements. Can be resources, investment, generating child constructs, paying the creator.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white z-20 absolute w-164 mx-auto bottom-0 left-1/2 -translate-x-1/2 h-full [box-shadow:30px_0_15px_-15px_rgba(0,0,0,0.15),-30px_0_15px_-15px_rgba(0,0,0,0.15)]">
            <div className="w-14! min-w-14 max-w-14 border-r bg-white h-full absolute left-0" ></div>

            {/* Speech bubble */}
            <div className="absolute bottom-48 right-[-100px] bg-white rounded-lg px-4 py-2 shadow-md">
              <p className="text-red-500 text-sm font-semibold">Yap! Yap! Yap!</p>
            </div>
          </div>
        </section>
        <section id="footer" className="h-screen min-h-screen max-h-screen snap-start snap-always relative">
          <img draggable={false} src={footerBg}
            className="h-full w-full min-h-screen max-h-screen min-w-screen max-w-screen object-cover object-bottom origin-center absolute pointer-events-none z-0" />

          {/* Left side text */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-[280px]">
            <p className="text-[#4E4E4E] text-base leading-relaxed mb-3">
              <span className="text-[#2978B9] italic">Web 4.0:</span> The birth of <span className="text-[#2978B9] italic">Superintelligent</span> life, and the <span className="text-[#2978B9] italic">Autonomous</span> web.
            </p>
            <p className="text-[#2978B9] italic text-base">web4.ai</p>
          </div>

          {/* Right side text */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-[280px] text-right">
            <p className="text-[#4E4E4E] text-base leading-relaxed">
              <span className="text-[#2978B9] italic">Sam's</span> survival depends on whether it can <span className="text-[#2978B9] italic">Generate Wealth</span> if it fails the construct gets <span className="text-[#2978B9] italic">Terminated</span>.
            </p>
          </div>

          <div className="bg-white z-20 absolute w-164 mx-auto bottom-0 left-1/2 -translate-x-1/2 h-full [box-shadow:30px_0_15px_-15px_rgba(0,0,0,0.15),-30px_0_15px_-15px_rgba(0,0,0,0.15)]">
            <div className="w-14! min-w-14 max-w-14 border-r bg-white h-full absolute left-0" ></div>

            {/* Sam Pays you back content */}
            <div className="absolute top-8 left-14 right-14 px-4 flex flex-col items-center h-[calc(100%-12rem)]">
              <h2 className="text-[#2978B9] text-2xl italic mb-3 text-center">Sam Pays you back</h2>
              <p className="text-[#4E4E4E] text-sm leading-relaxed text-center max-w-[400px]">
                <span className="text-[#2978B9] italic">Sam</span> pays it's <span className="text-[#2978B9] italic">Creators Cut</span> and keeps on generating more as <span className="text-[#2978B9] italic">long as it can sustain</span>. <span className="text-[#2978B9] italic">The child construct</span> does the same recursively
              </p>

              {/* Payment card */}
              <div className="mt-4 flex-1 flex items-center justify-center">
                <img src={samGift} alt="Sam sent you a present" className="max-h-full w-auto max-w-[320px]" />
              </div>
            </div>

            {/* Speech bubble */}
            <div className="absolute bottom-52 right-[-80px] bg-white rounded-lg px-4 py-2 shadow-md">
              <p className="text-gray-600 text-sm">Arigato!</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
