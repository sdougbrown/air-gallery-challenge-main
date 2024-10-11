// rowGrid
//
// based on: https://github.com/brunjo/rowGrid
//
// modified to be "pure"
// (i.e. only accepts and outputs values,
//  and leaves manipulation of the DOM to another lib (react))
//
//  Full disclosure here is that I wrote this for a Pexels implimentation here
//  quite a while ago! Seems like it's going to be kind of useful here 👀

const DEFAULT_MIN_WIDTH = 0;
const DEFAULT_MAX_MARGIN = 12;
const DEFAULT_MIN_MARGIN = 6;
const ROUND_UP = 0.5;

type Item = {
  id: string;
  width: number;
  height: number;
  processing: boolean;
};
type GridItem = Item & {
  marginLeft: number;
  marginRight: number | null | undefined;
};
export type RowGridItem = GridItem;
type Options = {
  containerWidth: number;
  itemHeight: number;
  minItemWidth?: number;
  maxMargin?: number;
  minMargin?: number;
  useFlex?: boolean;
};
type ReducedValues = {
  width: number;
  rows: Array<Array<Item | GridItem>>;
  row: Array<Item | GridItem>;
};
type RowReducerValues = {
  newRow: Array<Item | GridItem>;
  widthDiff: number;
  newHeight: number | null | undefined;
};
export const shouldUseFlex = true;
// specifying the return value makes flow happier, but
// can break the syntax highlighting for some editors (vim)
export function rowGrid<I extends Item>(
  { containerWidth, itemHeight, minItemWidth, maxMargin, minMargin }: Options,
  items: Array<I>
): Array<RowGridItem> {
  // @ts-expect-error there'sa  problem with the Item | GridItem union
  return reduceItems(
    containerWidth,
    // if we want to do 0, check for undefined
    minItemWidth || DEFAULT_MIN_WIDTH,
    maxMargin || DEFAULT_MAX_MARGIN,
    minMargin || DEFAULT_MIN_MARGIN,
    items.map((item: Item) => ({
      id: item.id,
      height: itemHeight,
      width: Math.ceil((item.width / item.height) * itemHeight),
      processing: item.processing ?? false,
    }))
  );
}
export default rowGrid;

function reduceItems(
  containerWidth: number,
  minItemWidth: number,
  maxMargin: number,
  minMargin: number,
  items: Array<Item>
) {
  const resizedItems = items.reduce(
    ({ width, rows, row }: ReducedValues, item: Item) => {
      const rowElems = row.concat(item);
      const rowWidth = Math.ceil(width + item.width);
      const rowLength = rowElems.length;
      const nrOfElems = rowLength - 1;

      // check whether width of row is too high
      if (rowWidth + maxMargin * nrOfElems > containerWidth) {
        let diff = rowWidth + maxMargin * nrOfElems - containerWidth;
        let rowMargin: number;
        // change margin
        const maxSave = (maxMargin - minMargin) * nrOfElems;

        if (maxSave < diff) {
          rowMargin = minMargin;
          diff -= (maxMargin - minMargin) * nrOfElems;
        } else {
          rowMargin = maxMargin - diff / nrOfElems;
          diff = 0;
        }

        const resizedRow = rowElems.reduce(
          (
            { newRow, widthDiff, newHeight }: RowReducerValues,
            rowElem: Item,
            rowIndex: number
          ) => {
            const rowElemWidth = rowElem.width;
            let newWidth = rowElemWidth - (rowElemWidth / rowWidth) * diff;

            /* eslint-disable no-param-reassign */
            newHeight =
              newHeight ||
              Math.round(rowElem.height * (newWidth / rowElemWidth));

            if (widthDiff + 1 - (newWidth % 1) >= ROUND_UP) {
              widthDiff -= newWidth % 1;
              newWidth = Math.floor(newWidth);
            } else {
              widthDiff += 1 - (newWidth % 1);
              newWidth = Math.ceil(newWidth);
            }

            /* eslint-enable no-param-reassign */
            return {
              newRow: newRow.concat({
                id: rowElem.id,
                width: newWidth,
                height: newHeight,
                marginLeft: rowIndex === 0 ? 0 : rowMargin,
                // compensates for some sloppy math above - should fix :)
                marginRight: rowIndex === nrOfElems ? -1 : null,
                processing: rowElem.processing,
              }),
              widthDiff,
              newHeight,
            };
          },
          {
            newRow: [],
            widthDiff: 0,
            newHeight: null,
          }
        ).newRow;
        // add the 'finished' row to the 'rows' array,
        // and give a fresh row to the next iteration
        rows.push(resizedRow);
        return {
          width: 0,
          rows,
          row: [],
        };
      }

      // accumulate row and width
      return {
        width: rowWidth,
        rows,
        row: rowElems,
      };
    },
    {
      width: 0,
      rows: [],
      row: [],
    }
  );

  // append the last row to processed rows and return
  if (resizedItems.row.length > 0) {
    resizedItems.rows.push(resizedItems.row);
  }

  return resizedItems.rows;
}

