import { Link, useLocation } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '/contact': 'Contact',
  '/gallery': 'Gallery',
  '/herbaceutical': 'Herbaceutical',
  '/nutraceutical': 'Nutraceutical',
  '/organic': 'Organic',
  '/production': 'Production',
  '/research': 'R&D',
};

const categoryTitles: Record<string, string> = {
  herbaceutical: 'Herbaceutical',
  nutraceutical: 'Nutraceutical',
  organic: 'Organic',
};

const formatSegment = (segment: string) =>
  segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const Breadcrumbs = () => {
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/contact') return null;

  const segments = location.pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; to?: string }> = [{ label: 'Home', to: '/' }];

  const isCategoryPage = segments[0] ? Boolean(categoryTitles[segments[0]]) : false;

  if (isCategoryPage) {
    crumbs.push({
      label: `Products: ${categoryTitles[segments[0]] ?? formatSegment(segments[0])}`,
      to: undefined,
    });
  } else {
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      crumbs.push({
        label: routeLabels[currentPath] ?? formatSegment(segment),
        to: isLast ? undefined : currentPath,
      });
    });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="fixed inset-x-0 top-[var(--zephyr-nav-h)] z-[90] w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md"
    >
      <div className="zephyr-container flex items-center py-2.5">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 pl-0">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {isLast ? (
                  <span className="font-semibold text-black">{crumb.label}</span>
                ) : (
                  <>
                    <Link to={crumb.to!} className="transition-colors hover:text-green-700">
                      {crumb.label}
                    </Link>
                    <span className="text-gray-400">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
