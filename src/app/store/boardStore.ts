import { create } from 'zustand';

import { fetchBoards } from '@/app/api/boards';

import type { Board, BoardsListResponse } from '@/app/api/boards';

type BoardRecord = Record<string, Board>;

export type BoardState = {
  list: Array<string>;
  boards: BoardRecord;
  total: null | number;
  isLoading: boolean;
};

export type BoardActions = {
  loadBoards: () => void;
};

export type BoardStore = BoardState & BoardActions;

function createNewState(): BoardState {
  return {
    list: [] as Array<string>,
    boards: {} as BoardRecord,
    total: null,
    isLoading: false,
  };
};

// this is probably overboard (lol get it), but i already wrote it for clips
// and it's just easier to do this the same in both places
export const useBoardStore = create<BoardStore>((set, get) => ({
  ...createNewState(),
  loadBoards: async () => {
    const { isLoading } = get();
    if (isLoading) {
      // duplicate request, abort
      return;
    }

    set({ isLoading: true });

    try {
      const response = await fetchBoards();

      const { boards } = get();
      const newList = response.data.reduce((accumulator: Array<string>, board: Board, idx: number) => {
        const id = board.id;

        accumulator[idx] = id;
        // might need to check for existing data on this clip,
        // we'll see. could be unnecessary for this demo.
        boards[id] = board;

        return accumulator;
      }, [] as Array<string>);

      set({
        list: get().list.concat(newList),
        boards,
        // may need to add to previous total? not sure yet.
        total: response.total,
        isLoading: false,
      });
    } catch (e) {
      console.error(`💥 Clip Fetch Request went wrong!`, e);
      set({ isLoading: false });
    }
  },
}));

