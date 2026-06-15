import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { KreatorPionPreviewPage } from './pages/KreatorPionPreviewPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KreatorPionPreviewPage />
  </StrictMode>,
);
