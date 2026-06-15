import { createContext, useContext } from 'react';
import { A4_HEIGHT, A4_WIDTH } from '../utils/previewUtils';

export interface PageSize {
  pageW: number;
  pageH: number;
}

const defaultSize: PageSize = { pageW: A4_WIDTH, pageH: A4_HEIGHT };

export const PageSizeContext = createContext<PageSize>(defaultSize);

export function usePageSize(): PageSize {
  return useContext(PageSizeContext);
}
