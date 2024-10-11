'use client';
import { useEffect } from 'react';
import { Collapser } from '@/app/components';
import { useBoardStore } from '@/app/store/boardStore';
import { useClipStore } from '@/app/store/clipStore';
import { useShallow } from 'zustand/react/shallow';

export function GalleryPage() {
  // initial content loading,
  // probably not the ideal prod strategy here
  // but i'm trying to do a lot in a short time lmao
  const [totalBoards, loadBoards] = useBoardStore(
    useShallow((state) => [
      state.total,
      state.loadBoards,
    ])
  );
  const [totalClips, loadClips] = useClipStore(
    useShallow((state) => [
      state.total,
      state.loadClips,
    ])
  );

  useEffect(() => {
    if (totalBoards === null) {
      loadBoards();
    }
    if (totalClips === null) {
      loadClips();
    }
  }, [totalBoards, totalClips, loadBoards, loadClips]);

  return (
    <main>
      <Collapser label="boards" count={totalBoards}>
        {null}
      </Collapser>
      <Collapser label="assets" count={totalClips}>
        {null}
      </Collapser>
    </main>
  );
}
