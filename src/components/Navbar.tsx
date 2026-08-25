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
  badge?: string;
}

const PRODUCT_LINKS: ProductLink[] = [
  { name: 'Herbaceutical', path: '/herbaceutical' },
  { name: 'Nutraceutical', path: '/nutraceutical' },
  { name: 'Organic', path: '/organic' },
];

const NAV_LINKS: NavLinkItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '', hasDropdown: true },
  { name: 'R & D', path: '/research' },
  { name: 'Production', path: '/production' },
  // Gallery page disabled
  // { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const DOCK_MAX_DISTANCE = 140;
const DOCK_MAX_SCALE = 1.06;
const DOCK_MAX_LIFT = -2;
const DROPDOWN_CLOSE_DELAY = 280;
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
  dockEnabled: boolean;
  onOpenDropdown?: () => void;
  onCloseDropdown?: () => void;
  isDropdownOpen?: boolean;
  onContactIntercept?: () => void;
  /** Immediate close (click toggle) vs delayed close (mouse leave). */
  onToggleDropdown?: () => void;
}

const DockNavItem = ({
  link,
  isActive,
  mouseX,
  reduceMotion,
  dockEnabled,
  onOpenDropdown,
  onCloseDropdown,
  isDropdownOpen,
  onContactIntercept,
  onToggleDropdown,
}: DockNavItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (value) => {
    if (reduceMotion || !dockEnabled) return DOCK_MAX_DISTANCE;
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

  const linkClassName = `
              nav-dock-link
              transition-colors duration-300 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2
              ${isActive ? 'text-white font-semibold' : 'text-[#4A4B4F] hover:text-black'}
            `;

  const activePill = isActive ? (
    <motion.span
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduceMotion ? { duration: 0 } : SPRING_SNAPPY}
      className="absolute inset-0 z-0 rounded-full bg-[#111315] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
    />
  ) : null;

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={() => link.hasDropdown && onOpenDropdown?.()}
      onMouseLeave={() => link.hasDropdown && onCloseDropdown?.()}
    >
      {/*
        pointer-events-none on the scaled layer: Safari hit-tests the pre-transform box
        and steals clicks from Products links when neighbors magnify.
      */}
      <motion.div
        style={dockEnabled && !reduceMotion ? { scale, y } : undefined}
        className="relative pointer-events-none"
      >
        {link.hasDropdown ? (
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
            onClick={() => onToggleDropdown?.()}
            className={`${linkClassName} pointer-events-auto`}
          >
            {activePill}
            <span className="relative z-10">{link.name}</span>
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: EASE_PREMIUM }}
              className="relative z-10 flex"
            >
              <ChevronDown className="nav-dock-link__chevron relative z-10" />
            </motion.span>
          </button>
        ) : onContactIntercept && link.path === '/contact' ? (
          <button
            type="button"
            onClick={onContactIntercept}
            className={`${linkClassName} pointer-events-auto`}
          >
            {activePill}
            <span className="relative z-10">{link.name}</span>
          </button>
        ) : (
          <Link to={link.path} className={`${linkClassName} pointer-events-auto`}>
            {activePill}
            <span className="relative z-10">{link.name}</span>
          </Link>
        )}
      </motion.div>

      {/* Dropdown stays outside scaled layer + outside backdrop-blur (rendered via portal slot below). */}
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
  onContactIntercept?: () => void;
}

const MobileMenu = ({ isOpen, onClose, activePath, onContactIntercept }: MobileMenuProps) => {
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
                              className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-[#4A4B4F] hover:text-black transition-colors"
                            >
                              <span>{product.name}</span>
                              {product.badge && (
                                <span className="nav-launch-badge shrink-0 rounded-full bg-[#0F3D38] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                  {product.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return onContactIntercept && link.path === '/contact' ? (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => {
                    onContactIntercept();
                    onClose();
                  }}
                  className={`px-4 py-3 rounded-xl text-left text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                    isActive ? 'bg-[#2D2E32] text-white' : 'text-[#4A4B4F] hover:bg-[#F1F3F4]'
                  }`}
                >
                  {link.name}
                </button>
              ) : (
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

  const toggleProductsDropdown = () => {
    clearCloseTimeout();
    setIsProductsOpen((open) => !open);
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
      const target = event.target as Node;
      const inPill = pillRef.current?.contains(target);
      const inMenu = document.getElementById('nav-products-menu')?.contains(target);
      if (!inPill && !inMenu) setIsProductsOpen(false);
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
  const isHome = location.pathname === '/';
  const glassy = isHome && !scrolled;
  // Freeze dock magnification while the menu is open — prevents Safari click misses.
  const dockEnabled = !isProductsOpen;

  return (
    <nav
      className={`fixed top-0 z-[100] w-full py-[clamp(0.35rem,0.4vw,0.65rem)] transition-[background-color,box-shadow] duration-300 ease-out ${
        glassy
          ? 'zephyr-nav--glassy bg-transparent shadow-none'
          : scrolled
            ? 'bg-white shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
            : 'bg-white shadow-none'
      }`}
    >
      {/* Sibling layer (not an ancestor of the dropdown) so Safari hit-testing stays intact */}
      <span className="zephyr-nav-glass" aria-hidden />
      {/* All screens: edge-to-edge with tight side padding */}
      <div className="zephyr-container nav-bar-inner relative z-10 flex w-full items-center justify-between">
        <Link
          to="/"
          className="relative z-10 flex shrink-0 items-center px-2 py-1"
          aria-label="Zephyr home"
        >
          <img
            src="/brand/logo.png"
            alt="Zephyr Logo"
            className="nav-logo-img relative z-10"
          />
        </Link>

        {/*
          Solid (not backdrop-blur) pill: Safari backdrop-filter ancestors break
          hit-testing on absolutely positioned dropdown children.
        */}
        <div
          ref={pillRef}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => {
            mouseX.set(Infinity);
            scheduleCloseProductsDropdown();
          }}
          className={`nav-dock-pill relative hidden xl:flex items-center rounded-full transition-colors duration-300 ${
            glassy
              ? 'bg-white/70 shadow-sm ring-1 ring-white/60'
              : 'bg-[#F1F3F4] shadow-sm'
          }`}
        >
          {NAV_LINKS.map((link) => {
            if (link.hasDropdown) {
              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={openProductsDropdown}
                  onMouseLeave={scheduleCloseProductsDropdown}
                >
                  <DockNavItem
                    link={link}
                    isActive={isProductsActive}
                    mouseX={mouseX}
                    reduceMotion={reduceMotion}
                    dockEnabled={dockEnabled}
                    isDropdownOpen={isProductsOpen}
                    onOpenDropdown={openProductsDropdown}
                    onCloseDropdown={scheduleCloseProductsDropdown}
                    onToggleDropdown={toggleProductsDropdown}
                  />

                  {/* Align under Products only — centering on the full pill pushed the menu right. */}
                  <AnimatePresence>
                    {isProductsOpen ? (
                      <motion.div
                        id="nav-products-menu"
                        role="menu"
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: EASE_PREMIUM }}
                        onMouseEnter={openProductsDropdown}
                        onMouseLeave={scheduleCloseProductsDropdown}
                        className="nav-products-menu absolute left-0 top-full z-[120] pt-3 origin-top"
                      >
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-black/5">
                          {PRODUCT_LINKS.map((product) => (
                            <Link
                              key={product.path}
                              to={product.path}
                              role="menuitem"
                              className="nav-products-menu__item"
                              onClick={() => setIsProductsOpen(false)}
                            >
                              <span>{product.name}</span>
                              {product.badge ? (
                                <span className="nav-launch-badge shrink-0 rounded-full bg-[#0F3D38] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                  {product.badge}
                                </span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <DockNavItem
                key={link.name}
                link={link}
                isActive={location.pathname === link.path}
                mouseX={mouseX}
                reduceMotion={reduceMotion}
                dockEnabled={dockEnabled}
              />
            );
          })}
        </div>

        <MenuToggle
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        />
      </div>

      <div className="zephyr-container mx-auto w-full">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activePath={location.pathname}
        />
      </div>
    </nav>
  );
};

export default Navbar;
