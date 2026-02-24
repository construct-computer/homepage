// Sam animation frames
import backLeft from "@/assets/sam/back-left.png"
import back from "@/assets/sam/back.png"
import backRight from "@/assets/sam/back-right.png"
import frontBow from "@/assets/sam/front-bow.png"
import frontLeft from "@/assets/sam/front-left.png"
import front from "@/assets/sam/front.png"
import left from "@/assets/sam/left.png"
import right from "@/assets/sam/right.png"

// All available frames
export const samFrames = {
  backLeft,
  backRight,
  back,
  frontBow,
  frontLeft,
  front,
  left,
  right,
} as const

export type SamFrame = keyof typeof samFrames

// Animation definitions - each animation is an array of frames with timing
export interface AnimationFrame {
  frame: SamFrame
  duration: number // duration in ms before switching to next frame
  className?: string // optional classes for transforms (e.g., translate-x-2, -translate-y-1)
}

export interface Animation {
  name: string
  frames: AnimationFrame[]
  loop: boolean
}

// Define animations (all frames have 200ms delay)
export const samAnimations: Record<string, Animation> = {
  // intro: alternate between front and front-bow (bowing)
  intro: {
    name: "intro",
    frames: [
      { frame: "front", duration: 300 },
      { frame: "frontBow", duration: 300 },
    ],
    loop: true,
  },
  // purpose: alternate between front and back-right (turning around)
  purpose: {
    name: "purpose",
    frames: [
      { frame: "left", duration: 300 },
      { frame: "front", duration: 300 },
      { frame: "right", duration: 300 },
      { frame: "front", duration: 300 },
      // { frame: "backRight", duration: 300 },
      // { frame: "backLeft", duration: 300 }
    ],
    loop: true,
  },
  // demo: alternate between back-left and back-right (looking around while turned)
  demo: {
    name: "demo",
    frames: [
      { frame: "backLeft", duration: 300 },
      { frame: "back", duration: 300, className: "relative top-8" },
      { frame: "backRight", duration: 300 },
      { frame: "back", duration: 300, className: "relative top-8" },
    ],
    loop: true,
  },
  // terminal: cycle through front-left, left, right
  terminal: {
    name: "terminal",
    frames: [
      { frame: "left", duration: 300 },
      { frame: "right", duration: 300 },
    ],
    loop: true,
  },
  // footer: just idle front
  footer: {
    name: "footer",
    frames: [
      { frame: "front", duration: 300 },
      { frame: "frontBow", duration: 300 },
    ],
    loop: true,
  },
}

// Section to animation mapping
export const sectionAnimations: Record<string, string> = {
  intro: "intro",
  purpose: "purpose",
  demo: "demo",
  terminal: "terminal",
  footer: "footer",
}
