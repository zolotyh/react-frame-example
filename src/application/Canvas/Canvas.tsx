import style from './Canvas.module.css'
import {forwardRef} from "react";
import {setSelection} from "../../web/signals/selectionSignal.ts";

export const Canvas = forwardRef<HTMLDivElement>((_props, parent) => {
    return <div ref={parent} onMouseDown={(e) => setSelection(e.nativeEvent)} className={style.canvas}>
        canvase
    </div>;
});
