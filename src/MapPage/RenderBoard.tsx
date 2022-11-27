import { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Rect } from "react-konva";
import { size } from "../Common/Constants";
import { MapData } from "../Common/Types";

type Props = {
    data: MapData;
    handleOnMouseEnter: (e: KonvaEventObject<MouseEvent>) => void;
    actualSize: number;
    ratio: number;
};

function RenderBoard({ data, handleOnMouseEnter, actualSize, ratio }: Props) {
    return (
        <>
            {data.maps
                .map((row, h) => {
                    return row.map((item, w) => {
                        const actualSize = size * ratio;
                        return (
                            <Rect
                                key={h + "-" + w}
                                width={actualSize}
                                height={actualSize}
                                fill={(h * w) % 2 === 0 ? "white" : "white"}
                                x={w * actualSize}
                                y={h * actualSize}
                                onMouseEnter={(e) => handleOnMouseEnter(e)}
                                stroke={"---"}
                                strokeWidth={1}
                            />
                        );
                    });
                })
                .flat()}
        </>
    );
}

export default RenderBoard;
