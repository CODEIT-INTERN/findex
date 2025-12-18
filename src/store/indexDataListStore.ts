import { create } from "zustand";
import { getIndexDataList } from "@/api/indexDataApi";
import type { IndexDataDto, IndexDataListParams } from "@/model/indexData";

interface IndexDataListState {
  items: IndexDataDto[];
  isLoading: boolean;
  error: Error | null;
  hasNext: boolean;
  idAfter: number;
  nextCursor: string | null;
  totalElements: number;
  filters: IndexDataListParams;

  fetch: (params?: IndexDataListParams) => Promise<void>;
  fetchNext: () => Promise<void>;
  setFilters: (filters: Partial<IndexDataListParams>) => void;
  resetFilters: () => void;
}

const initialFilters: IndexDataListParams = {
  sortField: "baseDate",
  sortDirection: "desc",
};

export const useIndexDataListStore = create<IndexDataListState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  hasNext: false,
  idAfter: 0,
  nextCursor: null,
  totalElements: 0,
  filters: initialFilters,

  fetch: async (params) => {
    set({ isLoading: true, error: null });

    if (params) {
      set({ filters: params });
    }

    const filters = params || get().filters;

    try {
      const page = await getIndexDataList(filters);
      set({
        items: page.content,
        isLoading: false,
        hasNext: page.hasNext,
        idAfter: page.nextIdAfter,
        nextCursor: page.nextCursor,
        totalElements: page.totalElements,
      });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchNext: async () => {
    const { items, filters, isLoading, hasNext, nextCursor, idAfter } = get();

    if (isLoading || !hasNext || !nextCursor) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const page = await getIndexDataList({
        ...filters,
        cursor: nextCursor,
        idAfter: idAfter,
      });

      set({
        items: [...items, ...page.content],
        isLoading: false,
        nextCursor: page.nextCursor,
        idAfter: page.nextIdAfter,
        hasNext: page.hasNext,
      });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({
      filters: initialFilters,
    });
  },
}));
