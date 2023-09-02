import style from './Canvas.module.css'
import {forwardRef} from "react";
import {setSelection, useSelection} from "../../web/signals/selectionSignal.ts";

export const Canvas = forwardRef<HTMLDivElement>((_props, parent) => {
    const selection = useSelection();
    return <div ref={parent} onMouseDown={(e) => setSelection(e.nativeEvent)} className={style.canvas}>
        {JSON.stringify((selection))}
    </div>;
});
