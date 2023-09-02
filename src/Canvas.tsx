import {useEffect, useRef} from "react";
import {setClick} from "./web/signals/clickSignal.ts";
import {selection$, setSelection, useSelection} from "./web/signals/selectionSignal.ts";
import {createPortal} from "react-dom";
import {Rect, setCSSPropsFromBoundClientRect} from "./application/selectionFrame/selectionFrame.ts";


function getElementPositionRelativeToDocument(element: HTMLElement) {
    let xPos = 0;
    let yPos = 0;

    while (element) {
        xPos += (element.offsetLeft || 0);
        yPos += (element.offsetTop || 0);
        element = element.offsetParent as HTMLElement;
    }

    return {left: xPos, top: yPos};
}

export const Canvas = () => {
    const frame = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (frame.current) {
            const correctionPoint = getElementPositionRelativeToDocument(canvas.current);

            frame.current.style.position = "absolute";

            const selectionSubscribion = selection$
                .subscribe((e) => {
                    if (frame.current) {
                        frame.current.style.display = "initial";
                        frame.current.style.background = "rgba(0,0,255, 0.1)";
                        setCSSPropsFromBoundClientRect(e, correctionPoint as unknown as Rect, frame.current,)
                    }
                });

            return () => selectionSubscribion.unsubscribe();
        }
    }, []);

    const selection = useSelection();

    return (
        <>
            <div
                className={"main"}
                ref={canvas}
                onClick={setClick}
                onMouseDown={setSelection}
            >
                <div className="small">&nbsp;</div>
                {JSON.stringify(selection)}
            </div>
            {createPortal(
                <div
                    className={"portal"}
                    ref={frame}
                    style={{pointerEvents: "none"}}
                ></div>,
                document.body
            )}
        </>
    );
};
