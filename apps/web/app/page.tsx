'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { Shield, Lock, Fingerprint, Key, Database, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-x-hidden relative">
      {/* Global Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-950/40 via-black to-gray-950 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.2),transparent_50%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none"></div>
      
      <div className="relative z-10">
      <Header />
      {/* Hero Section */}
      <section id="inicio" className="relative overflow-hidden px-5 pt-40 pb-12 lg:pt-48 lg:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-purple-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899, #8b5cf6, #a855f7)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                From Days to Seconds
              </motion.h1>
              <motion.p 
                className="text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed"
              >
                Verify your identity once. Access all Stellar anchors instantly. Your documents stay private with blockchain-powered Zero Knowledge Proofs.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-start lg:items-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-0 text-base lg:text-lg w-full sm:w-auto px-8 py-6 lg:py-7 rounded-lg font-semibold shadow-lg shadow-purple-500/20"
                  >
                    <Link href="/onboarding" className="flex items-center justify-center">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-700 text-gray-300 hover:bg-gray-900 hover:border-gray-600 hover:text-white text-base lg:text-lg w-full sm:w-auto px-8 py-6 lg:py-7 rounded-lg font-medium"
                  >
                    <Link href="#caracteristicas">Learn More</Link>
                  </Button>
                </motion.div>
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center lg:text-left">
                Solo validación
              </p>
            </motion.div>

            {/* Right Column - Code Snippet Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:mt-0"
            >
              <div className="relative bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-5 lg:p-7 overflow-hidden group hover:border-purple-500/60 transition-all duration-300 shadow-2xl shadow-purple-900/20">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-purple-600/0 group-hover:from-purple-500/10 group-hover:via-purple-500/20 group-hover:to-purple-600/10 transition-all duration-500"></div>
                
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">zk-proof.ts</span>
                  </div>
                  
                  {/* Code Content */}
                  <div className="font-mono text-xs lg:text-sm space-y-2 leading-relaxed">
                    <motion.div
                      className="text-gray-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                    >
                      <span className="text-gray-500">//</span> <span className="text-gray-500 italic">Generate ZK proof for identity</span>
                    </motion.div>
                    <motion.div
                      className="text-gray-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                    >
                      <span className="text-purple-400">const</span> <span className="text-blue-400">proof</span> = <span className="text-green-400">await</span> <span className="text-yellow-400">generateZKProof</span>({'{'}
                    </motion.div>
                    <motion.div
                      className="text-gray-300 pl-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="text-blue-400">identity</span>: <span className="text-green-400">userData</span>,
                    </motion.div>
                    <motion.div
                      className="text-gray-300 pl-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9 }}
                    >
                      <span className="text-blue-400">reveal</span>: <span className="text-orange-400">false</span>,
                    </motion.div>
                    <motion.div
                      className="text-gray-300 pl-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.0 }}
                    >
                      <span className="text-blue-400">anchor</span>: <span className="text-green-400">"stellar"</span>
                    </motion.div>
                    <motion.div
                      className="text-gray-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.1 }}
                    >
                      {'}'});
                    </motion.div>
                    <motion.div
                      className="pt-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 }}
                    >
                      <span className="text-gray-500">//</span> <span className="text-green-400">✓ Proof generated</span>
                    </motion.div>
                    <motion.div
                      className="text-gray-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.3 }}
                    >
                      <span className="text-gray-500">//</span> <span className="text-gray-500 italic">Access granted to all Stellar anchors</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="px-5 py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-purple-950/25 to-black/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(139,92,246,0.18),transparent_65%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(236,72,153,0.12),transparent_55%)]"></div>
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-100">
              Built for Privacy
            </h2>
            <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
              Everything you need to verify your identity without compromising your privacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: 'Zero Knowledge Proofs',
                description: 'Verify your identity without revealing sensitive information. Prove who you are without sharing unnecessary personal data.',
              },
              {
                icon: Fingerprint,
                title: 'Biometric Verification',
                description: 'Secure authentication through fingerprints and WebAuthn, ensuring only you can access your identity.',
              },
              {
                icon: Database,
                title: 'Distributed Storage',
                description: 'Decentralized system that protects your information through fragmentation and secure distribution.',
              },
              {
                icon: Lock,
                title: 'Full Control',
                description: 'You decide what information to share and with whom. Maintain complete control over your digital identity.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full group cursor-pointer">
                    <CardHeader>
                      <motion.div 
                        className="w-12 h-12 lg:w-10 lg:h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="w-6 h-6 lg:w-5 lg:h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                      </motion.div>
                      <CardTitle className="text-xl lg:text-xl text-gray-100 group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400 text-base lg:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Technical Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 lg:mt-20"
          >
            <div className="relative h-64 lg:h-80 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-purple-950/20 border border-purple-500/20">
              {/* Code-like Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                  <defs>
                    <pattern id="codePattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="currentColor" className="text-purple-500"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#codePattern)" />
                </svg>
              </div>

              {/* Architecture Diagram */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg viewBox="0 0 500 300" className="w-full h-full max-w-2xl">
                  {/* Data Flow Arrows */}
                  <motion.path
                    d="M 50 150 L 150 150"
                    stroke="#a855f7"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <motion.path
                    d="M 200 150 L 300 150"
                    stroke="#a855f7"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                  <motion.path
                    d="M 350 150 L 450 150"
                    stroke="#a855f7"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1.1 }}
                  />

                  {/* Nodes */}
                  {[
                    { x: 50, y: 150, label: 'User', delay: 0.3 },
                    { x: 150, y: 150, label: 'ZK Proof', delay: 0.6 },
                    { x: 250, y: 150, label: 'Encrypt', delay: 0.9 },
                    { x: 350, y: 150, label: 'Fragment', delay: 1.2 },
                    { x: 450, y: 150, label: 'Stellar', delay: 1.5 },
                  ].map((node, i) => (
                    <motion.g key={i}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        fill="#8b5cf6"
                        opacity="0.2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: node.delay }}
                      />
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="12"
                        fill="#a855f7"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: node.delay + 0.1 }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 50}
                        textAnchor="middle"
                        className="text-xs fill-gray-400"
                        fontSize="12"
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="px-5 py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-purple-950/20 to-gray-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(236,72,153,0.1),transparent_50%)]"></div>
        <div className="relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-100">
              How It Works
            </h2>
            <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
              Simple, secure, and fast—get verified in minutes.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Document Capture',
                description: 'Upload a photo of your identity document (ID). Our system processes the information securely.',
              },
              {
                step: '2',
                title: 'Biometric Verification',
                description: 'Complete authentication through fingerprint or WebAuthn to confirm your identity.',
              },
              {
                step: '3',
                title: 'ZK Proof Generation',
                description: 'The system generates Zero Knowledge proofs that verify your identity without revealing sensitive information.',
              },
              {
                step: '4',
                title: 'Fragmentation and Storage',
                description: 'Your information is fragmented, encrypted, and distributed securely, eliminating vulnerabilities.',
              },
              {
                step: '5',
                title: 'Stellar Integration',
                description: 'Your verified identity is linked to your Stellar account, enabling access to financial services.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col lg:flex-row gap-6 items-start group"
              >
                <div className="flex-shrink-0 relative">
                  <motion.div 
                    className="w-14 h-14 lg:w-12 lg:h-12 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xl lg:text-lg group-hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.step}
                  </motion.div>
                  {/* Connection Line (except last) */}
                  {index < 4 && (
                    <div className="absolute left-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-purple-600 to-purple-400/30 transform -translate-x-1/2 lg:hidden"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-2xl font-semibold text-gray-100 mb-3 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base lg:text-lg text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section id="problemas" className="px-5 py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-purple-950/25 to-black/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.16),transparent_65%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.12),transparent_55%)]"></div>
        <div className="relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-100">
              Problems We Solve
            </h2>
            <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
              Traditional KYC compromises your privacy. We fix that.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: 'Compromised Privacy',
                description: 'Traditional KYC processes require sharing all your personal information. With Spectra, you only verify what\'s necessary without exposing sensitive data.',
              },
              {
                title: 'Data Breach Risk',
                description: 'Every time you share your information, the risk of it being compromised increases. Our fragmentation and encryption system protects your data.',
              },
              {
                title: 'Lack of Control',
                description: 'Once you share your information, you lose control over it. With Spectra, you decide what to share and with whom.',
              },
              {
                title: 'Slow and Bureaucratic Processes',
                description: 'Traditional verification processes are slow. Spectra speeds up the process while maintaining maximum security.',
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 h-full group cursor-pointer transition-all duration-300 relative overflow-hidden">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:to-purple-600/5 transition-all duration-300"></div>
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-purple-500 transition-colors"></div>
                        <CardTitle className="text-xl lg:text-xl text-gray-100 group-hover:text-purple-300 transition-colors">
                          {problem.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <CardDescription className="text-gray-400 text-base lg:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                        {problem.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-5 py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-purple-950/30 to-gray-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.2),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(236,72,153,0.15),transparent_55%)]"></div>
        <div className="relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-100">
              Ready to Get Started?
            </h2>
            <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
              Verify your identity once. Access everything. Stay private.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white border-0 text-base lg:text-lg w-full sm:w-auto px-10 py-6 lg:py-7 rounded-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                <Link href="/onboarding" className="flex items-center justify-center">
                  Start Verification
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
            <p className="text-sm text-gray-500 mt-3">
              Solo validación
            </p>
          </motion.div>
      </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="quienes-somos" className="px-5 py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black/50 to-gray-950/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.1),transparent_50%)]"></div>
        <div className="relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-100">
              About Us
            </h2>
            <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
              Learn more about our mission and vision
            </p>
          </motion.div>

          <div className="flex flex-col items-center gap-8">
            {/* Visual Element - Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-48 lg:h-56 w-full max-w-md rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-purple-950/20 border border-purple-500/20"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                  {/* Grid Pattern */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-500"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Center Illustration */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 300 300" className="w-full h-full max-w-xs">
                  {/* Outer Shield - Privacy Protection */}
                  <motion.path
                    d="M150 50 L220 80 L220 150 L150 220 L80 150 L80 80 Z"
                    fill="none"
                    stroke="url(#shieldGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                  
                  {/* Inner Lock - Security */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <rect x="120" y="140" width="60" height="50" rx="5" fill="none" stroke="#a855f7" strokeWidth="2"/>
                    <path d="M120 140 Q120 120 150 120 Q180 120 180 140" fill="none" stroke="#a855f7" strokeWidth="2"/>
                    <circle cx="150" cy="165" r="8" fill="#a855f7" opacity="0.6"/>
                  </motion.g>

                  {/* Zero Knowledge Nodes - Representing ZK Proofs */}
                  {[
                    { cx: 100, cy: 100, delay: 1 },
                    { cx: 200, cy: 100, delay: 1.2 },
                    { cx: 100, cy: 200, delay: 1.4 },
                    { cx: 200, cy: 200, delay: 1.6 },
                  ].map((node, i) => (
                    <motion.g 
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: node.delay }}
                    >
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="12"
                        fill="#8b5cf6"
                        opacity="0.4"
                      />
                      <motion.circle
                        cx={node.cx}
                        cy={node.cy}
                        r="4"
                        fill="#a855f7"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: node.delay + 0.2 }}
                      />
                      {/* Connection Lines */}
                      <motion.line
                        x1={node.cx}
                        y1={node.cy}
                        x2="150"
                        y2="165"
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                        opacity="0.3"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: node.delay + 0.3 }}
                      />
                    </motion.g>
                  ))}

                  {/* Stellar Network Representation */}
                  <motion.circle
                    cx="150"
                    cy="150"
                    r="60"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.3"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1.8 }}
                  />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            {/* Text Content - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center space-y-4 max-w-2xl"
            >
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                At <span className="text-purple-400 font-semibold">Spectra</span>, we believe your identity belongs to you. 
                We use <span className="text-purple-400 font-semibold">Zero Knowledge Proofs</span> to verify your identity 
                without revealing sensitive information—prove who you are without sharing unnecessary data.
              </p>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                Built on the <span className="text-purple-400 font-semibold">Stellar</span> network, 
                Spectra enables seamless access to financial services while keeping your privacy intact.
              </p>
            </motion.div>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-5 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <span className="text-xl font-semibold text-gray-100">Spectra</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                Zero Knowledge Identity for Stellar Network. Verify once, access everywhere.
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-100 mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/onboarding" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href="#caracteristicas" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* About Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-100 mb-4">About</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#quienes-somos" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#problemas" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    Problems We Solve
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Spectra. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Powered by Stellar</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </footer>
      </div>
    </main>
  )
}
