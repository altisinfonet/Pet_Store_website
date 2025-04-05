import React, { useEffect, useState } from 'react'
import { Button, Checkbox } from '@mui/material'
import axios from 'axios'
import getUrlWithKey from '../../../Admin/util/_apiUrl'
import { emailRegax, isEmptyObject, validateMultipleEmailsWithComma } from '../../../Admin/util/_common'
import { _ERROR, _SUCCESS } from '../../../Admin/util/_reactToast'
import TextField from '../../../Admin/components/TextField'
import CkEditor from '../../../Admin/components/CkEditor'
import SimpleCard from '../../../Admin/components/SimpleCard'

// type FormFields = {
//     subject: string,
//     content: string,
//     to_email_address: string,
//     cc_email_address: string,
//     bcc_email_address: string
// }

const ContactUsAdmin = () => {

    const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded w-full`


    // Define the initial state
    const initialTemplateState = {
        send_notification: true,
        subject: "",
        content: "",
        id: "",
        to_email_address: "",
        cc_email_address: "",
        bcc_email_address: ""
    };

    const errorTemplateState: any = {
        subject: "",
        content: "",
        to_email_address: "",
        cc_email_address: "",
        bcc_email_address: ""
    }
    const [pageDescription, setPageDescription]: any = useState("");
    // Use useState hook to manage form state
    const [formTemplateState, setFormTemplateState] = useState(initialTemplateState);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(errorTemplateState);
    const [supportEmail, setSupportEmail] = useState(null);
    // const [fieldsErrors, setFieldsErrors] = useState<FormFields>(errorTemplateState);

    const { get_support_email_theam_options } = getUrlWithKey("theam_option");
    const { a_get_with_id, a_update, a_create } = getUrlWithKey("admin_setting");

    const fetchFormTemplateSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_CONTACTUSADMIN`)
            if (data?.success) {
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormTemplateState({
                            ...sateValue,
                            id: data?.data?.id
                        });

                        setPageDescription(sateValue?.content)
                    } else {
                        setFormTemplateState((pre: any) => ({
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

    const fetchSupportEmail = async () => {
        try {
            let { data } = await axios.get(`${get_support_email_theam_options}`)
            if (data?.success) {
                if (data?.data && data?.data?.support_email) {
                    setSupportEmail(data?.data?.support_email);
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const clearValidation = (stateName: string) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
    }

    const handleCheckbox = (e: any) => {
        // const stateName = e.target.name;
        // const stateValue = e.target.checked;

        // setFormTemplateState(pre => ({
        //     ...pre,
        //     [stateName]: stateValue
        // }))

        // clearValidation(stateName);
    }

    const runTimeValidationField = (dataSet: { [x: string]: any }) => {
        console.log("args", dataSet)
        if (!isEmptyObject(dataSet)) {
            for (const key in dataSet) {
                const value = dataSet[key]?.v;
                const regax = dataSet[key]?.regax;
                const message = dataSet[key]?.m;
                console.log("args regax(value)", regax(value))
                if (!regax(value)) {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: message
                    }));

                } else {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: ""
                    }));
                }
            }
        }
    }

    const handleTemplateChange = (e: any) => {
        const { name, value } = e.target;
        setFieldsErrors({ ...fieldsErrors, [name]: '' });
        setFormTemplateState({
            ...formTemplateState,
            [name]: value,
        });

        // let runTimeValidationObject: any = {};

        // if ("to_email_address" === name) {
        //     runTimeValidationObject[name] = {
        //         v: value,
        //         regax: emailRegax,
        //         m: "Invalid email address"
        //     }
        // }

        // if (isEmptyObject(runTimeValidationObject)) {
        //     // Clear the error message when user starts typing again
        //     setFieldsErrors({ ...fieldsErrors, [name]: '' });
        //     // clearValidation(name);
        // } else {
        //     runTimeValidationField(runTimeValidationObject);
        // }

        // clearValidation(name);
    };

    const handleTemplateContentChange = (e: any) => {
        setPageDescription(e);
        console.log('page:', pageDescription)
        clearValidation("content");
    };

    // validation
    const validation = (stateHandler: { [x: string]: any }, required_fields: string[] = [], templateType: string) => {
        let valid = true;

        if (!isEmptyObject(stateHandler) && required_fields.length) {
            for (let i = 0; i < required_fields.length; i++) {


                if (required_fields[i] === 'cc_email_address' || required_fields[i] === 'bcc_email_address') {
                    if (stateHandler[required_fields[i]] != '') {
                        let isValid = validateMultipleEmailsWithComma(stateHandler[required_fields[i]]);

                        if (!isValid) {
                            setFieldsErrors(pre => ({
                                ...pre,
                                [required_fields[i]]: "Invalid email address."
                            }));

                            valid = false;
                        }
                    }
                } else if (required_fields[i] === 'to_email_address') {
                    if (stateHandler[required_fields[i]] != '') {
                        let runTimeValidationObject: any = {};
                        runTimeValidationObject[required_fields[i]] = {
                            v: stateHandler[required_fields[i]],
                            regax: emailRegax,
                            m: "Invalid email address"
                        }

                        console.log('runTimeValidationObject', runTimeValidationObject, emailRegax(stateHandler[required_fields[i]]))

                        if (!emailRegax(stateHandler[required_fields[i]])) {
                            setFieldsErrors(pre => ({
                                ...pre,
                                [required_fields[i]]: "Invalid email address."
                            }));
                            valid = false;
                        }
                    }
                } else {
                    if (required_fields[i] === 'content') {
                        if (pageDescription == "<p><br></p>" || pageDescription == "") {
                            setFieldsErrors(pre => ({
                                ...pre,
                                ['content']: "This fields is required!"
                            }))
                            valid = false;
                        }
                    } else {
                        if (!stateHandler[required_fields[i]]) {
                            setFieldsErrors(pre => ({
                                ...pre,
                                [required_fields[i]]: "This fields is required!"
                            }));
                            valid = false;
                        }

                        for (let key in stateHandler) {
                            if (key == required_fields[i] && !stateHandler[key]) {
                                setFieldsErrors(pre => ({
                                    ...pre,
                                    [key]: "This fields is required!"
                                }));
                                valid = false;
                            }

                            if (fieldsErrors[key]) {
                                valid = false;
                            }
                        }
                    }
                }


            }
        } else {
            required_fields.forEach(item => setFieldsErrors(pre => ({
                ...pre,
                [item]: "This fields is required!"
            })));
        }
        return valid;
    }

    const getFormTemplateSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_CONTACTUSADMIN`)
            if (data?.success) {
                console.log("data?.data?.smtp", data?.data)
                if (data?.data) {
                    const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
                    if (sateValue) {
                        setFormTemplateState({
                            ...sateValue,
                            id: data?.data?.id
                        });

                        setPageDescription(sateValue?.content)
                    } else {
                        setFormTemplateState((pre: any) => ({
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

    // Handle form submission OTP Template
    const submitTemplate = async () => {
        // Implement form submission logic here
        console.log('Form submitted:', formTemplateState);
        try {
            let valid = false;
            valid = validation(formTemplateState, ["subject", "content", "to_email_address", "cc_email_address", "bcc_email_address"], "_CONTACTUSADMIN");

            if (valid) {
                if (formTemplateState?.id) {
                    let metadata: any = { ...formTemplateState, content: pageDescription };
                    delete metadata.id;
                    let data = await axios.post(`${a_update}`, { setting_id: "_CONTACTUSADMIN", id: formTemplateState.id, metadata: JSON.stringify(metadata) })
                    if (data?.data?.success) {
                        getFormTemplateSetting()
                        _SUCCESS("Contact Us - Admin Template Setting Updated Successfully!");
                    }
                } else {
                    let data = await axios.post(`${a_create}`, { setting_id: "_CONTACTUSADMIN", metadata: JSON.stringify({ ...formTemplateState, content: pageDescription }) })
                    if (data?.data?.success) {
                        getFormTemplateSetting();
                        _SUCCESS("OTP Template Setting Created Successfully!");
                    }
                }
            }
        } catch (error) {
            console.log(error);
            _ERROR("Something Went To Wrong!");
        }

    };

    useEffect(() => {
        fetchFormTemplateSetting();
        fetchSupportEmail();
    }, [])

    return (
        <div>
            <SimpleCard heading={"Contact Us - Admin"}>
                <>
                    <div className='pr-4 py-2'>Send Notification?
                        <Checkbox
                            sx={{
                                color: "#d8428c",
                                '&.Mui-checked': {
                                    color: "#d8428c",
                                },
                            }}
                            className='py-0'
                            name='send_notification'
                            onChange={handleCheckbox}
                            checked={formTemplateState?.send_notification == true} />
                    </div>

                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='to_email_address'
                                value={formTemplateState.to_email_address}
                                handelState={handleTemplateChange}
                                label={"TO Email Address"}
                                className={`${field_text_Cls} mt-0.5`}
                            />
                            <b>If left blank, mail goes to <span style={{ color: "green" }}>{supportEmail}</span></b><br />
                            <span style={{ color: "red" }}>{fieldsErrors?.to_email_address}</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='cc_email_address'
                                value={formTemplateState.cc_email_address}
                                handelState={handleTemplateChange}
                                label={"CC Email Address"}
                                className={`${field_text_Cls} mt-0.5`}
                            />
                            <span style={{ color: "red" }}>{fieldsErrors?.cc_email_address}</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='bcc_email_address'
                                value={formTemplateState.bcc_email_address}
                                handelState={handleTemplateChange}
                                label={"BCC Email Address"}
                                className={`${field_text_Cls} mt-0.5`}
                            />
                            <span style={{ color: "red" }}>{fieldsErrors?.bcc_email_address}</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className="field-root">
                            <TextField
                                name='subject'
                                value={formTemplateState.subject}
                                handelState={handleTemplateChange}
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
                                handleChange={handleTemplateContentChange}
                            />
                            <span style={{ color: "red" }}>{fieldsErrors?.content}</span>
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-between mt-8'>
                        <div></div>
                        <Button variant="outlined" className="border-green-600 text-green-600" onClick={submitTemplate}>
                            {formTemplateState?.id ? "Save" : "Save"}
                        </Button>
                    </div>
                </>
            </SimpleCard>
        </div>
    )
}

export default ContactUsAdmin