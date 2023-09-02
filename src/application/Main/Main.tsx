import styles from './Main.module.css'
import {Canvas} from "../Canvas/Canvas.tsx";
import {useEffect, useRef} from "react";
import {mouseUp$, nativeSelection$, selection$} from "../../web/signals/selectionSignal.ts";
import {curry} from "rambda";
import {createPortal} from "react-dom";
import {tap} from "rxjs";

const wrapWithPixels = (rect: DOMRect) => ({
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px'
})

const initMouseSelection: (
    parent: HTMLElement,
    canvas: HTMLElement,
    selection: ReturnType<typeof useRef<HTMLElement>>,
    rect: DOMRect,
) => void = (_parent, _canvas, selection, rect) => {
    Object.assign(selection.current!.style, wrapWithPixels(rect))
}


type MouseSelectionInit = (
    parent: ReturnType<typeof useRef>['current'],
    child: ReturnType<typeof useRef>['current'],
    selection: ReturnType<typeof useRef<HTMLElement | null>>,
) => void;

const useInitMouseSelection: MouseSelectionInit = (parent, child, selection) => {

    useEffect(() => {
        const s = mouseUp$.subscribe({
            next: () => {
                return selection.current!.style.display = 'none';
            },
            complete: () => alert(1),
        });
        return () => s.unsubscribe();
    }, [selection]);

    useEffect(() => {
        return nativeSelection$.pipe(tap(() => {
            return selection.current!.style.display = 'block';
        })).subscribe({
            next: curry(initMouseSelection)(parent, child, selection),
            complete: () => alert(1),
        })
            .unsubscribe
            .bind(nativeSelection$)
    }, [parent, child, selection]);

}


export const Main = () => {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const selectionRef = useRef<HTMLDivElement>(null);

    useInitMouseSelection(wrapperRef, canvasRef, selectionRef);

    return <div ref={wrapperRef} className={styles.main}>
        <Canvas ref={canvasRef}/>
        {createPortal(
            <div
                className={"portal"}
                ref={selectionRef}
                style={{pointerEvents: "none", position: "absolute", background: "rgba(0,0, 255, 0.2)"}}
            ></div>,
            document.body,
        )}
    </div>;
}