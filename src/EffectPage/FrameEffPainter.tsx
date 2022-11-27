import React from "react";
import {FrameEff, PartData, SmallImage} from "../Common/Types";
import PartImg from "./PartImg";

export type TypeFrame = "top" | "bottom";

export interface UpdatePartPositionRequest {
    offsetX: number;
    offsetY: number;
    index: number;
    type: TypeFrame;
    sequenceIndex: number;
}

type Props = {
    imgs: SmallImage[];
    partFrame: FrameEff;
    baseX: number;
    baseY: number;
    ratio: number;
    img: string;
    paintTop: boolean;
};

function FrameEffPainter({
                             partFrame,
                             baseX,
                             baseY,
                             imgs,
                             ratio,
                             img,
                             paintTop,
                         }: Props) {
    const BASE_EFF_X = baseX + 15;
    const BASE_EFF_Y = baseY + 60;


    return (
        <>
            {paintTop &&
                partFrame?.listPartTop?.map((partFrame, index) => {
                    return (
                        <PartImg
                            flip={partFrame.flip === 1}
                            index={999}
                            key={index}
                            img={img}
                            ratio={ratio}
                            x={BASE_EFF_X + partFrame.dx * ratio}
                            y={BASE_EFF_Y + partFrame.dy * ratio}
                            smallImage={imgs[partFrame.idSmallImg]}
                            partFrame={partFrame}
                        />
                    );
                })}

            {!paintTop &&
                partFrame?.listPartBottom?.map((partFrame, index) => {
                    return (
                        <PartImg
                            flip={partFrame.flip === 1}
                            index={999}
                            key={index}
                            img={img}
                            ratio={ratio}
                            x={BASE_EFF_X + partFrame.dx * ratio}
                            y={BASE_EFF_Y + partFrame.dy * ratio}
                            smallImage={imgs[partFrame.idSmallImg]}
                            partFrame={partFrame}
                        />
                    );
                })}
        </>
    );
}

export default FrameEffPainter;
