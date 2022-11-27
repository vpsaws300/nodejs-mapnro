import React from "react";
import { Crop } from "react-image-crop";
import { DataSkillEff, Dim, PartData } from "../Common/Types";
import { Ctx } from "../index";

export interface ContextType {
    ratio: number;
    setRatio: (ratio: number) => void;
    setFrameDelay: (delay: number) => void;
    frameDelay: number;
    setSelectedPartIndex: (i: number) => void;
    selectedPartIndex: number;
    rootImg: string;
    setRootImg: (data: string) => void;
    setCrop: (crop: Crop) => void;
    crop: Crop;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    canvasDim: Dim;
    setCanvasDim: (dim: Dim) => void;
    dataSkillEff: DataSkillEff | null;
    setDataSkillEff: (data: DataSkillEff) => void;
    parts: Array<PartData>;
    setParts: (parts: Array<PartData>) => void;
    maxFrame: number;
    setMaxFrame: (maxFrame: number) => void;
    play: boolean;
    setPlay: (play: boolean) => void;
    showModal: boolean;
    setShowModal: (showModel: boolean) => void;
    sequenceIndex: number;
    setSequenceIndex: (x: any) => void;
    frameIndex: number;
    setFrameIndex: (index: number) => void;
    indexExpand: number;
    setIndexExpand: (index: number) => void;
    selectedImgIndex: number;
    setSelectedImgIndex: (index: number) => void;
    showInput: boolean;
    setShowInput: (show: boolean) => void;
    inputValue: number;
    setInputValue: (value: number) => void;
}

export const useContextApi = () => {
    return React.useContext(Ctx)!!;
};
