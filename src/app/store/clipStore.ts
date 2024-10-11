import { create } from 'zustand';

import { fetchAssets } from '@/app/api/clips';

import type { Clip, ClipsPagination, ClipsListResponse } from '@/app/api/clips';

type ClipRecord = Record<string, Clip>;

export type ClipState = {
  list: Array<string>;
  clips: ClipRecord;
  pagination: ClipsPagination;
  total: null | number;
  isLoading: boolean;
};

export type ClipActions = {
  loadClips: () => void;
};

export type ClipStore = ClipState & ClipActions;

function createNewState(): ClipState {
  return {
    list: [] as Array<string>,
    clips: {} as ClipRecord,
    pagination: {
      hasMore: true,
      cursor: null,
    },
    total: null,
    isLoading: false,
  };
};

export const useClipStore = create<ClipStore>((set, get) => ({
  ...createNewState(),
  loadClips: async () => {
    const { isLoading, pagination } = get();
    if (isLoading || !pagination.hasMore) {
      // duplicate/invalid request, abort
      return;
    }

    set({ isLoading: true });

    try {
      const response = await fetchAssets(pagination);

      const { clips } = get();
      const newList = response.data.clips.reduce((accumulator: Array<string>, clip: Clip, idx: number) => {
        const id = clip.id;

        accumulator[idx] = id;
        // might need to check for existing data on this clip,
        // we'll see. could be unnecessary for this demo.
        clips[id] = clip;

        return accumulator;
      }, [] as Array<string>);

      set({
        list: get().list.concat(newList),
        clips,
        pagination: response.pagination,
        // may need to add to previous total? not sure yet.
        total: response.data.total,
        isLoading: false,
      });
    } catch (e) {
      console.error(`💥 Clip Fetch Request went wrong!`, e);
      set({ isLoading: false });
    }
  },
}));

