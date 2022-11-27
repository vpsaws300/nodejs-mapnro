import React from "react";
import { typeToSize } from "../Common/Constants";
import { ImageType } from "../Common/Types";

type Props = {
    index: number;
    setIndex: (index: number) => void;
    type: ImageType;
};

const RenderMobAndWayPointSelect = ({ index, setIndex, type }: Props) => {
    return (
        <div className="flex flex-col w-full bg-blue-100 p-2 space-x-2 space-y-2">
            <img
                src={"/assets/mob/mob.png"}
                alt=""
                className={`${
                    index === 0 ? "border-2" : ""
                } w-10 h-10 hover:cursor-pointer`}
                onClick={() => {
                    if (index !== 0) {
                        setIndex(typeToSize[type]);
                    } else {
                        setIndex(-1);
                    }
                }}
            />
            <img
                src={"/assets/mob/waygo.png"}
                alt=""
                className={`${
                    index === 1 ? "border-2 " : ""
                } w-10 h-10 hover:cursor-pointer`}
                onClick={() => {
                    if (index !== 1) {
                        setIndex(typeToSize[type] + 1);
                    } else {
                        setIndex(-1);
                    }
                }}
            />
            <img
                src={"/assets/mob/waygoright.png"}
                alt=""
                className={`${
                    index === 2 ? "border-2 " : ""
                } w-10 h-10 hover:cursor-pointer`}
                onClick={() => {
                    if (index !== 2) {
                        setIndex(typeToSize[type] + 2);
                    } else {
                        setIndex(-1);
                    }
                }}
            />
            <img
                src={"/assets/mob/npc.png"}
                alt=""
                className={`${
                    index === 3 ? "border-2 " : ""
                } w-10 h-10 hover:cursor-pointer`}
                onClick={() => {
                    if (index !== 3) {
                        setIndex(typeToSize[type] + 3);
                    } else {
                        setIndex(-1);
                    }
                }}
            />
        </div>
    );
};

export default RenderMobAndWayPointSelect;
