'use client';
import { useState } from 'react';

import './collapser.css';

import type { Children } from '@/types';

type CollapserProps = {
  label: string;
  count: null | number;
  children: Children;
};

export function Collapser({ children, count, label }: CollapserProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const countText = count ? ` (${count})` : '';

  return (
    <div className="collapser">
      <div className="relative flex items-end justify-between pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            collapser__btn relative flex shrink-0 items-center justify-center rounded font-semibold transition-colors hover:no-underline disabled:cursor-not-allowed disabled:bg-grey-3 disabled:text-grey-12 border-0 bg-transparent h-6 px-2 text-12 text-grey-11 hover:bg-grey-4 active:bg-grey-4 group/list-section-header -ml-2 cursor-pointer cursor-pointer
          `}
        >
          <span className="relative bg-transparent text-12 font-bold uppercase text-grey-10">
            {`${label}${countText}`}
          </span>
        </button>
      </div>
      {isExpanded ? children : null}
    </div>
  );
}

