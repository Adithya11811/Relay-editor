'use client'
import React from 'react'
import { SparklesCore } from './sparkles'

export function SparklesText({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-[200px] lg:w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="font-bold text-[70px] lg:text-[130px] tracking-tighter relative top-10 text-white brightness-[0.50]">
        {children}
      </div>

      <div className="w-[40rem] top-16 lg:top-10 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[#25DF74] to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[#25DF74] to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[#535252] to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[#535252] to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.1}
          maxSize={0.6}
          particleDensity={1500}
          className="w-full h-[100px] "
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(150px_50px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  )
}
