import {curry, mapObjIndexed, pipe} from 'rambda'

export type Rect = Pick<DOMRect, 'top' | 'left' | 'height' | 'width'>;
type Point = Pick<DOMRect, 'top' | 'left'>
type RectTransformer = (rect: Rect) => Rect;
type CorrectionTransformer = (point: Point, rect: Rect) => Rect;
type Elem = HTMLElement;

export const convertBoundClientRectToAbsCoords: RectTransformer = (rect) => ({
    width: Math.abs(rect.width),
    height: Math.abs(rect.height),
    top: rect.height > 0 ? rect.top : rect.top + rect.height,
    left: rect.width > 0 ? rect.left : rect.left + rect.width,
})

const addCorrectionPoint: CorrectionTransformer = (point, rect) => {
    return ({
        ...rect,
        top: rect.top + point.top,
        left: rect.left + point.left,
    });
}

const addCorrectionFromWindow: RectTransformer = (rect) => {
    return ({
        ...rect,
        top: rect.top - window.scrollY,
        left: rect.left - window.scrollX,
    });
}

const wrapWithPixels = mapObjIndexed((value) => value + 'px')


const getPixelsFn = (correctionPoint: Point) => {
    const correctionFn = curry(addCorrectionPoint)(correctionPoint);
    return pipe(
        convertBoundClientRectToAbsCoords,
        addCorrectionFromWindow,
        correctionFn,
        wrapWithPixels,
    );
}


export const setCSSPropsFromBoundClientRect = (
    input: Rect,
    correctionPoint: Point,
    e: Elem
) => Object.assign(e.style, getPixelsFn(correctionPoint)(input))