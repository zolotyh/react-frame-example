import {bind} from "@react-rxjs/core";
import {createSignal} from "@react-rxjs/utils";
import {
    switchMap,
    map,
    takeUntil,
    fromEvent,
    Observable, defer, shareReplay, startWith, endWith, race, distinctUntilChanged
} from "rxjs";
import {curry} from "rambda";

const MOUSEMOVE_EVENT = "mousemove";
const MOUSE_LEAVE = "mouseleave";
const MOUSEUP_EVENT = "mouseup";

export function startWithTap<T>(callback: () => void) {
    return (source: Observable<T>) =>
        defer(() => {
            callback();
            return source;
        });
}

const mouseMove$ = fromEvent<MouseEvent>(document, MOUSEMOVE_EVENT);
export const mouseUp$ = fromEvent(document, MOUSEUP_EVENT, );
export const mouseLeave$ = fromEvent(document, MOUSE_LEAVE, )

const toDomRect = (startEvent: MouseEvent, moveEvent: MouseEvent) => {
    /*
    1. Есть координаты передвижений относительно документа
    2. Есть координаты передвижений относительно мейна
    3. Все координаты должны быть относительно канваса
 */

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

export const END_SELECTION = Symbol('begin selection');
export const START_SELECTION = Symbol('start selection');

export const [useSelection, selection$] = bind(
    selectionChange$.pipe(
        switchMap((start) => mouseMove$.pipe(
            map(curry(toDomRect)(start)),
            shareReplay({ refCount: true, bufferSize: 1 }),
            distinctUntilChanged(),
            takeUntil(race(mouseUp$, mouseLeave$)),
            startWith(START_SELECTION),
            endWith(END_SELECTION),
        )),
    ),
    new DOMRect()
);
