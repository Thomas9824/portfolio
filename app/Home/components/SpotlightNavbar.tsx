'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface NavItem {
  label: string
  href: string
  active?: boolean
}

interface SpotlightNavbarProps {
  items?: NavItem[]
  className?: string
  onNavClick?: (href: string) => void
}

const defaultItems: NavItem[] = [
  { label: 'Newsletter', href: '#newsletter', active: true },
  { label: 'Course', href: '#product' },
  { label: 'Pricing', href: '#price' },
  { label: 'Subscribe', href: '#subscribe' },
]

export default function SpotlightNavbar({ 
  items = defaultItems,
  className = '',
  onNavClick
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLAnchorElement[]>([])
  const spotlightBlurRef = useRef<SVGFEGaussianBlurElement>(null)
  const spotlightLightingRef = useRef<SVGFESpecularLightingElement>(null)
  const spotlightPointRef = useRef<SVGFEPointLightElement>(null)
  const ambienceBlurRef = useRef<SVGFEGaussianBlurElement>(null)
  const ambienceLightingRef = useRef<SVGFESpecularLightingElement>(null)
  const ambiencePointRef = useRef<SVGFEPointLightElement>(null)
  
  const [monitoring, setMonitoring] = useState(false)

  const config = {
    theme: 'dark',
    spotlight: {
      speed: 0.25,
      deviation: 0.8,
      surface: 0.5,
      specular: 6,
      exponent: 65,
      light: 'hsla(234, 14%, 72%, 0.25)',
      x: 0,
      y: 54,
      z: 82,
      pointer: false,
    },
    ambience: {
      deviation: 0.8,
      surface: 0.5,
      specular: 25,
      exponent: 65,
      light: 'hsla(234, 14%, 72%, 0.25)',
      x: 120,
      y: -154,
      z: 160,
    },
  }

  const syncLight = ({ x, y }: { x: number; y: number }) => {
    if (!navRef.current || !spotlightPointRef.current) return
    
    const navBounds = navRef.current.getBoundingClientRect()
    spotlightPointRef.current.setAttribute('x', Math.floor(x - navBounds.x).toString())
    spotlightPointRef.current.setAttribute('y', Math.floor(y - navBounds.y).toString())
  }

  const update = () => {
    if (!navRef.current || !spotlightBlurRef.current || !spotlightLightingRef.current || 
        !spotlightPointRef.current || !ambienceBlurRef.current || !ambienceLightingRef.current || 
        !ambiencePointRef.current) return

    document.documentElement.dataset.theme = config.theme

    // Set spotlight
    spotlightBlurRef.current.setAttribute('stdDeviation', config.spotlight.deviation.toString())
    spotlightLightingRef.current.setAttribute('surfaceScale', config.spotlight.surface.toString())
    spotlightLightingRef.current.setAttribute('specularConstant', config.spotlight.specular.toString())
    spotlightLightingRef.current.setAttribute('specularExponent', config.spotlight.exponent.toString())
    spotlightLightingRef.current.setAttribute('lighting-color', config.spotlight.light)

    // Set ambience
    ambienceBlurRef.current.setAttribute('stdDeviation', config.ambience.deviation.toString())
    ambienceLightingRef.current.setAttribute('surfaceScale', config.ambience.surface.toString())
    ambienceLightingRef.current.setAttribute('specularConstant', config.ambience.specular.toString())
    ambienceLightingRef.current.setAttribute('specularExponent', config.ambience.exponent.toString())
    ambienceLightingRef.current.setAttribute('lighting-color', config.ambience.light)

    const anchor = document.querySelector('[data-active="true"]') as HTMLAnchorElement
    if (anchor && navRef.current) {
      const navBounds = navRef.current.getBoundingClientRect()
      const anchorBounds = anchor.getBoundingClientRect()

      spotlightPointRef.current.setAttribute(
        'x',
        (anchorBounds.left - navBounds.left + anchorBounds.width * 0.5 + config.spotlight.x).toString()
      )
      spotlightPointRef.current.setAttribute('y', config.spotlight.y.toString())
      spotlightPointRef.current.setAttribute('z', config.spotlight.z.toString())
    }

    ambiencePointRef.current.setAttribute('x', config.ambience.x.toString())
    ambiencePointRef.current.setAttribute('y', config.ambience.y.toString())
    ambiencePointRef.current.setAttribute('z', config.ambience.z.toString())

    if (config.spotlight.pointer && !monitoring) {
      setMonitoring(true)
      if (navRef.current) {
        navRef.current.dataset.pointerLighting = 'true'
      }
      window.addEventListener('pointermove', syncLight)
    } else if (!config.spotlight.pointer) {
      setMonitoring(false)
      if (navRef.current) {
        navRef.current.dataset.pointerLighting = 'false'
      }
      window.removeEventListener('pointermove', syncLight)
    }
  }

  const selectAnchor = (anchor: HTMLAnchorElement) => {
    if (!config.spotlight.pointer && navRef.current && spotlightPointRef.current) {
      const navBounds = navRef.current.getBoundingClientRect()
      const anchorBounds = anchor.getBoundingClientRect()
      
      // Update active states
      linksRef.current.forEach(link => {
        const isActive = anchor === link
        link.dataset.active = isActive ? "true" : "false"
      })
      
      gsap.to(spotlightPointRef.current, {
        duration: config.spotlight.speed,
        attr: {
          x: anchorBounds.left - navBounds.left + anchorBounds.width * 0.5 + config.spotlight.x,
        },
      })
    }
  }

  const handleNavClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    let anchor: HTMLAnchorElement | null = null
    
    if (target.tagName === 'A') {
      anchor = target as HTMLAnchorElement
    } else {
      // Check if clicked element is inside an anchor
      anchor = target.closest('a') as HTMLAnchorElement
    }
    
    if (anchor) {
      e.preventDefault()
      const href = anchor.getAttribute('href') || ''
      
      // Call external handler if provided
      if (onNavClick) {
        onNavClick(href)
      }
      
      selectAnchor(anchor)
    }
  }

  useEffect(() => {
    update()
  }, [])

  // Update active states when items prop changes
  useEffect(() => {
    items.forEach((item, index) => {
      if (linksRef.current[index]) {
        linksRef.current[index].dataset.active = item.active ? "true" : "false"
      }
    })
  }, [items])

  useEffect(() => {
    return () => {
      if (monitoring) {
        window.removeEventListener('pointermove', syncLight)
      }
    }
  }, [monitoring])

  return (
    <>
      {/* Navigation */}
      <nav 
        ref={navRef}
        className={className}
        onClick={handleNavClick}
      >
        <ul aria-hidden="true" className="lit">
          {items.map((item, index) => (
            <li key={index}>{item.label}</li>
          ))}
        </ul>
        
        <ul className="content">
          {items.map((item, index) => (
            <li key={index}>
              <a
                ref={el => {
                  if (el) linksRef.current[index] = el
                }}
                data-active={item.active ? "true" : "false"}
                href={item.href}
              >
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Spotlight Filter */}
      <svg className="sr-only">
        <filter id="spotlight">
          <feGaussianBlur
            ref={spotlightBlurRef}
            in="SourceAlpha"
            stdDeviation="3"
            result="blur"
          />
          <feSpecularLighting
            ref={spotlightLightingRef}
            result="lighting"
            in="blur"
            surfaceScale="5"
            specularConstant="0.5"
            specularExponent="120"
            lightingColor="#ffffff"
          >
            <fePointLight ref={spotlightPointRef} x="50" y="50" z="300" />
          </feSpecularLighting>
          <feComposite
            in="lighting"
            in2="SourceAlpha"
            operator="in"
            result="composite"
          />
          <feComposite
            in="merged"
            in2="composite"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litPaint"
          />
        </filter>
        
        <filter id="ambience">
          <feGaussianBlur
            ref={ambienceBlurRef}
            in="SourceAlpha"
            stdDeviation="3"
            result="blur"
          />
          <feSpecularLighting
            ref={ambienceLightingRef}
            result="lighting"
            in="blur"
            surfaceScale="5"
            specularConstant="0.5"
            specularExponent="120"
            lightingColor="#ffffff"
          >
            <fePointLight ref={ambiencePointRef} x="50" y="50" z="300" />
          </feSpecularLighting>
          <feComposite
            in="lighting"
            in2="SourceAlpha"
            operator="in"
            result="composite"
          />
          <feComposite
            in="merged"
            in2="composite"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litPaint"
          />
        </filter>
      </svg>
    </>
  )
}