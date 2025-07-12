export function unitToPxStr(nbUnit, pxPerUnit) {
    return `${nbUnit * pxPerUnit}px`;
}

export function isSegmentinSegment(x1, width1, x2, width2) {
    return x1 >= x2 && x1 + width1 <= x2 + width2;
}

function doesSegmentOverlapSegment(x1, width1, x2, width2) {
    return !(x1 + width1 <= x2) && !(x2 + width2 <= x1);
}

export function isRectInRect(x1, width1, y1, height1, x2, width2, y2, height2) {
    return isSegmentinSegment(x1, width1, x2, width2) && isSegmentinSegment(y1, height1, y2, height2);
}

export function doesRectOverlapRect(x1, width1, y1, height1, x2, width2, y2, height2) {
    return doesSegmentOverlapSegment(x1, width1, x2, width2) && doesSegmentOverlapSegment(y1, height1, y2, height2);
}
