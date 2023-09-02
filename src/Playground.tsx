import {DragEventHandler} from "react";

function createPlaceholder() {
    const img = document.createElement('img');
    img.setAttribute('style', 'width:' + 1 + 'px;height:' + 1 + 'px;border:none;display:block');
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    return img;
}

export const Playground = () => {
    const onDrag: DragEventHandler<HTMLDivElement> = (e) => {
        // e.preventDefault();
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setDragImage(createPlaceholder(),0,0)
        // e.dataTransfer.setDragImage(new HTMLElement(), 0, 0);
    }
    return <div draggable={true} onDragStart={onDrag} style={{width: '10000px', height: '10000px', background: 'blue'}}>
        <div  className={'playground'}>test</div>
    </div>;
}