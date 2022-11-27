import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import ReactCrop, {Crop} from "react-image-crop";
import {Ctx} from "..";
import {Button} from "../Common/Button";
import {API_URL, canvas1Width, imgTest, placeHolderImg} from "../Common/Constants";
import Divider from "../Common/Divider";
import Input from "../Common/Input";
import {DataSkillEff, Dim, PartData} from "../Common/Types";
import {safeParse} from "../Common/Utils";
import Img from "./../effects/ImgEffect 75.png";
import ShowPanel from "./ShowPanel";

type FileType = "image" | "data";
const defaultCrop = {
    unit: "px",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
} as Crop;

const EffectPage = () => {
    const [ratio, setRatio] = React.useState<number>(2);
    const [frameDelay, setFrameDelay] = React.useState<number>(80);
    const [selectedPartIndex, setSelectedPartIndex] = React.useState<number>(-1);
    const [rootImg, setRootImg] = React.useState<string>(imgTest);
    const [zoom, onZoomChange] = useState<number>(2);
    const [effId, setEffId] = useState<number>(75);

    const [crop, setCrop] = useState<Crop>(defaultCrop);
    const [indexExpand, setIndexExpand] = useState<number>(-1);
    const [canvasDim, setCanvasDim] = useState<Dim>({
        height: 284,
        width: 1020,
    });
    const [selectedImgIndex, setSelectedImgIndex] = useState<number>(-1);

    const [dataSkillEff, setDataSkillEff] = useState<DataSkillEff | null>({
        imgs: [
            // {id: 0, x: 0, y: 0, w: 78, h: 41},
            // {id: 1, x: 78, y: 0, w: 78, h: 41},
            // {id: 2, x: 156, y: 0, w: 78, h: 41},
            // {id: 3, x: 0, y: 41, w: 78, h: 41},
            // {id: 4, x: 78, y: 41, w: 78, h: 41},
            // {id: 5, x: 156, y: 41, w: 78, h: 41},
            // {id: 6, x: 0, y: 91, w: 78, h: 41},
            // {id: 7, x: 78, y: 91, w: 78, h: 41},
            // {id: 8, x: 156, y: 91, w: 78, h: 41},
        ],
        listFrame: [
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 0, dx: -35, dy: -35, flip: 0, onTop: 0},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 1, dx: -36, dy: -35, flip: 0, onTop: 0},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 2, dx: -38, dy: -35, flip: 0, onTop: 0},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 3, dx: -36, dy: -38, flip: 0, onTop: 0},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 4, dx: -37, dy: -36, flip: 0, onTop: 1},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 5, dx: -38, dy: -36, flip: 0, onTop: 1},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 6, dx: -35, dy: -37, flip: 0, onTop: 1},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 7, dx: -35, dy: -37, flip: 0, onTop: 1},
            //     ],
            // },
            // {
            //     listPartTop: [],
            //     listPartBottom: [
            //         {idSmallImg: 8, dx: -39, dy: -37, flip: 0, onTop: 1},
            //     ],
            // },
        ],
        sequence: [
            // 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6,
            // 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
        ],
        frameChar: [[], [], [], []],
    });
    const [parts, setParts] = useState<Array<PartData>>([]);
    const [maxFrame, setMaxFrame] = useState<number>(10);
    const [play, setPlay] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [sequenceIndex, setSequenceIndex] = useState(-1);
    const [frameIndex, setFrameIndex] = useState(-1);
    const [inputValue, setInputValue] = useState<number>(0);

    const [showInput, setShowInput] = useState(false);

    ///////////////// Refs
    const uploadRef = useRef<any>();
    const imgRef = useRef<HTMLImageElement | null>(null);
    const typeUploadRef = useRef<FileType>("image");

    useEffect(() => {
        setRootImg(Img);
    }, []);

    useEffect(() => {
        if (sequenceIndex === -1 || !dataSkillEff) {
            setCrop(defaultCrop);
            return;
        }
        const index = dataSkillEff.sequence[sequenceIndex];
        const imgs = dataSkillEff.imgs;
        const listPart =
            dataSkillEff.listFrame[index].listPartBottom.length > 0
                ? dataSkillEff.listFrame[index].listPartBottom
                : dataSkillEff.listFrame[index].listPartTop;
        const img = imgs[listPart[0].idSmallImg];

        setFrameIndex(index);
        setCrop({
            unit: "px",
            x: img.x * ratio,
            y: img.y * ratio,
            width: img.w * ratio,
            height: img.h * ratio,
        });
        setSelectedImgIndex(listPart[0].idSmallImg);
    }, [sequenceIndex]);

    useEffect(() => {
        if (!dataSkillEff || play) return;
        if (!play) {
            const firstFrame = dataSkillEff.sequence.indexOf(frameIndex);
            setSequenceIndex(firstFrame);
        }
    }, [frameIndex]);

    /////////////////////////////////////////
    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (typeUploadRef.current === "image") {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                setRootImg(reader.result as string);
            };
        } else if (typeUploadRef.current === "data") {
            const formData = new FormData();
            formData.append("file", file);
            axios
                .post(API_URL + "/uploadEffData", formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                })
                .then(({data}) => {
                    setDataSkillEff(data as DataSkillEff);
                })
                .catch(console.log);
        }
    };

    const handleParse = () => {
        axios
            .post(API_URL + "/parse/" + effId, dataSkillEff, {
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", effId + "");
                document.body.appendChild(link);
                link.click();
            });
    };

    const center = () => {
        return [canvas1Width / 2, canvasDim.height / 2];
    };

    const getBaseX = () => {
        let offset = 20;
        if (ratio === 1) {
            offset = 8;
        } else if (ratio === 2) {
            offset = 15;
        } else if (ratio === 3) {
            offset = 25;
        } else if (ratio === 4) {
            offset = 35;
        }
        return center()[0] - offset;
    };

    const getBaseY = () => {
        let offset = 20;
        if (ratio === 1) {
            offset = 8;
        } else if (ratio === 2) {
            offset = 15;
        } else if (ratio === 3) {
            offset = 25;
        } else if (ratio === 4) {
            offset = 35;
        }
        return center()[1] - offset;
    };

    const onAddSmallImage = () => {
        if (!dataSkillEff) {
            return;
        }
        const newDat = {
            ...dataSkillEff,
            imgs: dataSkillEff.imgs ? dataSkillEff.imgs : [],
        };
        console.log(crop);

        newDat.imgs.push({
            id: newDat.imgs.length,
            w: Math.round(Math.round(crop.width) / ratio),
            h: Math.round(Math.round(crop.height) / ratio),
            x: Math.round(Math.round(crop.x) / ratio),
            y: Math.round(Math.round(crop.y) / ratio),
        });
        setDataSkillEff(newDat);
    };

    function reCropImage() {
        if (!dataSkillEff || play) return;
        if (crop.x === 0 && crop.y === 0 && crop.width === 0 && crop.height === 0) {
            return;
        }

        const newDat = {...dataSkillEff};
        newDat.imgs[selectedImgIndex] = {
            ...dataSkillEff.imgs[selectedImgIndex],
            h: Math.round(crop.height / ratio),
            w: Math.round(crop.width / ratio),
            x: Math.round(crop.x / ratio),
            y: Math.round(crop.y / ratio),
        };

        setDataSkillEff({
            ...newDat,
        });
    }

    return (
        <Ctx.Provider
            value={{
                setSequenceIndex,
                play: play,
                setPlay: setPlay,
                canvasDim: canvasDim,
                crop: crop,
                dataSkillEff: dataSkillEff,
                frameDelay: frameDelay,
                maxFrame: maxFrame,
                onZoomChange: onZoomChange,
                parts: parts ?? [],
                ratio: ratio,
                rootImg: rootImg,
                selectedPartIndex: selectedPartIndex,
                setCrop: setCrop,
                setDataSkillEff: setDataSkillEff,
                setFrameDelay: setFrameDelay,
                setMaxFrame: setMaxFrame,
                setParts: setParts,
                setRatio: setRatio,
                setSelectedPartIndex: setSelectedPartIndex,
                setCanvasDim: setCanvasDim,
                setRootImg: setRootImg,
                zoom: zoom,
                setShowModal,
                showModal,
                sequenceIndex,
                frameIndex,
                setFrameIndex,
                indexExpand,
                setIndexExpand,
                selectedImgIndex,
                setSelectedImgIndex,
                showInput,
                setShowInput,
                inputValue,
                setInputValue,
            }}
        >
            <div className="container mx-auto flex pt-12">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    ref={uploadRef}
                    className="hidden"
                    placeholder="File upload"
                />
                <ShowPanel baseX={getBaseX()} baseY={getBaseY()} centerX={center()[0]}/>
                <div className="w-1/3 h-full ml-5">
                    <div className="flex justify-center w-full">
                        <div className="w-full p-5 border-2 rounded-lg shadow-lg bg-white">
                            <div className="flex justify-between">
                                <h5 className="text-gray-900 text-xl leading-tight font-bold mb-2">Image uploader</h5>
                                <div className="flex space-x-2">
                                    <Button onClick={onAddSmallImage}>Thêm Small Image</Button>
                                    <Button onClick={reCropImage}>ReCrop Image</Button>
                                </div>
                            </div>

                            <div className="w-full flex items-center justify-center my-4">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => {
                                        setCrop(c);
                                    }}
                                >
                                    <img
                                        ref={imgRef}
                                        src={rootImg !== null ? rootImg : placeHolderImg}
                                        style={{zoom: `${100}%`}}
                                        className="h-full border-2"
                                        alt=""
                                    />
                                </ReactCrop>
                            </div>
                            <Divider>Frame delay</Divider>
                            <Input
                                full
                                type="number"
                                placeholder="Frame delay"
                                value={frameDelay}
                                onChange={(e) => setFrameDelay(+e.target.value ?? 0)}
                            />
                            {/*<Divider>Zoom</Divider>*/}
                            {/*<Input*/}
                            {/*    onChange={(e) => {*/}
                            {/*        safeParse(() => {*/}
                            {/*            onZoomChange(+e.target.value);*/}
                            {/*        });*/}
                            {/*    }}*/}
                            {/*    value={zoom}*/}
                            {/*    placeholder="Zoom"*/}
                            {/*    type="number"*/}
                            {/*    full*/}
                            {/*/>*/}
                            <Divider>EffId</Divider>
                            <Input
                                type="number"
                                full
                                onChange={(e) => {
                                    safeParse(() => {
                                        setEffId(parseInt(e.target.value));
                                    });
                                }}
                                value={effId}
                                placeholder="EffId"
                            />

                            <Button
                                full
                                onClick={() => {
                                    uploadRef?.current?.click();
                                    typeUploadRef.current = "image";
                                }}
                            >
                                Upload image
                            </Button>
                            <Button
                                danger
                                full
                                onClick={() => {
                                    uploadRef?.current?.click();
                                    typeUploadRef.current = "data";
                                }}
                            >
                                Upload Data
                            </Button>

                            <Button
                                full
                                onClick={() => {
                                    handleParse();
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Ctx.Provider>
    );
};

export default EffectPage;
