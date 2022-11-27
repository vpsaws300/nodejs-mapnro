import {faExpand, faUpDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useRef, useState} from "react";
import {Draggable, useDraggable, useDraggableContext} from "react-tiny-dnd";
import {Button} from "../Common/Button";
import Divider from "../Common/Divider";
import Input from "../Common/Input";
import {PartFrame} from "../Common/Types";
import {useContextApi} from "../hooks/hooks";

type VerticalProps = {
    items: any[];
    onDropChange: (index1: number, index2: number) => void;
};
type HorizontalProps = {
    items: any[];
    onDropChange: (index1: number, index2: number) => void;
    selectedSequenceIndex: number;
    onClickItem: (index: number) => void;
};

const VerticalItems = ({
                           items,
                           onDropChange,
                       }: VerticalProps) => {
    const onDrop = (dragIndex: number, overIndex: number) => {
        onDropChange(dragIndex, overIndex);
    };

    const context = useDraggableContext({
        onDrop,
    });

    return (
        <div className="w-96 h-96 overflow-y-auto p-4 border-2">
            {items.map((item, i) => {
                return (
                    <VerticalDraggableItem
                        context={context}
                        key={JSON.stringify(item)}
                        index={i}
                        item={item}

                    />
                );
            })}
        </div>
    );
};

export default VerticalItems;

interface DraggableItemProps {
    index: number;
    item: any;
    selected?: boolean;
    context: any;
    onClick?: (index: number) => void;
}

const VerticalDraggableItem = ({
                                   index,
                                   context,
                                   item,
                                   selected,
                               }: DraggableItemProps) => {
    const {
        listeners, // Handler listeners can be passed to Draggable component as well
    } = useDraggable(context, index);

    const {frameIndex, setFrameIndex, dataSkillEff, indexExpand, setIndexExpand} = useContextApi();
    selected = frameIndex === index || selected;
    const expanded = indexExpand === index;

    return (
        <Draggable
            context={context}
            key={item.id}
            index={index}
            listeners={listeners}
        >
            <div
                className={`mb-2 w-full ${
                    selected ? "bg-yellow-300" : "bg-green-600"
                } cursor-pointer select-none border-2 shadow-sm rounded-md
                
            hover:bg-green-400 

            `}

            >
                <div className="flex w-full items-center justify-between" onClick={() => setFrameIndex(index)}>
                    <span className="p-2">{index}</span>

                    <Button
                        className="w-16"
                        onClick={(e) => {
                            if (expanded) {
                                setIndexExpand(-1)
                            } else {
                                setIndexExpand(index)
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faExpand}/>
                    </Button>
                </div>
                {expanded && (
                    <div className="w-full h-full bg-white p-3 space-y-2">
                        <Divider>List part top</Divider>
                        {dataSkillEff?.listFrame[frameIndex].listPartTop.map(
                            (part, i) => {
                                return <EditPartDialog part={part} isTop={true} key={i} index={i}/>;
                            }
                        )}
                        <Divider>List part bottom</Divider>
                        {dataSkillEff?.listFrame[frameIndex].listPartBottom.map(
                            (part, i) => {
                                return <EditPartDialog part={part} isTop={false} key={i} index={i}/>
                            }
                        )}
                    </div>
                )}
            </div>
        </Draggable>
    );
};

type EditPartDialogProps = {
    part: PartFrame;
    index: number;
    isTop: boolean;
};
const EditPartDialog = ({
                            part,
                            isTop,
                            index
                        }: EditPartDialogProps) => {

    const {frameIndex, dataSkillEff, setDataSkillEff} = useContextApi();

    const onChange = (newPartFrame: PartFrame) => {

        const newSkillEff = {...dataSkillEff};
        if (!newSkillEff) return;
        if (isTop) {
            newSkillEff.listFrame!![frameIndex].listPartTop[index] = newPartFrame;
        } else {
            newSkillEff.listFrame!![frameIndex].listPartBottom[index] = newPartFrame;
        }
        setDataSkillEff(newSkillEff as any);
    }
    const onSwapTopAndBottom = () => {
        const newSkillEff = {...dataSkillEff};
        if (!newSkillEff) return;
        if (isTop) {
            newSkillEff.listFrame!![frameIndex].listPartBottom.push(part);
            newSkillEff.listFrame!![frameIndex].listPartTop.splice(index, 1);
        } else {
            newSkillEff.listFrame!![frameIndex].listPartTop.push(part);
            newSkillEff.listFrame!![frameIndex].listPartBottom.splice(index, 1);
        }
        setDataSkillEff(newSkillEff as any);
    }
    return (
        <div>
            <div>Dx</div>
            <Input
                full
                type="number"
                placeholder="dx"
                onChange={(e) => {
                    onChange(
                        {
                            ...part,
                            dx: parseInt(e.target.value),
                        },
                    );
                }}
                value={part.dx}
            ></Input>
            <div>Dy</div>
            <Input
                full
                type="number"
                placeholder="dy"
                onChange={(e) => {
                    onChange(
                        {
                            ...part,
                            dy: parseInt(e.target.value),
                        },
                    );
                }}
                value={part.dy}
            ></Input>
            <div>Small Image Id</div>
            <Input
                full
                type="number"
                placeholder="Small image id"
                onChange={(e) => {
                    onChange(
                        {
                            ...part,
                            idSmallImg: parseInt(e.target.value),
                        },
                    );
                }}
                value={part.idSmallImg}
            ></Input>
            <div>Flip</div>
            <Input
                full
                type="number"
                placeholder="Flip"
                onChange={(e) => {
                    onChange(
                        {
                            ...part,
                            flip: parseInt(e.target.value),
                        },
                    );
                }}
                value={part.flip}
            ></Input>
            <Button full onClick={(e) => {
                e?.stopPropagation()
                onSwapTopAndBottom()
            }}>
                <FontAwesomeIcon icon={faUpDown} color="blue"/>
                Swap
            </Button>
        </div>
    );
};

export const HorizontalItems = ({
                                    items,
                                    onDropChange,
                                    selectedSequenceIndex,
                                    onClickItem,
                                }: HorizontalProps) => {
    const onDrop = (dragIndex: number, overIndex: number) => {
        onDropChange(dragIndex, overIndex);
    };

    const context = useDraggableContext({
        onDrop,
    });

    return (
        <div className="h-96 overflow-x-auto">
            {items.map((item, i) => {
                return (
                    <HorizontalDraggableItem
                        context={context}
                        onClick={onClickItem}
                        key={JSON.stringify(item)}
                        index={i}
                        item={item}
                        selected={i === selectedSequenceIndex}
                    />
                );
            })}
        </div>
    );
};

const HorizontalDraggableItem = ({
                                     index,
                                     context,
                                     item,
                                     selected,
                                     onClick,
                                 }: DraggableItemProps) => {
    const {
        listeners, // Handler listeners can be passed to Draggable component as well
    } = useDraggable(context, index);
    const divRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (divRef.current) {

        }
    }, [divRef])
    const ctx = useContextApi();
    if (!ctx) return null;
    const onChangeValue = (value: any) => {

    }
    return (
        <Draggable
            context={context}
            key={item.id}
            index={index}
            listeners={listeners}
        >
            {/*@ts-ignore*/}
            <EditableElement
                onChange={onChangeValue}
            >
                <div onClick={() => {
                    onClick?.(item.index);
                }}
                     className={`${
                         selected ? "bg-yellow-200" : "bg-green-600"
                     } mb-2 w-12 text-sm h-12 text-center rounded-full   cursor-pointer select-none border-2 shadow-sm
              p-2
          hover:bg-green-400`}>
                    {item.frame}
                </div>
            </EditableElement>
        </Draggable>
    );
};


const EditableElement = (props: any) => {
    const {onChange} = props;
    const element = useRef();
    let elements = React.Children.toArray(props.children);
    if (elements.length > 1) {
        throw Error("Can't have more than one child");
    }
    const onMouseUp = () => {
        // @ts-ignore
        const value = element.current?.value || element.current?.innerText;
        onChange(value);
    };
    useEffect(() => {
        // @ts-ignore
        const value = element.current?.value || element.current?.innerText;
        onChange(value);
    }, []);
    // @ts-ignore
    elements = React.cloneElement(elements[0], {
        contentEditable: true,
        suppressContentEditableWarning: true,
        ref: element,
        onKeyUp: onMouseUp
    });
    return elements;
};