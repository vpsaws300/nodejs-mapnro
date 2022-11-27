import axios from "axios";
import { KonvaEventObject } from "konva/lib/Node";
import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Button } from "../Common/Button";
import {
    API_URL,
    defaultHeight,
    defaultWidth,
    size,
    typeToSize
} from "../Common/Constants";
import Divider from "../Common/Divider";
import Input from "../Common/Input";
import { MyImage } from "../Common/MyImage";
import {
    EndData,
    ImageType,
    ImgData,
    ItemType,
    MapData,
    MapItem
} from "../Common/Types";
import { convertCoordToPixel, getImageName, initMap } from "../Common/Utils";
import { ImageSelectPanel } from "./ImageSelectPanel";
import RenderBoard from "./RenderBoard";
import RenderImages from "./RenderImages";
import RenderMobAndWayPointSelect from "./RenderMobAndWayPointSelect";

const Canvas = () => {
    const [type, setType] = useState<ImageType>("hiro");
    const [ratio, setRatio] = useState(0.3);
    const [fileName, setFileName] = useState("map");

    const [tmpImage, setTmpImage] = React.useState<ImgData | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [images, setImages] = React.useState<Array<any>>([]);
    const [wpMobs, setWpMob] = React.useState<Array<MapItem>>([]);

    // Mob state
    const [mobOffset, setMobOffset] = useState(0);
    const [mobLevel, setMobLevel] = useState(10);

    // npc state
    const [npcId, setNpcId] = useState(10);

    const [mapId, setMapId] = useState(166);
    const [mapName, setMapName] = useState("Map name");
    const [mobId, setMobId] = useState(17);

    const [sql, setSql] = useState("");
    const [data, setData] = React.useState<MapData>({
        fileName: fileName,
        width: defaultWidth,
        height: defaultHeight,
        maps: initMap(defaultWidth, defaultHeight),
    });

    const fileRef = React.useRef<any>();

    const currentIndex = React.useRef<number>(-1);

    useEffect(() => {
        if (
            data.height !== data.maps.length ||
            data.width !== data.maps[0].length
        ) {
            setData({
                ...data,
                maps: initMap(data.width, data.height),
            });
            return;
        }
        let imgs = new Array<EndData | null>();
        for (let h = 0; h < data.height; h++) {
            for (let w = 0; w < data.width; w++) {
                if (data.maps[h][w] === -1) {
                    imgs.push(null);
                    continue;
                }
                imgs.push({
                    size: size * ratio,
                    x: w * size * ratio,
                    y: h * size * ratio,
                    path: getImageName(data.maps[h][w], type),
                    index: data.maps[h][w],
                });
            }
        }
        if (imgs.length > 0) {
            setImages(imgs);
        }
    }, [data]);

    const handleChange = (e: any) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        // Upload file using axios
        axios
            .post(API_URL + "/uploadMapFile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(({ data }) => {
                setData(data as MapData);
            })
            .catch(console.log);
    };

    const pixelToIndex = (value: number) => {
        return Math.round(value / size / ratio);
    };

    const handleOnMouseEnter = (e: KonvaEventObject<MouseEvent>) => {
        const mySize = typeToSize[type];
        const x = e.target.x();
        const y = e.target.y();

        if (selectedIndex >= mySize) {
            const i = selectedIndex % mySize;
            setTmpImage({
                id: 0,
                index: selectedIndex,
                path: "",
                x,
                y,
                node: (
                    <MyImage
                        path={getImgByType(
                            i === 0
                                ? "mob"
                                : i === 1
                                ? "waypoint-left"
                                : i === 2
                                ? "waypoint-right"
                                : "npc"
                        )}
                        x={x}
                        y={y}
                        size={size * ratio}
                        onClick={() =>
                            drawNewMapItem(selectedIndex % mySize, x, y)
                        }
                    />
                ),
            });
            return;
        }

        const { width } = data;
        const h = pixelToIndex(y);
        const w = pixelToIndex(x);

        const index = h * width + w;
        const path = getImageName(selectedIndex, type);
        const actualSize = size * ratio;
        currentIndex.current = index;

        if (
            tmpImage === null ||
            tmpImage.path !== path ||
            index !== tmpImage.index
        ) {
            setTmpImage({
                path,
                id: selectedIndex,
                index,
                x,
                y,
                node: (
                    <MyImage
                        key={index}
                        path={path}
                        x={x}
                        y={y}
                        size={actualSize}
                        onClick={handleDrawImage}
                    />
                ),
            });
        }
    };

    const handleOnMouseLeave = (e: KonvaEventObject<MouseEvent>) => {
        setTmpImage(null);
    };

    const drawNewMapItem = (i: number, x: number, y: number) => {
        let type: ItemType = "mob";
        if (i === 0) {
            type = "mob";
        } else if (i === 1) {
            type = "waypoint-left";
        } else if (i === 2) {
            type = "waypoint-right";
        } else if (i === 3) {
            type = "npc";
        } else {
            type = "npc";
        }
        setWpMob([
            ...wpMobs,
            {
                type,
                x: x,
                y: y,
                mobId: mobId,
                mobLevel: mobLevel,
                npcId: npcId,
            },
        ]);
    };

    // Handle click after item is mounted
    const handleClear = (index: number) => {
        const mySize = typeToSize[type];
        if (selectedIndex >= size) {
            drawNewMapItem(
                selectedIndex % mySize,
                images[index].x,
                images[index].y
            );
        } else {
            const imgs = [...images];
            imgs[index] = null;
            setImages(imgs);
        }
    };

    const handleDrawImage = (e: KonvaEventObject<MouseEvent>) => {
        if (tmpImage === null) {
            return;
        }
        const x = e.target.x();
        const y = e.target.y();
        const mySize = typeToSize[type];
        if (selectedIndex >= mySize) {
            drawNewMapItem(selectedIndex % mySize, x, y);
        } else {
            const width = data.maps[0].length;

            const imgs = [...images];
            const actualSize = size * ratio;
            const w = pixelToIndex(x);
            const h = pixelToIndex(y);
            const index = w + h * width;
            imgs[index] = {
                path: getImageName(selectedIndex, type),
                size: actualSize,
                x,
                y,
                index: selectedIndex,
            };
            setImages(imgs);
        }
    };

    const toMapData = () => {
        const tmp = {
            width: data.width,
            fileName: data.fileName,
            height: data.height,
            maps: [],
        } as MapData;

        for (let i = 0; i < data.height; i++) {
            if (!tmp.maps[i]) {
                tmp.maps[i] = [];
            }
            for (let j = 0; j < data.width; j++) {
                const t = j + i * data.width;
                if (images[t] === null) {
                    tmp.maps[i][j] = -1;
                    continue;
                }
                tmp.maps[i][j] = images[t].index;
            }
        }

        return tmp;
    };

    const handleDownloadMap = () => {
        axios
            .post(API_URL + "/uploadMapData", toMapData(), {
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", data.fileName ?? "map.bin");
                document.body.appendChild(link);
                link.click();
            });
    };

    const handleUploadFile = () => {
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    const updateScale = (oldScale: number, newScale: number) => {
        if (oldScale === 0) return;

        setImages((imgs) => {
            return imgs.map((i) => {
                if (!i) {
                    return i;
                }
                i.x = (i.x / oldScale) * newScale;
                i.y = (i.y / oldScale) * newScale;
                i.size = (i.size / oldScale) * newScale;
                return i;
            });
        });
    };

    const handleClearMapItem = (index: number) => {
        setWpMob([
            ...wpMobs.slice(0, index),
            ...wpMobs.slice(index + 1, wpMobs.length),
        ]);
    };

    const getImgByType = (iType: any) => {
        return iType === "mob"
            ? "/assets/mob/mob.png"
            : iType === "waypoint-left"
            ? "/assets/mob/waygo.png"
            : iType === "waypoint-right"
            ? "/assets/mob/waygoright.png"
            : "/assets/mob/npc.png";
    };

    const generateSQL = () => {
        const typeID =
            type === "hiro"
                ? 1
                : type === "haru"
                ? 2
                : type === "okaza"
                ? 3
                : type === "vdmq"
                ? 4
                : 0;
        let s = `insert into map(id, tileID,bgID, typeMap, name, Vgo, Mob,NPC, maxplayer,numzone,x0, y0) values(${mapId},${typeID},0,0,'${mapName}',`;
        s +=
            "'[" +
            wpMobs
                .filter(
                    (w) =>
                        w.type === "waypoint-left" ||
                        w.type === "waypoint-right"
                )
                .map((w) => {
                    const [x, y] = convertCoordToPixel(w.x, w.y, ratio);
                    return `[${x - 24},${y - 8},${x},${y + 16},1,55,384]`;
                })
                .join(", ") +
            "]',";
        s +=
            "'[" +
            wpMobs
                .filter((w) => w.type === "mob")
                .map((w) => {
                    const [x, y] = convertCoordToPixel(w.x, w.y, ratio);
                    return `[${w.mobId},${w.mobLevel},${x},${y},5,0,false]`;
                })
                .join(", ") +
            "]',";
        s +=
            "'[" +
            wpMobs
                .filter((w) => w.type === "npc")
                .map((w) => {
                    const [x, y] = convertCoordToPixel(w.x, w.y, ratio);
                    return `[1,${x},${y},${w.npcId}]`;
                })
                .join(", ") +
            "]',";
        s += "20,30, 0,0);";
        setSql(s);
    };

    return (
        <div className="container mx-auto">
            <input
                placeholder="FIle"
                type="file"
                className="hidden"
                ref={fileRef}
                onChange={handleChange}
            />
            <div className="mb-5 text-2xl font-bold text-green-500 text-center">
                Tạo map trực quan
            </div>
            <div
                className={`flex justify-around ${
                    data.width > 24 ? "flex-col" : ""
                }`}
            >
                <div className="flex flex-col mx-auto mb-5 space-y-3">
                    <Stage
                        width={data.width * size * ratio}
                        height={data.height * size * ratio}
                        onMouseLeave={handleOnMouseLeave}
                    >
                        <Layer className="outline-dotted outline-2">
                            <RenderBoard
                                actualSize={size * ratio}
                                data={data}
                                handleOnMouseEnter={handleOnMouseEnter}
                                ratio={ratio}
                            />
                            <RenderImages
                                images={images}
                                handleClear={handleClear}
                                type={type}
                                handleOnMouseEnter={handleOnMouseEnter}
                            />

                            {(currentIndex.current === -1 ||
                                images[currentIndex.current] === null ||
                                selectedIndex >= typeToSize[type]) &&
                                tmpImage?.node}

                            {wpMobs.map((mw, index) => {
                                const path = getImgByType(mw.type);
                                return (
                                    <MyImage
                                        key={index}
                                        path={path}
                                        size={size * ratio}
                                        x={mw.x}
                                        y={mw.y}
                                        onClick={() =>
                                            handleClearMapItem(index)
                                        }
                                    />
                                );
                            })}
                        </Layer>
                    </Stage>
                    <div className="flex flex-row">
                        <ImageSelectPanel
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            type={type}
                        />
                        <RenderMobAndWayPointSelect
                            index={selectedIndex % typeToSize[type]}
                            setIndex={setSelectedIndex}
                            type={type}
                        />
                    </div>
                    <div className="flex justify-center items-center space-x-5">
                        <div className="mb-3 w-full">
                            <textarea
                                className="
                                            form-control
                                            block
                                            w-full
                                            px-3
                                            py-1.5
                                            text-base
                                            font-normal
                                            text-gray-700
                                            bg-white bg-clip-padding
                                            border border-solid border-gray-240
                                            rounded
                                            transition
                                            ease-in-out
                                            m-0
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                placeholder="Your sql here"
                                value={sql}
                            />
                        </div>
                        <button
                            className="bg-green-500 h-24 hover:bg-blue-700 text-white font-bold  rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={generateSQL}
                        >
                            Generate SQL
                        </button>
                    </div>
                </div>
                <div className="w-1/2">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="username"
                            >
                                Kích thước
                            </label>
                            <div className="flex space-x-5">
                                <Input
                                    type="number"
                                    placeholder="Rộng"
                                    value={data.width}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            width: Number(e.target.value),
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    value={data.height}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            height: Number(e.target.value),
                                        });
                                    }}
                                    placeholder="Cao"
                                />
                            </div>
                        </div>
                        <Input
                            full
                            type="text"
                            value={fileName}
                            onChange={(e) => {
                                setFileName(e.target.value);
                            }}
                            placeholder="Tên file"
                        />
                        <select
                            className="form-select appearance-none  block
                                    w-full px-3
                                    py-1.5 text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding bg-no-repeat
                                    border border-solid border-gray-240
                                    rounded
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            aria-label="Default select example"
                            onChange={(e) =>
                                setType(e.target.value as ImageType)
                            }
                            value={type}
                        >
                            <option selected>Chọn loại map</option>
                            <option value="hiro">Hiro</option>
                            <option value="haru">Haruna</option>
                            <option value="okaza">Okaza</option>
                            <option value="vdmq">Vùng đất ma quỷ</option>
                        </select>
                        <Divider>Mob</Divider>
                        <div className="space-y-3">
                            <label>Mob id</label>
                            <input
                                className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                value={mobId}
                                onChange={(e) => {
                                    setMobId(+e.target.value);
                                }}
                                placeholder="Mob id"
                            />
                            <label>Mob offset</label>
                            <Input
                                full
                                type="number"
                                value={mobOffset}
                                onChange={(e) => {
                                    setMobOffset(+e.target.value);
                                }}
                                placeholder="Mob Offset"
                            />
                            <label>Mob level</label>
                            <Input
                                full
                                type="number"
                                value={mobLevel}
                                onChange={(e) => {
                                    setMobLevel(+e.target.value);
                                }}
                                placeholder="Mob Level"
                            />
                        </div>
                        <Divider>NPC</Divider>
                        <div>
                            <label>Npc id</label>
                            <Input
                                full
                                type="number"
                                value={npcId}
                                onChange={(e) => {
                                    setNpcId(+e.target.value);
                                }}
                                placeholder="Npc Id"
                            />
                        </div>
                        <Divider>Map</Divider>
                        <div className="space-y-5">
                            <label>Npc id</label>

                            <Input
                                full
                                type="text"
                                value={mapName}
                                onChange={(e) => {
                                    setMapName(e.target.value);
                                }}
                                placeholder="Map name"
                            />
                            <label>Map ID</label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                value={mapId}
                                onChange={(e) => {
                                    setMapId(+e.target.value);
                                }}
                                placeholder="Map id"
                            />
                        </div>
                        <div className="flex justify-between pt-5 space-x-2">
                            <Button
                                onClick={() => {
                                    updateScale(ratio, ratio + 0.1);
                                    setRatio(ratio + 0.1);
                                }}
                            >
                                Tăng
                            </Button>
                            <Button
                                onClick={() => {
                                    updateScale(ratio, ratio - 0.1);
                                    setRatio(ratio - 0.1);
                                }}
                            >
                                Giảm
                            </Button>
                        </div>
                        <Button full onClick={handleUploadFile}>
                            Upload Map
                        </Button>
                        <Button full onClick={handleDownloadMap}>
                            Tải
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Canvas };

