import React, { useEffect, useState } from 'react'
import TextField from '../../components/TextField'
import SimpleCard from '../../components/SimpleCard'
import TextAreaField from '../../components/TextAreaField'
import { Button, Checkbox, Switch } from '@mui/material'
import getUrlWithKey from '../../util/_apiUrl'
import axios from 'axios'
import ImageUploader from '../../components/ImageUploader'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { _ERROR, _SUCCESS } from '../../util/_reactToast'
import { RiArrowDropRightLine } from 'react-icons/ri'
import CkEditor from '../../components/CkEditor'
import { isEmptyObject } from '../../util/_common'
import { _get, _post } from '../../services'

const Options = () => {

    const router = useRouter()

    const form_row_root = `flex md:flex-row flex-col items-center gap-4`
    const field_root_2 = `md:w-1/2 w-full`
    const field_root_3 = `md:w-1/3 w-full`
    const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded w-full`

    const { create_theam_options, read_theam_options, update_theam_options, update_theam_options_image } = getUrlWithKey("options");
    const { get_first, update, create } = getUrlWithKey("store_address");
    const { a_get_with_id, a_update, a_create } = getUrlWithKey("admin_setting");


    const [imageOpen, setImageOpen] = useState(false)
    const [images, setImages] = useState<any>([]);
    const [imageError, setImageError] = useState("");
    const [pageDescription, setPageDescription]: any = useState("");
    const [orderTemplateContent, setOrderTemplateContent]: any = useState("");
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [orderTemplateFieldsErrors, setOrderTemplateFieldsErrors] = useState<{ [x: string]: any }>(new Object());

    const initialvalue = {
        site_name: "",
        office_emial: "",
        office_phone: "",
        office_address: "",
        support_email: "",
        support_phone: "",
        support_days: "",
        support_time_start: "",
        support_time_end: "",
        warehouse_address: "",
        support_whatsapp: "",
        office_pan: ""
    }

    const initialvalueLinks = {
        links: [
            { facebook_link: "" },
            { twitter_link: "" },
            { instagram_link: "" },
            { linked_in_link: "" },
            { pinterest_link: "" },
        ],
    }

    // Define the initial state
    const initialOtpTemplateState = {
        send_notification: false,
        subject: "",
        content: "",
        id: ""
    };

    // Define the initial state
    const initialOrderTemplateState = {
        send_notification: false,
        subject: "",
        content: "",
        id: ""
    };

    // Define the initial state
    const initialState = {
        address_line_one: '',
        address_line_two: '',
        city: '',
        country: '',
        state: '',
        post_code: '',
        id: ''
    };

    const initialMetaInfo = {
        meta_title: "",
        meta_description: "",
        meta_keyword: "",
        id: ""
    }

    // Use useState hook to manage form state
    const [formState, setFormState] = useState(initialState);

    // Use useState hook to manage form state
    // const [formSmtpState, setFormSmtpState] = useState(initialSmtpState);
    const [formSmtpState, setFormSmtpState] = useState(null);

    // Use useState hook to manage form state
    const [formSMSState, setFormSMSState] = useState(null);

    // Use useState hook to manage form state
    const [formWhatsAppState, setFormWhatsAppState] = useState(null);

    // Use useState hook to manage form state for Meta information 
    const [formMetaInfoState, setFormMetaInfoState] = useState(initialMetaInfo);

    // Use useState hook to manage form state
    const [formOtpTemplateState, setFormOtpTemplateState] = useState(initialOtpTemplateState);
    const [formOrderTemplateState, setFormOrderTemplateState] = useState(initialOrderTemplateState);

    const [themesOptionsFromData, setThemesOptionsFromData]: any = useState(initialvalue)
    const [themesOptionsLinksFromData, setThemesOptionsLinksFromData]: any = useState(initialvalueLinks)

    // Handel Changes Functions
    const handleSmtpChange = (e: any) => {
        const { name, value } = e.target;
        setFormSmtpState({
            ...formSmtpState,
            [name]: value,
        });
    };

    const handleSMSChange = (e: any) => {
        const { name, value } = e.target;
        setFormSMSState({
            ...formSMSState,
            [name]: value,
        });
    };

    const handleWhatsAppChange = (e: any) => {
        const { name, value } = e.target;
        setFormWhatsAppState({
            ...formWhatsAppState,
            [name]: value,
        });
    };

    const handleMetaInfoChange = (e: any) => {
        const { name, value } = e.target;
        setFormMetaInfoState({
            ...formMetaInfoState,
            [name]: value,
        });
    };

    // const handleOTPEmailCheckbox = (e: any) => {
    //     const stateName = e.target.name;
    //     const stateValue = e.target.checked;

    //     setFormOtpTemplateState(pre => ({
    //         ...pre,
    //         [stateName]: stateValue
    //     }))

    //     clearValidation(stateName, "_OTPTEMPLATE");
    // }

    // const handleOrderEmailCheckbox = (e: any) => {
    //     const stateName = e.target.name;
    //     const stateValue = e.target.checked;

    //     setFormOrderTemplateState(pre => ({
    //         ...pre,
    //         [stateName]: stateValue
    //     }))

    //     clearValidation(stateName, "_ORDERTEMPLATE");
    // }

    // const handleOTPTemplateChange = (e: any) => {
    //     const { name, value } = e.target;
    //     setFormOtpTemplateState({
    //         ...formOtpTemplateState,
    //         [name]: value,
    //     });

    //     clearValidation(name, "_OTPTEMPLATE");
    // };

    // const handleOrderTemplateChange = (e: any) => {
    //     const { name, value } = e.target;
    //     setFormOrderTemplateState({
    //         ...formOrderTemplateState,
    //         [name]: value,
    //     });

    //     clearValidation(name, "_ORDERTEMPLATE");
    // };

    // const handleOTPTemplateContentChange = (e: any) => {
    //     setPageDescription(e);
    //     console.log('page:', pageDescription)
    //     clearValidation("content", "_OTPTEMPLATE");
    // };

    // const handleOrderTemplateContentChange = (e: any) => {
    //     setOrderTemplateContent(e);
    //     console.log('page:', orderTemplateContent)
    //     clearValidation("content", "_ORDERTEMPLATE");
    // };

    const handleSwitchChange = (e: any) => {
        const { name, checked } = e.target;
        setFormSmtpState({
            ...formSmtpState,
            [name]: checked,
        });
    };

    const handleChange = (e: any) => {
        const { name, value, id } = e.target;

        if (id === "links") {
            setThemesOptionsLinksFromData((prev: any) => ({
                ...prev,
                links: prev?.links?.map((link: any) => {
                    if (link.hasOwnProperty(name)) {
                        return { ...link, [name]: value };
                    }
                    return link;
                })
            }));
        } else {
            setThemesOptionsFromData((prev: any) => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleChangeStoreAddress = (e: any) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };



    // Handel get
    const getThemeOption = async () => {
        try {
            let data = await axios.get(`${read_theam_options}`)
            if (data?.data?.success) {
                setThemesOptionsFromData(data?.data?.data)
                if (data?.data?.data?.links) {
                    setThemesOptionsLinksFromData({ links: JSON.parse(data?.data?.data?.links) })
                } else {
                    setThemesOptionsLinksFromData(initialvalueLinks)
                }
                console.log({ links: JSON.parse(data?.data?.data?.links) }, initialvalueLinks, "__data get")
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const getStoreAddress = async () => {
        try {
            let data = await axios.get(`${get_first}`)
            if (data?.data?.success) {
                console.log("data?.data?.success", data?.data?.data)
                // setThemesOptionsFromData(data?.data?.data);
                setFormState(data?.data?.data)
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const getSmtpAdminSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_SMTP`)
            if (data?.success) {
                console.log("data?.data?.smtp", data?.data)
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormSmtpState({
                            ...sateValue,
                            id: data?.data?.id
                        });
                    } else {
                        setFormSmtpState((pre: any) => ({
                            ...pre,
                            id: data?.data?.id
                        }));
                    }
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const getSMSAdminSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_SMS`)
            if (data?.success) {
                console.log("data?.data?.smtp", data?.data)
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormSMSState({
                            ...sateValue,
                            id: data?.data?.id
                        });
                    } else {
                        setFormSMSState((pre: any) => ({
                            ...pre,
                            id: data?.data?.id
                        }));
                    }
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const getWhatsAppAdminSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_WHATSAPP`)
            if (data?.success) {
                console.log("data?.data?.smtp", data?.data)
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormWhatsAppState({
                            ...sateValue,
                            id: data?.data?.id
                        });
                    } else {
                        setFormWhatsAppState((pre: any) => ({
                            ...pre,
                            id: data?.data?.id
                        }));
                    }
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const getMetaInfoAdminSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_DEFAULT_META_INFO`)
            if (data?.success) {
                console.log("data?.data?._CURRENCY", data?.data)
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormMetaInfoState({ ...sateValue, id: data?.data?.id });
                    }
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const getFormOtpTemplateSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_OTPTEMPLATE`)
            if (data?.success) {
                console.log("data?.data?.smtp", data?.data)
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormOtpTemplateState({
                            ...sateValue,
                            id: data?.data?.id
                        });

                        setPageDescription(sateValue?.content)
                    } else {
                        setFormOtpTemplateState((pre: any) => ({
                            ...pre,
                            id: data?.data?.id
                        }));
                    }
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const getFormOrderTemplateSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_ORDERTEMPLATE`)
            if (data?.success) {
                console.log("data?.data?.smtp", data?.data)
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormOrderTemplateState({
                            ...sateValue,
                            id: data?.data?.id
                        });

                        setOrderTemplateContent(sateValue?.content)
                    } else {
                        setFormOrderTemplateState((pre: any) => ({
                            ...pre,
                            id: data?.data?.id
                        }));
                    }
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const submitForm = async () => {
        let fromData = { ...themesOptionsFromData, links: JSON.stringify(themesOptionsLinksFromData?.links) }
        if (themesOptionsFromData?.id) {
            if (fromData) {
                delete fromData.site_logo
                try {
                    let data = await axios.post(`${update_theam_options}`, fromData)
                    if (data?.data?.success) {
                        getThemeOption()
                        console.log(data?.data?.success, "__data");
                        _SUCCESS("Save Successfully!")
                    }
                } catch (error) {
                    console.log(error, "__error");
                    _ERROR("Something Went Wrong!")
                }
            }
        } else {
            if (fromData) {
                try {
                    let data = await axios.post(`${create_theam_options}`, fromData)
                    if (data?.data?.success) {
                        getThemeOption()
                        console.log(data?.data?.success, "__data")
                        _SUCCESS("Save Successfully!")
                    }
                } catch (error) {
                    console.log(error, "__error");
                    _ERROR("Something Went Wrong!")
                }
            }
        }
    }

    const submitStoreAddress = async () => {
        try {
            if (formState.id) {
                let data = await axios.post(`${update}`, formState)
                if (data?.data?.success) {
                    getSmtpAdminSetting();
                    _SUCCESS("Admin Setting SMTP Updated Successfully!");
                    console.log(data?.data?.success, "__data")
                }
            } else {
                let data = await axios.post(`${create}`, formState)
                if (data?.data?.success) {
                    getStoreAddress();
                    _SUCCESS("Store Address Created Successfully!");
                    console.log(data?.data?.success, "__data")
                }
            }

        } catch (error) {
            console.error(error);
            _ERROR("Something Went Wrong!")
        }
    }


    // // validation
    // const validation = (stateHandler: { [x: string]: any }, required_fields: string[] = [], templateType: string) => {
    //     let valid = true;

    //     if (templateType === "_OTPTEMPLATE") {
    //         if (!isEmptyObject(stateHandler) && required_fields.length) {
    //             for (let i = 0; i < required_fields.length; i++) {
    //                 if (required_fields[i] === 'content') {
    //                     if (pageDescription == "<p><br></p>" || pageDescription == "") {
    //                         setFieldsErrors(pre => ({
    //                             ...pre,
    //                             ['content']: "This fields is required!"
    //                         }))
    //                         valid = false;
    //                     }
    //                 } else {
    //                     if (!stateHandler[required_fields[i]]) {
    //                         setFieldsErrors(pre => ({
    //                             ...pre,
    //                             [required_fields[i]]: "This fields is required!"
    //                         }));
    //                         valid = false;
    //                     }

    //                     for (let key in stateHandler) {
    //                         if (key == required_fields[i] && !stateHandler[key]) {
    //                             setFieldsErrors(pre => ({
    //                                 ...pre,
    //                                 [key]: "This fields is required!"
    //                             }));
    //                             valid = false;
    //                         }
    //                         if (fieldsErrors[key]) {
    //                             valid = false;
    //                         }
    //                     }
    //                 }
    //             }
    //         } else {
    //             required_fields.forEach(item => setFieldsErrors(pre => ({
    //                 ...pre,
    //                 [item]: "This fields is required!"
    //             })));
    //         }
    //     }

    //     if (templateType === "_ORDERTEMPLATE") {
    //         if (!isEmptyObject(stateHandler) && required_fields.length) {
    //             for (let i = 0; i < required_fields.length; i++) {
    //                 if (required_fields[i] === 'content') {
    //                     if (orderTemplateContent == "<p><br></p>" || orderTemplateContent == "") {
    //                         setOrderTemplateFieldsErrors(pre => ({
    //                             ...pre,
    //                             ['content']: "This fields is required!"
    //                         }))
    //                         valid = false;
    //                     }
    //                 } else {
    //                     if (!stateHandler[required_fields[i]]) {
    //                         setOrderTemplateFieldsErrors(pre => ({
    //                             ...pre,
    //                             [required_fields[i]]: "This fields is required!"
    //                         }));
    //                         valid = false;
    //                     }

    //                     for (let key in stateHandler) {
    //                         if (key == required_fields[i] && !stateHandler[key]) {
    //                             setOrderTemplateFieldsErrors(pre => ({
    //                                 ...pre,
    //                                 [key]: "This fields is required!"
    //                             }));
    //                             valid = false;
    //                         }
    //                         if (fieldsErrors[key]) {
    //                             valid = false;
    //                         }
    //                     }
    //                 }
    //             }
    //         } else {
    //             required_fields.forEach(item => setFieldsErrors(pre => ({
    //                 ...pre,
    //                 [item]: "This fields is required!"
    //             })));
    //         }
    //     }

    //     return valid;
    // }

    // const clearValidation = (stateName: string, templateType: string) => {

    //     if (templateType === "_OTPTEMPLATE") {
    //         setFieldsErrors(pre => ({
    //             ...pre,
    //             [stateName]: ""
    //         }));
    //     }

    //     if (templateType === "_ORDERTEMPLATE") {
    //         setOrderTemplateFieldsErrors(pre => ({
    //             ...pre,
    //             [stateName]: ""
    //         }));
    //     }
    // }

    // Handle form submission smtp setting
    const submitFormSmtp = async () => {
        try {
            // Implement form submission logic here
            console.log('Form submitted:', formSmtpState);
            if (formSmtpState?.id) {
                let metadata: any = { ...formSmtpState };
                delete metadata.id;
                let data = await axios.post(`${a_update}`, { setting_id: "_SMTP", id: formSmtpState.id, metadata: JSON.stringify(metadata) })
                if (data?.data?.success) {
                    getStoreAddress();
                    _SUCCESS("Store Address Updated Successfully!");
                    console.log(data?.data?.success, "__data")
                }
            } else {
                let data = await axios.post(`${a_create}`, { setting_id: "_SMTP", metadata: JSON.stringify(formSmtpState) })
                if (data?.data?.success) {
                    getStoreAddress();
                    _SUCCESS("Store Address Created Successfully!");
                }
            }
        } catch (error) {
            console.log(error);
            _ERROR("Something Went To Wrong!")
        }
    };

    // Handle form submission SMS setting
    const submitFormSMS = async () => {
        // Implement form submission logic here
        console.log('Form submitted:', formSMSState);
        try {
            if (formSMSState?.id) {
                let metadata: any = { ...formSMSState };
                delete metadata.id;
                let data = await axios.post(`${a_update}`, { setting_id: "_SMS", id: formSMSState.id, metadata: JSON.stringify(metadata) })
                if (data?.data?.success) {
                    getSMSAdminSetting();
                    _SUCCESS("SMS Get Way Updated Successfully!");
                }
            } else {
                let data = await axios.post(`${a_create}`, { setting_id: "_SMS", metadata: JSON.stringify(formSMSState) })
                if (data?.data?.success) {
                    getSMSAdminSetting();
                    _SUCCESS("SMS Get Way Created Successfully!");
                }
            }
        } catch (error) {
            console.log(error);
            _ERROR("Something Went To Wrong!")
        }

    };

    // Handle form submission SMS setting
    const submitFormWhatsApp = async () => {
        // Implement form submission logic here
        console.log('Form submitted:', formWhatsAppState);
        try {
            if (formWhatsAppState?.id) {
                let metadata: any = { ...formWhatsAppState };
                delete metadata.id;
                let data = await axios.post(`${a_update}`, { setting_id: "_WHATSAPP", id: formWhatsAppState.id, metadata: JSON.stringify(metadata) })
                if (data?.data?.success) {
                    getWhatsAppAdminSetting();
                    _SUCCESS("WhatsApp Setting Updated Successfully!");
                }
            } else {
                let data = await axios.post(`${a_create}`, { setting_id: "_WHATSAPP", metadata: JSON.stringify(formWhatsAppState) })
                if (data?.data?.success) {
                    getWhatsAppAdminSetting();
                    _SUCCESS("WhatsApp Setting Created Successfully!");
                }
            }
        } catch (error) {
            console.log(error);
            _ERROR("Something Went Wrong!");
        }

    };

    const submitDefaultMetaInfo = async () => {
        console.log("submitDefaultMetaInfo", formMetaInfoState);
        // Implement form submission logic here 
        try {
            if (formMetaInfoState?.id) {
                let data = await axios.post(`${a_update}`, { setting_id: "_DEFAULT_META_INFO", id: formMetaInfoState?.id, metadata: JSON.stringify(formMetaInfoState) })
                if (data?.data?.success) {
                    _SUCCESS("Default Meta Info Saved!");
                }
            } else {
                let data = await axios.post(`${a_create}`, { setting_id: "_DEFAULT_META_INFO", metadata: JSON.stringify(formMetaInfoState) })
                if (data?.data?.success) {
                    _SUCCESS("Default Meta Info Saved!");
                }
            }
            getMetaInfoAdminSetting();
        } catch (error) {
            console.log(error);
            _ERROR("Something Went To Wrong!");
        }
    }

    // // Handle form submission OTP Template
    // const submitOTPTemplate = async () => {
    //     // Implement form submission logic here
    //     console.log('Form submitted:', formOtpTemplateState);
    //     try {
    //         let valid = false;
    //         valid = validation(formOtpTemplateState, ["subject", "content"], "_OTPTEMPLATE");

    //         if (valid) {
    //             if (formOtpTemplateState?.id) {
    //                 let metadata: any = { ...formOtpTemplateState, content: pageDescription };
    //                 delete metadata.id;
    //                 let data = await axios.post(`${a_update}`, { setting_id: "_OTPTEMPLATE", id: formOtpTemplateState.id, metadata: JSON.stringify(metadata) })
    //                 if (data?.data?.success) {
    //                     getFormOtpTemplateSetting()
    //                     _SUCCESS("OTP Template Setting Updated Successfully!");
    //                 }
    //             } else {
    //                 let data = await axios.post(`${a_create}`, { setting_id: "_OTPTEMPLATE", metadata: JSON.stringify({ ...formOtpTemplateState, content: pageDescription }) })
    //                 if (data?.data?.success) {
    //                     getFormOtpTemplateSetting();
    //                     _SUCCESS("OTP Template Setting Created Successfully!");
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         _ERROR("Something Went To Wrong!");
    //     }

    // };

    // // Handle form submission OTP Template
    // const submitOrderTemplate = async () => {
    //     // Implement form submission logic here
    //     console.log('Form submitted:', formOrderTemplateState);
    //     try {
    //         let valid = false;
    //         valid = validation(formOrderTemplateState, ["subject", "content"], "_ORDERTEMPLATE");

    //         if (valid) {
    //             if (formOrderTemplateState?.id) {
    //                 let metadata: any = { ...formOrderTemplateState, content: orderTemplateContent };
    //                 delete metadata.id;
    //                 let data = await axios.post(`${a_update}`, { setting_id: "_ORDERTEMPLATE", id: formOrderTemplateState.id, metadata: JSON.stringify(metadata) })
    //                 if (data?.data?.success) {
    //                     getFormOrderTemplateSetting()
    //                     _SUCCESS("Order Template Setting Updated Successfully!");
    //                 }
    //             } else {
    //                 let data = await axios.post(`${a_create}`, { setting_id: "_ORDERTEMPLATE", metadata: JSON.stringify({ ...formOrderTemplateState, content: orderTemplateContent }) })
    //                 if (data?.data?.success) {
    //                     getFormOrderTemplateSetting();
    //                     _SUCCESS("Order Template Setting Created Successfully!");
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         _ERROR("Something Went To Wrong!");
    //     }

    // };

    const handleImage = (e: any) => {
        // setImages(e.target.files);
        // setImageError("");
        // console.log('e: ', e);
        setImages(e);
        // if (fields?.product_category_id != null) {
        //     setRestoreImage(e);
        // }
        setImageError("");
    }

    const uploadImage = async () => {
        try {
            if (images?.length) {
                let formData: any = new FormData();
                formData.append('site_image', images[0]['file']);
                formData.append('id', themesOptionsFromData?.id);
                const data = await axios.post(`${update_theam_options_image}`, formData);
                if (data?.data?.success) {
                    getThemeOption()
                    console.log(data?.data?.success, "__data")
                }
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage || "Something went wrong!")
            console.log(error, "__error")
        }
    }

    const [accourding, setAccourding] = useState<any>({
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false
    });


    const headingHtml = (heading: string, drop?: boolean, id?: any, sub?: number) => {
        const changeAccourding = () => {
            const a = { ...accourding };
            for (let key in a) {
                if (key == id) {
                    a[key] = !a[key]
                } else {
                    a[key] = false;
                }
            }
            if (sub) {
                a[sub] = true
            }
            setAccourding(a);
            console.log("hhhhhhhhhhhhhhhhhhh", a);
        }
        if (drop) {
            return (
                <div className='flex items-center justify-between cursor-pointer' onClick={() => changeAccourding()}><span>{heading}</span><div className='cursor-pointer'>{accourding[id] ? <RiArrowDropRightLine className="rotate-90 text-3xl" /> : <RiArrowDropRightLine className="text-3xl" />}</div></div>
            )
        }
        return (
            heading
        )
    }

    useEffect(() => {
        getThemeOption();
        getStoreAddress();
        getSmtpAdminSetting();
        getSMSAdminSetting();
        getWhatsAppAdminSetting();
        getFormOtpTemplateSetting();
        getFormOrderTemplateSetting();
        getMetaInfoAdminSetting();
    }, [])

    //     useEffect(()=>{
    // const TempSet = () => {
    // const data = _get()
    // }
    //     },[])


    const [notificationConfigurationFile, setNotificationConfigurationFile] = useState(null);
    const [notificationConfigurationFileError, setNotificationConfigurationFileError] = useState(null);

    const notificationConfigurationFileOnChangeHandler = (e: any) => {
        const file = e.target.files[0];

        if (!file) {
            setNotificationConfigurationFile(null);
            setNotificationConfigurationFileError("Please select a file.");
        } else {
            // Check if the selected file is a JSON file
            if (file && file.type === "application/json") {
                setNotificationConfigurationFile(file);
                setNotificationConfigurationFileError("")
            } else {
                // Optionally, you can show an error message or alert the user
                setNotificationConfigurationFileError("Please select a JSON file.");
            }
        }
    };

    const submitNotificationConfigurationForm = async (e: any) => {
        e.preventDefault();

        if (!notificationConfigurationFile) {
            return;// Exit the function if no file is selected
        } else {
            const formData = new FormData();
            formData.append('upload_json', notificationConfigurationFile);
            console.log({ "upload_json": notificationConfigurationFile });

            try {
                const response = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/upload-firebase-json`, formData);
                console.log(response);
                if (response && response.data && response.data.success === true) {
                    _SUCCESS("Notiifcation Configuration File Upload");
                }
            } catch (error) {
                console.log(error.message);
                _ERROR("Notiifcation Configuration File Not Upload");
            }
        }

    }




    const [invoiceSettings, setInvoiceSettings] = useState({
        cod_transporterId: "",
        online_transporterId: "",
        tenderId: "",
    });

    const [invoiceData, setInvoiceData] = useState({
        setting_id: "",
        id: ""
    });

    const invoiceHandleChange = (e) => {
        setInvoiceSettings((pre) => ({ ...pre, [e.target.name]: e.target.value }));
    }

    useEffect(() => {
        async function getGENESYSINVOICE() {
            try {
                const res = await _get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-admin-setting/_GENESYSINVOICE`);
                if (res && res.data && res.data.data) {
                    console.log(res && res.data && res.data.data);
                    const responseJsonData = res && res.data && res.data.data && JSON.parse(res.data.data.metadata);
                    setInvoiceData({
                        id: res && res.data && res.data.data && res.data.data.id,
                        setting_id: res && res.data && res.data.data && res.data.data.setting_id
                    });
                    setInvoiceSettings({
                        cod_transporterId: responseJsonData.cod_transporterId,
                        online_transporterId: responseJsonData.online_transporterId,
                        tenderId: responseJsonData.tenderId
                    });
                }
                console.log(res && res.data && res.data.data && JSON.parse(res.data.data.metadata))
            } catch (error) {
                console.log(error.message)
            }
        };
        getGENESYSINVOICE();
    }, []);


    const submitInvoiceSettings = async () => {
        const payloda = {
            ...invoiceData,
            metadata: JSON.stringify(invoiceSettings)
        }
        try {
            // console.log(payloda)
            const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-admin-setting`, payloda);
            _SUCCESS("Invoice settings update successfully");
            console.log(res);
        } catch (error) {
            console.log(error.message)
        }
    }



    return (
        <div>
            <SimpleCard heading={headingHtml("General Settings", true, 1)}>
                {accourding[1] && <><SimpleCard className='mb-2' heading={headingHtml("Site Details", true, 10, 1)}>
                    {accourding[10] && <><div className='flex flex-col items-center justify-center gap-4'>
                        {!imageOpen ?
                            <Image src={themesOptionsFromData?.site_logo} alt={`${themesOptionsFromData?.site_name}-logo`} width={175} height={157} />
                            :
                            <>
                                <ImageUploader onImageChange={handleImage} preImages={images} className={`border border-gray-500 rounded w-60 h-fit min-h-32`} img_cls={`h-fit min-h-32`} />
                            </>}

                        <div className='flex items-center gap-2'>
                            {imageOpen ?
                                <Button
                                    variant="contained"
                                    className={`bg-red-600 hover:bg-red-700 text-white`}
                                    onClick={() => { setImageOpen(false); setImages([]); setImageError("") }}
                                >
                                    cancel
                                </Button> : null}
                            <Button
                                variant="contained"
                                className={`bg-green-600 hover:bg-green-700 text-white`}
                                onClick={() => { !imageOpen ? setImageOpen(true) : uploadImage() }}
                            >
                                {!imageOpen ? "update" : "upload"}
                            </Button>
                        </div>
                    </div>

                        <div className='pt-2 font-semibold text-gray-800 capitalize'>site details</div>

                        <div className={`${form_row_root} mb-2`}>
                            <div className={`${field_root_3}`}>
                                <TextField name='site_name' value={themesOptionsFromData?.site_name} handelState={(e: any) => handleChange(e)} label={"site name"} className={`${field_text_Cls}`} />
                            </div>
                            <div className={`${field_root_3}`}>
                                <TextField name='office_emial' type='emali' value={themesOptionsFromData?.office_emial} handelState={(e: any) => handleChange(e)} label={"office emial"} className={`${field_text_Cls}`} />
                            </div>
                            <div className={`${field_root_3}`}>
                                <TextField name='office_phone' type='number' value={themesOptionsFromData?.office_phone} handelState={(e: any) => handleChange(e)} label={"office phone"} className={`${field_text_Cls}`} />
                            </div>
                        </div>

                        <div className={`${form_row_root} mb-2`}>
                            <div className={`${field_root_3} !w-1/2`}>
                                <TextField name='office_gstin' value={themesOptionsFromData?.office_gstin} handelState={(e: any) => handleChange(e)} label={"Office GSTIN"} className={`${field_text_Cls}`} />
                            </div>
                            <div className={`${field_root_3} !w-1/2`}>
                                <TextField name='office_branch' value={themesOptionsFromData?.office_branch} handelState={(e: any) => handleChange(e)} label={"Office Branch"} className={`${field_text_Cls}`} />
                            </div>
                        </div>

                        <div className={`${form_row_root} mb-2`}>
                            <div className={`${field_root_2} !w-full`}>
                                <TextAreaField name='office_address' value={themesOptionsFromData?.office_address} handelState={(e: any) => handleChange(e)} label={"office address"} className={`${field_text_Cls}`} />
                            </div>
                        </div>
                        <div className={`${form_row_root} mb-2`}>
                            <div className={`${field_root_2} !w-full`}>
                                <TextField name='office_pan' value={themesOptionsFromData?.office_pan} handelState={(e: any) => handleChange(e)} label={"Office PAN"} className={`${field_text_Cls}`} />
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-8'>
                            <div></div>
                            <Button variant="outlined" className={`border-green-600 text-green-600`} onClick={() => submitForm()}>{themesOptionsFromData?.id ? "Save" : "Save"}</Button>
                        </div>
                    </>}
                </SimpleCard>
                    <SimpleCard className='mb-2' heading={headingHtml("Support Details", true, 11, 1)}>
                        {accourding[11] && <><div className='pt-2 font-semibold text-gray-800 capitalize'>support details</div>

                            <div className={`${form_row_root} mb-2`}>
                                <div className={`${field_root_2}`}>
                                    <TextField name='support_email' type='emali' value={themesOptionsFromData?.support_email} handelState={(e: any) => handleChange(e)} label={"support email"} className={`${field_text_Cls}`} />
                                </div>
                                <div className={`${field_root_2}`}>
                                    <TextField name='support_phone' type='number' value={themesOptionsFromData?.support_phone} handelState={(e: any) => handleChange(e)} label={"support phone"} className={`${field_text_Cls}`} />
                                </div>
                                <div className={`${field_root_2}`}>
                                    <TextField name='support_whatsapp' type='number' value={themesOptionsFromData?.support_whatsapp} handelState={(e: any) => handleChange(e)} label={"support whatsapp"} className={`${field_text_Cls}`} />
                                </div>
                            </div>

                            <div className={`${form_row_root} mb-2`}>
                                <div className={`${field_root_3}`}>
                                    <TextField name='support_days' value={themesOptionsFromData?.support_days} handelState={(e: any) => handleChange(e)} label={"support days"} className={`${field_text_Cls}`} />
                                </div>
                                <div className={`${field_root_3}`}>
                                    <TextField name='support_time_start' value={themesOptionsFromData?.support_time_start} handelState={(e: any) => handleChange(e)} label={"support time start"} className={`${field_text_Cls}`} />
                                </div>
                                <div className={`${field_root_3}`}>
                                    <TextField name='support_time_end' value={themesOptionsFromData?.support_time_end} handelState={(e: any) => handleChange(e)} label={"support time end"} className={`${field_text_Cls}`} />
                                </div>
                            </div>

                            <div className={`${form_row_root} mb-2`}>
                                <div className={`${field_root_2} !w-full`}>
                                    <TextAreaField name='warehouse_address' value={themesOptionsFromData?.warehouse_address} handelState={(e: any) => handleChange(e)} label={"warehouse address"} className={`${field_text_Cls}`} />
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-between mt-8'>
                                <div></div>
                                <Button variant="outlined" className={`border-green-600 text-green-600`} onClick={() => submitForm()}>{themesOptionsFromData?.id ? "Save" : "Save"}</Button>
                            </div></>}
                    </SimpleCard>
                    <SimpleCard heading={headingHtml("Links Details", true, 12, 1)}>
                        {accourding[12] && <><div className='pt-2 font-semibold text-gray-800 capitalize'>Links</div>

                            <div className={`${form_row_root} mb-2`}>
                                <div className={`${field_root_2}`}>
                                    <TextField name='facebook_link' id="links" value={themesOptionsLinksFromData?.links[0]?.facebook_link} handelState={(e: any) => handleChange(e)} label={"Facebook Link"} className={`${field_text_Cls}`} />
                                </div>
                                <div className={`${field_root_2}`}>
                                    <TextField name='twitter_link' id="links" value={themesOptionsLinksFromData?.links[1]?.twitter_link} handelState={(e: any) => handleChange(e)} label={"Twitter Link"} className={`${field_text_Cls}`} />
                                </div>
                            </div>

                            <div className={`${form_row_root} mb-2`}>
                                <div className={`${field_root_3}`}>
                                    <TextField name='instagram_link' id="links" value={themesOptionsLinksFromData?.links[2]?.instagram_link} handelState={(e: any) => handleChange(e)} label={"Instagram Link"} className={`${field_text_Cls}`} />
                                </div>
                                <div className={`${field_root_3}`}>
                                    <TextField name='linked_in_link' id="links" value={themesOptionsLinksFromData?.links[3]?.linked_in_link} handelState={(e: any) => handleChange(e)} label={"Linked In Link"} className={`${field_text_Cls}`} />
                                </div>
                                <div className={`${field_root_3}`}>
                                    <TextField name='pinterest_link' id="links" value={themesOptionsLinksFromData?.links[4]?.pinterest_link} handelState={(e: any) => handleChange(e)} label={"Pinterest Link"} className={`${field_text_Cls}`} />
                                </div>
                            </div>

                            <div className='w-full flex items-center justify-between mt-8'>
                                <div></div>
                                <Button variant="outlined" className={`border-green-600 text-green-600`} onClick={() => submitForm()}>{themesOptionsFromData?.id ? "Save" : "Save"}</Button>
                            </div></>}
                    </SimpleCard></>}
            </SimpleCard>

            <br />
            <SimpleCard heading={headingHtml("Store Address", true, 2)}>
                {accourding[2] && <><div className={`${form_row_root} mb-2`}>
                    <div className={`${field_root_3}`}>
                        <TextField name='address_line_one' value={formState.address_line_one} handelState={(e: any) => handleChangeStoreAddress(e)} label={"Address line 1"} className={`${field_text_Cls}`} />
                    </div>
                    <div className={`${field_root_3}`}>
                        <TextField name='address_line_two' type='emali' value={formState.address_line_two} handelState={(e: any) => handleChangeStoreAddress(e)} label={"Address line 2"} className={`${field_text_Cls}`} />
                    </div>
                    <div className={`${field_root_3}`}>
                        <TextField name='city' type='text' value={formState.city} handelState={(e: any) => handleChangeStoreAddress(e)} label={"City"} className={`${field_text_Cls}`} />
                    </div>
                </div>

                    <div className={`${form_row_root} mb-2`}>
                        <div className={`${field_root_2} !w-full`}>
                            <TextField name='country' type='text' value={formState.country} handelState={(e: any) => handleChangeStoreAddress(e)} label={"Country"} className={`${field_text_Cls}`} />
                        </div>
                        <div className={`${field_root_2} !w-full`}>
                            <TextField name='state' type='text' value={formState.state} handelState={(e: any) => handleChangeStoreAddress(e)} label={"State"} className={`${field_text_Cls}`} />
                        </div>
                        <div className={`${field_root_2}`}>
                            <TextField name='post_code' type='emali' value={formState.post_code} handelState={(e: any) => handleChangeStoreAddress(e)} label={"Post Code"} className={`${field_text_Cls}`} />
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className={`border-green-600 text-green-600`} onClick={() => submitStoreAddress()}>{formState.id ? "Save" : "Save"}</Button>
                    </div></>}
            </SimpleCard>

            <br />
            <SimpleCard heading={headingHtml("Email Configuration", true, 3)}>
                {accourding[3] && <>
                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='formEmail'
                                value={formSmtpState.formEmail}
                                handelState={handleChange}
                                label={"Form Email"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                        <div className="field-root">
                            <TextField
                                name='userName'
                                value={formSmtpState.userName}
                                handelState={handleChange}
                                label={"User Name"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='password'
                                type='text'
                                value={formSmtpState.password}
                                handelState={handleSmtpChange}
                                label={"Password"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                        <div className="field-root">
                            <TextField
                                name='host'
                                value={formSmtpState.host}
                                handelState={handleSmtpChange}
                                label={"Host"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='smtpPort'
                                type='number'
                                value={formSmtpState.smtpPort}
                                handelState={handleSmtpChange}
                                label={"SMTP Port"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                        <div className="field-root flex items-center">
                            <label className="mr-2">SMTP SSL</label>
                            <Switch
                                name='smtpSSL'
                                checked={formSmtpState.smtpSSL}
                                onChange={handleSwitchChange}
                            />
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitFormSmtp}>
                            {formSmtpState.id ? "Save" : "Save"}
                        </Button>
                    </div>
                </>}
            </SimpleCard>

            <br />
            <SimpleCard heading={headingHtml("SMS-GATEWAY Configuration", true, 4)}>
                {accourding[4] && <>
                    <div className="form-row">
                        <div className="field-root mb-2">
                            <TextField
                                name='url'
                                value={formSMSState.url}
                                handelState={handleSMSChange}
                                label={"SMS API"}
                                className={`${field_text_Cls}`}
                            />
                        </div>
                        <div className="field-root">
                            <TextField
                                name='sender'
                                value={formSMSState.sender}
                                handelState={handleSMSChange}
                                label={"Sender"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field-root mb-2">
                            <TextField
                                name='apikey'
                                value={formSMSState.apikey}
                                handelState={handleSMSChange}
                                label={"Api Key"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitFormSMS}>
                            {formSMSState.id ? "Save" : "Save"}
                        </Button>
                    </div>
                </>}
            </SimpleCard>

            <br />
            <SimpleCard heading={headingHtml("WhatsApp Configuration", true, 5)}>
                {accourding[5] && <>
                    <div className="flex flex-col gap-2 mb-2">
                        <div className="field-root">
                            <TextField
                                name='apiKey'
                                value={formWhatsAppState.apiKey}
                                handelState={handleWhatsAppChange}
                                label={"Api Key"}
                                className={`${field_text_Cls}`}
                            />
                        </div>
                        <div className="field-root">
                            <TextField
                                name='url'
                                value={formWhatsAppState.url}
                                handelState={handleWhatsAppChange}
                                label={"Api Url"}
                                className={`${field_text_Cls}`}
                            />
                        </div>
                        <div className="field-root">
                            <TextField
                                name='apiSecrect'
                                value={formWhatsAppState.apiSecrect}
                                handelState={handleWhatsAppChange}
                                label={"Api Secret"}
                                className={`${field_text_Cls} mb-2 mt-0.5`}
                            />
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitFormWhatsApp}>
                            {formWhatsAppState.id ? "Save" : "Save"}
                        </Button>
                    </div>
                </>}
            </SimpleCard>


            <br />
            <SimpleCard heading={headingHtml("Notification Configuration", true, 13)}>
                {accourding[13] && <>
                    <div className="flex flex-col gap-2 mb-2">
                        <input type="file" name="notificationConfigurationFile" id="notificationConfigurationFile" onChange={notificationConfigurationFileOnChangeHandler} />
                    </div>
                    <span className='text-pink-700 font-semibold'>{notificationConfigurationFileError && notificationConfigurationFileError}</span>


                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitNotificationConfigurationForm}>
                            Save
                        </Button>
                    </div>
                </>}
            </SimpleCard>

            <br />
            <SimpleCard heading={headingHtml("Default Meta Information", true, 6)}>
                {accourding[6] && <>
                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='meta_title'
                                value={formMetaInfoState.meta_title}
                                handelState={handleMetaInfoChange}
                                label={"Meta Title"}
                                className={`${field_text_Cls}`}
                            />
                        </div>
                    </div>
                    <div className="form-row mb-2">

                        <div className="field-root">
                            <TextField
                                name='meta_description'
                                value={formMetaInfoState.meta_description}
                                handelState={handleMetaInfoChange}
                                label={"Meta Description"}
                                className={`${field_text_Cls}`}
                            />
                        </div>

                    </div>
                    <div className="form-row mb-2">

                        <div className="field-root">
                            <TextField
                                name='meta_keyword'
                                value={formMetaInfoState.meta_keyword}
                                handelState={handleMetaInfoChange}
                                label={"Meta Keywords"}
                                className={`${field_text_Cls}`}
                            />
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitDefaultMetaInfo}>
                            {"Save"}
                        </Button>
                    </div>
                </>}
            </SimpleCard>

            <br />
            <SimpleCard heading={headingHtml("Invoice Settings", true, 7)}>
                {accourding[7] && <>
                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='cod_transporterId'
                                value={invoiceSettings.cod_transporterId}
                                handelState={invoiceHandleChange}
                                label={"COD transporterId"}
                                className={`${field_text_Cls}`}
                            />
                        </div>
                    </div>
                    <div className="form-row mb-2">

                        <div className="field-root">
                            <TextField
                                name='online_transporterId'
                                value={invoiceSettings.online_transporterId}
                                handelState={invoiceHandleChange}
                                label={"Online transporterId"}
                                className={`${field_text_Cls}`}
                            />
                        </div>

                    </div>
                    <div className="form-row mb-2">

                        <div className="field-root">
                            <TextField
                                name='tenderId'
                                value={invoiceSettings.tenderId}
                                handelState={invoiceHandleChange}
                                label={"Tender Id"}
                                className={`${field_text_Cls}`}
                            />
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitInvoiceSettings}>
                            {"Save"}
                        </Button>
                    </div>
                </>}
            </SimpleCard>
































            {/* <SimpleCard heading={headingHtml("Email Template Setting", true, 7)}>
                {accourding[7] && (
                    <>
                        <SimpleCard heading={headingHtml("OTP Template", true, 8, 7)}>
                            {accourding[8] && <>

                                <div className='pr-4 py-2'>Send Notification
                                    <Checkbox
                                        sx={{
                                            color: "#d8428c",
                                            '&.Mui-checked': {
                                                color: "#d8428c",
                                            },
                                        }}
                                        className='py-0'
                                        name='send_notification'
                                        onChange={handleOTPEmailCheckbox}
                                        checked={formOtpTemplateState?.send_notification == true} />
                                </div>

                                <div className="form-row mb-2">
                                    <div className="field-root">
                                        <TextField
                                            name='subject'
                                            value={formOtpTemplateState.subject}
                                            handelState={handleOTPTemplateChange}
                                            label={"Email Subject"}
                                            className={`${field_text_Cls} mt-0.5`}
                                        />
                                        <span style={{ color: "red" }}>{fieldsErrors?.subject}</span>
                                    </div>

                                </div>

                                <div className="form-row mb-2">
                                    <p className=' py-2'>Email Content</p>
                                    <div className="field-root">
                                        <CkEditor
                                            value={pageDescription}
                                            handleChange={handleOTPTemplateContentChange}
                                        />
                                        <span style={{ color: "red" }}>{fieldsErrors?.content}</span>
                                    </div>
                                </div>

                                <div className='w-full flex items-center justify-between mt-8'>
                                    <div></div>
                                    <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitOTPTemplate}>
                                        {formOtpTemplateState?.id ? "Save" : "Save"}
                                    </Button>
                                </div>
                            </>}
                        </SimpleCard><br />

                        <SimpleCard heading={headingHtml("Order Template", true, 9, 7)}>
                            {accourding[9] && <>
                                <div className='px-0 py-2'>Send Notification
                                    <Checkbox
                                        sx={{
                                            color: "#d8428c",
                                            '&.Mui-checked': {
                                                color: "#d8428c",
                                            },
                                        }}
                                        className='py-0'
                                        name='send_notification'
                                        onChange={handleOrderEmailCheckbox}
                                        checked={formOrderTemplateState?.send_notification == true} />
                                </div>
                                <div className="form-row mb-2">
                                    <div className="field-root">
                                        <TextField
                                            name='subject'
                                            value={formOrderTemplateState.subject}
                                            handelState={handleOrderTemplateChange}
                                            label={"Email Subject"}
                                            className={`${field_text_Cls}`}
                                        />
                                        <span style={{ color: "red" }}>{orderTemplateFieldsErrors?.subject}</span>
                                    </div>

                                </div>

                                <div className="form-row mb-2">
                                    <p className='px-0 py-2'>Email Content</p>
                                    <div className="field-root">
                                        <CkEditor
                                            value={orderTemplateContent}
                                            handleChange={handleOrderTemplateContentChange}
                                        />
                                        <span style={{ color: "red" }}>{orderTemplateFieldsErrors?.content}</span>
                                    </div>
                                </div>

                                <div className='w-full flex items-center justify-between mt-8'>
                                    <div></div>
                                    <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitOrderTemplate}>
                                        {formOrderTemplateState?.id ? "Save" : "Save"}
                                    </Button>
                                </div>
                            </>}
                        </SimpleCard>
                    </>
                )}
            </SimpleCard> */}
        </div>
    )
}

export default Options