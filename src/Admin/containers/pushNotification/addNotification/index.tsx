import React, { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Button, IconButton } from '@mui/material';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import { _post } from '../../../services';
import Cropper from 'react-easy-crop';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
}) as unknown as React.ComponentType<any>;

// import "react-quill/dist/quill.snow.css";
import 'quill/dist/quill.snow.css';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface NotificationData {
    notificationTitle: string;
    notificationText: string;
    notificationImage: string;
    notificationName: string;
    dateValue: string;
    timeValue: string;
    soundValue: string;
    targetUserSegment: any[]; // Use appropriate type for targetUserSegment
}

interface RowData {
    firstValue: string;
    secondValue: string;
    thirdValue: string;
}

interface ErrorData {
    notificationTitle?: string;
    notificationText?: string;
    dateValue?: string;
    timeValue?: string;
    soundValue?: string;
    targetUserSegment?: string;
}


const AddNotification = () => {

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
    ];



    const [data, setData] = useState("")


    const [counter, setCounter] = useState<any>(0);
    // console.log(counter)
    const [allNotificationData, setAllNotificationData] = useState<any>(null); // Adjust the type according to the API response structure

    const [rows, setRows] = useState<RowData[]>([{ firstValue: '', secondValue: '', thirdValue: '' }]);
    const [targetUserSegment, setTargetUserSegment] = useState<any[]>([]); // Adjust the type based on your segment data
    // console.log("targetUserSegment",targetUserSegment.length)

    const [notificationTitle, setNotificationTitle] = useState<any>("");
    const [notificationText, setNotificationText] = useState<any>("");
    const [notificationImage, setNotificationImage] = useState<any>("");
    const [notificationUrl, setNotificationUrl] = useState<any>("")
    const [notificationImageFile, setNotificationImageFile] = useState<any>(null); // Adjust the type based on your image;
    const [imageFileValidationError, setImageFileValidationError] = useState<String>("")
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [image, setImage] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const [notificationName, setNotificationName] = useState<any>("");

    const [dateValue, setDateValue] = useState<any>('');
    const [timeValue, setTimeValue] = useState<any>('');
    const [soundValue, setSoundValue] = useState<any>("enable");

    const [targetUserSegments, setTargetUserSegments] = useState<{ firstValue: any, secondValue: any, thirdValue: any }>({
        firstValue: "",
        secondValue: "",
        thirdValue: ""
    });

    const [error, setError] = useState<ErrorData>({});


    useEffect(() => {
        // Fetch data from API
        async function getData() {
            // const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/`);
            // const data = await response.data;
            // setAllNotificationData(data && data);
        }
        getData();
    }, []);




    // console.log(croppedAreaPixels)
    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        if (!croppedAreaPixels) {
            console.error('Cropped area pixels are invalid!');
        } else {
            setCroppedAreaPixels(croppedAreaPixels);
        }
    };




    const generateBase64FromCroppedImage = (): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            if (notificationImageFile && croppedAreaPixels) {
                const imageObj = new Image();
                imageObj.src = notificationImageFile; // Set the image source to the file

                imageObj.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        // Set canvas dimensions based on the cropped area
                        canvas.width = croppedAreaPixels.width;
                        canvas.height = croppedAreaPixels.height;

                        // Draw the cropped image onto the canvas
                        ctx.drawImage(
                            imageObj,
                            croppedAreaPixels.x,
                            croppedAreaPixels.y,
                            croppedAreaPixels.width,
                            croppedAreaPixels.height,
                            0,
                            0,
                            croppedAreaPixels.width,
                            croppedAreaPixels.height
                        );

                        // Convert the canvas to a base64 string
                        const base64String = canvas.toDataURL('image/jpeg');
                        setBase64Image(base64String); // Store the base64 image string

                        // console.log('Generated base64 string:', base64String); // Log the Base64 string
                        resolve(base64String); // Resolve the promise with the base64 string
                    } else {
                        reject('Canvas context is not available');
                    }
                };

                imageObj.onerror = (err) => {
                    reject('Error loading image: ' + err);
                };
            } else {
                reject('No image file or cropped area available');
            }
        });
    };




    const handleImageFileChange = (e: any) => {
        const file = e.target.files[0];

        // Check if the file exists
        if (!file) return;

        // Validate file type (JPG, JPEG, PNG)
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setNotificationImageFile("");
            setImageFileValidationError('Please upload a JPG, JPEG, or PNG image.');
            return;
        }

        // Validate file size (less than 1MB)
        const maxSize = 1 * 1024 * 1024; // 1MB in bytes
        if (file.size > maxSize) {
            setNotificationImageFile("");
            setImageFileValidationError('The image file should be less than 1MB.');
            return;
        }

        // Validate image orientation (landscape)
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            img.onload = () => {
                if (img.width <= img.height) {
                    setNotificationImageFile("");
                    setImageFileValidationError('Please upload a landscape image (width should be greater than height).');
                    return;
                }
            };
        };

        reader.onloadend = () => {
            setNotificationImageFile(reader.result as string); // Set the image to be cropped
            // console.log('Loaded image file:', reader.result); // Log the image data to confirm it's correct
        }

        reader.readAsDataURL(file);
    }



    const validation = (): any => {
        let error: any = {};

        if (!notificationTitle) {
            console.log("provide notification title")
            error.notificationTitle = "Title is required";
        }
        else if (!notificationText) {
            error.notificationText = "Text is required";
        }
        // else if (notificationText && notificationTitle) {
        //     console.log("start-incrementing counter for 1");
        //     setCounter((prev: number) => prev + 1);
        //     // console.log("incrementation complete");
        // }
        // else if (targetUserSegment.length <= 0) {
        //     error.targetUserSegment = "At least one segment is required";
        // }
        // else if (targetUserSegment.length > 0) {
        //     console.log("start-incrementing counter for 2");
        //     setCounter((prev: number) => prev + 1);
        //     // console.log("incrementation complete");
        // }
        // else if (!dateValue) {
        //     error.dateValue = "Date is required";
        // }
        // else if (!timeValue) {
        //     error.timeValue = "Time is required";
        // }
        // else if (dateValue && timeValue) {
        //     console.log("start-incrementing counter for 2 for 3");
        //     setCounter((prev: number) => prev + 1);
        // }
        // else if (!soundValue) {
        //     error.soundValue = "Sound is required";
        // }
        // else if (soundValue) {
        //     // console.log("start-incrementing counter");
        //     setCounter((prev: number) => prev + 1);
        //     // console.log("incrementation complete");
        // };
        setError(error);
    };


    const handleOpenSections = (): any => {
        console.log("Start checking validations");

        // Validation now returns a boolean (true if valid, false if invalid)
        if (!validation()) {
            console.log("Validation failed. Do nothing.");
            return; // validation failed, do nothing
        }

        console.log("Validation complete. Proceeding...");
    };


    const router = useRouter();
    const navigate = (url: string): void => {
        router.push(url);
    };

    const createNotifications = async (payload: any): Promise<void> => {
        try {
            const response = await _post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/send-notification-to-all-users`, payload);
            console.log(response);
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    const handleSubmitNotification = async (): Promise<void> => {
        try {
            if (notificationImageFile) {
                console.log("Upload file...");

                // Wait for the base64 image to be generated before continuing
                const base64String = await generateBase64FromCroppedImage();
                setBase64Image(base64String); // Ensure the state is updated

                // Proceed with the form submission
                const formData = new FormData();
                formData.append('title', notificationTitle);
                formData.append('body', notificationText);
                formData.append('image_url', notificationImage);
                formData.append('image_base', base64String);
                formData.append('url', notificationUrl);

                console.log({
                    notificationTitle,
                    notificationText,
                    notificationImage,
                    notificationImageFile,
                    base64String,
                });

                await createNotifications(formData);
                toast.success("Notification Created");
                navigate('/admin/push-notification');
            } else {
                console.log("Upload file...");
                const formData = new FormData();
                formData.append('title', notificationTitle);
                formData.append('body', notificationText);
                formData.append('image_url', notificationImage);
                formData.append('image_base', base64Image || "");
                formData.append('url', notificationUrl);

                console.log({
                    notificationTitle,
                    notificationText,
                    notificationImage,
                    notificationImageFile,
                    base64Image,
                    notificationUrl
                });

                await createNotifications(formData);
                toast.success("Notification Created");
                navigate('/admin/push-notification');
            }
        } catch (error: any) {
            console.log("Error: Notification send error \n", error.message);
        }
    };





    const addRow = (): any => {
        setRows([...rows, { firstValue: '', secondValue: '', thirdValue: '' }]);
    };

    const removeRow = (index: any): any => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);

        // Remove the corresponding segment from targetUserSegment
        const updatedTargetUserSegment = targetUserSegment.filter((_, i) => i !== index);
        setTargetUserSegment(updatedTargetUserSegment);
    };

    const handleInputChange = (index: any, name: keyof any, value: any): any => {
        const updatedRows = rows.map((row, rowIndex) =>
            rowIndex === index ? { ...row, [name]: value } : row
        );
        setRows(updatedRows);

        // When all three values are selected, update targetUserSegment
        if (updatedRows[index].firstValue && updatedRows[index].secondValue && updatedRows[index].thirdValue) {
            const updatedTargetUserSegment = [...targetUserSegment];
            updatedTargetUserSegment[index] = updatedRows[index]; // Update the segment at the current index
            setTargetUserSegment(updatedTargetUserSegment);
        }
    };

    return (
        <>
            {/* [#2271b1] */}
            <div>
                <div>
                    <div className='mb-5'>
                        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/push-notification')}>
                            Back
                        </Button>
                    </div>
                    <div className='bg-white p-2 rounded w-[90%] mx-auto'>
                        <p><span className='px-2 rounded-md text-white' style={{ backgroundColor: '#2271b1' }}>1</span> <span>Notification</span></p>

                        <div className='w-[100%] px-4'>
                            {/* <div className='flex flex-col gap-2 my-3'>
                                <label htmlFor="notificationTitle" >Notification Title</label>
                                <ReactQuill
                                    theme="snow"
                                    value={notificationTitle}
                                    className='ReactQuill_root'
                                    modules={{ toolbar: toolbarOptions }}
                                    onChange={setNotificationTitle}
                                    style={{ minHeight: '100px', height: 'auto' }}
                                />
                                {error && error.notificationTitle && <span className='text-pink-600'>{error.notificationTitle}</span>}
                            </div>
                            <div className='flex flex-col gap-2 my-3'>
                                <label htmlFor="notificationText">Notification Text</label>
                                <ReactQuill
                                    theme="snow"
                                    value={notificationText}
                                    className='ReactQuill_root'
                                    modules={{ toolbar: toolbarOptions }}
                                    onChange={setNotificationText}
                                />
                                {error && error.notificationText && <span className='text-pink-600'>{error.notificationText}</span>}
                            </div> */}

                            <div className='flex flex-col gap-2 my-3'>
                                <label htmlFor="notificationTitle">Notification Title</label>
                                <input
                                    type="text"
                                    id="notificationTitle"
                                    className="form-control border p-2 rounded"
                                    value={notificationTitle}
                                    onChange={(e) => setNotificationTitle(e.target.value)}
                                    placeholder="Enter notification title"
                                />
                                {error?.notificationTitle && <span className='text-pink-600'>{error.notificationTitle}</span>}
                            </div>

                            <div className='flex flex-col gap-2 my-3'>
                                <label htmlFor="notificationText">Notification Text</label>
                                <textarea
                                    id="notificationText"
                                    className="form-control border p-2 rounded h-32"
                                    value={notificationText}
                                    onChange={(e) => setNotificationText(e.target.value)}
                                    placeholder="Enter notification text"
                                />
                                {error?.notificationText && <span className='text-pink-600'>{error.notificationText}</span>}
                            </div>
                            <div className='flex flex-col gap-2 my-3'>
                                <label htmlFor="notificationText">Notification URL</label>
                                <input
                                    id="notificationUrl"
                                    className="form-control border p-2 rounded"
                                    value={notificationUrl}
                                    onChange={(e) => setNotificationUrl(e.target.value)}
                                    placeholder="Enter notification URL"
                                />
                                {/* {error?.notificationText && <span className='text-pink-600'>{error.notificationText}</span>} */}
                            </div>

                            <div className='flex flex-col gap-2 my-3'>
                                <label htmlFor="notificationImage">Notification Image (optional)</label>
                                <div className="flex items-center gap-2 w-full border">
                                    <input type="text" name="notificationImage" id="" className={`w-full border-gray-300 h-[40px] rounded px-2 bg-white ${notificationImageFile && "cursor-not-allowed"}`} placeholder='Enter image url' value={notificationImage} onChange={(e: any) => setNotificationImage(e.target.value)} disabled={notificationImageFile && true} />

                                    <div className={`flex items-center gap-3 border-l h-[40px] px-2 bg-gray-100 `}>
                                        <input type="file" name="notificationImage" id="notificationImage" className={`hidden form-control`} onChange={handleImageFileChange} disabled={notificationImage && true} />
                                        <label htmlFor='notificationImage'>
                                            <FileUploadRoundedIcon className={` text-[#2271b1] ${notificationImage ? "cursor-not-allowed" : "cursor-pointer"}`} />
                                        </label>
                                    </div>
                                </div>
                                <div className='flex'>
                                    {notificationImageFile && <span className='border px-2 py-1 rounded  text-pink-600 '><span>{notificationImageFile.name}</span> <CloseRoundedIcon className='cursor-pointer' onClick={() => setNotificationImageFile(null)} /></span>}
                                </div>
                                <div className='flex'>
                                    {imageFileValidationError && <span className='border px-2 py-1 rounded  text-pink-600 '><span>{imageFileValidationError}</span> <CloseRoundedIcon className='cursor-pointer' onClick={() => setNotificationImageFile(null)} />
                                    </span>}
                                </div>

                                {notificationImageFile && (
                                    <div className='relative h-[400px] w-[100%]'>
                                        <Cropper
                                            image={notificationImageFile}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={10 / 4}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete} // Call onCropComplete and store cropped area pixels
                                            onZoomChange={setZoom}
                                        />
                                    </div>
                                )}


                            </div>
                            {/* <div className='flex flex-col gap-2 my-3'>
                                <label htmlFor="notificationName">Notification Name (Optionsl)</label>
                                <input type="text" name="notificationName" id="notificationName" className="border w-full border-gray-300 h-[40px] rounded px-2" placeholder='Enter notification name' value={notificationName} onChange={(e: any) => setNotificationName(e.target.value)} />
                            </div> */}
                        </div>

                        {/* Second Section Start */}
                        {/* {
                            counter >= 1 && (
                                <>
                                    <div className='my-8'>
                                        <p><span className='px-2 rounded-md text-white' style={{ backgroundColor: '#e4509e' }}>2</span> <span>Target</span></p>

                                        <div className='px-4 my-6'>
                                            <div className='d-flex gap-2'>
                                                <button className='border px-3 py-1 rounded'>User Segment</button>
                                                <button className='border px-3 py-1 rounded'>Topic</button>
                                            </div>
                                            <div>
                                                <div className="border rounded p-3 bg">
                                                    <div className=''
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '10px',
                                                            width: "100%"
                                                        }}
                                                    >
                                                        <p className="w-[50%]">App</p>
                                                        <div className='w-[100%]'>
                                                            <select name="" id="" className='border  w-full px-4 py-2 rounded border-gray-300 '>
                                                                <option value="">----select----</option>
                                                                <option value="store.pinkpaws">store.pinkpaws</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {rows.map((row, index) => (
                                                            <>
                                                                <div key={index} className='w-100 flex items-center gap-2 my-2'>
                                                                    <select name="firstValue" id="" className='border  w-full px-4 py-2 rounded border-gray-300 ' value={row.firstValue}
                                                                        onChange={(e: any) => handleInputChange(index, 'firstValue', e.target.value)}  >
                                                                        <option value="">----select----</option>
                                                                        <option value="store.pinkpaws1">store.pinkpaws-1</option>
                                                                        <option value="store.pinkpaws2">store.pinkpaws-2</option>
                                                                        <option value="store.pinkpaws3">store.pinkpaws-3</option>
                                                                    </select>
                                                                    <select name="secondValue" id="" className='border  w-full px-4 py-2 rounded border-gray-300 ' value={row.secondValue}
                                                                        onChange={(e: any) => handleInputChange(index, 'secondValue', e.target.value)}>
                                                                        <option value="">----select----</option>
                                                                        <option value="store.pinkpaws1">store.pinkpaws-1</option>
                                                                        <option value="store.pinkpaws2">store.pinkpaws-2</option>
                                                                        <option value="store.pinkpaws3">store.pinkpaws-3</option>
                                                                    </select>
                                                                    <select name="thirdValue" id="" className='border  w-full px-4 py-2 rounded border-gray-300 ' value={row.thirdValue}
                                                                        onChange={(e: any) => handleInputChange(index, 'thirdValue', e.target.value)} >
                                                                        <option value="">----select----</option>
                                                                        <option value="store.pinkpaws1">store.pinkpaws-1</option>
                                                                        <option value="store.pinkpaws2">store.pinkpaws-2</option>
                                                                        <option value="store.pinkpaws3">store.pinkpaws-3</option>
                                                                    </select>
                                                                    <div className="text-pink-600">
                                                                        <IconButton onClick={() => removeRow(index)} className="text-pink-600">
                                                                            <CloseRoundedIcon />
                                                                        </IconButton>
                                                                    </div>
                                                                </div>
                                                                {error && error.targetUserSegment && <span className='text-pink-600'>{error.targetUserSegment}</span>}
                                                            </>
                                                        ))}

                                                        <div className='flex justify-end'>
                                                            <button
                                                                onClick={addRow}
                                                                className="border px-4 py-1 rounded-lg bg-green-600 text-white"
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        } */}
                        {/* Second Section End */}

                        {/* Third Section Start */}
                        {/* {
                            counter >= 2 &&

                            <div className='my-4'>
                                <p><span className='px-2 rounded-md text-white' style={{ backgroundColor: '#e4509e' }}>3</span> <span>Scheduling</span></p>
                                <div className="px-4 my-6">
                                    <div className='flex flex-col'>
                                        <label htmlFor="notificationName">Send to eligible users</label>
                                        <div className='flex items-center gap-2 mt-2 w-full'>
                                            <div className="flex flex-col w-full">
                                                <input type="date" name="dateValue" className='border  w-full px-4 py-2 rounded border-gray-300' id="dateValue" value={dateValue} onChange={(e: any) => setDateValue(e.target.value)} />
                                                {error && error.dateValue && <span className="text-pink-600">{error.dateValue}</span>}
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <input type="time" name="timeValue" className='border  w-full px-4 py-2 rounded border-gray-300' id="timeValue" value={timeValue} onChange={(e: any) => setTimeValue(e.target.value)} />
                                                {error && error.timeValue && <span className="text-pink-600">{error.timeValue}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } */}
                        {/* Third Section Start */}

                        {/* Fourth Section Start */}
                        {/* {
                            counter >= 3 &&  // 4th step: Aditional Options (optional)
                            <div className='my-4'>
                                <p><span className='px-2 rounded-md text-white' style={{ backgroundColor: '#e4509e' }}>4</span> <span>Aditional Options (optional)</span></p>
                                <div className="px-4 my-6">
                                    <div className='d-flex flex-column'>
                                        <label htmlFor="notificationName">Sound</label>
                                        <select name="soundValue" id="soundValue" className='border  w-full px-4 py-2 rounded border-gray-300' value={soundValue} onChange={(e: any) => setSoundValue(e.target.value)}>
                                            <option value="">----select----</option>
                                            <option value="enable">Enable</option>
                                            <option value="disable">Disable</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        } */}
                        {/* Fourth Section End */}

                        {/* Next Button Start */}
                        {/* <div className={`px-4 my-5 ${counter >= 3 ? 'hidden' : ''}`}>
                            <button className='px-5 py-1 border rounded text-white' style={{
                                backgroundColor: '#e4509e',
                            }}
                                onClick={handleOpenSections}
                            >Next</button>
                        </div> */}
                        {/* Next Button End */}


                        {/* <div className={`px-4 my-5`}> */}
                        {/* <div className={`px-4 my-5 ${counter >= 3 ? '' : 'hidden'}`}> */}
                        <div className={`px-4 my-5`}>
                            <button className='px-5 py-1 border rounded text-white' style={{
                                backgroundColor: '#2271b1',
                            }}
                                type='button'
                                onClick={handleSubmitNotification}
                            >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddNotification