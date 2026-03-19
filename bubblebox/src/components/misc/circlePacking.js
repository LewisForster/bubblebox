export function polygonContainsPoint(xPoints, yPoints, testX, testY) {
    const numVertices = xPoints.length;
    let c = false;
    let j = numVertices - 1;
    for (let i = 0; i < numVertices; i++) {
        const deltaX = xPoints[j] - xPoints[i];
        const ySpread = testY - yPoints[i];
        const deltaY = yPoints[j] - yPoints[i];
        if (((xPoints[i] > testX) != (xPoints[j] > testX)) &&
            (testY < (((deltaX * ySpread) / deltaY) + yPoints[i]))) {
            c = !c;

        }
        j = i;
    }
    return c;
}

export function isCircleInPolygon(xpolygon, ypolygon, x, y, radius) {
    for (let k = 0; k < 16; k++) {
        const theta = Math.PI * (k / 8.0);
        const pointX = x + (radius * Math.cos(theta));
        const pointY = y + (radius * Math.sin(theta));
        if (!polygonContainsPoint(xpolygon, ypolygon, pointX, pointY)) {
            return false;
        }
    }
    return true;
}

// https://www.tylerxhobbs.com/words/a-randomized-approach-to-circle-packing