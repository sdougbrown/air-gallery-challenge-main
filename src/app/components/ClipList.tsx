import { useMemo } from 'react';
import { useClipStore } from '@/app/store/clipStore';
import { ClipCard } from './Clip';

import rowGrid from '@/app/utils/rowGrid';

import './clips.css';

export function ClipList() {
  const list = useClipStore((state) => state.list);
  const clips = useClipStore((state) => state.clips);

  const itemSizes = useMemo(() => rowGrid({
    containerWidth: 1000, // evaluate from window later
    itemHeight: 226, // should probably be a percentage of window
    maxMargin: 24,
    minMargin: 22,
  }, list, clips), [list, clips]);

  return (
    <div className="clip-list">
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

