import React, { useEffect, useRef } from 'react'
import './Hero.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const sectionRef = useRef(null)   
  const videoRef   = useRef(null)
  const overlayRef  = useRef(null)

  // Refs for animation layers
  const ch1TitleRef = useRef(null)
  const ch1SubRef   = useRef(null)
  const ch2TitleRef = useRef(null)
  const ch2SubRef   = useRef(null)
  const ch3TitleRef = useRef(null)
  const ch3SubRef   = useRef(null)

  useEffect(() => {
    const video   = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    video.pause()
    video.currentTime = 0

    const setup = () => {
      const duration = video.duration
      // Extending scroll length to make it feel more "epic" and less rushed
      const scrollLen = window.innerHeight * 6 
      section.style.height = `${scrollLen + window.innerHeight}px`

      // 1. SMOOTH VIDEO SCRUBBING
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${scrollLen}`,
        scrub: 2, // This adds the "liquid" feel to the scroll
        onUpdate: (self) => {
          const targetTime = self.progress * duration
          // We use gsap.to instead of direct assignment to prevent frame jumping
          gsap.to(video, {
            currentTime: targetTime,
            duration: 0.5,
            ease: "power1.out"
          })
        },
      })

      // 2. TEXT ANIMATION TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${scrollLen}`,
          scrub: 1.5, // Slightly faster than the video for a parallax feel
        },
      })

      // Chapter 1: The Walls
      tl.fromTo(ch1TitleRef.current, { opacity: 0, y: 100, filter: 'blur(20px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2 })
      tl.fromTo(ch1SubRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=1")
      tl.to([ch1TitleRef.current, ch1SubRef.current], { opacity: 0, y: -100, filter: 'blur(10px)', duration: 2 }, "+=2")

      // Chapter 2: Shingeki No Kyojin
      tl.fromTo(ch2TitleRef.current, { opacity: 0, scale: 0.8, letterSpacing: "1em" }, { opacity: 1, scale: 1, letterSpacing: "0.2em", duration: 2 })
      tl.fromTo(ch2SubRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=1")
      tl.to([ch2TitleRef.current, ch2SubRef.current], { opacity: 0, scale: 1.2, filter: 'blur(20px)', duration: 2 }, "+=2")

      // Chapter 3: Final Reveal
      tl.fromTo(overlayRef.current, { backgroundColor: "rgba(0,0,0,0.6)" }, { backgroundColor: "rgba(0,0,0,0.2)", duration: 2 })
      tl.fromTo(ch3TitleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 })
      tl.fromTo(ch3SubRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.5")
    }

    // 3. MOUSE PARALLAX EFFECT
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const xPos = (clientX / window.innerWidth - 0.5) * 40
      const yPos = (clientY / window.innerHeight - 0.5) * 40

      gsap.to(".hero__chapter", {
        x: xPos,
        y: yPos,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto"
      })
    }

    if (video.readyState >= 1) {
      setup()
    } else {
      video.addEventListener('loadedmetadata', setup, { once: true })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__sticky">
        <video
          ref={videoRef}
          className="hero__video"
          src="/video/one.mp4"
          muted
          playsInline
          preload="auto"
        />
        
        <div className="hero__overlay" ref={overlayRef} />
        <div className="hero__grain" />

        {/* Chapter 1 */}
        <div className="hero__chapter hero__ch1">
          <div className="hero__eyebrow">
            <span className="hero__rule" />
            <span className="hero__eyebrow-txt">Year 845 · Wall Maria</span>
            <span className="hero__rule" />
          </div>
          <h1 className="hero__ch1-title" ref={ch1TitleRef}>
            BEYOND THE <em className="glow-text">WALLS</em><br />
            <span>LIES THE TRUTH</span>
          </h1>
          <p className="hero__ch1-sub" ref={ch1SubRef}>
            Humanity's last refuge — three walls, one consuming dread.
          </p>
        </div>

        {/* Chapter 2 */}
        <div className="hero__chapter hero__ch2">
          <p className="hero__ch2-title" ref={ch2TitleRef}>SHINGEKI NO KYOJIN</p>
          <p className="hero__ch2-sub"   ref={ch2SubRef}>— THE DAY THE WALL WAS BREACHED —</p>
        </div>

        {/* Chapter 3 */}
        <div className="hero__chapter hero__ch3">
          <h2 className="hero__ch3-title" ref={ch3TitleRef}>
            ATTACK<br /><span className="red-text">ON TITAN</span>
          </h2>
          <p className="hero__ch3-sub" ref={ch3SubRef}>
            Dedicate your heart. Pledge your life.
          </p>
        </div>

        <div className="hero__scroll-hint">
          <span />
        </div>
      </div>
    </section>
  )
}

export default Hero
