import { useClipStore } from '@/app/store/clipStore';

import './clips.css';

type ClipProps = {
  id: string;
  width: number;
  height: number;
  style: Record<string, number | null | void>;
};

export function ClipCard({ id, style, width, height }: ClipProps) {
  const clip = useClipStore((state) => state.clips[id]);

  return (
    <div className="clip-card" style={style}>
      <img
        src={clip.assets.image}
        className="clip-card__img"
        height={height}
        width={width}
        alt={clip.title}
      />
    </div>
  );
}

