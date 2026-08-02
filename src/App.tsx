import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Homepage from './homepage/Homepage'
import Research from './research/Research'
import Production from './production/Production'
import Contact from './contact/Contact'
import Navbar from './Global/Navbar'
import NewFooter from './Global/NewFooter'
import Breadcrumbs from './Global/Breadcrumbs'
import GalleryPage from './gallery/GalleryPage'
import ScrollToTop from './Global/ScrollToTop'
import HerbaceuticalPage from './herbaceutical/HerbaceuticalPage'
import NutraceuticalPage from './nutraceutical/NutraceuticalPage'
import OrganicPage from './organic/OrganicPage'

function AppContent() {
  return (
    <div className="relative">
      <ScrollToTop />
      <Navbar />
      <Breadcrumbs />
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
      <NewFooter />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
