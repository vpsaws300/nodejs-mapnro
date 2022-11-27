import React from "react";
import {HorizontalItems} from "./Items";

type Props = {
    sequenceIndex: number;
    maxFrame: number;
    onChange?: (value: number) => void;
    onClick: () => void;
    sequence: number[];
    onDropChange: (index1: number, index2: number) => void;
};

const FramePoints = ({
                         maxFrame,
                         onChange,
                         sequenceIndex,
                         sequence,
                         onClick,
                         onDropChange,
                     }: Props) => {
    return (
        <>
            <div className="flex my-3">
                {<HorizontalItems
                    onClickItem={onChange!!}
                    selectedSequenceIndex={sequenceIndex}
                    items={new Array(maxFrame)
                        .fill(-1)
                        .map((_, index) => {
                            return {
                                frame: sequence[index],
                                index: index,
                            };
                        })}
                    onDropChange={onDropChange}
                />}
            </div>
        </>
    );
};

export default FramePoints;
