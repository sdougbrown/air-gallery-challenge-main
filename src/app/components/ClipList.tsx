'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useClipStore } from '@/app/store/clipStore';
import { ClipCard } from './Clip';

import rowGrid from '@/app/utils/rowGrid';
import { debounce } from '@/app/utils/debounce';

import './clips.css';

const LOAD_THRESH = 2000;

function getMaxDocHeight() {
  // this is too dirty aaaaaa
  return Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                   document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
}

export function ClipList() {
  const container = useRef(null);

  const list = useClipStore((state) => state.list);
  const clips = useClipStore((state) => state.clips);
  const pagination = useClipStore((state) => state.pagination);
  const loadClips = useClipStore((state) => state.loadClips);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    const onScroll = debounce((event: Event) => {
      if (getMaxDocHeight() - window.scrollY < LOAD_THRESH) {
        if (pagination.hasMore) {
          loadClips();
        }
      }
    }, 64);

    document.addEventListener('scroll', onScroll);

    () => document.removeEventListener('scroll', onScroll);
  }, [loadClips, pagination]);

  const itemSizes = useMemo(() => rowGrid({
    // @ts-expect-error rush move here I know it's bad
    containerWidth: container.current?.offsetWidth || 1000,
    itemHeight: 226, // should probably be a percentage of window
    maxMargin: 24,
    minMargin: 22,
  }, list, clips), [list, clips]);

  return (
    <div ref={container} className="clip-list">
      {itemSizes.map((row, rowIdx) => (
        <div className="clip-list__row" key={`grid-row-${rowIdx}}`}>
          {row.map(({ id, width, height, marginLeft, marginRight }, i) => (
            <ClipCard
              key={`${i}/${id}`}
              id={id}
              height={height}
              width={width}
              style={{
                marginRight,
                marginLeft,
                height,
                width,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

