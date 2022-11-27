import {
    faAdd,
    faPause,
    faPlayCircle,
    faSubtract,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Layer, Stage, Text } from "react-konva";
import Alert from "../Common/Alert";
import { Button } from "../Common/Button";
import { canvas1Width } from "../Common/Constants";
import Divider from "../Common/Divider";
import Input from "../Common/Input";
import { getPart } from "../Common/Utils";
import { useContextApi } from "../hooks/hooks";
import { Char } from "./Char";
import FrameEffPainter from "./FrameEffPainter";
import FramePoints from "./FramePoints";
import VerticalItems from "./Items";

type Props = {
    baseX: number;
    baseY: number;
    centerX: number;
};

type AlertContent = {
    title: string;
    content: string;
};

type PendingType = "frame" | "sequence" | "";

const ShowPanel = ({ baseX, baseY, centerX }: Props) => {
    const {
        setCanvasDim,
        ratio,
        setRatio,
        parts,
        play,
        rootImg,
        setPlay,
        dataSkillEff,
        setDataSkillEff,
        frameDelay,
        setSelectedPartIndex,
        setShowModal,
        setSequenceIndex,
        sequenceIndex,
        setCrop,
        frameIndex,
        crop,
        showModal,
        selectedImgIndex,
        setSelectedImgIndex,
        showInput,
        setShowInput,
        inputValue,
        setInputValue,
    } = useContextApi();
    const [alertContent, setAlertContent] = useState<AlertContent>({
        content: "",
        title: "",
    });
    const sequence = dataSkillEff?.sequence ?? [];

    //// REF
    const canvas1Ref = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<any>();

    useEffect(() => {
        const playAnimation = () => {
            setSequenceIndex((f: any) => {
                let nextF = f + 1;
                nextF %= sequence.length;
                return nextF;
            });

            timeoutRef.current = setTimeout(() => {
                playAnimation();
            }, frameDelay);

            return timeoutRef.current;
        };

        if (play && timeoutRef.current === null) {
            playAnimation();
        } else {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        return () => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        };
    }, [play, frameDelay]);

    useEffect(() => {
        const load = function () {
            if (canvas1Ref) {
                setCanvasDim({
                    width: canvas1Ref.current?.clientWidth!!,
                    height: canvas1Ref.current?.clientHeight!!,
                });
            }
        };
        window.addEventListener("load", load);

        setTimeout(() => {
            if (
                dataSkillEff &&
                dataSkillEff.listFrame &&
                dataSkillEff.listFrame.length > 0
            ) {
                setSequenceIndex(0);
            }
        }, 300);
        return () => {
            window.removeEventListener("load", load);
        };
    }, []);

    useEffect(() => {
        setSelectedPartIndex(-1);
    }, [parts]);

    // Update draggable position

    const onSwapFrame = (index1: number, index2: number) => {
        if (!dataSkillEff) return;
        const listFrame = dataSkillEff?.listFrame ?? [];
        const newListFrame = [...listFrame];
        const temp = newListFrame[index1];
        newListFrame[index1] = newListFrame[index2];
        newListFrame[index2] = temp;
        setDataSkillEff({
            ...dataSkillEff,
            listFrame: newListFrame,
        });
    };

    const onSwapSequence = (index1: number, index2: number) => {
        if (!dataSkillEff) return;
        const sequence = dataSkillEff.sequence ?? [];
        if (sequence.length <= 1) return;

        const newSequence = [...sequence];
        const temp = newSequence[index1];
        newSequence[index1] = newSequence[index2];
        newSequence[index2] = temp;
        setDataSkillEff({
            ...dataSkillEff,
            sequence: newSequence,
        });
    };

    const onChangeFrameOffsetX = (newDX: number) => {
        const newDataSkillEff = { ...dataSkillEff };
        const frames = newDataSkillEff.listFrame!![frameIndex];
        const isTop = frames.listPartTop.length > 0;
        const listFrame = isTop ? frames.listPartTop : frames.listPartBottom;
        const currentFrame = listFrame[0];
        currentFrame.dy = newDX;
        setDataSkillEff(newDataSkillEff as any);
    };

    const onChangeFrameOffsetY = (newDy: number) => {
        const newDataSkillEff = { ...dataSkillEff };
        const frames = newDataSkillEff.listFrame!![frameIndex];
        const isTop = frames.listPartTop.length > 0;
        const listFrame = isTop ? frames.listPartTop : frames.listPartBottom;
        const currentFrame = listFrame[0];
        currentFrame.dy = newDy;
        setDataSkillEff(newDataSkillEff as any);
    };

    const onDoneInputValue = (type: PendingType) => {
        if (type === "frame") {
            const imgs = dataSkillEff?.imgs!!;
            if (imgs.length === 0) {
                setShowModal(true);
                setAlertContent({
                    content: "Select an image first",
                    title: "Error",
                });
                setTimeout(() => {
                    setShowModal(false);
                }, 2000);
                return;
            }

            const newDataSkillEff = { ...dataSkillEff };
            const frames = newDataSkillEff.listFrame!!;
            newDataSkillEff.listFrame = [
                ...frames,
                {
                    listPartTop: [
                        {
                            idSmallImg: selectedImgIndex,
                            onTop: 0,
                            dx: -30,
                            dy: -30,
                            flip: 0,
                        },
                    ],
                    listPartBottom: [],
                },
            ];
            setDataSkillEff(newDataSkillEff as any);
        } else if (type === "sequence") {
            console.log("ADD SEQUENCE");
            const imgs = dataSkillEff?.imgs!!;
            if (imgs.length === 0) {
                setShowModal(true);
                setAlertContent({
                    content: "Create image first",
                    title: "Error",
                });
                setTimeout(() => {
                    setShowModal(false);
                }, 2000);
                return;
            }
            if (frameIndex === -1) {
                setShowModal(true);
                setAlertContent({
                    content: "Select Frame first to add sequence",
                    title: "Error",
                });
                setTimeout(() => {
                    setShowModal(false);
                }, 2000);
                return;
            }
            const newDataSkillEff = { ...dataSkillEff };
            const sequence = newDataSkillEff.sequence ?? [];
            newDataSkillEff.sequence = [...sequence, frameIndex];
            setDataSkillEff(newDataSkillEff as any);
        }
        setShowInput(false);
    };

    function onDeleteSelectedSequence() {
        if (!dataSkillEff) return;
        const sequence = dataSkillEff.sequence ?? [];
        if (sequence.length < 1) return;
        const newSequence = [...sequence];
        newSequence.splice(sequenceIndex, 1);
        setDataSkillEff({
            ...dataSkillEff,
            sequence: newSequence,
        });
    }

    return (
        <div className="w-2/3 h-full">
            {showModal && (
                <Alert
                    text={alertContent.content}
                    title={alertContent.title}
                    danger
                />
            )}
            {/*{*/}
            {/*    showInput && <div className='w-full space-y-2'>*/}
            {/*        <Input full onChange={(e) => setInputValue(+e.target.value!!)} type="number" value={inputValue}*/}
            {/*               placeholder="Input value"/>*/}
            {/*        <div className='w-full justify-end'>*/}
            {/*            <Button onClick={handleDoneInputValue}>Done</Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}
            <div className="flex mb-3 justify-between w-full">
                {/* Flex container top */}
                <div
                    ref={canvas1Ref}
                    className="w-full p-5 border-2 rounded-lg shadow-lg relative bg-white flex items-center justify-center h-full  flex-row-reverse"
                >
                    <div className="flex-1 justify-center flex flex-col h-full">
                        <Stage
                            className="border-x-2"
                            width={canvas1Width}
                            height={300}
                        >
                            <Layer>
                                {sequenceIndex !== -1 &&
                                    dataSkillEff?.listFrame && (
                                        <FrameEffPainter
                                            baseX={baseX}
                                            baseY={baseY}
                                            ratio={ratio}
                                            imgs={dataSkillEff.imgs}
                                            img={rootImg}
                                            paintTop={false}
                                            partFrame={
                                                dataSkillEff.listFrame[
                                                    frameIndex
                                                ]
                                            }
                                        />
                                    )}
                            </Layer>
                            <Layer>
                                <Text
                                    y={10}
                                    x={centerX - 30}
                                    text="Charater"
                                    fontStyle="bold"
                                    fontSize={15}
                                />
                                <Char
                                    baseX={baseX}
                                    baseY={baseY}
                                    parts={[
                                        getPart(2, "head"),
                                        getPart(1, "body"),
                                        getPart(0, "leg"),
                                    ]}
                                    ratio={ratio}
                                    width={10}
                                />
                            </Layer>
                            <Layer>
                                {sequenceIndex !== -1 &&
                                    dataSkillEff?.listFrame && (
                                        <FrameEffPainter
                                            baseX={baseX}
                                            baseY={baseY}
                                            imgs={dataSkillEff.imgs}
                                            ratio={ratio}
                                            img={rootImg}
                                            paintTop
                                            partFrame={
                                                dataSkillEff.listFrame[
                                                    frameIndex
                                                ]
                                            }
                                        />
                                    )}
                            </Layer>
                        </Stage>
                        <div className="rounded-full text-xl h-10 space-x-5 flex items-center w-full flex-row justify-center">
                            <FontAwesomeIcon
                                className="bg-green-500 rounded-full p-2 hover:bg-green-600 cursor-pointer select-none"
                                icon={faSubtract}
                                onClick={() => {
                                    if (ratio > 1) {
                                        setRatio(ratio - 1);
                                    }
                                }}
                            />

                            <FontAwesomeIcon
                                className="bg-green-500 rounded-full p-2 hover:bg-green-600 cursor-pointer select-none"
                                icon={faAdd}
                                onClick={() => {
                                    if (ratio < 4) {
                                        setRatio(ratio + 1);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <Button
                    className="w-20 h-10 self-end bg-amber-600"
                    onClick={() => {
                        setPlay(!play);
                    }}
                >
                    <FontAwesomeIcon icon={play ? faPause : faPlayCircle} />
                </Button>

                <div className="flex flex-col w-full justify-center mx-5">
                    <VerticalItems
                        items={dataSkillEff?.listFrame ?? []}
                        onDropChange={onSwapFrame}
                    />
                    <div className="flex space-x-5 mt-3">
                        <Button
                            onClick={() => {
                                onDoneInputValue("frame");
                            }}
                        >
                            <FontAwesomeIcon icon={faAdd} />
                        </Button>
                        <Button
                            danger
                            onClick={() => {
                                if (
                                    !dataSkillEff ||
                                    !dataSkillEff.listFrame ||
                                    frameIndex === -1
                                )
                                    return;
                                const newDataEff = { ...dataSkillEff };
                                newDataEff.listFrame.splice(frameIndex, 1);
                                newDataEff.sequence =
                                    newDataEff.sequence.filter(
                                        (i) => i !== frameIndex
                                    );
                                setDataSkillEff(newDataEff as any);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col">
                    <FramePoints
                        sequenceIndex={sequenceIndex}
                        maxFrame={sequence.length}
                        sequence={sequence}
                        onDropChange={onSwapSequence}
                        onChange={(frame) => setSequenceIndex(frame)}
                        onClick={() => setPlay(false)}
                    />
                    <div className="flex space-x-5">
                        <Button
                            onClick={() => {
                                onDoneInputValue("sequence");
                            }}
                        >
                            <FontAwesomeIcon icon={faAdd} />
                        </Button>
                        <Button
                            danger
                            onClick={() => {
                                onDeleteSelectedSequence();
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                </div>
            </div>
            <input
                placeholder="Frame"
                type="range"
                className="overflow-x-auto w-full"
                min={0}
                height={500}
                max={sequence.length - 1}
                onChange={(e) => {
                    setSequenceIndex(+e.target.value);
                }}
                value={sequenceIndex}
                onClick={() => setPlay(false)}
            />
            <div className="w-full rounded-xl bg-green-200 h-52 p-5 flex space-x-5">
                <div className="w-full">
                    <Divider>Dx</Divider>
                    <Input
                        onChange={(e) => {
                            setCrop({
                                ...crop,
                                x: +e.target.value!! * ratio,
                            });
                        }}
                        placeholder={"Dx"}
                        value={Math.round(crop.x / ratio)}
                        type="number"
                        full
                    />

                    <Divider>DY</Divider>
                    <Input
                        onChange={(e) => {
                            setCrop({
                                ...crop,
                                y: +e.target.value!! * ratio,
                            });
                        }}
                        placeholder={"Dx"}
                        value={Math.round(crop.y / ratio)}
                        type="number"
                        full
                    />
                </div>
                <div className="w-full">
                    <Divider>Width</Divider>
                    <Input
                        onChange={(e) => {
                            setCrop({
                                ...crop,
                                width: +e.target.value!! * ratio,
                            });
                        }}
                        placeholder={"Dx"}
                        value={Math.round(crop.width / ratio)}
                        type="number"
                        full
                    />
                    <Divider>Height</Divider>
                    <Input
                        onChange={(e) => {
                            setCrop({
                                ...crop,
                                height: +e.target.value!!,
                            });
                        }}
                        placeholder={"Dx"}
                        value={Math.round(crop.height / ratio)}
                        type="number"
                        full
                    />
                </div>

                <div className="w-full">
                    <Divider>OffsetX Selected Image</Divider>
                    <Input
                        onChange={(e) => {
                            setCrop({
                                ...crop,
                                x: +e.target.value!! * ratio,
                            });
                        }}
                        placeholder={"Dx"}
                        value={Math.round(crop.x / ratio)}
                        type="number"
                        full
                    />

                    <Divider>Offset Y Selected Image</Divider>
                    <Input
                        onChange={(e) => {
                            setCrop({
                                ...crop,
                                y: +e.target.value!! * ratio,
                            });
                        }}
                        placeholder={"Dx"}
                        value={Math.round(crop.y / ratio)}
                        type="number"
                        full
                    />
                </div>
            </div>
            <div className="w-full h-16 bg-blue-300 rounded-sm mt-3 shadow-sm border-2 flex flex-row space-x-3 p-2 overflow-x-auto ">
                {dataSkillEff?.imgs.map((img, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedImgIndex(index);

                                setCrop({
                                    ...crop,
                                    x: dataSkillEff.imgs[index].x * ratio,
                                    y: dataSkillEff.imgs[index].y * ratio,
                                    width: dataSkillEff.imgs[index].w * ratio,
                                    height: dataSkillEff.imgs[index].h * ratio,
                                });
                            }}
                            className={` w-60 flex-1 text-center rounded-sm hover:bg-green-400 ${
                                selectedImgIndex === index
                                    ? "bg-green-500"
                                    : "bg-green-700"
                            }`}
                        >
                            <div>ID {img.id}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShowPanel;
