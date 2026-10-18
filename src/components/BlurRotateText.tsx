import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface BlurRotateTextProps {
  /** Array of words to cycle through */
  texts: string[];
  /** Display duration per word in ms (default: 2800) */
  interval?: number;
  /** Whether the rotation loop is running */
  auto?: boolean;
  /** Additional styling */
  className?: string;
}

/**
 * Luxury Editorial Blur-to-Focus Fade reveal.
 * Characters smoothly emerge from a soft Gaussian blur and subtle lift into sharp focus,
 * then gently diffuse and lift away before the next category resolves.
 */
export const BlurRotateText: React.FC<BlurRotateTextProps> = ({
  texts,
  interval = 2800,
  auto = true,
  className = "",
}) => {
  const reduced = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!auto || texts.length <= 1 || reduced) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [auto, texts.length, interval, reduced]);

  const currentText = texts[index] || "";
  const characters = Array.from(currentText);

  // Maximum characters across texts to reserve stable horizontal space and eliminate layout shifts
  const maxChars = Math.max(...texts.map((t) => t.length));

  if (reduced) {
    return (
      <span className={`inline-block text-white font-semibold ${className}`}>
        {currentText}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center justify-start font-semibold select-none overflow-visible ${className}`}
      style={{
        minWidth: `${maxChars * 0.58}ch`,
      }}
      aria-label={currentText}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="inline-flex items-center"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {characters.map((char, charIndex) => (
            <motion.span
              key={`${index}-${charIndex}`}
              className="inline-block text-white"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 12,
                  filter: "blur(10px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1], // Bespoke smooth cubic-bezier
                    delay: charIndex * 0.032, // Elegant left-to-right cascade wave
                  },
                },
                exit: {
                  opacity: 0,
                  y: -10,
                  filter: "blur(8px)",
                  transition: {
                    duration: 0.38,
                    ease: [0.4, 0, 0.2, 1],
                    delay: charIndex * 0.015,
                  },
                },
              }}
              style={{
                minWidth: char === " " ? "0.3em" : "auto",
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default BlurRotateText;
