import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FlowProvider } from './context/FlowContext'
import './index.css'

import LandingPage from './pages/LandingPage'
import OccasionPage from './pages/OccasionPage'
import QuestionsPage from './pages/QuestionsPage'
import GeneratingPage from './pages/GeneratingPage'
import PreviewPage from './pages/PreviewPage'
import SharePage from './pages/SharePage'
import ExperiencePage from './pages/ExperiencePage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FlowProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/occasion" element={<OccasionPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/generating" element={<GeneratingPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/r/:slug" element={<ExperiencePage />} />
        </Routes>
      </FlowProvider>
    </BrowserRouter>
  </StrictMode>
)