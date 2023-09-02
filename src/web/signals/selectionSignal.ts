import {bind} from "@react-rxjs/core";
import {createSignal} from "@react-rxjs/utils";
import {
    switchMap,
    map,
    takeUntil,
    throttleTime,
    fromEvent,
    Observable, defer
} from "rxjs";
import {curry} from "rambda";

const MOUSE_SELECTION_THROTTLE_TIME = 30;
const MOUSEMOVE_EVENT = "mousemove";
const MOUSEUP_EVENT = "mouseup";

export function startWithTap<T>(callback: () => void) {
    return (source: Observable<T>) =>
        defer(() => {
            callback();
            return source;
        });
}

const mouseMove$ = fromEvent<MouseEvent>(document, MOUSEMOVE_EVENT);
export const mouseUp$ = fromEvent(document, MOUSEUP_EVENT);

const toDomRect = (startEvent: MouseEvent, moveEvent: MouseEvent) => {
    const width = moveEvent.pageX - startEvent.pageX;
    const height = moveEvent.pageY - startEvent.pageY;

    const x = width > 0 ? startEvent.pageX : moveEvent.clientX;
    const y = height > 0 ? startEvent.pageY : moveEvent.clientY;

    return new DOMRect(
        x,
        y,
        Math.abs(width),
        Math.abs(height),
    )
}

export const [selectionChange$, setSelection] = createSignal<MouseEvent>();

export const nativeSelection$ = selectionChange$.pipe(
    switchMap((start) =>
        mouseMove$.pipe(
            throttleTime(MOUSE_SELECTION_THROTTLE_TIME),
            map(curry(toDomRect)(start)),
            takeUntil(mouseUp$),
        )
    )
)

export const [useSelection, selection$] = bind(
    selectionChange$.pipe(
        switchMap((start) =>
            mouseMove$.pipe(
                throttleTime(MOUSE_SELECTION_THROTTLE_TIME),
                map(curry(toDomRect)(start)),
                takeUntil(mouseUp$),
            )
        )
    )
);
