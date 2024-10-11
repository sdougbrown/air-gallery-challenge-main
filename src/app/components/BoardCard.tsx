import { useBoardStore } from '@/app/store/boardStore';
import { isNil } from 'ramda';

import './boards.css';

type BoardCardProps = {
  id: string;
};


export function BoardCard({ id }: BoardCardProps) {
  const board = useBoardStore((state) => state.boards[id]);

  return (
    <div className="board-card rounded bg-black/40">
      <div className="flex absolute inset-0">
        {isNil(board.thumbnails) ? null : (
          <img
            alt="board.title"
            src={board.thumbnails[0]}
            width={400}
            height={400}
            className="board-card__img"
          />
        )}
      </div>
      <div className="flex grow items-end">
        <div className="flex grow">
          <div className="mx-3 mb-3.5">
            <span className="line-clamp-3 break-words pb-0.5">
              {board.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

