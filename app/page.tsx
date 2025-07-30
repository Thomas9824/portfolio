'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import SpotlightNavbar from './Home/components/SpotlightNavbar'
import LightRays from './Home/components/LightRays'
import About from './About/About'

gsap.registerPlugin(ScrollToPlugin)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navbarRef = useRef<HTMLDivElement>(null)
  const homeContentRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')
  
  // Debug log
  console.log('Current section:', currentSection)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (isAnimating) return
      
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      if (scrollY < windowHeight * 0.5) {
        if (currentSection !== 'home') {
          setCurrentSection('home')
          
          // Only animate if not currently animating
          if (!isAnimating) {
            // Hide header navbar first
            gsap.to("#header-nav", {
              duration: 0.3,
              opacity: 0,
              y: -20,
              ease: "power2.in"
            })
            
            // Restore navbar position
            gsap.to(navbarRef.current, {
              duration: 0.7,
              y: 0,
              x: 0,
              scale: 1,
              ease: "power3.inOut"
            })
            
            // Fade in home content
            if (homeContentRef.current?.children) {
              gsap.to(Array.from(homeContentRef.current.children), {
                duration: 0.5,
                opacity: 1,
                y: 0,
                stagger: 0.05,
                ease: "power2.out",
                delay: 0.2
              })
            }
          }
        }
      } else {
        if (currentSection !== 'about') {
          setCurrentSection('about')
          
          // Only animate if not currently animating (to avoid conflicts with manual navigation)
          if (!isAnimating) {
            // Animate navbar to header position on scroll
            gsap.to(navbarRef.current, {
              duration: 0.4,
              y: -window.innerHeight * 0.35,
              x: window.innerWidth * 0.15,
              scale: 0.85,
              ease: "power3.inOut"
            })
            
            // Fade out home content
            if (homeContentRef.current?.children) {
              gsap.to(Array.from(homeContentRef.current.children), {
                duration: 0.2,
                opacity: 0,
                y: -20,
                stagger: 0.02,
                ease: "power2.inOut"
              })
            }
            
            // Show header navbar
            gsap.to("#header-nav", {
              duration: 0.2,
              opacity: 1,
              y: 0,
              ease: "power2.out",
              delay: 0.15
            })
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentSection, isAnimating])

  const handleNavClick = (href: string) => {
    if (isAnimating) return
    
    if (href === '#about') {
      setCurrentSection('about')
      setIsAnimating(true)
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false)
          // Ensure we're on about section
          setCurrentSection('about')
          // Show header navbar
          gsap.to("#header-nav", {
            duration: 0.4,
            opacity: 1,
            y: 0,
            ease: "power2.out"
          })
        }
      })

      // Phase 1: Fade out other content and scale down navbar
      if (homeContentRef.current?.children) {
        tl.to(Array.from(homeContentRef.current.children), {
          duration: 0.2,
          opacity: 0,
          y: -20,
          stagger: 0.02,
          ease: "power2.inOut"
        })
      }
      
      // Phase 2: Transform navbar to header position
      tl.to(navbarRef.current, {
        duration: 0.4,
        y: -window.innerHeight * 0.35,
        x: window.innerWidth * 0.15,
        scale: 0.85,
        ease: "power3.inOut"
      }, "-=0.1")
      
      // Phase 3: Scroll to about section with smooth easing
      tl.to(window, {
        duration: 0.5,
        scrollTo: {
          y: "#about",
          offsetY: 0
        },
        ease: "power3.inOut"
      }, "-=0.2")
      
      // Phase 4: Animate about content in
      tl.fromTo("#about > div", {
        opacity: 0,
        y: 40
      }, {
        duration: 0.4,
        opacity: 1,
        y: 0,
        ease: "power3.out"
      }, "-=0.2")
    } else if (href === '#home') {
      // Reverse animation to go back home
      setCurrentSection('home')
      setIsAnimating(true)
      
      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false)
      })
      
      // Hide header navbar
      tl.to("#header-nav", {
        duration: 0.3,
        opacity: 0,
        y: -20,
        ease: "power2.in"
      })
      
      // Scroll back to home
      .to(window, {
        duration: 0.8,
        scrollTo: "#home",
        ease: "power3.inOut"
      }, "-=0.1")
      
      // Restore navbar position
      .to(navbarRef.current, {
        duration: 0.7,
        y: 0,
        x: 0,
        scale: 1,
        ease: "power3.inOut"
      }, "-=0.7")
      
      // Fade in home content
      if (homeContentRef.current?.children) {
        tl.to(Array.from(homeContentRef.current.children), {
          duration: 0.5,
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out"
        }, "-=0.3")
      }
    }
  }

  return (
    <div ref={containerRef} style={{backgroundColor: '#0A0A0A'}}>
      {/* Light Rays Background Effect */}
      <div className="fixed inset-0 w-full h-full z-[1]">
        <LightRays
          raysOrigin="top-center"
          raysColor="#E6E6E6"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* Fixed Header Navbar (initially hidden) */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40" style={{opacity: 0}} id="header-nav">
        <SpotlightNavbar
          key={`header-${currentSection}`}
          items={[
            { label: 'Home', href: '#home', active: currentSection === 'home' },
            { label: 'About', href: '#about', active: currentSection === 'about' },
            { label: 'Work', href: '#work' },
            { label: 'Contact', href: '#contact' },
          ]}
          className="inline-flex"
          onNavClick={handleNavClick}
        />
      </div>
      
      {/* Home Section */}
      <section id="home" className="relative min-h-screen z-[2]">
        {/* Home Content */}
        <div ref={homeContentRef} className="absolute h-screen flex items-center z-30" style={{left: '20%', width: '60%'}}>
          <div className="text-left max-w-2xl">
            {/* Portfolio Label */}
            <div style={{marginBottom: '2vh'}}>
              <p className="text-xs tracking-widest uppercase font-medium" style={{color: '#E6E6E6', fontFamily: 'OffBitTrial-Dot'}}>
                PORTFOLIO 2025
              </p>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-wide" style={{color: '#E6E6E6', marginBottom: '3vh'}}>
              Hello! My name <br/> is Thomas
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-2xl leading-relaxed font-normal" style={{color: '#A0A0A0', marginBottom: '6vh'}}>
              I'm a cybersecurity engineering student <br/> based in Angers, France.
            </p>

            {/* Navigation Menu */}
            <div ref={navbarRef}>
              <SpotlightNavbar
                key={`main-${currentSection}`}
                items={[
                  { label: 'Home', href: '#home', active: currentSection === 'home' },
                  { label: 'About', href: '#about', active: currentSection === 'about' },
                  { label: 'Work', href: '#work' },
                  { label: 'Contact', href: '#contact' },
                ]}
                className="inline-flex"
                onNavClick={handleNavClick}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <About />
    </div>
  )
}
