'use client';
import { useEffect } from 'react';
import { useBoardStore } from '@/app/store/boardStore';
import { useClipStore } from '@/app/store/clipStore';
import { useShallow } from 'zustand/react/shallow';

import { BoardList, ClipList, Collapser } from '@/app/components';

import './gallery.css';

export function GalleryPage() {
  // initial content loading,
  // probably not the ideal prod strategy here
  // but i'm trying to do a lot in a short time lmao
  const [isLoadingBoards, totalBoards, loadBoards] = useBoardStore(
    useShallow((state) => [
      state.isLoading,
      state.total,
      state.loadBoards,
    ])
  );
  const [isLoadingClips, totalClips, loadClips] = useClipStore(
    useShallow((state) => [
      state.isLoading,
      state.total,
      state.loadClips,
    ])
  );

  useEffect(() => {
    if (!isLoadingBoards && totalBoards === null) {
      loadBoards();
    }
    if (!isLoadingClips && totalClips === null) {
      loadClips();
    }
  }, [isLoadingBoards, isLoadingClips, totalBoards, totalClips, loadBoards, loadClips]);

  return (
    <main className="page-gallery">
      <Collapser label="boards" count={totalBoards}>
        <BoardList />
      </Collapser>
      <Collapser label="assets" count={totalClips}>
        <ClipList />
      </Collapser>
    </main>
  );
}
