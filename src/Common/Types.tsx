import { ReactNode } from "react";

export interface MapData {
    fileName?: string;
    width: number;
    height: number;
    maps: number[][];
}
export interface ImgData {
    path: string;
    x: number;
    y: number;
    id: number;
    index: number;
    node?: ReactNode;
}

export type ImageType = "hiro" | "okaza" | "vdmq" | "haru";

export interface EndData {
    path: string;
    size: number;
    x: number;
    y: number;
    index: number;
}

export interface PartFrame {
    idSmallImg: number;
    dx: number;
    dy: number;
    flip: number;
    onTop: number;
}

export interface FrameEff {
    listPartTop: Array<PartFrame>;
    listPartBottom: Array<PartFrame>;
}

export interface SmallImage {
    id: number;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface DataSkillEff {
    imgs: Array<SmallImage>;
    listFrame: Array<FrameEff>;
    sequence: number[];
    frameChar: number[][];
}

export type ItemType = "mob" | "waypoint-left" | "waypoint-right" | "npc";
export interface MapItem {
    type: ItemType;
    x: number;
    y: number;
    mobId?: number;
    mobLevel?: number;
    npcId?: number;
}

export interface Part {
    id: number;
    dx: number;
    dy: number;
}

export interface PartData {
    img: string;
    data: SmallImage;
}

export interface Dim {
    width: number;
    height: number;
}