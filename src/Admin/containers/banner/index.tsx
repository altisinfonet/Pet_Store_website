
// import React, { useEffect, useState } from 'react'
// // import SimpleCard from '../../components/SimpleCard'
// // import ImageUploader from '../../components/ImageUploader'
// // import PinkPawsbutton from '../../components/PinkPawsbutton'
// // import getUrlWithKey from '../util/_apiUrl'
// import axios from 'axios'
// // import { urlToBase64 } from '../../util/_common'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// // import {Image as NImage} from 'next/image'
// import productImage from "../../../../public/assets/images/product.png"

// import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses } from '@mui/material';
// import getUrlWithKey from '../../util/_apiUrl';
// import SimpleCard from '../../components/SimpleCard';
// import PinkPawsbutton from '../../components/PinkPawsbutton';
// import ImageUploader from '../../components/ImageUploader';
// import ActionDrop from '../../components/ActionDrop';
// import { urlToBase64 } from '../../util/_common';
// import moment from 'moment';
// import { useRead } from '../../../hooks';
// import { _get, _post } from '../../../services';
// import TextField from '../../components/TextField';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
// import SelectField from '../../components/SelectField';
// import ButtonField from '../../components/ButtonField';
// import Pageination from '../../components/Pageination';
// import { RiArrowDropRightLine } from 'react-icons/ri';
// import TextAreaField from '../../components/TextAreaField';
// import { _ERROR, _INFO, _SUCCESS } from '../../util/_reactToast';

// const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
//     [`&.${tableCellClasses.head}`]: {
//         backgroundColor: "#000000",
//         color: theme.palette.common.white,
//     },
//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//     },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(even)': {
//         backgroundColor: theme.palette.action.hover,
//     },
//     // hide last border
//     '&:last-child td, &:last-child th': {
//         border: 0,
//     },
// }));

// const Banner = () => {

//     let dropZoneCls = `w-full border border-dashed border-color-pink-3 rounded`;
//     const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded`;

//     const { update_seller_banner, create_seller_banner, update_seller_banner_image, seller_banner_list, total_items_only, delete_multiple_seller_banner } = getUrlWithKey("seller_banner")
//     const { get_status } = getUrlWithKey("products")



//     const imagesDataSet = { large_image_device: [], medium_image_device: [], small_image_device: [] }
//     const imageErrorSet = { imagesLarge: "", imagesMedium: "", imagesSmall: "" }
//     const [imagesLarge, setImagesLarge] = useState<any>([]);
//     const [imagesMedium, setImagesMedium] = useState<any>([]);
//     const [imagesSmall, setImagesSmall] = useState<any>([]);
//     const [imageError, setImageError] = useState(imageErrorSet);
//     const [dataList, setDataList]: any = useState<any[]>([]);
//     const [updateImageState, setUpdateImageState] = useState(false);
//     const [selectedId, setSelectedId]: any = useState("")
//     const [title, setTitle]: any = useState("")
//     const [section, setSection]: any = useState("")
//     const [bannerLink, setBannerLink]: any = useState(" ")
//     const [description, setDescription]: any = useState("")
//     const [titleError, setTitleError]: any = useState();
//     const [sectionError, setSectionError]: any = useState();
//     const [bannerLinkError, setBannerLinkError]: any = useState();

//     const [pageNo, setPageNo] = useState(1)
//     const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
//     const [totalProductGetUrl, setTotalProductGetUrl] = useState("");
//     const [actionValue, setActionValue] = useState("delete")
//     const [checked, setChecked] = useState<any[]>([]);
//     const [totalGetData, setTotalGetData] = useState("totalItem")
//     const [totalpageNo, setTotalPageNo]: any = useState()
//     const [totalProductPages, setTotalProductPages]: any = useState(`${total_items_only}/seller_banner`)
//     const [largeDimensionsData, setLargeDimensionsData]: any = useState({})
//     const [mediumDimensionsData, setMediumDimensionsData]: any = useState({})
//     const [smallDimensionsData, setSmallDimensionsData]: any = useState({})
//     const [totalProductsView, setTotalProductsView]: any = useState([])
//     const [confirmStatus, setConfirmStatus]: any = useState("");
//     const [confirmMultipleStatus, setConfirmMultipleStatus]: any = useState("");
//     const { sendData: getStatus }: any = useRead({ selectMethod: "put", url: get_status });
//     // const { sendData: totalProductsView }: any = useRead({ selectMethod: "get", url: totalProductPages });
//     console.log(largeDimensionsData, "largeDimensionsData5565")
//     const getTotalProductsView = async (search?: any) => {
//         if (search) {
//             const { data } = await _get(`${totalProductPages}?search=${search}`)
//             if (data?.success) {
//                 setTotalProductsView(data?.data)
//             }
//         } else {
//             const { data } = await _get(`${totalProductPages}`)
//             if (data?.success) {
//                 setTotalProductsView(data?.data)
//             }
//         }
//     }

//     useEffect(() => {
//         getTotalProductsView()
//     }, [totalProductPages])

//     // Function to get image dimensions from base64 string
//     const getImageDimensionsFromBase64 = async (base64String: any) => {
//         // Remove data URL prefix (if exists)
//         const base64Data: any = base64String?.replace(/^data:image\/\w+;base64,/, '');

//         // Create a buffer from the base64 data (Node.js)
//         const buffer = Buffer.from(base64Data, 'base64');

//         const blob = new Blob([buffer]);

//         // Create an image element
//         const img: any = new Image();

//         // Use a promise to load the image and extract dimensions
//         const dimensions = await new Promise((resolve, reject) => {
//             img.onload = () => {
//                 resolve({
//                     width: img.width,
//                     height: img.height
//                 });
//             };
//             img.onerror = (err: any) => reject(err);
//             img.src = URL.createObjectURL(blob);
//         });

//         // Clean up by revoking the object URL
//         URL.revokeObjectURL(img.src);

//         return dimensions;
//     };


//     const LimageSize = (base64Image: any) => {
//         getImageDimensionsFromBase64(base64Image)
//             .then(dimensions => {
//                 console.log('Image dimensions:', dimensions);
//                 setLargeDimensionsData(dimensions)
//             })
//             .catch(error => {
//                 console.error('Error getting image dimensions:', error);
//             });
//     }

//     const MimageSize = (base64Image: any) => {
//         getImageDimensionsFromBase64(base64Image)
//             .then(dimensions => {
//                 console.log('Image dimensions:', dimensions);
//                 setMediumDimensionsData(dimensions)
//             })
//             .catch(error => {
//                 console.error('Error getting image dimensions:', error);
//             });
//     }

//     const SimageSize = (base64Image: any) => {
//         getImageDimensionsFromBase64(base64Image)
//             .then(dimensions => {
//                 console.log('Image dimensions:', dimensions);
//                 setSmallDimensionsData(dimensions)
//             })
//             .catch(error => {
//                 console.error('Error getting image dimensions:', error);
//             });
//     }



//     const getBanner = async (search?: any) => {
//         try {
//             if (search !== "") {
//                 const { data } = await axios.put(seller_banner_list, { ...getProd, search: search });
//                 if (data?.success) {
//                     console.log(data?.data, "imageData")
//                     setDataList(data?.data)
//                 }
//                 console.log(data, "__data__")
//             } else {
//                 const { data } = await axios.put(seller_banner_list, getProd);
//                 if (data?.success) {
//                     console.log(data?.data, "imageData")
//                     setDataList(data?.data)
//                 }
//                 console.log(data, "__data__")
//             }
//         } catch (error) {
//             console.log(error, "__error__")
//         }
//     }

//     useEffect(() => {
//         setGetProd({ ...getProd, page: pageNo })
//     }, [pageNo])

//     useEffect(() => {
//         getBanner()
//     }, [getProd])

//     // common table actons start

//     const handelAllChecked = (e: any) => {
//         if (e?.target?.checked && dataList && dataList?.length) {
//             const arr = [];
//             for (let g = 0; g < dataList.length; g++) {
//                 if (dataList[g] && dataList[g]?.id) {
//                     arr.push(dataList[g]?.id);
//                 }
//             }
//             setChecked(arr);
//         } else {
//             setChecked([]);
//         }
//     }

//     const handelTableCheckBox = (e: any, v: any) => {
//         const arr = [...checked];
//         if (e?.target?.checked) {
//             arr.push(v);
//             setChecked(arr);
//         } else {
//             setChecked(arr.filter((item: any) => item !== v))
//         }
//     }

//     const actionArray = [
//         // { value: "bulkAction", name: "Bulk action" },
//         { value: "delete", name: "Delete" },
//     ]

//     const handleChangeAction = (e: any) => {
//         setActionValue(e.target.value);
//     }

//     console.log("handelApply", actionValue, checked);

//     const handleApply = async () => {
//         if (actionValue === 'delete' && checked?.length) {
//             const { data } = await axios.post(delete_multiple_seller_banner, { best_seller_banner_ids: checked });
//             if (data?.success) {
//                 console.log("handelApply-data", data);
//                 _SUCCESS(data?.massage);
//                 // setFields(defaultFieldSet);
//                 setConfirmMultipleStatus("");
//                 setPageNo(1)
//                 setGetProd({ page: pageNo, rowsPerPage: 10 })
//                 getTotalProductsView()
//                 setActionValue("delete");
//                 setChecked([]);
//                 getBanner();
//             }
//         }
//     }

//     const searchRes = (value: any) => {
//         console.log("searchRes", value);
//         if (value) {
//             setPageNo(1);
//             // setTotalProductPages(`${total_items_only}/seller_banner?search=${value}`)
//             getTotalProductsView(`${value}`)
//             getBanner(value)
//         } else {
//             setPageNo(1);
//             getTotalProductsView()
//             getBanner()
//         }
//     }

//     const getTotalPage = (): number => {
//         console.log("list?.totalPage", totalProductsView?.totalPage)
//         if (totalProductsView?.totalPage && totalProductsView?.totalPage !== 0) {
//             return totalProductsView?.totalPage;
//         } else if (totalProductsView?.totalPage === 0) {
//             return 1;
//         } else {
//             return 0;
//         }
//     }

//     useEffect(() => {
//         if (totalGetData === "totalPublished") {
//             let page = totalProductsView?.totalPublished < 10 ? 1 : Math.ceil((totalProductsView?.totalPublished / 10))
//             setTotalPageNo(page)
//         } else if (totalGetData === "totalDraft") {
//             let page = totalProductsView?.totalDraft < 10 ? 1 : Math.ceil((totalProductsView?.totalDraft / 10))
//             setTotalPageNo(page)
//         } else if (totalGetData === "totalTrash") {
//             let page = totalProductsView?.totalDraft < 10 ? 1 : Math.ceil((totalProductsView?.totalDraft / 10))
//             setTotalPageNo(page)
//         } else {
//             setTotalPageNo()
//         }
//     }, [totalGetData])

//     // common table actons end

//     const updateImage = async (value?: any) => {
//         console?.log(value, "dffd451df")
//         let largeImage = await urlToBase64(value?.large_image_device);
//         let mediumImage = await urlToBase64(value?.medium_image_device);
//         let smallImage = await urlToBase64(value?.small_image_device);

//         console.log(largeImage, mediumImage, smallImage, "largeImage")

//         let data_url_large = [
//             {
//                 data_url: largeImage
//             }
//         ];

//         let data_url_medium = [
//             {
//                 data_url: mediumImage
//             }
//         ];

//         let data_url_small = [
//             {
//                 data_url: smallImage
//             }
//         ];

//         setUpdateImageState(true)
//         if (value?.id) {
//             setSelectedId(value?.id)
//         } else {
//             setSelectedId("")
//         }

//         if (value?.title) {
//             setTitle(value?.title)
//         } else {
//             setTitle("")
//         }

//         if (value?.section) {
//             setSection(value?.section)
//         } else {
//             setSection("")
//         }

//         if (value?.link) {
//             const urlObj = new URL(value.link);
//             const pathAfterPort = urlObj.pathname;
//             console.log(pathAfterPort, "df54h65df13")
//             if (pathAfterPort === "/") {
//                 setBannerLink("")
//             } else {
//                 setBannerLink(pathAfterPort)
//             }
//         } else {
//             setBannerLink("")
//         }

//         if (value?.description) {
//             setDescription(value?.description)
//         } else {
//             setDescription("")
//         }
//         setImagesLarge(data_url_large)
//         setImagesMedium(data_url_medium)
//         setImagesSmall(data_url_small)
//         console.log(value, "__value_selected__")
//     }

//     const cancelUpdateImage = () => {
//         setUpdateImageState(false)
//         setTitle("")
//         setDescription("")
//         setGetProd({ page: pageNo, rowsPerPage: 10 })
//         setImageError(imageErrorSet)
//         setSelectedId("")
//         setImagesLarge([])
//         setImagesMedium([])
//         setImagesSmall([])
//     }

//     console.log(updateImageState, "updateImageState")

//     const handleInputImage = (e: any, type: string) => {
//         // console.log(e, "ddfg5g65dfgd")
//         // if (type === "large_image_device") {
//         //     setImagesLarge(e)
//         // }
//         // if (type === "medium_image_device") {
//         //     setImagesMedium(e)
//         // }
//         // if (type === "small_image_device") {
//         //     setImagesSmall(e)
//         // }
//         if (!e?.length) return;

//         if (!e?.length) return;

//         const file = e[0]?.file; // Extract the file
//         if (!file) return;

//         const img = new Image();
//         img.src = URL.createObjectURL(file);

//         img.onload = () => {
//             const width = img.width;
//             const height = img.height;
//             console.log(width, height, "Imagedimensions");

//             let isValid = false;

//             if (type === "large_image_device") {
//                 if (width >= 1920 && height >= 600) {
//                     isValid = true;
//                     setImagesLarge(e);
//                     setLargeDimensionsData({ width, height });
//                 } else {
//                     _ERROR("Please select an image that is at least 1920px wide and 600px tall.")
//                     // _INFO("Please select an image with at least 1920x600 dimensions.");
//                 }
//             }

//             if (type === "medium_image_device") {
//                 if (width >= 991 && height >= 309) {
//                     isValid = true;
//                     setImagesMedium(e);
//                     setMediumDimensionsData({ width, height });
//                 } else {
//                     _ERROR("Please select an image that is at least 991px wide and 309px tall.");
//                 }
//             }

//             if (type === "small_image_device") {
//                 if (width >= 576 && height >= 180) {
//                     isValid = true;
//                     setImagesSmall(e);
//                     setSmallDimensionsData({ width, height });
//                 } else {
//                     _ERROR("Please select an image that is at least 576px wide and 180px tall.");
//                 }
//             }
//         };
//     }

//     const handleChangeStatus = async (id: any, title: any, description: any, value: any) => {
//         console.log(id, title, value, "status_value")
//         try {
//             const { data } = await _post(update_seller_banner, { best_seller_banner_id: id, title: title, description: description, status_id: value })
//             if (data?.success) {
//                 _SUCCESS(data?.massage)
//                 getBanner()
//             } else {
//                 _ERROR(data?.massage)
//             }
//         } catch (error) {
//             console.log("error", error);
//             _ERROR("Somthing went to wrong")
//         }
//     }

//     const updateBanner = async () => {
//         // console.log(imagesLarge[0].file, imagesMedium[0].file, imagesSmall[0].file, "imagesData")
//         console.log(largeDimensionsData, mediumDimensionsData, smallDimensionsData, "__imagesLarge")

//         let valid = true;

//         if (imagesLarge?.length && largeDimensionsData?.width < 1920 && largeDimensionsData?.height < 600) {
//             valid = false;
//             setImageError((pre: any) => ({ ...pre, imagesLarge: "please select valid image" }))
//         }

//         if (imagesMedium?.length && mediumDimensionsData?.width < 991 && mediumDimensionsData?.height < 309) {
//             setImageError((pre: any) => ({ ...pre, imagesMedium: "please select valid image" }))
//             valid = false;
//         }

//         if (imagesSmall?.length && smallDimensionsData?.width < 576 && smallDimensionsData?.height < 180) {
//             setImageError((pre: any) => ({ ...pre, imagesSmall: "please select valid image" }))
//             valid = false;
//         }

//         if (valid) {
//             try {
//                 let formData = new FormData();
//                 formData.append('large_image_device', imagesLarge[0].file);
//                 formData.append('medium_image_device', imagesMedium[0].file);
//                 formData.append('small_image_device', imagesSmall[0].file);
//                 formData.append('best_seller_banner_id', selectedId);
//                 const { data } = await axios.post(update_seller_banner_image, formData)
//                 if (data?.success) {
//                     getBanner()
//                     getTotalProductsView()
//                     // handleChangeStatus(selectedId, title, "1")
//                     setImageError(imageErrorSet)
//                     _SUCCESS(data?.massage)
//                 }
//             } catch (error) {
//                 _ERROR(error?.response?.data?.massage || "Something went wrong, try afetr sometime")
//                 console.log(error, "__error")
//             }
//         }
//     }

//     const updateNewBanner = async () => {
//         console.log(largeDimensionsData, mediumDimensionsData, smallDimensionsData, "__imagesLarge");

//         try {
//             let formData = new FormData();

//             if (imagesLarge?.length && imagesLarge[0]?.file) {
//                 formData.append("large_image_device", imagesLarge[0].file);
//             }
//             if (imagesMedium?.length && imagesMedium[0]?.file) {
//                 formData.append("medium_image_device", imagesMedium[0].file);
//             }
//             if (imagesSmall?.length && imagesSmall[0]?.file) {
//                 formData.append("small_image_device", imagesSmall[0].file);
//             }

//             if (!selectedId) {
//                 console.log("Skipping API call: selectedId is undefined.");
//                 return;
//             }

//             formData.append("best_seller_banner_id", selectedId);

//             // Ensure at least one valid image exists before triggering API
//             if (formData.has("large_image_device") || formData.has("medium_image_device") || formData.has("small_image_device")) {
//                 const { data } = await axios.post(update_seller_banner_image, formData);
//                 if (data?.success) {
//                     getBanner();
//                     getTotalProductsView();
//                 }
//             }
//         } catch (error) {
//             _ERROR(error?.response?.data?.message || "Something went wrong, try again later.");
//         }
//     };


//     // 🔹 UseEffect to trigger `updateBanner` when any state has a value
//     useEffect(() => {
//         if (!selectedId) return;
//         if (
//             imagesLarge?.length && largeDimensionsData?.width >= 1920 && largeDimensionsData?.height >= 600 ||
//             imagesMedium?.length && mediumDimensionsData?.width >= 991 && mediumDimensionsData?.height >= 309 ||
//             imagesSmall?.length && smallDimensionsData?.width >= 576 && smallDimensionsData?.height >= 180
//         ) {
//             updateNewBanner();
//         }
//     }, [largeDimensionsData, mediumDimensionsData, smallDimensionsData, imagesLarge, imagesMedium, imagesSmall, selectedId]);

//     // const updateBannerData = async () => {
//     //     try {
//     //         if (title !== "") {
//     //             const { data } = await axios.post(update_seller_banner, {
//     //                 title: title,
//     //                 description: description,
//     //                 status_id: "1",
//     //                 best_seller_banner_id: selectedId
//     //             })
//     //             if (data?.success) {
//     //                 updateBanner(data?.data?.bestSellerBannerId)
//     //             }
//     //         } else {
//     //             setTitleError("Title is mandetory")
//     //         }
//     //     } catch (error) {
//     //         console.log(error, "__error")
//     //     }

//     // }

//     const updateBannerData = async () => {
//         try {
//             setTitleError('');
//             setSectionError('');
//             // setBannerLinkError('');

//             let isValid = true;

//             if (title === "") {
//                 setTitleError("Title is mandatory");
//                 isValid = false;
//             }

//             if (section === "") {
//                 setSectionError("Section is mandatory");
//                 isValid = false;
//             }

//             // if (bannerLink === "") {
//             //     setBannerLinkError("Banner link is mandatory");
//             //     isValid = false;
//             // }

//             if (!isValid) {
//                 return;
//             }

//             const { data } = await axios.post(update_seller_banner, {
//                 title: title,
//                 description: description,
//                 status_id: "1",
//                 best_seller_banner_id: selectedId,
//                 section: section,
//                 link: bannerLink || ""
//             });

//             if (data?.success) {
//                 _SUCCESS(data?.massage || "Home banner updated successfully.")
//                 // updateBanner();
//                 cancelUpdateImage()
//             }

//         } catch (error) {
//             _ERROR(error?.response?.data?.massage || "Something went wrong!")
//             console.log(error, "__error");
//         }
//     }


//     // const createBanner = async () => {
//     //     try {
//     //         if (title !== "") {
//     //             const { data } = await axios.post(create_seller_banner, {
//     //                 title: title,
//     //                 description: description, status_id: "3"
//     //             })
//     //             if (data?.success) {
//     //                 setSelectedId(data?.data?.bestSellerBannerId)
//     //                 updateBanner(data?.data?.bestSellerBannerId)
//     //                 getTotalProductsView()
//     //             } else {
//     //                 _ERROR(data?.massage)
//     //             }
//     //         } else {
//     //             setTitleError("Title is mandetory")
//     //         }
//     //     } catch (error) {
//     //         console.log(error, "__error")
//     //     }
//     // }

//     const createBanner = async () => {
//         try {
//             // Reset errors before validation
//             setTitleError('');
//             setSectionError('');
//             // setBannerLinkError('');

//             let isValid = true;

//             if (title === "") {
//                 setTitleError("Title is mandatory");
//                 isValid = false;
//             }

//             if (section === "") {
//                 setSectionError("Section is mandatory");
//                 isValid = false;
//             }

//             // if (bannerLink === "") {
//             //     setBannerLinkError("Banner link is mandatory");
//             //     isValid = false;
//             // }

//             if (!isValid) {
//                 return;
//             }
//             const { data } = await axios.post(create_seller_banner, {
//                 title: title,
//                 description: description,
//                 status_id: "3",
//                 section: section,
//                 link: bannerLink || ""
//             });

//             if (data?.success) {
//                 setSelectedId(data?.data?.bestSellerBannerId);
//                 // updateBanner();
//                 getTotalProductsView();
//             }
//         } catch (error) {
//             _ERROR(error?.response?.data?.massage);
//             console.log(error, "__error");
//         }
//     };



//     const delteBanner = async (id: any) => {
//         const { data } = await axios.post(delete_multiple_seller_banner, { best_seller_banner_ids: [id] });
//         if (data?.success) {
//             console.log("handelApply-data", data);
//             _SUCCESS(data?.massage);
//             // setFields(defaultFieldSet);
//             setConfirmStatus("");
//             setPageNo(1)
//             getTotalProductsView()
//             setGetProd({ page: pageNo, rowsPerPage: 10 })
//             setActionValue("delete");
//             setChecked([]);
//             getBanner();
//         }
//     }

//     useEffect(() => {
//         setTitleError("")
//     }, [title])

//     useEffect(() => {
//         setSectionError("")
//     }, [section])

//     useEffect(() => {
//         if (imagesLarge?.length) {
//             LimageSize(imagesLarge[0]?.data_url)
//         }
//         if (imagesMedium?.length) {
//             MimageSize(imagesMedium[0]?.data_url)
//         }
//         if (imagesSmall?.length) {
//             SimageSize(imagesSmall[0]?.data_url)
//         }
//         setImageError(imageErrorSet)
//     }, [imagesLarge, imagesMedium, imagesSmall])

//     console.log(largeDimensionsData, mediumDimensionsData, smallDimensionsData, "__imagesLarge")

//     const [accourding, setAccourding] = useState<any>({
//         1: true,
//         2: true,
//         3: true,
//     });

//     const headingHtml = (heading: string, drop?: boolean, id?: any) => {
//         if (drop) {
//             return (
//                 <div className='flex items-center justify-between'><span>{heading}</span><div className='cursor-pointer' onClick={() => setAccourding((pre: any) => ({
//                     ...pre,
//                     [id]: !accourding[id]
//                 }))}>{accourding[id] ? <RiArrowDropRightLine className="rotate-90 text-3xl" /> : <RiArrowDropRightLine className="text-3xl" />}</div></div>
//             )
//         }
//         return (
//             heading
//         )
//     }


//     const imageRepeter = () => {

//         return (
//             <div className='flex flex-col gap-4'>

//                 <div className='w-full flex items-center justify-end gap-4 mt-4'>
//                     <PinkPawsbutton variant='outlined' name={"close"} handleClick={() => { cancelUpdateImage() }} />
//                     <PinkPawsbutton name={selectedId ? "Update" : "Save"} handleClick={() => { selectedId ? updateBannerData() : createBanner() }} />
//                 </div>

//                 {/* <div className='flex items-center justify-between'>
//                     <div>
//                         <p className='text-sm font-medium'>Title <span style={{ color: "red" }}>*</span></p>
//                         <TextField
//                             className={`w-full ${field_text_Cls}`}
//                             textFieldRoot='w-[400px]'
//                             name='title'
//                             handelState={(e: any) => setTitle(e.target.value)}
//                             value={title}
//                         />
//                         {titleError ? <p className='text-xs text-red-500'>{titleError}</p> : null}
//                     </div>

//                     <div>

//                         <p className='text-sm font-medium'>Link <span className='text-gray-400 font-semibold text-sm'>(optional)</span></p>
//                         <TextField
//                             className={`w-full ${field_text_Cls}`}
//                             textFieldRoot='w-full'
//                             name='title'
//                             handelState={(e: any) => setTitle(e.target.value)}
//                             value={title}
//                         />
//                         {titleError ? <p className='text-xs text-red-500'>{titleError}</p> : null}
//                     </div>

//                     <div>

//                         <p className='text-sm font-medium'>Title <span style={{ color: "red" }}>*</span></p>
//                         <TextField
//                             className={`w-full ${field_text_Cls}`}
//                             textFieldRoot='w-full'
//                             name='title'
//                             handelState={(e: any) => setTitle(e.target.value)}
//                             value={title}
//                         />
//                         {titleError ? <p className='text-xs text-red-500'>{titleError}</p> : null}
//                     </div>
//                 </div> */}
//                 <div className="flex flex-wrap gap-4 justify-between">
//                     <div className="w-full sm:w-[400px]">
//                         <p className="text-sm font-medium">Title <span style={{ color: "red" }}>*</span></p>
//                         <TextField
//                             className={`w-full ${field_text_Cls}`}
//                             textFieldRoot="w-full"
//                             name="title"
//                             handelState={(e: any) => setTitle(e.target.value)}
//                             value={title}
//                         />
//                         {titleError && <p className="text-xs text-red-500">{titleError}</p>}
//                     </div>

//                     <div className="w-full sm:w-[400px]">
//                         <p className="text-sm font-medium">Section <span style={{ color: "red" }}>*</span></p>
//                         <select
//                             className={`w-full ${field_text_Cls} border border-gray-300 rounded-md py-2 px-3`}
//                             name="section"
//                             onChange={(e: any) => setSection(e.target.value)}
//                             value={section}
//                         >
//                             <option value="">Select Section</option>
//                             <option value="section1">Section 1</option>
//                             <option value="section2">Section 2</option>
//                         </select>
//                         {sectionError && <p className="text-xs text-red-500">{sectionError}</p>}
//                     </div>

//                     <div className="w-full sm:w-[400px]">
//                         <p className="text-sm font-medium">Link <span className='text-gray-400 font-semibold text-sm'>(optional)</span></p>
//                         <TextField
//                             className={`w-full ${field_text_Cls}`}
//                             textFieldRoot="w-full"
//                             name="bannerLink"
//                             handelState={(e: any) => setBannerLink(e.target.value)}
//                             value={bannerLink}
//                         />
//                     </div>


//                 </div>


//                 <div className='flex w-full flex-col items-start'>
//                     <p className='text-sm font-medium'>Description</p>
//                     <TextAreaField
//                         textareaRoot={"w-full"}
//                         className={`!w-full h-40 p-1 ${field_text_Cls}`}
//                         name='description'
//                         handelState={(e: any) => setDescription(e.target.value)}
//                         value={description}
//                     />
//                 </div>

//                 <SimpleCard heading={headingHtml("Home Banner Large devices (1920px*600px)", true, 1)} childrenClassName='flex flex-col gap-4'>
//                     {accourding[1] &&
//                         <div className='flex flex-col w-full gap-4'>
//                             <div className='flex gap-4 w-full'>
//                                 <div className={`flex flex-col gap-4 w-full`}>
//                                     <div className='flex items-start flex-col'>
//                                         <div className={`${dropZoneCls}`}>
//                                             <ImageUploader
//                                                 imageCropSize={{ width: 1920, height: 600 }}
//                                                 acceptType={["jpg", "png", "jpeg", "webp"]}
//                                                 className={`w-full h-fit min-h-40 flex items-center justify-center imageDeopZone `}
//                                                 onImageChange={(e: any) => handleInputImage(e, "large_image_device")}
//                                                 preImages={imagesLarge}
//                                             />
//                                         </div>
//                                         {imageError?.imagesLarge ? <p className='text-xs text-red-500'>{imageError?.imagesLarge}</p> : null}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>}
//                 </SimpleCard>

//                 <SimpleCard heading={headingHtml("Home Banner Medium devices (991px*309px)", true, 2)} childrenClassName='flex flex-col gap-4'>
//                     {accourding[2] &&
//                         <div className='flex flex-col w-full gap-4'>
//                             <div className='flex gap-4 w-full'>
//                                 <div className={`flex flex-col gap-4 w-full`}>
//                                     <div className='flex items-start flex-col'>
//                                         <div className={`${dropZoneCls}`}>
//                                             <ImageUploader
//                                                 imageCropSize="991px*309px"
//                                                 acceptType={["jpg", "png", "jpeg", "webp"]}
//                                                 className={`w-full h-fit min-h-40 flex items-center justify-center imageDeopZone `}
//                                                 onImageChange={(e: any) => handleInputImage(e, "medium_image_device")}
//                                                 preImages={imagesMedium}
//                                             />
//                                         </div>
//                                         {imageError?.imagesLarge ? <p className='text-xs text-red-500'>{imageError?.imagesLarge}</p> : null}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>}
//                 </SimpleCard>

//                 <SimpleCard heading={headingHtml("Home Banner Small devices (576px*180px)", true, 3)} childrenClassName='flex flex-col gap-4'>
//                     {accourding[3] &&
//                         <div className='flex flex-col w-full gap-4'>
//                             <div className='flex gap-4 w-full'>
//                                 <div className={`flex flex-col gap-4 w-full`}>
//                                     <div className='flex items-start flex-col'>
//                                         <div className={`${dropZoneCls}`}>
//                                             <ImageUploader
//                                                 imageCropSize="576px*180px"
//                                                 acceptType={["jpg", "png", "jpeg", "webp"]}
//                                                 className={`w-full h-fit min-h-40 flex items-center justify-center imageDeopZone `}
//                                                 onImageChange={(e: any) => handleInputImage(e, "small_image_device")}
//                                                 preImages={imagesSmall}
//                                             />
//                                         </div>
//                                         {imageError?.imagesLarge ? <p className='text-xs text-red-500'>{imageError?.imagesLarge}</p> : null}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>}
//                 </SimpleCard>

//                 <div className='w-full flex items-center justify-end gap-4 mt-4'>
//                     <PinkPawsbutton variant='outlined' name='close' handleClick={() => { cancelUpdateImage() }} />
//                     <PinkPawsbutton name={selectedId ? "Update" : "Save"} handleClick={() => { selectedId ? updateBannerData() : createBanner() }} />
//                 </div>

//             </div>
//         )
//     }

//     console.log(dataList, selectedId, title, "___images")
//     console.log(getStatus, "getStatus")
//     console.log(totalProductsView, "totalProductsView")

//     return (
//         <>

//             {!updateImageState ?
//                 <>

//                     <div className='flex flex-col gap-2 pb-4'>
//                         <div className='flex flex-wrap gap-2 items-center justify-between'>
//                             <SearchAndAddNewComponent buttonTxt={'Search'} addNewProduct={updateImage} name={'Add new'} res={searchRes} />
//                         </div>
//                         <div className='flex flex-wrap gap-2 items-center justify-between'>
//                             <div className='flex flex-wrap gap-4'>
//                                 <ActionDrop
//                                     btnValue="Apply"
//                                     handleChange={handleChangeAction}
//                                     menuItemArray={actionArray}
//                                     value={actionValue}
//                                     handleClick={() => setConfirmMultipleStatus("mulDelete")}
//                                     disabled={checked.length ? false : true}
//                                 />

//                             </div>
//                             <Pageination
//                                 items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
//                                 value={pageNo}
//                                 totalpageNo={getTotalPage()}
//                                 handleClickFirst={() => setPageNo(1)}
//                                 handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : (pageNo - 1))}
//                                 handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
//                                 disabledMid={true}
//                                 handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
//                                 handleClickLast={() => setPageNo(getTotalPage())}
//                             />
//                         </div>
//                     </div>

//                     <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
//                         <TableHead>
//                             <TableRow
//                                 hover
//                                 role="checkbox"
//                                 className='bg-slate-200 hover:!bg-slate-200'
//                                 sx={{ cursor: 'pointer' }}
//                             >
//                                 <TableCell padding="checkbox">
//                                     <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === dataList?.length ? true : false} />
//                                 </TableCell>

//                                 <TableCell>Image</TableCell>
//                                 <TableCell>Title</TableCell>
//                                 <TableCell>Section</TableCell>
//                                 <TableCell>Description</TableCell>
//                                 <TableCell>Date</TableCell>
//                                 <TableCell>Status</TableCell>
//                                 <TableCell>Action</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {dataList?.map((row: any, index: number) => {
//                                 return (
//                                     <StyledTableRow
//                                         hover
//                                         key={index}
//                                         sx={{ cursor: 'pointer' }}

//                                     >
//                                         <StyledTableCell className='!w-[5%]' padding="checkbox">
//                                             <Checkbox
//                                                 checked={checked.includes(row?.id)}
//                                                 onClick={(e) => handelTableCheckBox(e, row?.id)}
//                                                 size="small"
//                                             />
//                                         </StyledTableCell>
//                                         <StyledTableCell className='w-[20%]' onClick={() => { updateImage(row) }}>
//                                             <img
//                                                 src={row?.large_image_device ? row?.large_image_device : "/assets/images/product.png"}
//                                                 alt='productImage'
//                                                 width={row?.large_image_device ? 192 : 122}
//                                                 height={row?.large_image_device ? 108 : 38}
//                                             />
//                                         </StyledTableCell>
//                                         <StyledTableCell className='w-[20%]' onClick={() => { updateImage(row) }}>
//                                             {row?.title || "--"}
//                                         </StyledTableCell>
//                                         <StyledTableCell className='w-[10%]' onClick={() => { updateImage(row) }}>
//                                             {row?.section || "--"}
//                                         </StyledTableCell>
//                                         <StyledTableCell className='w-[20%]' onClick={() => { updateImage(row) }}>
//                                             {row?.description || "--"}
//                                         </StyledTableCell>
//                                         <StyledTableCell className='w-[10%]' onClick={() => { updateImage(row) }}>
//                                             {moment(row?.created_at).format("MMMM DD YYYY")}
//                                         </StyledTableCell>
//                                         <StyledTableCell className='w-[15%]'>
//                                             <ActionDrop
//                                                 btnValue="Apply"
//                                                 handleChange={(e: any) => handleChangeStatus(row?.id, row?.title, row?.description, e.target.value)}
//                                                 menuItemArray={getStatus}
//                                                 value={getStatus.filter((v: any) => v?.id === row?.status?.id)[0]?.id}
//                                                 btn={true}
//                                                 needId={true}
//                                                 needtitle={true}
//                                             />
//                                         </StyledTableCell>
//                                         <StyledTableCell className='w-[10%]'>
//                                             <div className='flex items-center gap-2'>
//                                                 <EditIcon className='text-green-700' onClick={() => { updateImage(row) }} />
//                                                 <DeleteIcon className='text-red-500'
//                                                     onClick={() => {
//                                                         // delteBanner(row?.id) 
//                                                         if (!checked.includes(row?.id)) {
//                                                             _ERROR("Please select the checkbox before deleting.")
//                                                         } else {
//                                                             setConfirmStatus(row?.id);
//                                                         }

//                                                     }} />
//                                             </div>
//                                         </StyledTableCell>

//                                     </StyledTableRow>
//                                 );
//                             })
//                             }
//                         </TableBody>
//                     </Table>

//                     <div className='flex flex-wrap items-center justify-between pt-4'>
//                         <ActionDrop
//                             btnValue="Apply"
//                             handleChange={handleChangeAction}
//                             menuItemArray={actionArray}
//                             value={actionValue}
//                             handleClick={() => setConfirmMultipleStatus("mulDelete")}
//                             disabled={checked.length ? false : true}
//                         />

//                         <Pageination
//                             items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
//                             value={pageNo}
//                             totalpageNo={getTotalPage()}
//                             handleClickFirst={() => setPageNo(1)}
//                             handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : (pageNo - 1))}
//                             handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
//                             disabledMid={true}
//                             handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
//                             handleClickLast={() => setPageNo(getTotalPage())}
//                         />
//                     </div>
//                 </>
//                 :
//                 <div className='flex flex-col gap-4'>
//                     {imageRepeter()}
//                 </div>}

//             <Dialog
//                 open={confirmStatus !== ""}
//                 // onClose={handleClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogContent className='w-80 h-40 p-4'>
//                     <div className='bg-white flex flex-col justify-between h-full'>
//                         <p className='flex flex-col items-center justify-center'>
//                             <span>Do you want to delete this record?</span>
//                         </p>
//                         <div className='flex items-center gap-4'>
//                             <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { delteBanner(confirmStatus); }} />
//                             <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmStatus("") }} />
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>

//             <Dialog
//                 open={confirmMultipleStatus !== ""}
//                 // onClose={handleClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogContent className='w-80 h-40 p-4'>
//                     <div className='bg-white flex flex-col justify-between h-full'>
//                         <p className='flex flex-col items-center justify-center'>
//                             <span>Do you want to delete this record?</span>
//                         </p>
//                         <div className='flex items-center gap-4'>
//                             <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { handleApply(); }} />
//                             <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmMultipleStatus("") }} />
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     )
// }

// export default Banner

// // ===================================================Old Code===============================================================


// // ===================================================New Code===============================================================


import React, { useEffect, useState } from 'react'
// import SimpleCard from '../../components/SimpleCard'
// import ImageUploader from '../../components/ImageUploader'
// import PinkPawsbutton from '../../components/PinkPawsbutton'
// import getUrlWithKey from '../util/_apiUrl'
import axios from 'axios'
// import { urlToBase64 } from '../../util/_common'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import {Image as NImage} from 'next/image'
import productImage from "../../../../public/assets/images/product.png"

import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses, Button } from '@mui/material';
import getUrlWithKey from '../../util/_apiUrl';
import SimpleCard from '../../components/SimpleCard';
import PinkPawsbutton from '../../components/PinkPawsbutton';
import ImageUploader from '../../components/ImageUploader';
import ActionDrop from '../../components/ActionDrop';
import { urlToBase64 } from '../../util/_common';
import moment from 'moment';
import { useRead } from '../../../hooks';
import { _get, _post } from '../../../services';
import TextField from '../../components/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
import SelectField from '../../components/SelectField';
import ButtonField from '../../components/ButtonField';
import Pageination from '../../components/Pageination';
import { RiArrowDropRightLine } from 'react-icons/ri';
import TextAreaField from '../../components/TextAreaField';
import { _ERROR, _INFO, _SUCCESS } from '../../util/_reactToast';
import ImageFileInput from '../FileInput';
import ImageCropper from "../ImageCropper"

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#000000",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Banner = () => {

    let dropZoneCls = `w-full border border-dashed border-color-pink-3 rounded`;
    const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded`;

    const { update_seller_banner, create_seller_banner, update_seller_banner_image, seller_banner_list, total_items_only, delete_multiple_seller_banner } = getUrlWithKey("seller_banner")
    const { get_status } = getUrlWithKey("products")



    const imagesDataSet = { large_image_device: [], medium_image_device: [], small_image_device: [] }
    const imageErrorSet = { imagesLarge: "", imagesMedium: "", imagesSmall: "" }
    const [imagesLarge, setImagesLarge] = useState<any>([]);
    const [imagesMedium, setImagesMedium] = useState<any>([]);
    const [imagesSmall, setImagesSmall] = useState<any>([]);
    const [imagesCancelLarge, setImagesCancelLarge] = useState<any>([]);
    const [imagesCancelMedium, setImagesCancelMedium] = useState<any>([]);
    const [imagesCancelSmall, setImagesCancelSmall] = useState<any>([]);
    console.log(imagesSmall, "6dfgh56gggfd")
    const [imageError, setImageError] = useState(imageErrorSet);
    const [dataList, setDataList]: any = useState<any[]>([]);
    const [updateImageState, setUpdateImageState] = useState(false);
    const [selectedId, setSelectedId]: any = useState("")
    const [title, setTitle]: any = useState("")
    const [section, setSection]: any = useState("")
    const [bannerLink, setBannerLink]: any = useState(" ")
    const [description, setDescription]: any = useState("")
    const [titleError, setTitleError]: any = useState();
    const [sectionError, setSectionError]: any = useState();
    const [bannerLinkError, setBannerLinkError]: any = useState();

    const [pageNo, setPageNo] = useState(1)
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [totalProductGetUrl, setTotalProductGetUrl] = useState("");
    const [actionValue, setActionValue] = useState("delete")
    const [checked, setChecked] = useState<any[]>([]);
    const [totalGetData, setTotalGetData] = useState("totalItem")
    const [totalpageNo, setTotalPageNo]: any = useState()
    const [totalProductPages, setTotalProductPages]: any = useState(`${total_items_only}/seller_banner`)
    const [largeDimensionsData, setLargeDimensionsData]: any = useState({})
    const [mediumDimensionsData, setMediumDimensionsData]: any = useState({})
    const [smallDimensionsData, setSmallDimensionsData]: any = useState({})
    const [totalProductsView, setTotalProductsView]: any = useState([])
    const [confirmStatus, setConfirmStatus]: any = useState("");
    const [confirmMultipleStatus, setConfirmMultipleStatus]: any = useState("");

    const { sendData: getStatus }: any = useRead({ selectMethod: "put", url: get_status });
    // const { sendData: totalProductsView }: any = useRead({ selectMethod: "get", url: totalProductPages });
    console.log(imagesLarge, "largeDimensionsData5565")
    const getTotalProductsView = async (search?: any) => {
        if (search) {
            const { data } = await _get(`${totalProductPages}?search=${search}`)
            if (data?.success) {
                setTotalProductsView(data?.data)
            }
        } else {
            const { data } = await _get(`${totalProductPages}`)
            if (data?.success) {
                setTotalProductsView(data?.data)
            }
        }
    }

    useEffect(() => {
        getTotalProductsView()
    }, [totalProductPages])

    // Function to get image dimensions from base64 string
    const getImageDimensionsFromBase64 = async (base64String: any) => {
        // Remove data URL prefix (if exists)
        const base64Data: any = base64String?.replace(/^data:image\/\w+;base64,/, '');

        // Create a buffer from the base64 data (Node.js)
        const buffer = Buffer.from(base64Data, 'base64');

        const blob = new Blob([buffer]);

        // Create an image element
        const img: any = new Image();

        // Use a promise to load the image and extract dimensions
        const dimensions = await new Promise((resolve, reject) => {
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };
            img.onerror = (err: any) => reject(err);
            img.src = URL.createObjectURL(blob);
        });

        // Clean up by revoking the object URL
        URL.revokeObjectURL(img.src);

        return dimensions;
    };


    const LimageSize = (base64Image: any) => {
        getImageDimensionsFromBase64(base64Image)
            .then(dimensions => {
                console.log('Image dimensions:', dimensions);
                setLargeDimensionsData(dimensions)
            })
            .catch(error => {
                console.error('Error getting image dimensions:', error);
            });
    }

    const MimageSize = (base64Image: any) => {
        getImageDimensionsFromBase64(base64Image)
            .then(dimensions => {
                console.log('Image dimensions:', dimensions);
                setMediumDimensionsData(dimensions)
            })
            .catch(error => {
                console.error('Error getting image dimensions:', error);
            });
    }

    const SimageSize = (base64Image: any) => {
        getImageDimensionsFromBase64(base64Image)
            .then(dimensions => {
                console.log('Image dimensions:', dimensions);
                setSmallDimensionsData(dimensions)
            })
            .catch(error => {
                console.error('Error getting image dimensions:', error);
            });
    }



    const getBanner = async (search?: any) => {
        try {
            if (search !== "") {
                const { data } = await axios.put(seller_banner_list, { ...getProd, search: search });
                if (data?.success) {
                    console.log(data?.data, "imageData")
                    setDataList(data?.data)
                }
                console.log(data, "__data__")
            } else {
                const { data } = await axios.put(seller_banner_list, getProd);
                if (data?.success) {
                    console.log(data?.data, "imageData")
                    setDataList(data?.data)
                }
                console.log(data, "__data__")
            }
        } catch (error) {
            console.log(error, "__error__")
        }
    }

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo])

    useEffect(() => {
        getBanner()
    }, [getProd])

    // common table actons start

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && dataList && dataList?.length) {
            const arr = [];
            for (let g = 0; g < dataList.length; g++) {
                if (dataList[g] && dataList[g]?.id) {
                    arr.push(dataList[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
    }

    const handelTableCheckBox = (e: any, v: any) => {
        const arr = [...checked];
        if (e?.target?.checked) {
            arr.push(v);
            setChecked(arr);
        } else {
            setChecked(arr.filter((item: any) => item !== v))
        }
    }

    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]

    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    console.log("handelApply", actionValue, checked);

    const handleApply = async () => {
        if (actionValue === 'delete' && checked?.length) {
            const { data } = await axios.post(delete_multiple_seller_banner, { best_seller_banner_ids: checked });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                // setFields(defaultFieldSet);
                setConfirmMultipleStatus("");
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                getTotalProductsView()
                setActionValue("delete");
                setChecked([]);
                getBanner();
            }
        }
    }

    const searchRes = (value: any) => {
        console.log("searchRes", value);
        if (value) {
            setPageNo(1);
            // setTotalProductPages(`${total_items_only}/seller_banner?search=${value}`)
            getTotalProductsView(`${value}`)
            getBanner(value)
        } else {
            setPageNo(1);
            getTotalProductsView()
            getBanner()
        }
    }

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalProductsView?.totalPage)
        if (totalProductsView?.totalPage && totalProductsView?.totalPage !== 0) {
            return totalProductsView?.totalPage;
        } else if (totalProductsView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    useEffect(() => {
        if (totalGetData === "totalPublished") {
            let page = totalProductsView?.totalPublished < 10 ? 1 : Math.ceil((totalProductsView?.totalPublished / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalDraft") {
            let page = totalProductsView?.totalDraft < 10 ? 1 : Math.ceil((totalProductsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalTrash") {
            let page = totalProductsView?.totalDraft < 10 ? 1 : Math.ceil((totalProductsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else {
            setTotalPageNo()
        }
    }, [totalGetData])

    // common table actons end

    const updateImage = async (value?: any) => {
        console?.log(value, "dffd451df")
        let largeImage = await urlToBase64(value?.large_image_device);
        let mediumImage = await urlToBase64(value?.medium_image_device);
        let smallImage = await urlToBase64(value?.small_image_device);

        console.log(largeImage, mediumImage, smallImage, value?.large_image_device, value?.medium_image_device, value?.small_image_device, "largeImage")

        let data_url_large = [
            {
                data_url: largeImage
            }
        ];

        let data_url_medium = [
            {
                data_url: mediumImage
            }
        ];

        let data_url_small = [
            {
                data_url: smallImage
            }
        ];

        setUpdateImageState(true)
        if (value?.id) {
            setSelectedId(value?.id)
            // setShowCropiingModal(true)
        } else {
            setSelectedId("")
        }

        if (value?.title) {
            setTitle(value?.title)
        } else {
            setTitle("")
        }

        if (value?.section) {
            setSection(value?.section)
        } else {
            setSection("")
        }

        if (value?.link) {
            try {
                const urlObj = new URL(value.link);
                const pathAfterPort = urlObj.pathname;
                console.log(pathAfterPort, "df54h65df13");

                if (pathAfterPort === "/") {
                    setBannerLink("");
                } else {
                    setBannerLink(pathAfterPort);
                }
            } catch (error) {
                console.error("Invalid URL", error);
                setBannerLink(""); // fallback if the URL is invalid
            }
            // const urlObj = new URL(value.link);
            // const pathAfterPort = urlObj.pathname;
            // console.log(pathAfterPort, "df54h65df13")
            // if (pathAfterPort === "/") {
            //     setBannerLink("")
            // } else {
            //     setBannerLink(pathAfterPort)
            // }
        } else {
            setBannerLink("")
        }

        if (value?.description) {
            setDescription(value?.description)
        } else {
            setDescription("")
        }
        // setImagesLarge(data_url_large)
        // setImagesMedium(data_url_medium)
        // setImagesSmall(data_url_small)
        setImagesLarge(value?.large_image_device)
        setImagesCancelLarge(value?.large_image_device)
        setImagesMedium(value?.medium_image_device)
        setImagesCancelMedium(value?.medium_image_device)
        setImagesSmall(value?.small_image_device)
        setImagesCancelSmall(value?.small_image_device)

        console.log(value, "__value_selected__")
    }

    const cancelUpdateImage = () => {
        setUpdateImageState(false)
        setTitle("")
        setDescription("")
        setGetProd({ page: pageNo, rowsPerPage: 10 })
        setImageError(imageErrorSet)
        setSelectedId("")
        setImagesLarge([])
        setImagesMedium([])
        setImagesSmall([])
    }

    console.log(updateImageState, "updateImageState")

    const handleInputImage = (e: any, type: string) => {
        // console.log(e, "ddfg5g65dfgd")
        // if (type === "large_image_device") {
        //     setImagesLarge(e)
        // }
        // if (type === "medium_image_device") {
        //     setImagesMedium(e)
        // }
        // if (type === "small_image_device") {
        //     setImagesSmall(e)
        // }
        if (!e?.length) return;

        if (!e?.length) return;

        const file = e[0]?.file; // Extract the file
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const width = img.width;
            const height = img.height;
            console.log(width, height, "Imagedimensions");

            let isValid = false;

            if (type === "large_image_device") {
                if (width >= 1920 && height >= 600) {
                    isValid = true;
                    setImagesLarge(e);
                    setLargeDimensionsData({ width, height });
                } else {
                    _ERROR("Please select an image that is at least 1920px wide and 600px tall.")
                    // _INFO("Please select an image with at least 1920x600 dimensions.");
                }
            }

            if (type === "medium_image_device") {
                if (width >= 991 && height >= 309) {
                    isValid = true;
                    setImagesMedium(e);
                    setMediumDimensionsData({ width, height });
                } else {
                    _ERROR("Please select an image that is at least 991px wide and 309px tall.");
                }
            }

            if (type === "small_image_device") {
                if (width >= 576 && height >= 180) {
                    isValid = true;
                    setImagesSmall(e);
                    setSmallDimensionsData({ width, height });
                } else {
                    _ERROR("Please select an image that is at least 576px wide and 180px tall.");
                }
            }
        };
    }

    // const handleChangeStatus = async (id: any, title: any, description: any, value: any) => {
    //     console.log(id, title, value, "status_value")
    //     try {
    //         const { data } = await _post(update_seller_banner, { best_seller_banner_id: id, title: title, description: description, status_id: value })
    //         if (data?.success) {
    //             _SUCCESS(data?.massage)
    //             getBanner()
    //             console.log(dataList, "xf65f4s56sdf")
    //         } else {
    //             _ERROR(data?.massage)
    //         }
    //     } catch (error) {
    //         console.log("error", error);
    //         _ERROR("Somthing went to wrong")
    //     }
    // }

    const handleChangeStatus = async (id: string, title: string, description: string, newStatusId: string) => {
        console.log(id, title, newStatusId, "status_value");

        try {
            // Fetch latest banner data
            await getBanner();

            // Find the selected banner
            const selectedBanner = dataList.find((banner: any) => banner.id === id);

            if (!selectedBanner) {
                return console.error("Banner not found");
            }

            const { section } = selectedBanner;

            // Find all banners in the same section
            const bannersInSameSection = dataList.filter((banner: any) => banner.section === section);

            // If the new status is "Published", first set all other banners in the section to "Draft"
            if (newStatusId === "1") { // "1" = Published
                for (const banner of bannersInSameSection) {
                    if (banner.id !== id && banner.status?.id === "1") {
                        await _post(update_seller_banner, {
                            best_seller_banner_id: banner.id,
                            title: banner.title,
                            description: banner.description,
                            status_id: "3", // Draft
                        });
                    }
                }
            }

            // Update the selected banner's status
            const { data } = await _post(update_seller_banner, {
                best_seller_banner_id: id,
                title: title,
                description: description,
                status_id: newStatusId,
            });

            if (data?.success) {
                _SUCCESS(data?.massage);
                getBanner(); // Refresh data
            } else {
                _ERROR(data?.massage);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            _ERROR("Something went wrong");
        }
    };



    const updateBanner = async () => {
        // console.log(imagesLarge[0].file, imagesMedium[0].file, imagesSmall[0].file, "imagesData")
        console.log(largeDimensionsData, mediumDimensionsData, smallDimensionsData, "__imagesLarge")

        let valid = true;

        if (imagesLarge?.length && largeDimensionsData?.width < 1920 && largeDimensionsData?.height < 600) {
            valid = false;
            setImageError((pre: any) => ({ ...pre, imagesLarge: "please select valid image" }))
        }

        if (imagesMedium?.length && mediumDimensionsData?.width < 991 && mediumDimensionsData?.height < 309) {
            setImageError((pre: any) => ({ ...pre, imagesMedium: "please select valid image" }))
            valid = false;
        }

        if (imagesSmall?.length && smallDimensionsData?.width < 576 && smallDimensionsData?.height < 180) {
            setImageError((pre: any) => ({ ...pre, imagesSmall: "please select valid image" }))
            valid = false;
        }

        if (valid) {
            try {
                let formData = new FormData();
                formData.append('large_image_device', imagesLarge[0].file);
                formData.append('medium_image_device', imagesMedium[0].file);
                formData.append('small_image_device', imagesSmall[0].file);
                formData.append('best_seller_banner_id', selectedId);
                const { data } = await axios.post(update_seller_banner_image, formData)
                if (data?.success) {
                    getBanner()
                    getTotalProductsView()
                    // handleChangeStatus(selectedId, title, "1")
                    setImageError(imageErrorSet)
                    _SUCCESS(data?.massage)
                }
            } catch (error) {
                _ERROR(error?.response?.data?.massage || "Something went wrong, try afetr sometime")
                console.log(error, "__error")
            }
        }
    }


    // 🔹 UseEffect to trigger `updateBanner` when any state has a value
    // useEffect(() => {
    //     if (!selectedId) return;
    //     if (
    //         imagesLarge?.length && largeDimensionsData?.width >= 1920 && largeDimensionsData?.height >= 600 ||
    //         imagesMedium?.length && mediumDimensionsData?.width >= 991 && mediumDimensionsData?.height >= 309 ||
    //         imagesSmall?.length && smallDimensionsData?.width >= 576 && smallDimensionsData?.height >= 180
    //     ) {
    //         updateNewBanner();
    //     }
    // }, [largeDimensionsData, mediumDimensionsData, smallDimensionsData, imagesLarge, imagesMedium, imagesSmall, selectedId]);

    // const updateBannerData = async () => {
    //     try {
    //         if (title !== "") {
    //             const { data } = await axios.post(update_seller_banner, {
    //                 title: title,
    //                 description: description,
    //                 status_id: "1",
    //                 best_seller_banner_id: selectedId
    //             })
    //             if (data?.success) {
    //                 updateBanner(data?.data?.bestSellerBannerId)
    //             }
    //         } else {
    //             setTitleError("Title is mandetory")
    //         }
    //     } catch (error) {
    //         console.log(error, "__error")
    //     }

    // }

    const updateBannerData = async () => {
        try {
            setTitleError('');
            setSectionError('');
            // setBannerLinkError('');

            let isValid = true;

            if (title === "") {
                setTitleError("Title is mandatory");
                isValid = false;
            }

            if (section === "") {
                setSectionError("Section is mandatory");
                isValid = false;
            }

            // if (bannerLink === "") {
            //     setBannerLinkError("Banner link is mandatory");
            //     isValid = false;
            // }

            if (!isValid) {
                return;
            }

            const { data } = await axios.post(update_seller_banner, {
                title: title,
                description: description,
                status_id: "1",
                best_seller_banner_id: selectedId,
                section: section,
                link: bannerLink || ""
            });

            if (data?.success) {
                _SUCCESS(data?.massage || "Home banner updated successfully.")
                // updateBanner();
                updateNewBanner(selectedId)
                cancelUpdateImage()
            }

        } catch (error) {
            _ERROR(error?.response?.data?.massage || "Something went wrong!")
            console.log(error, "__error");
        }
    }


    // const createBanner = async () => {
    //     try {
    //         if (title !== "") {
    //             const { data } = await axios.post(create_seller_banner, {
    //                 title: title,
    //                 description: description, status_id: "3"
    //             })
    //             if (data?.success) {
    //                 setSelectedId(data?.data?.bestSellerBannerId)
    //                 updateBanner(data?.data?.bestSellerBannerId)
    //                 getTotalProductsView()
    //             } else {
    //                 _ERROR(data?.massage)
    //             }
    //         } else {
    //             setTitleError("Title is mandetory")
    //         }
    //     } catch (error) {
    //         console.log(error, "__error")
    //     }
    // }

    const createBanner = async () => {
        try {
            // Reset errors before validation
            setTitleError('');
            setSectionError('');
            // setBannerLinkError('');

            let isValid = true;

            if (title === "") {
                setTitleError("Title is mandatory");
                isValid = false;
            }

            if (section === "") {
                setSectionError("Section is mandatory");
                isValid = false;
            }

            // if (bannerLink === "") {
            //     setBannerLinkError("Banner link is mandatory");
            //     isValid = false;
            // }

            if (!isValid) {
                return;
            }
            const { data } = await axios.post(create_seller_banner, {
                title: title,
                description: description,
                status_id: "3",
                section: section,
                link: bannerLink || ""
            });

            if (data?.success) {
                setSelectedId(data?.data?.bestSellerBannerId);
                _SUCCESS(data?.massage || "Banner Created Successfully")
                // updateBanner();
                updateNewBanner(data?.data?.bestSellerBannerId)
                setUpdateImageState(false)
                getBanner()
                getTotalProductsView();
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage);
            console.log(error, "__error");
        }
    };


    const delteBanner = async (id: any) => {
        const { data } = await axios.post(delete_multiple_seller_banner, { best_seller_banner_ids: [id] });
        if (data?.success) {
            console.log("handelApply-data", data);
            _SUCCESS(data?.massage);
            // setFields(defaultFieldSet);
            setConfirmStatus("");
            setPageNo(1)
            getTotalProductsView()
            setGetProd({ page: pageNo, rowsPerPage: 10 })
            setActionValue("delete");
            setChecked([]);
            getBanner();
        }
    }

    useEffect(() => {
        setTitleError("")
    }, [title])

    useEffect(() => {
        setSectionError("")
    }, [section])

    useEffect(() => {
        if (imagesLarge?.length) {
            LimageSize(imagesLarge[0]?.data_url)
        }
        if (imagesMedium?.length) {
            MimageSize(imagesMedium[0]?.data_url)
        }
        if (imagesSmall?.length) {
            SimageSize(imagesSmall[0]?.data_url)
        }
        setImageError(imageErrorSet)
    }, [imagesLarge, imagesMedium, imagesSmall])

    console.log(largeDimensionsData, mediumDimensionsData, smallDimensionsData, "__imagesLarge")

    const [accourding, setAccourding] = useState<any>({
        1: true,
        2: true,
        3: true,
    });

    const headingHtml = (heading: string, drop?: boolean, id?: any) => {
        if (drop) {
            return (
                <div className='flex items-center justify-between'><span>{heading}</span><div className='cursor-pointer' onClick={() => setAccourding((pre: any) => ({
                    ...pre,
                    [id]: !accourding[id]
                }))}>{accourding[id] ? <RiArrowDropRightLine className="rotate-90 text-3xl" /> : <RiArrowDropRightLine className="text-3xl" />}</div></div>
            )
        }
        return (
            heading
        )
    }

    const [image, setImage] = useState("")
    const [currentPage, setCurrentPage] = useState("choose-img")
    const [currentImageSize, setCurrentImageSize] = useState("")
    const [activeCroppers, setActiveCroppers] = useState({
        large: false,
        medium: false,
        small: false,
    });
    const [imgAfterCrop, setImgAfterCrop] = useState("")
    const [isHovered, setIsHovered] = useState(false);
    const [croppedImgSize, setCroppedImgSize] = useState({ width: 0, height: 0 });
    const [ShowCropiingModal, setShowCropiingModal] = useState(false)
    const [ShowCropiingMediumModal, setShowCropiingMediumModal] = useState(false)
    const [ShowCropiingSmallModal, setShowCropiingSmallModal] = useState(false)


    const [croppedImgSizeLarge, setCroppedImgSizeLarge] = useState({ width: 0, height: 0 });
    const [croppedImgSizeMedium, setCroppedImgSizeMedium] = useState({ width: 0, height: 0 });
    const [croppedImgSizeSmall, setCroppedImgSizeSmall] = useState({ width: 0, height: 0 });

    const [imgAfterCropLarge, setImgAfterCropLarge] = useState("");
    const [imgAfterCropMedium, setImgAfterCropMedium] = useState("");
    const [imgAfterCropSmall, setImgAfterCropSmall] = useState("");

    const [imgAfterCropPrevLarge, setImgAfterCropPrevLarge] = useState(false);
    const [imgAfterCropPrevMedium, setImgAfterCropPrevMedium] = useState(false);
    const [imgAfterCropPrevSmall, setImgAfterCropPrevSmall] = useState(false);

    const [showCropperLarge, setShowCropperLarge] = useState(false);
    const [showCropperMedium, setShowCropperMedium] = useState(false);
    const [showCropperSmall, setShowCropperSmall] = useState(false);

    const [showCropImagepreview, setShowCropImagePrev] = useState(false)
    console.log(imgAfterCropLarge, imagesLarge, "5df4g65fd1gdf5")

    // const onImageSelected = (imageData, cardType) => {
    //     if (cardType === 'large') {
    //         setImage(imageData)
    //         setImagesLarge(imageData);
    //         setShowCropperLarge(true);
    //     } else if (cardType === 'medium') {
    //         setImage(imageData)
    //         setImagesMedium(imageData);
    //         setShowCropperMedium(true);
    //     } else if (cardType === 'small') {
    //         setImage(imageData)
    //         setImagesSmall(imageData);
    //         setShowCropperSmall(true);
    //     }
    //     setCurrentPage("crop-img");
    // };

    const onImageSelected = (imageData, cardType) => {
        setImage(imageData);
        console.log(cardType, "d1fg54dgf")
        // Reset all states first
        setShowCropperLarge(false);
        setShowCropperMedium(false);
        setShowCropperSmall(false);

        setShowCropiingModal(false);
        setShowCropiingMediumModal(false);
        setShowCropiingSmallModal(false);

        setActiveCroppers((prev) => ({
            ...prev,
            [cardType]: true,
        }));

        // Open only the selected cropper
        if (cardType === 'large') {
            setImagesLarge(imageData);
            setShowCropperLarge(true);
            setShowCropiingModal(true);
            setCurrentImageSize("large")
        } else if (cardType === 'medium') {
            setImagesMedium(imageData);
            setShowCropperMedium(true);
            setShowCropiingMediumModal(true);
            setCurrentImageSize("medium")
        } else if (cardType === 'small') {
            setImagesSmall(imageData);
            setShowCropperSmall(true);
            setShowCropiingSmallModal(true);
            setCurrentImageSize("small")
        }
        setCurrentPage("crop-img");
        // setCurrentImageSize("")
    };

    const onCropDone = (imgCroppedArea, finalSize, cardType) => {
        const canvasEle = document.createElement("canvas");
        canvasEle.width = finalSize.width;
        canvasEle.height = finalSize.height;

        const context = canvasEle.getContext("2d");
        let imageObj1 = new Image();
        let imgSource;

        // Reset states
        setShowCropiingModal(false);
        setShowCropiingMediumModal(false);
        setShowCropiingSmallModal(false);
        setShowCropImagePrev(true)
        if (cardType === "large") {
            imgSource = imagesLarge;
            setImgAfterCropPrevLarge(true);
            setShowCropiingModal(true);
        } else if (cardType === "medium") {
            imgSource = imagesMedium;
            setImgAfterCropPrevMedium(true);
            setShowCropiingMediumModal(true);
        } else if (cardType === "small") {
            imgSource = imagesSmall;
            setImgAfterCropPrevSmall(true);
            setShowCropiingSmallModal(true);
        }

        imageObj1.src = imgSource;

        imageObj1.onload = function () {
            context.drawImage(
                imageObj1,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                finalSize.width,
                finalSize.height
            );

            const dataURL = canvasEle.toDataURL("image/jpeg");
            let croppedImage = new Image();
            croppedImage.src = dataURL;

            croppedImage.onload = function () {
                if (cardType === "large") {
                    setCroppedImgSizeLarge({ width: croppedImage.width, height: croppedImage.height });
                    setImgAfterCropLarge(dataURL);
                } else if (cardType === "medium") {
                    setCroppedImgSizeMedium({ width: croppedImage.width, height: croppedImage.height });
                    setImgAfterCropMedium(dataURL);
                } else if (cardType === "small") {
                    setCroppedImgSizeSmall({ width: croppedImage.width, height: croppedImage.height });
                    setImgAfterCropSmall(dataURL);
                }
                setCurrentPage("img-cropped");
            };
        };
    };

    const onCropCancel = (cardType: string) => {
        switch (cardType) {
            case 'large':
                setImagesLarge(imagesCancelLarge);
                setShowCropperLarge(false);
                setImgAfterCropLarge("")
                break;
            case 'medium':
                setImagesMedium(imagesCancelMedium);
                setShowCropperMedium(false);
                setImgAfterCropMedium("")
                break;
            case 'small':
                setImagesSmall(imagesCancelSmall);
                setShowCropperSmall(false);
                setImgAfterCropSmall("")
                break;
            default:
                console.warn("Invalid cardType:", cardType);
        }
        setCurrentPage("choose-img");
    };


    // const updateNewBanner = async () => {
    //     console.log(imgAfterCropLarge, imgAfterCropMedium, imgAfterCropSmall, croppedImgSizeLarge, croppedImgSizeMedium, croppedImgSizeSmall, "Image Data");
    //     try {
    //         let formData = new FormData();

    //         // Check if each image size exists and append to FormData
    //         // Large Image Check
    //         if (imgAfterCropLarge && croppedImgSizeLarge?.width === 1920 && croppedImgSizeLarge?.height === 600) {
    //             const imageDataLarge = imgAfterCropLarge.split(",")[1];
    //             formData.append("large_image_device", imageDataLarge);
    //         }

    //         // Medium Image Check
    //         if (imgAfterCropMedium && croppedImgSizeMedium?.width === 991 && croppedImgSizeMedium?.height === 309) {
    //             const imageDataMedium = imgAfterCropMedium.split(",")[1];
    //             formData.append("medium_image_device", imageDataMedium);
    //         }

    //         // Small Image Check
    //         if (imgAfterCropSmall && croppedImgSizeSmall?.width === 576 && croppedImgSizeSmall?.height === 180) {
    //             const imageDataSmall = imgAfterCropSmall.split(",")[1];
    //             formData.append("small_image_device", imageDataSmall);
    //         }
    //         // alert("hello")

    //         // Ensure `selectedId` is defined before proceeding with API call
    //         // if (!selectedId) {
    //         //     console.log("Skipping API call: selectedId is undefined.");
    //         //     return;
    //         // }
    //         if (selectedId) {
    //             formData.append("best_seller_banner_id", selectedId);
    //         }

    //         // Ensure at least one valid image exists before triggering the API
    //         if (formData.has("large_image_device") || formData.has("medium_image_device") || formData.has("small_image_device")) {
    //             const { data } = await axios.post(update_seller_banner_image, formData);
    //             if (data?.success) {
    //                 // Trigger actions after successful update (fetch banners and product views)
    //                 getBanner();
    //                 getTotalProductsView();
    //                 setShowCropperLarge(false)
    //                 setShowCropperMedium(false)
    //                 setShowCropperSmall(false)
    //                 setShowCropiingModal(false)
    //                 setCurrentPage("choose-img")
    //                 setShowCropImagePrev(false)
    //             }
    //         }
    //     } catch (error) {
    //         // Handle API call errors gracefully
    //         _ERROR(error?.response?.data?.message || "Something went wrong, try again later.");
    //     }
    // };


    // const updateNewBanner = async () => {
    //     console.log(imgAfterCrop, croppedImgSize, "54jhkghj1h");
    //     // return
    //     try {
    //         let formData = new FormData();

    //         if (imgAfterCrop && croppedImgSize?.width === 1920 && croppedImgSize?.height === 600) {
    //             const imageData = imgAfterCrop.split(",")[1];
    //             formData.append("large_image_device", imageData);
    //         }
    //         if (imgAfterCrop && croppedImgSize?.width === 991 && croppedImgSize?.height === 309) {
    //             const imageData = imgAfterCrop.split(",")[1];
    //             formData.append("medium_image_device", imageData);
    //         }
    //         if (imgAfterCrop && croppedImgSize?.width === 576 && croppedImgSize?.height === 180) {
    //             const imageData = imgAfterCrop.split(",")[1];
    //             formData.append("small_image_device", imageData);
    //         }

    //         if (!selectedId) {
    //             console.log("Skipping API call: selectedId is undefined.");
    //             return;
    //         }

    //         formData.append("best_seller_banner_id", selectedId);

    //         // Ensure at least one valid image exists before triggering API
    //         if (formData.has("large_image_device") || formData.has("medium_image_device") || formData.has("small_image_device")) {
    //             const { data } = await axios.post(update_seller_banner_image, formData);
    //             if (data?.success) {
    //                 getBanner();
    //                 getTotalProductsView();
    //             }
    //         }
    //     } catch (error) {
    //         _ERROR(error?.response?.data?.message || "Something went wrong, try again later.");
    //     }
    // };

    const updateNewBanner = async (id: string) => {
        console.log(
            imgAfterCropLarge,
            imgAfterCropMedium,
            imgAfterCropSmall,
            croppedImgSizeLarge,
            croppedImgSizeMedium,
            croppedImgSizeSmall,
            "Image Data"
        );

        try {
            let formData = new FormData();

            // Convert Base64 to Blob/File function
            const base64ToFile = (base64: string, fileName: string) => {
                const byteCharacters = atob(base64.split(",")[1]); // Decode Base64
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/webp" }); // Set MIME type
                return new File([blob], fileName, { type: "image/webp" });
            };

            // Large Image Check
            if (imgAfterCropLarge && croppedImgSizeLarge?.width === 1920 && croppedImgSizeLarge?.height === 600) {
                const largeFile = base64ToFile(imgAfterCropLarge, "large_image.webp");
                formData.append("large_image_device", largeFile);
            }

            // Medium Image Check
            if (imgAfterCropMedium && croppedImgSizeMedium?.width === 991 && croppedImgSizeMedium?.height === 309) {
                const mediumFile = base64ToFile(imgAfterCropMedium, "medium_image.webp");
                formData.append("medium_image_device", mediumFile);
            }

            // Small Image Check
            if (imgAfterCropSmall && croppedImgSizeSmall?.width === 576 && croppedImgSizeSmall?.height === 180) {
                const smallFile = base64ToFile(imgAfterCropSmall, "small_image.webp");
                formData.append("small_image_device", smallFile);
            }

            // Ensure `selectedId` is defined before proceeding
            formData.append("best_seller_banner_id", id);
            // if (selectedId) {
            // }

            // Ensure at least one valid image exists before triggering the API
            if (formData.has("large_image_device") || formData.has("medium_image_device") || formData.has("small_image_device")) {
                const { data } = await axios.post(update_seller_banner_image, formData);
                if (data?.success) {
                    getBanner();
                    getTotalProductsView();
                    setShowCropperLarge(false);
                    setShowCropperMedium(false);
                    setShowCropperSmall(false);
                    setShowCropiingModal(false);
                    setCurrentPage("choose-img");
                    setShowCropImagePrev(false);
                }
            }
        } catch (error) {
            _ERROR(error?.response?.data?.message || "Something went wrong, try again later.");
        }
    };



    const imageRepeter = () => {
        return (
            <div className='flex flex-col gap-4'>

                <div className='w-full flex items-center justify-end gap-4 mt-4'>
                    <PinkPawsbutton variant='outlined' name={"close"} handleClick={() => { cancelUpdateImage() }} />
                    <PinkPawsbutton name={selectedId ? "Update" : "Save"} handleClick={() => { selectedId ? updateBannerData() : createBanner() }} />
                </div>

                {/* <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-sm font-medium'>Title <span style={{ color: "red" }}>*</span></p>
                        <TextField
                            className={`w-full ${field_text_Cls}`}
                            textFieldRoot='w-[400px]'
                            name='title'
                            handelState={(e: any) => setTitle(e.target.value)}
                            value={title}
                        />
                        {titleError ? <p className='text-xs text-red-500'>{titleError}</p> : null}
                    </div>

                    <div>

                        <p className='text-sm font-medium'>Link <span className='text-gray-400 font-semibold text-sm'>(optional)</span></p>
                        <TextField
                            className={`w-full ${field_text_Cls}`}
                            textFieldRoot='w-full'
                            name='title'
                            handelState={(e: any) => setTitle(e.target.value)}
                            value={title}
                        />
                        {titleError ? <p className='text-xs text-red-500'>{titleError}</p> : null}
                    </div>

                    <div>

                        <p className='text-sm font-medium'>Title <span style={{ color: "red" }}>*</span></p>
                        <TextField
                            className={`w-full ${field_text_Cls}`}
                            textFieldRoot='w-full'
                            name='title'
                            handelState={(e: any) => setTitle(e.target.value)}
                            value={title}
                        />
                        {titleError ? <p className='text-xs text-red-500'>{titleError}</p> : null}
                    </div>
                </div> */}
                <div className="flex flex-wrap gap-4 justify-between">
                    <div className="w-full sm:w-[400px]">
                        <p className="text-sm font-medium">Title <span style={{ color: "red" }}>*</span></p>
                        <TextField
                            className={`w-full ${field_text_Cls}`}
                            textFieldRoot="w-full"
                            name="title"
                            handelState={(e: any) => setTitle(e.target.value)}
                            value={title}
                        />
                        {titleError && <p className="text-xs text-red-500">{titleError}</p>}
                    </div>

                    <div className="w-full sm:w-[400px]">
                        <p className="text-sm font-medium">Section <span style={{ color: "red" }}>*</span></p>
                        <select
                            className={`w-full ${field_text_Cls} border border-gray-300 rounded-md py-2 px-3`}
                            name="section"
                            onChange={(e: any) => setSection(e.target.value)}
                            value={section}
                        >
                            <option value="">Select Section</option>
                            <option value="section1">Section 1</option>
                            <option value="section2">Section 2</option>
                        </select>
                        {sectionError && <p className="text-xs text-red-500">{sectionError}</p>}
                    </div>

                    <div className="w-full sm:w-[400px]">
                        <p className="text-sm font-medium">Link <span className='text-gray-400 font-semibold text-sm'>(optional)</span></p>
                        <TextField
                            className={`w-full ${field_text_Cls}`}
                            textFieldRoot="w-full"
                            name="bannerLink"
                            handelState={(e: any) => setBannerLink(e.target.value)}
                            value={bannerLink}
                        />
                    </div>


                </div>


                <div className='flex w-full flex-col items-start'>
                    <p className='text-sm font-medium'>Description</p>
                    <TextAreaField
                        textareaRoot={"w-full"}
                        className={`!w-full h-40 p-1 ${field_text_Cls}`}
                        name='description'
                        handelState={(e: any) => setDescription(e.target.value)}
                        value={description}
                    />
                </div>
                {/* 
                <SimpleCard heading={headingHtml("Home Banner Large devices (1920px*600px)", true, 1)} childrenClassName='flex flex-col gap-4'>
                    {accourding[1] && (
                        ShowCropiingModal ? (
                            <>
                                <div
                                    style={{
                                        width: "900px",
                                        height: "300px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "auto",
                                        borderRadius: "10px",
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                        margin: "10px auto",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <img
                                        src={imagesLarge}
                                        alt="cropped-image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>
                                {!showCropperLarge && <ImageFileInput
                                    // onImageSelected={onImageSelected}
                                    onImageSelected={(image) => onImageSelected(image, 'large')}
                                    btnValue="Update Image" />}

                                {showCropperLarge && <div className="flex gap-2 items-center justify-center">
                                    <Button
                                        variant="contained"
                                        className="btn"
                                        onClick={() => updateNewBanner()}
                                    >
                                        Crop
                                    </Button>

                                    <Button
                                        variant="contained"
                                        className="btn"
                                        onClick={() => {
                                            setCurrentPage("choose-img");
                                            setImage("");
                                        }}
                                    >
                                        New Image
                                    </Button>
                                </div>}
                                {showCropperLarge && ShowCropiingSmallModal && ShowCropiingMediumModal && currentPage === "crop-img" && accourding[1] && (
                                    <ImageCropper
                                        imgSize="large"
                                        imgDimension="3.2"
                                        image={image}
                                        // onCropDone={onCropDone}
                                        // onCropCancel={onCropCancel}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'large')}
                                        onCropCancel={() => onCropCancel('large')}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="container">
                                {currentPage === "choose-img" ? (
                                    <ImageFileInput
                                        // onImageSelected={onImageSelected}
                                        onImageSelected={(image) => onImageSelected(image, 'large')}
                                        btnValue="" />
                                ) : showCropperLarge && currentPage === "crop-img" && accourding[1] ? (
                                    <ImageCropper
                                        imgSize="large"
                                        imgDimension="3.2"
                                        image={image}
                                        // onCropDone={onCropDone}
                                        // onCropCancel={onCropCancel}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'large')}
                                        onCropCancel={() => onCropCancel('large')}
                                    />
                                ) : (
                                    ""
                                )}
                                {imgAfterCropPrevLarge &&
                                    <div>
                                        <div
                                            style={{
                                                width: "900px",
                                                height: "300px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                overflow: "auto",
                                                borderRadius: "10px",
                                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                                margin: "20px auto",
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            <img
                                                src={imagesLarge}
                                                alt="cropped-image"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        </div>

                                        <div className="flex gap-2 items-center justify-center">
                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={() => updateNewBanner()}
                                            >
                                                Crop
                                            </Button>

                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={() => {
                                                    setCurrentPage("choose-img");
                                                    setImage("");
                                                }}
                                            >
                                                New Image
                                            </Button>
                                        </div>
                                    </div>}
                            </div>
                        )
                    )}
                </SimpleCard>

                <SimpleCard heading={headingHtml("Home Banner Medium devices (991px*309px)", true, 2)} childrenClassName='flex flex-col gap-4'>
                    {accourding[2] && (
                        ShowCropiingMediumModal ? (
                            <>
                                <div
                                    style={{
                                        width: "900px",
                                        height: "300px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "auto",
                                        borderRadius: "10px",
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                        margin: "10px auto",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <img
                                        src={imagesMedium}
                                        alt="cropped-image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>
                                {!showCropperMedium && <ImageFileInput
                                    // onImageSelected={onImageSelected}
                                    onImageSelected={(image) => onImageSelected(image, 'medium')}
                                    btnValue="Update Image" />}

                                {showCropperMedium && <div className="flex gap-2 items-center justify-center">
                                    <Button
                                        variant="contained"
                                        className="btn"
                                        onClick={() => updateNewBanner()}
                                    >
                                        Crop
                                    </Button>

                                    <Button
                                        variant="contained"
                                        className="btn"
                                        onClick={() => {
                                            setCurrentPage("choose-img");
                                            setImage("");
                                        }}
                                    >
                                        New Image
                                    </Button>
                                </div>}

                                {showCropperMedium && ShowCropiingModal && ShowCropiingSmallModal && currentPage === "crop-img" && (
                                    <ImageCropper
                                        imgSize="medium"
                                        imgDimension="3.1"
                                        image={image}
                                        // onCropDone={onCropDone}
                                        // onCropCancel={onCropCancel}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'medium')}
                                        onCropCancel={() => onCropCancel('medium')}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="container">
                                {imgAfterCropPrevMedium && currentPage === "choose-img" ? (
                                    <ImageFileInput
                                        // onImageSelected={onImageSelected}
                                        onImageSelected={(image) => onImageSelected(image, 'medium')}
                                        btnValue="" />
                                ) : showCropperMedium && currentPage === "crop-img" ? (
                                    <ImageCropper
                                        imgSize="medium"
                                        imgDimension="3.1"
                                        image={image}
                                        // onCropDone={onCropDone}
                                        // onCropCancel={onCropCancel}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'medium')}
                                        onCropCancel={() => onCropCancel('medium')}
                                    />
                                ) : (
                                    ""
                                )}

                                    {!imgAfterCropPrevMedium || !showCropperMedium
                                        ?
                                        <ImageFileInput
                                    // onImageSelected={onImageSelected}
                                    onImageSelected={(image) => onImageSelected(image, 'medium')}
                                            btnValue="" />
                                        :
                                    <div>
                                        <div
                                            style={{
                                                width: "900px",
                                                height: "300px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                overflow: "auto",
                                                borderRadius: "10px",
                                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                                margin: "20px auto",
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            <img
                                                src={imagesMedium}
                                                alt="cropped-image"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        </div>

                                        <div className="flex gap-2 items-center justify-center">
                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={() => updateNewBanner()}
                                            >
                                                Crop
                                            </Button>

                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={() => {
                                                    setCurrentPage("choose-img");
                                                    setImage("");
                                                }}
                                            >
                                                New Image
                                            </Button>
                                        </div>
                                    </div>}
                            </div>
                        )
                    )}
                </SimpleCard>

                <SimpleCard heading={headingHtml("Home Banner Small devices (576px*180px)", true, 3)} childrenClassName='flex flex-col gap-4'>
                    {accourding[3] && (
                        ShowCropiingSmallModal ? (
                            <>
                                <div
                                    style={{
                                        width: "900px",
                                        height: "300px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "auto",
                                        borderRadius: "10px",
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                        margin: "10px auto",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <img
                                        src={imagesSmall}
                                        alt="cropped-image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>
                                {!showCropperSmall && <ImageFileInput
                                    // onImageSelected={onImageSelected}
                                    onImageSelected={(image) => onImageSelected(image, 'small')}
                                    btnValue="Update Image" />}

                                {showCropperSmall && <div className="flex gap-2 items-center justify-center">
                                    <Button
                                        variant="contained"
                                        className="btn"
                                        onClick={() => updateNewBanner()}
                                    >
                                        Crop
                                    </Button>

                                    <Button
                                        variant="contained"
                                        className="btn"
                                        onClick={() => {
                                            setCurrentPage("choose-img");
                                            setImage("");
                                        }}
                                    >
                                        New Image
                                    </Button>
                                </div>}

                                {showCropperSmall && ShowCropiingModal && ShowCropiingMediumModal && currentPage === "crop-img" && (
                                    <ImageCropper
                                        imgSize="small"
                                        imgDimension="3.0"
                                        image={image}
                                        // onCropDone={onCropDone}
                                        // onCropCancel={onCropCancel}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'small')}
                                        onCropCancel={() => onCropCancel('small')}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="container">
                                {imgAfterCropPrevSmall && currentPage === "choose-img" ? (
                                    <ImageFileInput
                                        // onImageSelected={onImageSelected}
                                        onImageSelected={(image) => onImageSelected(image, 'small')}
                                        btnValue="" />
                                ) : showCropperSmall && currentPage === "crop-img" ? (
                                    <ImageCropper
                                        imgSize="small"
                                        imgDimension="3.0"
                                        image={image}
                                        // onCropDone={onCropDone}
                                        // onCropCancel={onCropCancel}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'small')}
                                        onCropCancel={() => onCropCancel('small')}
                                    />
                                ) : (""
                                )}
                                {!imgAfterCropPrevSmall ? (<ImageFileInput
                                    // onImageSelected={onImageSelected}
                                    onImageSelected={(image) => onImageSelected(image, 'medium')}
                                    btnValue="" />
                                ) : (
                                    <div>
                                        <div
                                            style={{
                                                width: "900px",
                                                height: "300px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                overflow: "auto",
                                                borderRadius: "10px",
                                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                                margin: "20px auto",
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            <img
                                                src={imagesSmall}
                                                alt="cropped-image"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        </div>

                                        <div className="flex gap-2 items-center justify-center">
                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={() => updateNewBanner()}
                                            >
                                                Crop
                                            </Button>

                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={() => {
                                                    setCurrentPage("choose-img");
                                                    setImage("");
                                                }}
                                            >
                                                New Image
                                            </Button>
                                        </div>
                                    </div>)}
                            </div>
                        )
                    )}
                </SimpleCard> */}

                <SimpleCard heading={headingHtml("Home Banner Large devices (1920px*600px)", true, 1)} childrenClassName='flex flex-col gap-4'>
                    {accourding[1] && (
                        ShowCropiingModal && showCropperLarge ? (
                            <>
                                {/* Large Image Cropping Preview */}
                                {(showCropImagepreview && currentPage !== "crop-img") && <div style={{
                                    width: "900px",
                                    height: "300px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "auto",
                                    borderRadius: "10px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                    margin: "10px auto",
                                    backgroundColor: "#fff",
                                }}>
                                    <img
                                        src={imgAfterCropLarge}
                                        alt="cropped-image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>}

                                {!showCropperLarge && (
                                    <ImageFileInput onImageSelected={(image) => onImageSelected(image, 'large')} btnValue="Update Image" />
                                )}

                                {(showCropImagepreview && currentPage !== "crop-img") && (
                                    <div className="flex gap-2 items-center justify-center">
                                        <Button variant="contained" className="btn" onClick={() => {
                                            setCurrentPage("crop-img");
                                        }}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid #64748B",
                                                color: "#64748B",
                                                fontWeight: "bold",
                                                padding: "6px 15px",
                                                fontSize: "16px",
                                                textTransform: "uppercase",
                                                borderRadius: "8px",
                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                                transition: "all 0.3s ease",
                                                cursor: "pointer",
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = "#64748B";
                                                e.currentTarget.style.color = "#fff";
                                                e.currentTarget.style.border = "none";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#64748B";
                                                e.currentTarget.style.border = "1px solid #64748B";
                                            }}
                                        >
                                            Change Image
                                        </Button>
                                    </div>
                                )}

                                {/* Large Image Cropper Component */}
                                {showCropperLarge && ShowCropiingModal && currentPage === "crop-img" && accourding[1] && (
                                    <ImageCropper
                                        imgSize="large"
                                        imgDimension="3.2"
                                        image={image}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'large')}
                                        onCropCancel={() => onCropCancel('large')}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="container">
                                {imagesLarge !== undefined ? (
                                    <div>
                                        <div style={{
                                            width: "900px",
                                            height: "300px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            overflow: "auto",
                                            borderRadius: "10px",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                            margin: "20px auto",
                                            backgroundColor: "#fff",
                                        }}>
                                            <img src={imgAfterCropLarge ? imgAfterCropLarge : imagesLarge} alt="cropped-image" style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }} />
                                        </div>

                                        {imagesLarge ?
                                            <ImageFileInput onImageSelected={(image) => onImageSelected(image, "large")} btnValue="Update Image" />
                                            : <div className="flex gap-2 items-center justify-center">
                                                <Button variant="contained" className="btn"
                                                >
                                                    Crop
                                                </Button>
                                                <Button variant="contained" className="btn" onClick={() => {
                                                    setCurrentPage("choose-img");
                                                    setImage("");
                                                }}>
                                                    New Image
                                                </Button>
                                            </div>}
                                    </div>
                                ) :
                                    <ImageFileInput onImageSelected={(image) => onImageSelected(image, "large")} btnValue="Upload Image" />
                                }
                            </div>
                        )
                    )}
                </SimpleCard>

                <SimpleCard heading={headingHtml("Home Banner Medium devices (991px*309px)", true, 2)} childrenClassName='flex flex-col gap-4'>
                    {accourding[2] && (
                        ShowCropiingMediumModal && showCropperMedium ? (
                            <>
                                {(showCropImagepreview && currentPage !== "crop-img") && <div style={{
                                    width: "900px",
                                    height: "300px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "auto",
                                    borderRadius: "10px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                    margin: "10px auto",
                                    backgroundColor: "#fff",
                                }}>
                                    <img
                                        src={imgAfterCropMedium}
                                        alt="cropped-image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>}

                                {!showCropperMedium && (
                                    <ImageFileInput onImageSelected={(image) => onImageSelected(image, 'medium')} btnValue="Update Image" />
                                )}

                                {(showCropImagepreview && currentPage !== "crop-img") && (
                                    <div className="flex gap-2 items-center justify-center">
                                        <Button variant="contained" className="btn" onClick={() => {
                                            setCurrentPage("crop-img");
                                        }}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid #64748B",
                                                color: "#64748B",
                                                fontWeight: "bold",
                                                padding: "6px 15px",
                                                fontSize: "16px",
                                                textTransform: "uppercase",
                                                borderRadius: "8px",
                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                                transition: "all 0.3s ease",
                                                cursor: "pointer",
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = "#64748B";
                                                e.currentTarget.style.color = "#fff";
                                                e.currentTarget.style.border = "none";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#64748B";
                                                e.currentTarget.style.border = "1px solid #64748B";
                                            }}
                                        >
                                            Change Image
                                        </Button>
                                    </div>
                                )}

                                {/* Medium Image Cropper Component */}
                                {showCropperMedium && ShowCropiingMediumModal && currentPage === "crop-img" && accourding[2] && (
                                    <ImageCropper
                                        imgSize="medium"
                                        imgDimension="3.1"
                                        image={image}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'medium')}
                                        onCropCancel={() => onCropCancel('medium')}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="container">
                                {imagesMedium !== undefined ? (
                                    <div>
                                        <div style={{
                                            width: "900px",
                                            height: "300px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            overflow: "auto",
                                            borderRadius: "10px",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                            margin: "20px auto",
                                            backgroundColor: "#fff",
                                        }}>
                                            <img src={imgAfterCropMedium ? imgAfterCropMedium : imagesMedium} alt="cropped-image" style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }} />
                                        </div>

                                        {imagesMedium ? <ImageFileInput onImageSelected={(image) => onImageSelected(image, "medium")} btnValue="Update Image" /> :
                                            <div className="flex gap-2 items-center justify-center">
                                                <Button variant="contained" className="btn"
                                                >
                                                    Crop
                                                </Button>
                                                <Button variant="contained" className="btn" onClick={() => {
                                                    setCurrentPage("choose-img");
                                                    setImage("");
                                                }}>
                                                    New Image
                                                </Button>
                                            </div>}
                                    </div>
                                ) :
                                    <ImageFileInput onImageSelected={(image) => onImageSelected(image, "medium")} btnValue="Upload Image" />
                                }
                            </div>
                        )
                    )}
                </SimpleCard>

                <SimpleCard heading={headingHtml("Home Banner Small devices (576px*180px)", true, 3)} childrenClassName='flex flex-col gap-4'>
                    {accourding[3] && (
                        ShowCropiingSmallModal && showCropperSmall ? (
                            <>
                                {/* Small Image Cropping Preview */}
                                {(showCropImagepreview && currentPage !== "crop-img") && <div style={{
                                    width: "900px",
                                    height: "300px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "auto",
                                    borderRadius: "10px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                    margin: "10px auto",
                                    backgroundColor: "#fff",
                                }}>
                                    <img
                                        src={imgAfterCropSmall}
                                        alt="cropped-image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>}

                                {!showCropperSmall && (
                                    <ImageFileInput onImageSelected={(image) => onImageSelected(image, 'small')} btnValue="Update Image" />
                                )}

                                {(showCropImagepreview && currentPage !== "crop-img") && (
                                    <div className="flex gap-2 items-center justify-center">
                                        <Button variant="contained" className="btn" onClick={() => {
                                            setCurrentPage("crop-img");
                                        }}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid #64748B",
                                                color: "#64748B",
                                                fontWeight: "bold",
                                                padding: "6px 15px",
                                                fontSize: "16px",
                                                textTransform: "uppercase",
                                                borderRadius: "8px",
                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                                transition: "all 0.3s ease",
                                                cursor: "pointer",
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = "#64748B";
                                                e.currentTarget.style.color = "#fff";
                                                e.currentTarget.style.border = "none";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#64748B";
                                                e.currentTarget.style.border = "1px solid #64748B";
                                            }}
                                        >
                                            Change Image
                                        </Button>
                                    </div>
                                )}

                                {/* Small Image Cropper Component */}
                                {showCropperSmall && ShowCropiingSmallModal && currentPage === "crop-img" && accourding[3] && (
                                    <ImageCropper
                                        imgSize="small"
                                        imgDimension="3.0"
                                        image={image}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, 'small')}
                                        onCropCancel={() => onCropCancel('small')}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="container">
                                {activeCroppers.small && showCropperSmall && currentPage === "crop-img" && accourding[3] && (
                                    <ImageCropper
                                        imgSize="small"
                                        imgDimension="3.0"
                                        image={image}
                                        onCropDone={(croppedArea, finalSize) => onCropDone(croppedArea, finalSize, "small")}
                                        onCropCancel={() => setActiveCroppers((prev) => ({ ...prev, small: false }))}
                                    />
                                )}

                                {imagesSmall !== undefined ? (
                                    <div>
                                        <div style={{
                                            width: "900px",
                                            height: "300px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            overflow: "auto",
                                            borderRadius: "10px",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                            margin: "20px auto",
                                            backgroundColor: "#fff",
                                        }}>
                                            <img src={imgAfterCropSmall ? imgAfterCropSmall : imagesSmall} alt="cropped-image" style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }} />
                                        </div>

                                        {imagesSmall ? <ImageFileInput onImageSelected={(image) => onImageSelected(image, "small")} btnValue="Update Image" /> :
                                            <div className="flex gap-2 items-center justify-center">
                                                <Button variant="contained" className="btn"
                                                >
                                                    Crop
                                                </Button>
                                                <Button variant="contained" className="btn" onClick={() => {
                                                    setCurrentPage("choose-img");
                                                    setImage("");
                                                }}>
                                                    New Image
                                                </Button>
                                            </div>}
                                    </div>
                                ) :
                                    <ImageFileInput onImageSelected={(image) => onImageSelected(image, "small")} btnValue="Upload Image" />
                                }
                            </div>
                        )
                    )}
                </SimpleCard>

                <div className='w-full flex items-center justify-end gap-4 mt-4'>
                    <PinkPawsbutton variant='outlined' name='close' handleClick={() => { cancelUpdateImage() }} />
                    <PinkPawsbutton name={selectedId ? "Update" : "Save"} handleClick={() => { selectedId ? updateBannerData() : createBanner() }} />
                </div>

            </div>
        )
    }

    console.log(dataList, selectedId, title, "___images")
    console.log(getStatus, "getStatus")
    console.log(totalProductsView, "totalProductsView")

    return (
        <>

            {!updateImageState ?
                <>

                    <div className='flex flex-col gap-2 pb-4'>
                        <div className='flex flex-wrap gap-2 items-center justify-between'>
                            <SearchAndAddNewComponent buttonTxt={'Search'} addNewProduct={updateImage} name={'Add new'} res={searchRes} />
                        </div>
                        <div className='flex flex-wrap gap-2 items-center justify-between'>
                            <div className='flex flex-wrap gap-4'>
                                <ActionDrop
                                    btnValue="Apply"
                                    handleChange={handleChangeAction}
                                    menuItemArray={actionArray}
                                    value={actionValue}
                                    handleClick={() => setConfirmMultipleStatus("mulDelete")}
                                    disabled={checked.length ? false : true}
                                />

                            </div>
                            <Pageination
                                items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
                                value={pageNo}
                                totalpageNo={getTotalPage()}
                                handleClickFirst={() => setPageNo(1)}
                                handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : (pageNo - 1))}
                                handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                                disabledMid={true}
                                handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                                handleClickLast={() => setPageNo(getTotalPage())}
                            />
                        </div>
                    </div>

                    <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-slate-200 hover:!bg-slate-200'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === dataList?.length ? true : false} />
                                </TableCell>

                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Section</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataList?.map((row: any, index: number) => {
                                return (
                                    <StyledTableRow
                                        hover
                                        key={index}
                                        sx={{ cursor: 'pointer' }}

                                    >
                                        <StyledTableCell className='!w-[5%]' padding="checkbox">
                                            <Checkbox
                                                checked={checked.includes(row?.id)}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='w-[20%]' onClick={() => { updateImage(row) }}>
                                            <img
                                                src={row?.large_image_device ? row?.large_image_device : "/assets/images/product.png"}
                                                alt='productImage'
                                                width={row?.large_image_device ? 192 : 122}
                                                height={row?.large_image_device ? 108 : 38}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='w-[20%]' onClick={() => { updateImage(row) }}>
                                            {row?.title || "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='w-[10%]' onClick={() => { updateImage(row) }}>
                                            {row?.section || "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='w-[20%]' onClick={() => { updateImage(row) }}>
                                            {row?.description || "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='w-[10%]' onClick={() => { updateImage(row) }}>
                                            {moment(row?.created_at).format("MMMM DD YYYY")}
                                        </StyledTableCell>
                                        <StyledTableCell className='w-[15%]'>
                                            <ActionDrop
                                                btnValue="Apply"
                                                handleChange={(e: any) => handleChangeStatus(row?.id, row?.title, row?.description, e.target.value)}
                                                menuItemArray={getStatus}
                                                value={getStatus.filter((v: any) => v?.id === row?.status?.id)[0]?.id}
                                                btn={true}
                                                needId={true}
                                                needtitle={true}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='w-[10%]'>
                                            <div className='flex items-center gap-2'>
                                                <EditIcon className='text-green-700' onClick={() => { updateImage(row) }} />
                                                <DeleteIcon className='text-red-500'
                                                    onClick={() => {
                                                        // delteBanner(row?.id) 
                                                        if (!checked.includes(row?.id)) {
                                                            _ERROR("Please select the checkbox before deleting.")
                                                        } else {
                                                            setConfirmStatus(row?.id);
                                                        }

                                                    }} />
                                            </div>
                                        </StyledTableCell>

                                    </StyledTableRow>
                                );
                            })
                            }
                        </TableBody>
                    </Table>

                    <div className='flex flex-wrap items-center justify-between pt-4'>
                        <ActionDrop
                            btnValue="Apply"
                            handleChange={handleChangeAction}
                            menuItemArray={actionArray}
                            value={actionValue}
                            handleClick={() => setConfirmMultipleStatus("mulDelete")}
                            disabled={checked.length ? false : true}
                        />

                        <Pageination
                            items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
                            value={pageNo}
                            totalpageNo={getTotalPage()}
                            handleClickFirst={() => setPageNo(1)}
                            handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : (pageNo - 1))}
                            handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                            disabledMid={true}
                            handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                            handleClickLast={() => setPageNo(getTotalPage())}
                        />
                    </div>
                </>
                :
                <div className='flex flex-col gap-4'>
                    {imageRepeter()}
                </div>}

            <Dialog
                open={confirmStatus !== ""}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className='w-80 h-40 p-4'>
                    <div className='bg-white flex flex-col justify-between h-full'>
                        <p className='flex flex-col items-center justify-center'>
                            <span>Do you want to delete this record?</span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { delteBanner(confirmStatus); }} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmStatus("") }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={confirmMultipleStatus !== ""}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className='w-80 h-40 p-4'>
                    <div className='bg-white flex flex-col justify-between h-full'>
                        <p className='flex flex-col items-center justify-center'>
                            <span>Do you want to delete this record?</span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { handleApply(); }} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmMultipleStatus("") }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Banner