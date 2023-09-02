import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";

export const DEFAULT_ZOOM = 1;

export const [zoomChange$, setZoom] = createSignal<number>();
export const [useZoom, zoom$] = bind(zoomChange$, DEFAULT_ZOOM);