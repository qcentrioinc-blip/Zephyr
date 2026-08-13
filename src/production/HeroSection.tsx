import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { H1, P } from "../components/Typography/Typo";

const ease = [0.22, 1, 0.36, 1] as const;

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0d241c]">
      <div className="absolute inset-0">
        <img
          src="/facility/production-hero-wide.webp"
          alt=""
          className="h-full w-full object-cover opacity-55"
          aria-hidden="true"
          width={1600}
          height={900}
        />
        <div className="absolute inset-0 bg-[#0d241c]/55" />
      </div>

      <div className="zephyr-container relative z-10 pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-14">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#9ad485]"
          >
            Production & Facilities
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease }}
          >
            <H1 className="text-white">Manufacturing capacity for private-label scale-up</H1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease }}
            className="mt-5 max-w-xl"
          >
              <P className="text-white/75">
                Humidity-controlled dispensing, granulation, high-speed compression,
                coating, capsule filling, and flexible finished goods packaging.
                Built for nutraceutical, herbaceutical, and organic private label
                partners in the US market.
              </P>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="mt-7"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#113227] transition hover:bg-[#EDFAEB]"
            >
              Request MOQ
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Right-side capacity cards commented by user — keep commented
        <Reveal className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[{value:'5B+',label:'Tablets...'}, ...].map(...)}
        </Reveal>
        */}
      </div>
    </section>
  );
};

export default HeroSection;
