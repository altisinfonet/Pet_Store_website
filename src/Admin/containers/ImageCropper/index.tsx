
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@mui/material';
import { _ERROR } from '../../util/_reactToast';

const ImageCropping = ({ image, imgSize, onCropDone, onCropCancel, imgDimension }) => {
    console.log(imgSize, imgDimension, "54d1gh5df1")
    const [isHovered, setIsHovered] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedArea, setCroppedArea] = useState(null)
    const [aspectRatio, setAspectRatio] = useState(4 / 3)
    const [finalSize, setFinalSize] = useState({ width: 1920, height: 600 })
    const [isAspectRatioSelected, setIsAspectRatioSelected] = useState(false)
    const aspectRatios = [
        { label: '1920x600', value: 1920 / 600, width: 1920, height: 600 },
        { label: '991x309', value: 991 / 309, width: 991, height: 309 },
        { label: '576x180', value: 577 / 180, width: 576, height: 180 }
    ];

    let filteredAspectRatio = [];
    if (imgSize === 'large') {
        filteredAspectRatio = [aspectRatios[0]];
    } else if (imgSize === 'medium') {
        filteredAspectRatio = [aspectRatios[1]];
    } else if (imgSize === 'small') {
        filteredAspectRatio = [aspectRatios[2]];
    }

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels)
    }

    const isSelected = (dimension: number) => {
        if (parseFloat(imgDimension) !== dimension) {
            _ERROR("Please select valid image size");
            return false;
        }
        return true;
    };
    const onAspectRatioChange = (e: any) => {
        const selectedLabel = aspectRatios.find((r: any) => r.value === parseFloat(imgDimension));
        const selected = aspectRatios.find((r: any) => r.value === parseFloat(e.target.value))

        console.log(selectedLabel?.value, e, imgDimension, "f56gh6g23")
        if (selected) {
            if (e.target.value === selectedLabel?.value) {
                isSelected(selectedLabel?.value)
            }
            setAspectRatio(selected.value)
            setFinalSize({ width: selected.width, height: selected.height })
            setIsAspectRatioSelected(true)
            console.log(selected, "65g4f89df4g9df")
        } else {
            setIsAspectRatioSelected(false)
        }
    }

    return (
        <>
            <div className="main-container" style={{
                width: "90%",
                maxWidth: "800px",
                margin: "0 auto",
                position: "relative",
                height: "500px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#fff",
                padding: "15px"
            }}>
                <div className='container' style={{ marginTop: "10px" }}>
                    <Cropper
                        image={image}
                        aspect={aspectRatio}
                        crop={crop}
                        zoom={zoom}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        style={{
                            containerStyle: {
                                width: "100%",
                                height: "400px",
                                backgroundColor: "transparent",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                            mediaStyle: {
                                objectFit: "contain",
                                width: "100%",
                                height: "100%",
                            },
                            cropAreaStyle: {
                                border: "2px dashed #fff",
                            }
                        }}
                    />
                </div>

                <div
                    style={{
                        width: "100%",
                        maxWidth: "800px",
                        position: "absolute",
                        bottom: "0%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        textAlign: 'center',
                        backgroundColor: "#f8f9fa",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <div onChange={onAspectRatioChange} style={{ marginBottom: "10px" }}>
                        {filteredAspectRatio.map((ratio: any) => (
                            <label key={ratio.label} style={{ marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    value={ratio.value}
                                    name="ratio"
                                /> {ratio.label}
                            </label>
                        ))}
                    </div>

                    <div>
                        <Button variant='contained'
                            className='btn'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={onCropCancel}
                            style={{
                                backgroundColor: isHovered ? "#DC2626" : "transparent",
                                border: isHovered ? "none" : "1px solid #DC2626",
                                color: isHovered ? "#fff" : "#DC2626",
                                fontWeight: "bold",
                                padding: "6px 15px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                borderRadius: "8px",
                                marginRight: "10px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            Cancel
                        </Button>

                        <Button variant='contained' disabled={!isAspectRatioSelected}
                            className='btn' onClick={() => {
                                onCropDone(croppedArea, finalSize)
                            }}
                            style={{
                                backgroundColor: !isAspectRatioSelected ? "#f0f0f0" : "transparent",
                                border: !isAspectRatioSelected ? "1px solid #ccc" : "1px solid #64748B",
                                color: !isAspectRatioSelected ? "#aaa" : "#64748B",
                                fontWeight: "bold",
                                padding: "6px 15px",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                transition: "all 0.3s ease",
                                cursor: !isAspectRatioSelected ? "default" : "pointer",
                            }}
                            onMouseOver={(e) => {
                                if (!isAspectRatioSelected) return;
                                e.currentTarget.style.backgroundColor = "#64748B";
                                e.currentTarget.style.color = "#fff";
                                e.currentTarget.style.border = "none";
                            }}
                            onMouseOut={(e) => {
                                if (!isAspectRatioSelected) return;
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#64748B";
                                e.currentTarget.style.border = "1px solid #64748B";
                            }}
                        >
                            Crop & Preview
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImageCropping

// ===============================================================================Prev Old Code===================================================================================


// ===============================================================================New Code===================================================================================
// import React, { useState, useEffect } from 'react';
// import Cropper from 'react-easy-crop';
// import { Button } from '@mui/material';
// import { _ERROR } from '../../util/_reactToast';

// const ImageCropping = ({ image, onCropDone, onCropCancel }) => {
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedArea, setCroppedArea] = useState(null);
//     const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
//     const [aspectRatio, setAspectRatio] = useState(null); // Initially free crop

//     useEffect(() => {
//         // Load the image to get its actual dimensions
//         const img = new Image();
//         img.src = image;
//         img.onload = () => {
//             setImageSize({ width: img.width, height: img.height });
//             setAspectRatio(img.width / img.height); // Set aspect ratio dynamically
//         };
//     }, [image]);

//     const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
//         setCroppedArea(croppedAreaPixels);
//     };

//     return (
//         <>
//             <div className="main-container" style={{
//                 width: "90%",
//                 maxWidth: "800px",
//                 margin: "0 auto",
//                 position: "relative",
//                 height: "500px",
//                 borderRadius: "10px",
//                 boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//                 backgroundColor: "#fff",
//                 padding: "15px"
//             }}>
//                 <div className="container" style={{ marginTop: "10px" }}>
//                     {imageSize.width > 0 && imageSize.height > 0 && (
//                         <Cropper
//                             image={image}
//                             aspect={aspectRatio} // Dynamic aspect ratio
//                             crop={crop}
//                             zoom={zoom}
//                             onCropChange={setCrop}
//                             onZoomChange={setZoom}
//                             onCropComplete={onCropComplete}
//                             initialCroppedAreaPercentages={{ width: 100, height: 100 }}
//                             style={{
//                                 containerStyle: {
//                                     width: "100%",
//                                     height: "400px",
//                                     backgroundColor: "transparent",
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                 },
//                                 mediaStyle: {
//                                     objectFit: "contain", // Ensure full image is visible
//                                     width: "100%",
//                                     height: "100%",
//                                 },
//                                 cropAreaStyle: {
//                                     border: "2px dashed #fff",
//                                 }
//                             }}
//                         />
//                     )}
//                 </div>

//                 <div
//                     style={{
//                         width: "100%",
//                         maxWidth: "800px",
//                         position: "absolute",
//                         bottom: "0%",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         textAlign: "center",
//                         backgroundColor: "#f8f9fa",
//                         padding: "15px",
//                         borderRadius: "8px",
//                         boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
//                     }}
//                 >
//                     <div>
//                         <Button
//                             variant="contained"
//                             onClick={onCropCancel}
//                             style={{
//                                 backgroundColor: "#DC2626",
//                                 color: "#fff",
//                                 fontWeight: "bold",
//                                 padding: "6px 15px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 borderRadius: "8px",
//                                 marginRight: "10px",
//                                 boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
//                                 transition: "all 0.3s ease",
//                             }}
//                         >
//                             Cancel
//                         </Button>

//                         <Button
//                             variant="contained"
//                             onClick={() => onCropDone(croppedArea)}
//                             style={{
//                                 backgroundColor: "#64748B",
//                                 color: "#fff",
//                                 fontWeight: "bold",
//                                 padding: "6px 15px",
//                                 fontSize: "16px",
//                                 textTransform: "uppercase",
//                                 borderRadius: "8px",
//                                 boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
//                                 transition: "all 0.3s ease",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Crop & Preview
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ImageCropping;

// =============================================================================New Updated Cod==============================================================================

// import React, { useState, useEffect } from 'react';
// import Cropper from 'react-easy-crop';
// import { Button } from '@mui/material';

// const aspectRatios = [
//     { label: '1920x600', value: 1920 / 600, width: 1920, height: 600 },
//     { label: '991x309', value: 991 / 309, width: 991, height: 309 },
//     { label: '576x180', value: 576 / 180, width: 576, height: 180 }
// ];

// const ImageCropping = ({ image, imgSize, onCropDone, onCropCancel }) => {
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedArea, setCroppedArea] = useState(null);
//     const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
//     const [aspectRatio, setAspectRatio] = useState(null);
//     const [selectedSize, setSelectedSize] = useState(aspectRatios[0]); // Default to 1920x600

//     console.log(imgSize, "df6547g8df74gd8")

//     useEffect(() => {
//         const img = new Image();
//         img.src = image;
//         img.onload = () => {
//             setImageSize({ width: img.width, height: img.height });
//             setAspectRatio(img.width / img.height); // Set dynamic aspect ratio
//         };
//     }, [image]);

//     const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
//         setCroppedArea(croppedAreaPixels);
//     };

//     const handleSizeChange = (e) => {
//         const selected = aspectRatios.find(ratio => ratio.value === parseFloat(e.target.value));
//         setSelectedSize(selected);
//         setAspectRatio(selected.value); // Update aspect ratio dynamically
//     };

//     return (
//         <>
//             <div className="main-container" style={{
//                 width: "90%",
//                 maxWidth: "800px",
//                 margin: "0 auto",
//                 position: "relative",
//                 height: "500px",
//                 borderRadius: "10px",
//                 boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//                 backgroundColor: "#fff",
//                 padding: "15px"
//             }}>
//                 <div className="container" style={{ marginTop: "10px" }}>
//                     {imageSize.width > 0 && imageSize.height > 0 && (
//                         <Cropper
//                             image={image}
//                             aspect={aspectRatio} // Updated dynamically
//                             crop={crop}
//                             zoom={zoom}
//                             onCropChange={setCrop}
//                             onZoomChange={setZoom}
//                             onCropComplete={onCropComplete}
//                             style={{
//                                 containerStyle: {
//                                     width: "100%",
//                                     height: "400px",
//                                     backgroundColor: "transparent",
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                 },
//                                 mediaStyle: {
//                                     objectFit: "contain", // Ensure full image is visible
//                                     width: "100%",
//                                     height: "100%",
//                                 },
//                                 cropAreaStyle: {
//                                     border: "2px dashed #fff",
//                                 }
//                             }}
//                         />
//                     )}
//                 </div>

//                 {/* Radio buttons for selecting crop size */}
//                 <div style={{
//                     textAlign: "center",
//                     backgroundColor: "#f8f9fa",
//                     padding: "15px",
//                     borderRadius: "8px",
//                     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                     marginTop: "380px"
//                 }}>
//                     <div onChange={handleSizeChange} style={{ marginBottom: "10px" }}>
//                         {aspectRatios.map((ratio) => (
//                             <label key={ratio.label} style={{ marginRight: '10px' }}>
//                                 <input
//                                     type="radio"
//                                     value={ratio.value}
//                                     name="cropSize"
//                                     checked={selectedSize.value === ratio.value}
//                                     onChange={handleSizeChange}
//                                 /> {ratio.label}
//                             </label>
//                         ))}
//                     </div>

//                     <Button
//                         variant="contained"
//                         onClick={onCropCancel}
//                         style={{
//                             backgroundColor: "#DC2626",
//                             color: "#fff",
//                             fontWeight: "bold",
//                             padding: "6px 15px",
//                             fontSize: "16px",
//                             textTransform: "uppercase",
//                             borderRadius: "8px",
//                             marginRight: "10px",
//                             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
//                             transition: "all 0.3s ease",
//                         }}
//                     >
//                         Cancel
//                     </Button>

//                     <Button
//                         variant="contained"
//                         onClick={() => onCropDone(croppedArea, selectedSize)}
//                         style={{
//                             backgroundColor: "#64748B",
//                             color: "#fff",
//                             fontWeight: "bold",
//                             padding: "6px 15px",
//                             fontSize: "16px",
//                             textTransform: "uppercase",
//                             borderRadius: "8px",
//                             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
//                             transition: "all 0.3s ease",
//                             cursor: "pointer",
//                         }}
//                     >
//                         Crop & Preview
//                     </Button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ImageCropping;


// ====================================================================New update Code 2.0==================================================================================


// 

// ===================================================================New Update Code 2.1.0=================================================================================


// import React, { useState, useEffect } from "react";
// import Cropper from "react-easy-crop";
// import { Button } from "@mui/material";

// const aspectRatios = [
//     { label: "1920x600", value: 1920 / 600, width: 1920, height: 600 },
//     { label: "991x309", value: 991 / 309, width: 991, height: 309 },
//     { label: "576x180", value: 576 / 180, width: 576, height: 180 },
// ];

// const ImageCropping = ({ image, imgSize, onCropDone, onCropCancel }) => {
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedArea, setCroppedArea] = useState(null);
//     const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
//     const [aspectRatio, setAspectRatio] = useState(null);
//     const [selectedSize, setSelectedSize] = useState(aspectRatios[0]); // Default to 1920x600

//     useEffect(() => {
//         const img = new Image();
//         img.src = image;
//         img.onload = () => {
//             setImageSize({ width: img.width, height: img.height });
//             setAspectRatio(img.width / img.height); // Dynamic aspect ratio
//         };
//     }, [image]);

//     useEffect(() => {
//         let defaultSize;
//         if (imgSize === "large") {
//             defaultSize = aspectRatios[0]; // 1920x600
//         } else if (imgSize === "medium") {
//             defaultSize = aspectRatios[1]; // 991x309
//         } else {
//             defaultSize = aspectRatios[2]; // 576x180
//         }
//         setSelectedSize(defaultSize);
//         setAspectRatio(defaultSize.value); // Set aspect ratio dynamically
//     }, [imgSize]);

//     const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
//         setCroppedArea(croppedAreaPixels);
//     };

//     return (
//         <>
//             <div
//                 className="main-container"
//                 style={{
//                     width: "90%",
//                     maxWidth: "900px",
//                     margin: "0 auto",
//                     position: "relative",
//                     height: "550px",
//                     borderRadius: "10px",
//                     boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//                     backgroundColor: "#fff",
//                     padding: "15px",
//                 }}
//             >
//                 <div className="container" style={{ marginTop: "10px" }}>
//                     {imageSize.width > 0 && imageSize.height > 0 && (
//                         <div
//                             style={{
//                                 position: "relative",
//                                 width: "100%",
//                                 height: "450px",
//                                 overflow: "hidden",
//                             }}
//                         >
//                             {/* Dark Background Overlay with Transparent Crop Area */}
//                             <div
//                                 style={{
//                                     position: "absolute",
//                                     top: 0,
//                                     left: 0,
//                                     width: "100%",
//                                     height: "100%",
//                                     // backgroundColor: "rgba(0,0,0,0.6)",
//                                     clipPath: `inset(${(450 - selectedSize.height / 2) / 2}px 
//                                                   ${(900 - selectedSize.width / 2) / 2}px 
//                                                   ${(450 - selectedSize.height / 2) / 2}px 
//                                                   ${(900 - selectedSize.width / 2) / 2}px)`,
//                                 }}
//                             ></div>

//                             {/* Image Cropper */}
//                             <Cropper
//                                 image={image}
//                                 aspect={aspectRatio} // Dynamic aspect ratio
//                                 crop={crop}
//                                 zoom={zoom}
//                                 onCropChange={setCrop}
//                                 onZoomChange={setZoom}
//                                 onCropComplete={onCropComplete}
//                                 style={{
//                                     containerStyle: {
//                                         width: "100%",
//                                         height: "100%",
//                                         backgroundColor: "transparent",
//                                     },
//                                     mediaStyle: {
//                                         objectFit: "contain", // Ensure full image visibility
//                                         width: "100%",
//                                         height: "100%",
//                                     },
//                                     cropAreaStyle: {
//                                         border: "2px solid rgba(255, 255, 255, 0.8)", // White border
//                                     },
//                                 }}
//                             />
//                         </div>
//                     )}
//                 </div>

//                 {/* Buttons */}
//                 <div
//                     style={{
//                         textAlign: "center",
//                         backgroundColor: "#f8f9fa",
//                         padding: "15px",
//                         borderRadius: "8px",
//                         boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                         marginTop: "20px",
//                     }}
//                 >
//                     <Button
//                         variant="contained"
//                         onClick={onCropCancel}
//                         style={{
//                             backgroundColor: "#DC2626",
//                             color: "#fff",
//                             fontWeight: "bold",
//                             padding: "6px 15px",
//                             fontSize: "16px",
//                             textTransform: "uppercase",
//                             borderRadius: "8px",
//                             marginRight: "10px",
//                             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
//                             transition: "all 0.3s ease",
//                         }}
//                     >
//                         Cancel
//                     </Button>

//                     <Button
//                         variant="contained"
//                         onClick={() => onCropDone(croppedArea, selectedSize)}
//                         style={{
//                             backgroundColor: "#64748B",
//                             color: "#fff",
//                             fontWeight: "bold",
//                             padding: "6px 15px",
//                             fontSize: "16px",
//                             textTransform: "uppercase",
//                             borderRadius: "8px",
//                             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
//                             transition: "all 0.3s ease",
//                             cursor: "pointer",
//                         }}
//                     >
//                         Crop & Preview
//                     </Button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ImageCropping;
