import React from "react";
import { typeToSize } from "../Common/Constants";
import { ImageType } from "../Common/Types";
import { getImageName } from "../Common/Utils";

type Props = {
    type: ImageType;
    setSelectedIndex: (index: number) => void;
    selectedIndex: number;
};

export const ImageSelectPanel = ({
    type,
    selectedIndex,
    setSelectedIndex,
}: Props) => {
    const generateItemSelect = () => {
        const elements = [];
        for (let i = 0; i < typeToSize[type]; i++) {
            elements.push(
                <img
                    onClick={() => {
                        setSelectedIndex(i);
                    }}
                    className={` w-10 h-10 ${
                        selectedIndex === i ? "border-2" : "border-none"
                    } hover:cursor-pointer`}
                    key={i}
                    src={getImageName(i, type)}
                    alt=""
                />
            );
        }

        return elements;
    };

    return (
        <div className="bg-blue-300 shadow-md rounded px-8 pt-6 pb-8 mb-4 mr-5 border-2">
            <div className="flex w-full flex-wrap space-x-1 space-y-1">
                {generateItemSelect()}
            </div>
        </div>
    );
};
