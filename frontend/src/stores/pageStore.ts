import { create } from 'zustand';
import { ROUTES } from '@/constants/url';

interface PageState {
  currentPage: string;
  setPage: (page: string) => void;
}

const usePageStore = create<PageState>((set) => ({
  currentPage: ROUTES.MAIN,
  setPage: (page) => set({ currentPage: page }),
}));

export default usePageStore;