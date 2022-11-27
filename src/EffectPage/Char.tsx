import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import { Part } from "../Common/Types";

type Props = {
    // Head, body, leg
    parts: Part[];
    ratio: number;
    width: number;
    baseX: number;
    baseY: number;
};

let localRatio = 1;

const getPath = (partId: number) => {
    return process.env.PUBLIC_URL + `/assets/part/x${localRatio}/${partId}.png`;
};

export const Char = ({ parts, ratio, width, baseX, baseY }: Props) => {
    localRatio = ratio;
    return (
        <>
            <CharImage
                baseX={baseX}
                baseY={baseY}
                x={parts[0].dx * ratio}
                y={parts[0].dy * ratio}
                id={parts[0].id}
            />

            <CharImage
                baseX={baseX}
                baseY={baseY}
                x={(parts[1].dx - 1) * ratio}
                y={(parts[1].dy + 19 - 2) * ratio}
                id={parts[1].id}
            />

            <CharImage
                baseX={baseX}
                baseY={baseY}
                x={(parts[2].dx + 3) * ratio}
                y={(parts[2].dy + 19 + 8 - 1) * ratio}
                id={parts[2].id}
            />
        </>
    );
};

type PropsCharImg = {
    x: number;
    y: number;
    id: number;
    baseX: number;
    baseY: number;
};

const CharImage = ({ x, y, id, baseX, baseY }: PropsCharImg) => {
    const [image] = useImage(getPath(id));

    return <Image image={image} x={baseX + x} y={baseY + y} />;
};
