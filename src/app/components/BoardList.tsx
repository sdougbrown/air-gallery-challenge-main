import { useBoardStore } from '@/app/store/boardStore';
import { BoardCard } from './BoardCard';

import './boards.css';

export function BoardList() {
  const list = useBoardStore((state) => state.list);

  return (
    <div className="board-list">
      {list.map((id, i) => (
        <BoardCard key={`${i}/${id}`} id={id} />
      ))}
    </div>
  );
}

