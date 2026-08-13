import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'

import Navbar from './components/Navbar'
import NewFooter from './components/NewFooter'
import Breadcrumbs from './components/Breadcrumbs'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'
import Seo from './components/Seo'
/** Eager: first paint must not wait on a lazy chunk (Mac Safari often stuck on “Loading…”). */
import Homepage from './homepage/Homepage'

const Research = lazy(() => import('./research/Research'))
const Production = lazy(() => import('./production/Production'))
const Contact = lazy(() => import('./contact/Contact'))
// Gallery page disabled — see src/gallery/GalleryPage.tsx
// const GalleryPage = lazy(() => import('./gallery/GalleryPage'))
const HerbaceuticalPage = lazy(() => import('./herbaceutical/HerbaceuticalPage'))
const NutraceuticalPage = lazy(() => import('./nutraceutical/NutraceuticalPage'))
const OrganicPage = lazy(() => import('./organic/OrganicPage'))
const SkincarePage = lazy(() => import('./skincare/SkincarePage'))

function RouteFallback() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center bg-white text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      Loading…
    </div>
  )
}

/** Marks the lazy route as committed so chrome like the footer can show. */
function RouteReady({
  children,
  onReady,
  onPending,
}: {
  children: ReactNode
  onReady: () => void
  onPending: () => void
}) {
  useLayoutEffect(() => {
    onReady()
    return () => onPending()
  }, [onReady, onPending])

  return <>{children}</>
}

function AppContent() {
  const { pathname } = useLocation()
  const hideFooter = pathname === '/contact' || pathname === '/skincare'
  const showCrumbs =
    pathname !== '/' && pathname !== '/contact'
  const [contentReady, setContentReady] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Warm fonts + layout after route commit so first scroll isn't a decode/layout storm.
  useEffect(() => {
    if (!contentReady) return
    let cancelled = false
    const warm = async () => {
      try {
        await document.fonts?.ready
      } catch {
        /* ignore */
      }
      if (cancelled) return
      requestAnimationFrame(() => {
        void document.body.offsetHeight
      })
    }
    void warm()
    return () => {
      cancelled = true
    }
  }, [contentReady, pathname])

  const markReady = useCallback(() => {
    setContentReady(true)
  }, [])

  const markPending = useCallback(() => {
    setContentReady(false)
  }, [])

  return (
    <div className="relative min-h-[100dvh]">
      <Seo />
      <ScrollToTop />
      <Navbar />
      <Breadcrumbs />
      {/* Only pages with breadcrumbs need a spacer; home keeps nav overlay on the hero */}
      {showCrumbs && (
        <div
          aria-hidden="true"
          className="h-[calc(var(--zephyr-nav-h)+var(--zephyr-crumb-h))]"
        />
      )}
      <Suspense fallback={<RouteFallback />}>
        <RouteReady
          key={pathname}
          onReady={markReady}
          onPending={markPending}
        >
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/research" element={<Research />} />
            <Route path="/production" element={<Production />} />
            {/* Gallery route disabled — /gallery returns no match (404) */}
            {/* <Route path="/gallery" element={<GalleryPage />} /> */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/herbaceutical" element={<HerbaceuticalPage />} />
            <Route path="/nutraceutical" element={<NutraceuticalPage />} />
            <Route path="/organic" element={<OrganicPage />} />
            <Route path="/skincare" element={<SkincarePage />} />
          </Routes>
        </RouteReady>
      </Suspense>
      {!hideFooter && contentReady && <NewFooter />}
      <ScrollToTopButton />
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
