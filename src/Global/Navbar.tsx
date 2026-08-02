import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface NavLinkItem {
  name: string;
  path: string;
  hasDropdown?: boolean;
}

interface ProductLink {
  name: string;
  path: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '', hasDropdown: true },
  { name: 'R & D', path: '/research' },
  { name: 'Production', path: '/production' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Get In Touch', path: '/contact' },
];

const PRODUCT_LINKS: ProductLink[] = [
  { name: 'Herbaceutical', path: '/herbaceutical' },
  { name: 'Nutraceutical', path: '/nutraceutical' },
  { name: 'Organic', path: '/organic' },
];

const DOCK_MAX_DISTANCE = 140;
const DOCK_MAX_SCALE = 1.08;
const DOCK_MAX_LIFT = -2;
const DROPDOWN_CLOSE_DELAY = 150;
const SCROLL_THRESHOLD = 12;
const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;
const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 38, mass: 0.7 } as const;

const useScrolled = (threshold: number) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

interface DockNavItemProps {
  link: NavLinkItem;
  isActive: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  reduceMotion: boolean;
  onOpenDropdown?: () => void;
  onCloseDropdown?: () => void;
  isDropdownOpen?: boolean;
}

const DockNavItem = ({
  link,
  isActive,
  mouseX,
  reduceMotion,
  onOpenDropdown,
  onCloseDropdown,
  isDropdownOpen,
}: DockNavItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (value) => {
    if (reduceMotion) return DOCK_MAX_DISTANCE;
    const bounds = itemRef.current?.getBoundingClientRect();
    if (!bounds) return DOCK_MAX_DISTANCE;
    const center = bounds.left + bounds.width / 2;
    return value - center;
  });

  const scaleRaw = useTransform(
    distance,
    [-DOCK_MAX_DISTANCE, 0, DOCK_MAX_DISTANCE],
    [1, DOCK_MAX_SCALE, 1]
  );
  const liftRaw = useTransform(
    distance,
    [-DOCK_MAX_DISTANCE, 0, DOCK_MAX_DISTANCE],
    [0, DOCK_MAX_LIFT, 0]
  );

  const scale = useSpring(scaleRaw, { mass: 0.15, stiffness: 420, damping: 32 });
  const y = useSpring(liftRaw, { mass: 0.15, stiffness: 420, damping: 32 });

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={() => link.hasDropdown && onOpenDropdown?.()}
      onMouseLeave={() => link.hasDropdown && onCloseDropdown?.()}
    >
      <motion.div style={{ scale, y }} className="relative">
        {link.hasDropdown ? (
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
            className={`
              relative z-10 flex items-center gap-1 px-3 xl:px-5 py-2.5 rounded-full text-[13px] xl:text-[14.5px]
              font-medium whitespace-nowrap transition-all duration-300 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2
              ${isActive ? 'text-white font-semibold' : 'text-[#4A4B4F] hover:text-black'}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 z-0 rounded-full bg-[#111315] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
                transition={SPRING_SNAPPY}
              />
            )}
            <span className="relative z-10">{link.name}</span>
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="relative z-10 flex"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
          </button>
        ) : (
          <Link
            to={link.path}
            className={`
              relative z-10 flex items-center gap-1 px-3 xl:px-5 py-2.5 rounded-full text-[13px] xl:text-[14.5px]
              font-medium whitespace-nowrap transition-all duration-300 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2
              ${isActive ? 'text-white font-semibold' : 'text-[#4A4B4F] hover:text-black'}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 z-0 rounded-full bg-[#111315] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
                transition={SPRING_SNAPPY}
              />
            )}
            <span className="relative z-10">{link.name}</span>
          </Link>
        )}
      </motion.div>

      {link.hasDropdown && (
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE_PREMIUM }}
              className="absolute top-full right-0 pt-3 w-52 origin-top"
            >
              <div className="bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/5 overflow-hidden">
                {PRODUCT_LINKS.map((product, index) => (
                  <motion.div
                    key={product.path}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.03, ease: EASE_PREMIUM }}
                  >
                    <Link
                      to={product.path}
                      role="menuitem"
                      className="block px-5 py-3 text-sm text-[#4A4B4F] hover:bg-gray-50 hover:text-black transition-colors font-medium"
                    >
                      {product.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuToggle = ({ isOpen, onClick }: MenuToggleProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
    className="xl:hidden relative w-10 h-10 flex items-center justify-center text-black hover:bg-[#F1F3F4] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
  >
    <motion.span
      className="absolute block w-5 h-[1.5px] bg-current rounded-full"
      animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -4 }}
      transition={{ duration: 0.28, ease: EASE_PREMIUM }}
    />
    <motion.span
      className="absolute block w-5 h-[1.5px] bg-current rounded-full"
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={{ duration: 0.15, ease: EASE_PREMIUM }}
    />
    <motion.span
      className="absolute block w-5 h-[1.5px] bg-current rounded-full"
      animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 4 }}
      transition={{ duration: 0.28, ease: EASE_PREMIUM }}
    />
  </button>
);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
}

const MobileMenu = ({ isOpen, onClose, activePath }: MobileMenuProps) => {
  const [productsExpanded, setProductsExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) setProductsExpanded(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32, ease: EASE_PREMIUM }}
          className="xl:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl mt-2 shadow-xl shadow-black/5 border border-gray-100"
        >
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.28, delay: 0.05, ease: EASE_PREMIUM }}
            className="flex flex-col p-3"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activePath === link.path;

              if (link.hasDropdown) {
                return (
                  <div key={link.name}>
                    <button
                      type="button"
                      onClick={() => setProductsExpanded((prev) => !prev)}
                      aria-expanded={productsExpanded}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                        PRODUCT_LINKS.some((p) => p.path === activePath)
                          ? 'bg-[#2D2E32] text-white'
                          : 'text-[#4A4B4F] hover:bg-[#F1F3F4]'
                      }`}
                    >
                      {link.name}
                      <motion.span
                        animate={{ rotate: productsExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                        className="flex"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {productsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.24, ease: EASE_PREMIUM }}
                          className="overflow-hidden pl-4"
                        >
                          {PRODUCT_LINKS.map((product) => (
                            <Link
                              key={product.path}
                              to={product.path}
                              onClick={onClose}
                              className="block px-4 py-2.5 text-sm text-[#4A4B4F] hover:text-black transition-colors"
                            >
                              {product.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className={`px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                    isActive ? 'bg-[#2D2E32] text-white' : 'text-[#4A4B4F] hover:bg-[#F1F3F4]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const reduceMotion = Boolean(useReducedMotion());
  const scrolled = useScrolled(SCROLL_THRESHOLD);

  const pillRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouseX = useMotionValue(Infinity);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openProductsDropdown = () => {
    clearCloseTimeout();
    setIsProductsOpen(true);
  };

  const scheduleCloseProductsDropdown = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, DROPDOWN_CLOSE_DELAY);
  };

  useEffect(() => {
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isProductsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProductsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProductsOpen]);

  useEffect(() => clearCloseTimeout, []);

  const isProductsActive = PRODUCT_LINKS.some((p) => p.path === location.pathname);

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: '#ffffff',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
      className="fixed top-0 z-[100] w-full px-4 py-2 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* LEFT: logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <motion.img
            src="/Global/Logo.png"
            alt="Zephyr Logo"
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="h-10 w-auto object-contain sm:h-12 md:h-14"
          />
        </Link>

        {/* RIGHT desktop: nav links */}
        <div
          ref={pillRef}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="hidden xl:flex items-center rounded-full bg-[#F1F3F4] px-1.5 py-1 shadow-sm"
        >
          {NAV_LINKS.map((link) => (
            <DockNavItem
              key={link.name}
              link={link}
              isActive={
                link.hasDropdown
                  ? isProductsActive
                  : location.pathname === link.path
              }
              mouseX={mouseX}
              reduceMotion={reduceMotion}
              isDropdownOpen={link.hasDropdown && isProductsOpen}
              onOpenDropdown={openProductsDropdown}
              onCloseDropdown={scheduleCloseProductsDropdown}
            />
          ))}
        </div>

        {/* RIGHT mobile/tablet: hamburger */}
        <MenuToggle
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activePath={location.pathname}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
