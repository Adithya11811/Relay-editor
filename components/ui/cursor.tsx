'use client'
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function BlurryCursor(): JSX.Element {
    const mouse = useRef<{ x: number; y: number }>({ x: 75, y: 75 });
    const button = useRef<HTMLButtonElement>(null);

    const manageMouseMove = (e: MouseEvent): void => {
        const { clientX, clientY } = e;

        mouse.current = {
            x: clientX,
            y: clientY
        }

        moveButton(mouse.current.x, mouse.current.y);
    }

    const moveButton = (x: number, y: number): void => {
        gsap.set(button.current, { x, y, xPercent: -50, yPercent: -50 })
    }

    useEffect(() => {
        window.addEventListener("mousemove", manageMouseMove);
        return () => {
            window.removeEventListener("mousemove", manageMouseMove);
        }
    }, []);

    return (
      <div className="absolute z-50 h-screen">
        <Link href="/auth/register">
          <button
            ref={button}
            className="top-0 left-0 fixed bg-green-500 text-white rounded-full px-4 py-6 z-10 mix-blend-luminosity		"
          >
            Get
            <br />
            Started
          </button>
        </Link>
      </div>
    )
}
