import styles from './Main.module.css'
import {Canvas} from "../Canvas/Canvas.tsx";
import {useEffect, useRef} from "react";
import {
    END_SELECTION,
    selection$,
    START_SELECTION
} from "../../web/signals/selectionSignal.ts";
import {curry} from "rambda";
import {createPortal} from "react-dom";
import {filter, tap} from "rxjs";

const initMouseSelection: (
    parent: HTMLElement,
    canvas: HTMLElement,
    selection: ReturnType<typeof useRef<HTMLElement>>,
    rect: DOMRect,
) => void = (_parent, _canvas, selection, rect) => {
    selection.current!.style.clipPath = `polygon(${rect.left}px ${rect.top}px, ${rect.left + rect.width}px ${rect.top}px, ${rect.left + rect.width}px ${rect.top + rect.height}px, ${rect.left}px ${rect.top + rect.height}px)`;
    selection.current!.querySelector('div')!.style.clipPath = `polygon(evenodd, 
        ${rect.left}px ${rect.top}px, 
        ${rect.left + rect.width}px ${rect.top}px, 
        ${rect.left + rect.width}px ${rect.top + rect.height}px, 
        ${rect.left}px ${rect.top + rect.height}px, 
        ${rect.left + 1}px ${rect.top + rect.height - 1}px, 
        ${rect.left + 1}px ${rect.top + 1}px,  
        ${rect.left + rect.width - 1}px ${rect.top + 1}px, 
        ${rect.left + rect.width - 1}px ${rect.top + rect.height - 1}px, 
        ${rect.left + 1}px ${rect.top + rect.height - 1}px, 
        ${rect.left}px ${rect.top + rect.height}px)`;
}


type MouseSelectionInit = (
    parent: ReturnType<typeof useRef>['current'],
    child: ReturnType<typeof useRef>['current'],
    selection: ReturnType<typeof useRef<HTMLElement | null>>,
) => void;

const isMouseEvent = (n: unknown) => n !== END_SELECTION && n !== START_SELECTION;


// const showMouseSelectionFrameOnStart = (selectionFrameElem: HTMLElement) => tap(() => showFrame(selectionFrameElem));
const hideMouseSelectionFrameOnEnd = (selectionFrameElem: HTMLElement) => tap((n) => n === END_SELECTION && hideFrame(selectionFrameElem));

function hideFrame(selectionFrameElem: HTMLElement) {
    selectionFrameElem.style.clipPath = 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)'
}


const useInitMouseSelection: MouseSelectionInit = (parent, child, selection) => {

    useEffect(() => {
        return selection$.pipe(
            hideMouseSelectionFrameOnEnd(selection.current!),
            filter(isMouseEvent),
        ).subscribe(
            curry(initMouseSelection)(parent, child, selection),
        )
            .unsubscribe
            .bind(selection$)
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
                className={styles.portal}
                ref={selectionRef}
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    willChange: 'clip-path',
                    // transition: 'all 10ms ease-in',
                    width: '100%',
                    height: '100%',
                    left: '0',
                    top: '0',
                }}
            >
                <div></div>
            </div>,
            document.body,
        )}
    </div>;
}