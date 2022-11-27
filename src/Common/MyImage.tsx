import { KonvaEventObject } from "konva/lib/Node";
import { IRect } from "konva/lib/types";
import { Image } from "react-konva";
import useImage from "use-image";

export interface MyImageProps {
    path: string;
    x: number;
    y: number;
    size: number;
    onClick?: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseEnter?: (e: KonvaEventObject<MouseEvent>) => void;
    crop?: IRect;
    flip?: boolean;
}

export const MyImage = ({
    path,
    size,
    x,
    y,
    onClick,
    handleMouseEnter: handleMouseOver,
    crop,
    flip,
}: MyImageProps) => {
    const [image] = useImage(path);
    return (
        <Image
            scaleX={flip ? -1 : 1}
            image={image}
            width={size}
            height={size}
            // crop={{ x: 0, y: 0, width: 2 * size, height: 2.5 * size }}
            x={flip ? x + size : x}
            y={y}
            onMouseDown={(e) => {
                if (onClick) {
                    onClick(e);
                }
            }}
            onMouseOver={(e) => {
                if (handleMouseOver) {
                    handleMouseOver(e);
                }
            }}
        />
    );
};
