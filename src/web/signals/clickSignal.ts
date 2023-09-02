import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { filter } from "rxjs";
import type { MouseEvent } from "react";

const isSingleMouseEvent = (e: MouseEvent) => e.detail === 1;
const isDoubleMouseEvent = (e: MouseEvent) => e.detail === 2;
const isTripleMouseEvent = (e: MouseEvent) => e.detail === 3;

export const [clickChange$, setClick] = createSignal<MouseEvent>();
export const [useRowClick, rowClick$] = bind(clickChange$);

export const [useClick, click$] = bind(
  rowClick$.pipe(filter(isSingleMouseEvent))
);
export const [useDblClick, dblClick$] = bind(
  rowClick$.pipe(filter(isDoubleMouseEvent))
);
export const [useTripleClick, tripleClick$] = bind(
  rowClick$.pipe(filter(isTripleMouseEvent))
);
