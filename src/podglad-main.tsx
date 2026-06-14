import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ClassicPreviewPage } from './pages/ClassicPreviewPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClassicPreviewPage />
  </StrictMode>,
);
