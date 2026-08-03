import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'

import Navbar from './Global/Navbar'
import NewFooter from './Global/NewFooter'
import Breadcrumbs from './Global/Breadcrumbs'
import ScrollToTop from './Global/ScrollToTop'
import Seo from './Global/Seo'

const Homepage = lazy(() => import('./homepage/Homepage'))
const Research = lazy(() => import('./research/Research'))
const Production = lazy(() => import('./production/Production'))
const Contact = lazy(() => import('./contact/Contact'))
const GalleryPage = lazy(() => import('./gallery/GalleryPage'))
const HerbaceuticalPage = lazy(() => import('./herbaceutical/HerbaceuticalPage'))
const NutraceuticalPage = lazy(() => import('./nutraceutical/NutraceuticalPage'))
const OrganicPage = lazy(() => import('./organic/OrganicPage'))

function RouteFallback() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center bg-white text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      Loading…
    </div>
  )
}

function AppContent() {
  const { pathname } = useLocation()
  const hideFooter = pathname === '/contact'

  return (
    <div className="relative">
      <Seo />
      <ScrollToTop />
      <Navbar />
      <Breadcrumbs />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/research" element={<Research />} />
          <Route path="/production" element={<Production />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/herbaceutical" element={<HerbaceuticalPage />} />
          <Route path="/nutraceutical" element={<NutraceuticalPage />} />
          <Route path="/organic" element={<OrganicPage />} />
        </Routes>
      </Suspense>
      {!hideFooter && <NewFooter />}
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
