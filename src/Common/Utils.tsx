import { size } from "./Constants";
import Parts from "./part.json";
import { Part } from "./Types";

function getImageName(index: number, type: string) {
    let s = "";
    if (index < 10) {
        s = "tile00" + index;
    } else if (index < 100) {
        s = "tile0" + index;
    } else {
        s = "tile" + index;
    }
    s = process.env.PUBLIC_URL + "./assets/" + type + "/" + s + ".png";
    return s;
}
export { getImageName };

export const initMap = (width: number, height: number) => {
    return new Array(height).fill(new Array(width).fill(-1));
};

const pixel = 24;
export const convertCoordToPixel = (x: number, y: number, ratio: number) => {
    const w = (Math.round(x / ratio / size) + 1) * pixel;
    const h = (Math.round(y / ratio / size) + 1) * pixel;
    return [w, h];
};

export const safeParse = (func: () => void) => {
    try {
        func();
    } catch (e) {}
};

type PartType = "body" | "head" | "leg";

export const getPart = (index: number, partType: PartType) => {
    const part = (
        partType === "body" || partType === "leg"
            ? Parts[index].pi[1]
            : Parts[index].pi[0]
    ) as Part;
    return part;
};
