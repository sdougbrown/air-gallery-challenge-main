'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
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

  const [containerState, setContainerState] = useState(null);
  const list = useClipStore((state) => state.list);
  const clips = useClipStore((state) => state.clips);
  const pagination = useClipStore((state) => state.pagination);
  const loadClips = useClipStore((state) => state.loadClips);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    // @ts-expect-error ignore for now
    setContainerState(container.current.offsetWidth);

    const onScroll = debounce((event: Event) => {
      if (getMaxDocHeight() - window.scrollY < LOAD_THRESH) {
        if (pagination.hasMore) {
          loadClips();
        }
      }
    }, 64);

    const onResize = debounce((event: any) => {
      // @ts-expect-error ignore for now
      setContainerState(container.current.offsetWidth);
    }, 32);

    document.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);

    () => {
      document.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [loadClips, pagination]);


  const itemSizes = useMemo(() => rowGrid({
    containerWidth: containerState || 0,
    itemHeight: 226, // should probably be a percentage of window
    maxMargin: 24,
    minMargin: 22,
  }, list, clips), [list, clips, containerState]);

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

