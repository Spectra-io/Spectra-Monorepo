'use client'

import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'About Us', href: '#quienes-somos' },
    { label: 'Features', href: '#caracteristicas' },
    { label: 'How It Works', href: '#como-funciona' },
    { label: 'Problems', href: '#problemas' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-x-hidden ${
        isScrolled
          ? 'bg-gray-900/20 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-gray-900/10 backdrop-blur-lg border-b border-white/5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 -ml-2 lg:-ml-10">
            <Logo />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-200 hover:text-purple-300 transition-colors text-sm font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/onboarding">Start KYC</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-200 hover:text-purple-300 transition-colors p-2 rounded-lg hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900/30 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-5 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-gray-200 hover:text-purple-300 transition-colors text-base font-medium py-2 rounded-lg hover:bg-white/5 px-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                asChild
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
              >
                <Link href="/onboarding">Start KYC</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

