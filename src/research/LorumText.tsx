import  { useEffect, useRef, useState } from 'react';

const LorumText = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Triggers when 10% of the component is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Base typography style to match the thick, heavy font look
  const baseTextClass = "font-black uppercase tracking-tighter leading-none select-none transition-all duration-1000 ease-out";
  
  // Custom text-stroke style for the outline effect
  const outlineClass = "text-transparent [-webkit-text-stroke:1px_#262626] md:[-webkit-text-stroke:2px_#171717]";
  const filledClass = "text-[#d4d4d8]";

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-[60vh] md:min-h-screen flex flex-col justify-center overflow-hidden font-sans"
    >
      <div className="w-full flex flex-col gap-2 md:gap-4 max-w-[1920px] mx-auto">
        
        {/* ROW 1: LOREM (Outlined, aligned left/top) */}
        <div 
          className={`w-full text-left -ml-4 sm:-ml-8 md:-ml-12 transform transition-all duration-1000 delay-100
            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
        >
          <h1 className={`${baseTextClass} ${outlineClass} text-7xl sm:text-9xl md:text-[13rem] lg:text-[16rem] xl:text-[20rem]`}>
            Zephyr
          </h1>
        </div>

        {/* ROW 2: LORE (Filled, staggered right) */}
        <div 
          className={`w-full text-right pr-6 sm:pr-12 md:pr-24 lg:pr-40 transform transition-all duration-1000 delay-300
            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
        >
          <h1 className={`${baseTextClass} ${filledClass} text-6xl sm:text-8xl md:text-[11rem] lg:text-[14rem] xl:text-[17rem]`}>
            Scale
          </h1>
        </div>

        {/* ROW 3: IPSUM (Filled, shifted center-left) */}
        <div 
          className={`w-full text-left pl-8 sm:pl-16 md:pl-32 lg:pl-48 transform transition-all duration-1000 delay-500
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <h1 className={`${baseTextClass} ${filledClass} text-6xl sm:text-8xl md:text-[11rem] lg:text-[14rem] xl:text-[17rem]`}>
            Quality
          </h1>
        </div>

        {/* ROW 4: TECHNIC (Outlined, aligned left/bottom) */}
        <div 
          className={`w-full text-left -ml-2 sm:-ml-4 md:-ml-6 transform transition-all duration-1000 delay-700
            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
        >
          <h1 className={`${baseTextClass} ${outlineClass} text-6xl sm:text-8xl md:text-[11rem] lg:text-[14rem] xl:text-[17rem]`}>
            Partner
          </h1>
        </div>

      </div>
    </section>
  );
};

export default LorumText;
