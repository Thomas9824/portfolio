'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Lanyard from './Home/Card/Lanyard'

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [showGrid, setShowGrid] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isVerySmall, setIsVerySmall] = useState(false)

  useEffect(() => {
    // Fonction pour détecter si on est sur mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsVerySmall(window.innerWidth < 480 || window.innerHeight < 700) // iPhone et petits écrans
    }

    // Vérifier au chargement initial
    checkMobile()

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Utilisation de GSAP pour initialiser la grille avec des hauteurs adaptatives
    if (gridRef.current) {
      const rowHeights = isVerySmall ? '15px 15px 15px 15px 1fr' : 
                        isMobile ? '20px 20px 20px 20px 1fr' : 
                        '40px 40px 40px 40px 1fr 30px'
      gsap.set(gridRef.current, {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: rowHeights,
        minHeight: '100vh',
        maxHeight: '100vh',
        gap: '0px',
      })
    }
  }, [isMobile, isVerySmall])

  // Définir les hauteurs de grille selon l'écran
  const gridRowHeights = isVerySmall ? '15px 15px 15px 15px 1fr' : 
                         isMobile ? '20px 20px 20px 20px 1fr' : 
                         '40px 40px 40px 40px 1fr 30px'

  return (
    <div 
      ref={gridRef}
      className="h-screen relative overflow-hidden"
      style={{ 
        backgroundColor: 'white',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: gridRowHeights,
        gap: '0px',
        padding: '0px',
      }}
    >
      {/* Toggle Switch - iOS Style */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={showGrid}
            onChange={() => setShowGrid(!showGrid)}
            className="sr-only"
          />
          <div className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${
            showGrid ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              showGrid ? 'transform translate-x-4' : 'transform translate-x-0'
            }`} />
          </div>
        </label>
      </div>

      {/* Menu - R1C1: Home */}
      <div 
        className="flex items-center justify-start h-full w-full z-5"
        style={{ 
          gridColumn: '1 / 2',
          gridRow: '1 / 2',
        }}
      >
        <a href="#home" className={`text-black font-sans ${isVerySmall ? 'text-sm' : 'text-base'} md:text-3xl hover:bg-[rgb(0,255,0)] transition-colors px-1 py-0`}>Home</a>
      </div>

      {/* Menu - R2C1: About */}
      <div 
        className="flex items-center justify-start h-full w-full z-5"
        style={{ 
          gridColumn: '1 / 2',
          gridRow: '2 / 3',
        }}
      >
        <a href="#about" className={`text-black font-sans ${isVerySmall ? 'text-sm' : 'text-base'} md:text-3xl hover:bg-[rgb(0,255,0)] transition-colors px-1 py-0`}>About</a>
      </div>

      {/* Menu - R3C1: Work */}
      <div 
        className="flex items-center justify-start h-full w-full z-5"
        style={{ 
          gridColumn: '1 / 2',
          gridRow: '3 / 4',
        }}
      >
        <a href="#work" className={`text-black font-sans ${isVerySmall ? 'text-sm' : 'text-base'} md:text-3xl hover:bg-[rgb(0,255,0)] transition-colors px-1 py-0`}>Work</a>
      </div>

      {/* Menu - R4C1: Contact */}
      <div 
        className="flex items-center justify-start h-full w-full z-5"
        style={{ 
          gridColumn: '1 / 2',
          gridRow: '4 / 5',
        }}
      >
        <a href="#contact" className={`text-black font-sans ${isVerySmall ? 'text-sm' : 'text-base'} md:text-3xl hover:bg-[rgb(0,255,0)] transition-colors px-1 py-0`}>Contact</a>
      </div>

      {/* Language Selector - R1C12: FR/EN */}
      <div 
        className="flex items-center justify-center h-full w-full z-5"
        style={{ 
          gridColumn: '12 / 13',
          gridRow: '1 / 2',
        }}
      >
        <div className={`text-black font-sans ${isVerySmall ? 'text-xs' : 'text-xs'} md:text-lg h-full w-full flex items-center justify-center`}>
          <span className="cursor-pointer hover:text-gray-600 transition-colors">FR</span>
          <span className="mx-1">/</span>
          <span className="cursor-pointer hover:text-gray-600 transition-colors">EN</span>
        </div>
      </div>

      {/* Footer Desktop - R6: Thomas Mionnet © 2025 + Drag it! défilant */}
      {!isMobile && (
        <div 
          className="relative h-full w-full z-5 overflow-hidden"
          style={{ 
            gridColumn: '1 / -1',
            gridRow: '6',
            backgroundColor: 'rgb(0,255,0)',
          }}
        >
          {/* Copyright - desktop */}
          <div className="absolute left-0 top-0 h-full flex items-center justify-center px-4" style={{ width: '50%' }}>
            <p className="text-black font-sans text-lg font-bold whitespace-nowrap">
              Thomas Mionnet © 2025
            </p>
          </div>
          
          {/* Texte défilant "drag it !" - desktop */}
          <div className="absolute top-0 h-full flex items-center overflow-hidden" style={{ left: '50%', width: '50%' }}>
            <div 
              className="whitespace-nowrap text-black font-sans text-2xl font-bold animate-scroll"
              style={{
                animation: 'scroll-left 8s linear infinite',
              }}
            >
              drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • 
            </div>
          </div>
        </div>
      )}

      {/* Footer Mobile - Position fixe au niveau du toggle */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 right-16 z-5 h-8 flex items-center overflow-hidden" style={{ backgroundColor: 'rgb(0,255,0)' }}>
          {/* Copyright - mobile fixe */}
          <div className="absolute left-0 top-0 h-full flex items-center justify-center px-2" style={{ width: '50%' }}>
            <p className={`text-black font-sans ${isVerySmall ? 'text-xs' : 'text-xs'} font-bold whitespace-nowrap`}>
              Thomas Mionnet © 2025
            </p>
          </div>
          
          {/* Texte défilant "drag it !" - mobile fixe */}
          <div className="absolute top-0 h-full flex items-center overflow-hidden" style={{ left: '50%', width: '50%' }}>
            <div 
              className={`whitespace-nowrap text-black font-sans ${isVerySmall ? 'text-xs' : 'text-xs'} font-bold animate-scroll`}
              style={{
                animation: 'scroll-left 8s linear infinite',
              }}
            >
              drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • drag it ! • 
            </div>
          </div>
        </div>
      )}
      
      {/* Animation CSS pour le défilement */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll-left 12s linear infinite;
        }
      `}</style>

      {/* Content - R1 à R6: Lanyard Full Screen */}
      <div 
        className="flex items-center justify-center h-full w-full z-30"
        style={{ 
          gridColumn: '1 / -1',
          gridRow: '1 / -1',
        }}
      >
        <Lanyard isVerySmall={isVerySmall} />
      </div>

      {/* Debug Grid - Conditional */}
      {showGrid && (
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-30"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: gridRowHeights,
            gap: '0px',
            padding: '0px',
          }}
        >
          {/* Génération de toutes les cellules de la grille */}
          {Array.from({ length: isMobile ? 5 : 6 }, (_, rowIndex) => 
            Array.from({ length: 12 }, (_, colIndex) => {
              const rowNames = isMobile ? ['menu1', 'menu2', 'menu3', 'menu4', 'content'] : ['menu1', 'menu2', 'menu3', 'menu4', 'content', 'footer']
              const rowColors = ['bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500']
              
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`border-2 border-white border-opacity-60 ${rowColors[rowIndex]} bg-opacity-20 flex items-center justify-center`}
                  style={{ 
                    gridColumn: `${colIndex + 1} / ${colIndex + 2}`,
                    gridRow: `${rowIndex + 1} / ${rowIndex + 2}`,
                    minHeight: rowIndex === 5 ? '30px' : rowIndex < 4 ? (isVerySmall ? '15px' : isMobile ? '20px' : '40px') : 'auto'
                  }}
                >
                  <div className="text-xs text-white font-bold text-center bg-black bg-opacity-50 px-1 py-0.5 rounded font-sans">
                    <div>R{rowIndex + 1}C{colIndex + 1}</div>
                    <div className="text-[10px] opacity-70">{rowNames[rowIndex]}</div>
                  </div>
                </div>
              )
            })
          )}
          
          {/* Lignes de séparation principales */}
          <div 
            className="border-t-4 border-white border-opacity-80"
            style={{ gridColumn: '1 / -1', gridRow: '1 / 2' }}
          />
          <div 
            className="border-t-4 border-white border-opacity-80"
            style={{ gridColumn: '1 / -1', gridRow: '2 / 3' }}
          />
          <div 
            className="border-t-4 border-white border-opacity-80"
            style={{ gridColumn: '1 / -1', gridRow: '3 / 4' }}
          />
          <div 
            className="border-t-4 border-white border-opacity-80"
            style={{ gridColumn: '1 / -1', gridRow: '4 / 5' }}
          />
          <div 
            className="border-t-4 border-white border-opacity-80"
            style={{ gridColumn: '1 / -1', gridRow: '5 / 6' }}
          />
          {!isMobile && (
            <div 
              className="border-t-4 border-white border-opacity-80"
              style={{ gridColumn: '1 / -1', gridRow: '6 / 7' }}
            />
          )}
          
          {/* Lignes de séparation des colonnes */}
          {Array.from({ length: 13 }, (_, i) => (
            <div
              key={`col-${i}`}
              className="border-l-4 border-white border-opacity-80"
              style={{ gridColumn: `${i + 1} / ${i + 2}`, gridRow: '1 / -1' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
