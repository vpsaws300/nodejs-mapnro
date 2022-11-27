import React from "react";
import { Shape } from "react-konva";
import { PartFrame, SmallImage } from "../Common/Types";

type PartImgProps = {
    img: string;
    smallImage: SmallImage;
    ratio: number;
    x: number;
    y?: number;
    selectedIndex?: number;
    setSelectedIndex?: (i: number) => void;
    flip?: boolean;
    index: number;
    partFrame?: PartFrame;
};

const PartImg = ({
    ratio,
    smallImage,
    x,
    y,
    selectedIndex,
    setSelectedIndex,
    index,
    img,
    flip,
}: PartImgProps) => {
    const selected = index === selectedIndex;
    return (
        <Shape
            fill={`${selected ? "rgba(20,20,20,0.5)" : ""}`}
            scaleY={flip ? -1 : 1}
            onClick={() => {
                if (selected) {
                    setSelectedIndex?.(-1);
                } else {
                    setSelectedIndex?.(index);
                }
            }}
            sceneFunc={(ctx, shape) => {
                const image = new window.Image();
                image.src = img;
                ctx.beginPath();
                // ctx.rect(x, y ?? 0, smallImage.w * ratio, smallImage.h * ratio);
                ctx.closePath();
                ctx.fillStrokeShape(shape);

                // Crop image
                ctx.drawImage(
                    image,
                    smallImage.x * ratio,
                    smallImage.y * ratio,
                    smallImage.w * ratio,
                    smallImage.h * ratio,
                    x ?? 0,
                    y ?? 0,
                    smallImage.w * ratio,
                    smallImage.h * ratio
                );
            }}
        />
    );
};

export default PartImg;
