import React from "react";
import { MyImage } from "../Common/MyImage";
import { getImageName } from "../Common/Utils";

type Props = {
    images: Array<any>;
    handleClear: (index: number) => void;
    type: string;
    handleOnMouseEnter: (e: any) => void;
};

const RenderImages = ({
    images,
    handleClear,
    type,
    handleOnMouseEnter,
}: Props) => {
    return (
        <div>
            {images.map(
                (img, index) =>
                    img && (
                        <MyImage
                            key={index}
                            onClick={() => handleClear(index)}
                            path={getImageName(img.index, type)}
                            size={img.size}
                            x={img?.x}
                            y={img?.y}
                            handleMouseEnter={handleOnMouseEnter}
                        />
                    )
            )}
        </div>
    );
};

export default RenderImages;
