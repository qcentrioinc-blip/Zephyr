import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const CONFETTI_COLORS = ["#11BB8A", "#9ad485", "#EDFAEB", "#547A3D", "#14d09a"];

type CelebrationBurstProps = {
  reduceMotion?: boolean;
  className?: string;
};

export default function CelebrationBurst({
  reduceMotion = false,
  className = "mb-5",
}: CelebrationBurstProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: (i % 2 === 0 ? 1 : -1) * (18 + (i % 6) * 14),
        y: -28 - (i % 5) * 16,
        rotate: (i * 37) % 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 5 + (i % 3) * 2,
        delay: (i % 6) * 0.04,
      })),
    []
  );

  if (reduceMotion) {
    return (
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#11BB8A] ${className}`}
      >
        <Check className="h-8 w-8 text-[#0d241c]" strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto flex h-20 w-20 items-center justify-center ${className}`}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="pointer-events-none absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.45,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: p.x,
            y: p.y,
            scale: [0.4, 1, 0.6],
            rotate: p.rotate,
          }}
          transition={{
            duration: 1.05,
            delay: 0.15 + p.delay,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#11BB8A] shadow-[0_0_32px_rgba(17,187,138,0.45)]"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
      >
        <Check className="h-8 w-8 text-[#0d241c]" strokeWidth={2.5} />
      </motion.div>
    </div>
  );
}
