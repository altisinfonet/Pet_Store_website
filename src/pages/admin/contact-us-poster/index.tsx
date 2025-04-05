import React, { useEffect, useState } from 'react'
import SimpleCard from '../../../Admin/components/SimpleCard'
import { Button, Checkbox } from '@mui/material'
import TextField from '../../../Admin/components/TextField'
import CkEditor from '../../../Admin/components/CkEditor'
import { isEmptyObject } from '../../../Admin/util/_common'
import axios from 'axios'
import { _ERROR, _SUCCESS } from '../../../Admin/util/_reactToast'
import getUrlWithKey from '../../../Admin/util/_apiUrl'

const ContactUsPoster = () => {

    const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded w-full`

    // Define the initial state
    const initialTemplateState = {
        send_notification: false,
        subject: "",
        content: "",
        id: ""
    };

    const [pageDescription, setPageDescription]: any = useState("");
    // Use useState hook to manage form state
    const [formTemplateState, setFormTemplateState] = useState(initialTemplateState);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());

    const { a_get_with_id, a_update, a_create } = getUrlWithKey("admin_setting");

    const fetchFormTemplateSetting = async () => {
        try {
            let { data } = await axios.get(`${a_get_with_id}/_CONTACTUSPOSTER`)
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

    const clearValidation = (stateName: string) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
    }

    const handleCheckbox = (e: any) => {
        const stateName = e.target.name;
        const stateValue = e.target.checked;

        setFormTemplateState(pre => ({
            ...pre,
            [stateName]: stateValue
        }))

        clearValidation(stateName);
    }

    const handleTemplateChange = (e: any) => {
        const { name, value } = e.target;
        setFormTemplateState({
            ...formTemplateState,
            [name]: value,
        });

        clearValidation(name);
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
            let { data } = await axios.get(`${a_get_with_id}/_CONTACTUSPOSTER`)
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

    // Handle form submission OTP Template
    const submitTemplate = async () => {
        // Implement form submission logic here
        console.log('Form submitted:', formTemplateState);
        try {
            let valid = false;
            valid = validation(formTemplateState, ["subject", "content"], "_CONTACTUSPOSTER");

            if (valid) {
                if (formTemplateState?.id) {
                    let metadata: any = { ...formTemplateState, content: pageDescription };
                    delete metadata.id;
                    let data = await axios.post(`${a_update}`, { setting_id: "_CONTACTUSPOSTER", id: formTemplateState.id, metadata: JSON.stringify(metadata) })
                    if (data?.data?.success) {
                        getFormTemplateSetting()
                        _SUCCESS("Contact Us - Poster Template Setting Updated Successfully!");
                    }
                } else {
                    let data = await axios.post(`${a_create}`, { setting_id: "_CONTACTUSPOSTER", metadata: JSON.stringify({ ...formTemplateState, content: pageDescription }) })
                    if (data?.data?.success) {
                        getFormTemplateSetting();
                        _SUCCESS("Contact Us - Poster Template Setting Created Successfully!");
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
    }, [])

    return (
        <div>
            <SimpleCard heading={"Contact Us - Poster"}>
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

export default ContactUsPoster