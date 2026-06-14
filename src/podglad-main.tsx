import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { PreviewGallery } from './pages/PreviewGallery';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreviewGallery />
  </StrictMode>,
);
