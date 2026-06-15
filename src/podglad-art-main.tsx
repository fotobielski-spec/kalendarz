import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ArtPreviewPage } from './pages/ArtPreviewPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtPreviewPage />
  </StrictMode>,
);
