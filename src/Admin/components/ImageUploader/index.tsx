import { CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";

// @ts-ignore  
import ImageUploading from 'react-images-uploading';

// import CropImageModel from "./imageCrop";
// import 'react-image-crop/dist/ReactCrop.css'

function ImageUploader({ onImageChange, preImages, delRes, delResFun, notWidth, className, img_cls, multiple, multiImagePreview, acceptType, imageWidth }: any) {
    const [images, setImages] = React.useState([]);
    // const [crop, setCrop] = useState(false);
    // const [cropSrc, setCropSrc] = useState("");
    // const maxNumber = 69;
    useEffect(() => {
        console.log("preImages", preImages)
        setImages(preImages);
    }, [preImages])


    const onChange: any = (imageList: any, addUpdateIndex: number) => {
        // data for submit
        setImages(imageList);
        onImageChange(imageList);
    };

    // const onCustomCrop = (image, index) => {
    //     console.log("crop hit", index)
    //     const { data_url } = image;
    //     if (data_url) {
    //         setCrop(true);
    //         setCropSrc(data_url);
    //     }
    // }

    return (
        <>
            <ImageUploading
                value={images}
                onChange={onChange}
                // maxNumber={maxNumber}
                multiple={multiple}
                dataURLKey="data_url"
                acceptType={acceptType ? acceptType : ["jpg", "png", "jpeg", "svg", "webp"]}
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }: any) => (
                    // write your building UI
                    <div className={`${className} upload__image-wrapper`}>
                        {
                            !imageList.length ? (<>
                                <button
                                    type="button"
                                    style={isDragging ? { color: "#ffffff", backgroundColor: "#d9d9d9" } : null}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                    className={`${img_cls} image-button p-4 w-full`}
                                >
                                    Click or Drop Image
                                </button>
                            </>) : null
                        }

                        {/* <button type="button" onClick={onImageRemoveAll}>Remove all images</button> */}
                        {/* {multiImagePreview ?
                            <div className="flex flex-wrap gap-1">
                                {imageList?.length ? imageList.map((image: any, index: number) => (
                                    <div key={index} className="image-item">
                                        <div className="center-image flex items-center justify-center">
                                            <img src={image.data_url} alt="mltiImage" className="border border-solid h-20 w-20" width={notWidth ? "" : "150"} />
                                        </div>
                                    </div>)) : null}
                            </div>
                            :
                            imageList?.length ? imageList.map((image: any, index: number) => (
                                <div key={index} className="image-item">
                                    <div className="center-image mb-2 flex items-center justify-center">
                                        <img src={image.data_url} alt="" className={`${imageWidth ? imageWidth : "w-[60%]"}`} width={notWidth ? "" : "150"} />
                                    </div>
                                    <div className="center-image">
                                        <div className="image-item__btn-wrapper">
                                            
                                            <span
                                                className="fa-solid fa-pen-to-square edit text-dark me-2 cursor-pointer"
                                                onClick={() => onImageUpdate(index)}
                                            >Update Image</span>
                                             <span
                                                className="fa-solid fa-trash delete text-dark me-2 cursor-pointer"
                                                onClick={() => {
                                                    onImageRemove(index);
                                                    if (delResFun) delResFun();
                                                }}
                                            >Remove Image</span>
                                           </div>
                                    </div>

                                </div>
                            )) : null} */}
                        {multiImagePreview ? (
                            <div className="flex flex-wrap gap-1">
                                {Array.isArray(imageList) && imageList.length ? (
                                    imageList.map((image: any, index: number) => (
                                        <div key={index} className="image-item">
                                            <div className="center-image flex items-center justify-center">
                                                <img
                                                    src={image.data_url}
                                                    alt="multiImage"
                                                    className="border border-solid h-20 w-20"
                                                    width={notWidth ? "" : "150"}
                                                    style={{ objectFit: "cover", borderRadius: "10px" }} 
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        ) : (
                            Array.isArray(imageList) && imageList.length ? (
                                imageList.map((image: any, index: number) => (
                                    <div key={index} className="image-item">
                                        <div className="center-image mb-2 flex items-center justify-center">
                                            <img
                                                src={image.data_url}
                                                alt=""
                                                className={`${imageWidth ? imageWidth : "w-[60%]"}`}
                                                width={notWidth ? "" : "150"}
                                            />
                                        </div>
                                        <div className="center-image">
                                            <div className="image-item__btn-wrapper">
                                                <span
                                                    className="fa-solid fa-pen-to-square edit text-dark me-2 cursor-pointer"
                                                    onClick={() => onImageUpdate(index)}
                                                >
                                                    Update Image
                                                </span>
                                                <span
                                                    className="fa-solid fa-trash delete text-dark me-2 cursor-pointer"
                                                    onClick={() => {
                                                        onImageRemove(index);
                                                        if (delResFun) delResFun();
                                                    }}
                                                >
                                                    Remove Image
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : null
                        )}

                    </div>
                )}
            </ImageUploading>
            {/* {
                crop ? <CropImageModel src={cropSrc} /> : null
            } */}

        </>
    );
}

export default ImageUploader;
