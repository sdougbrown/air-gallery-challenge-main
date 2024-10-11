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
          className={`collapser__btn`}
        >
          <span className="relative bg-transparent text-12 font-semibold uppercase text-grey-10">
            {`${label}${countText}`}
          </span>
        </button>
      </div>
      {isExpanded ? children : null}
    </div>
  );
}

