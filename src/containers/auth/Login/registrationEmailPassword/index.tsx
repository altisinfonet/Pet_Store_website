import { Modal } from '@mui/base'
import { Box } from '@mui/system'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import iconp from "../../../../../public/assets/icon/pencil.png"
import icon5 from "../../../../../public/assets/icon/full-name.png"
import icon6 from "../../../../../public/assets/icon/email-id.png"
import iconv from "../../../../../public/assets/icon/hidden.png"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import iconmail from "../../../../../public/assets/icon/emai-otp.png"
import { isEmptyObject, phoneRegax } from '../../../../util/_common'

import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const RegistrationEmailPassword = ({ handleRegitrationEmailByPassword, loggedEmail }) => {
    const defaultFieldSet = {
        password: "",
        mobileNumber: "",
        name: "",
    }


    const [showPass, setShowPass] = useState(false)

    // const [password, setPassword] = useState('');
    // const [mobileNumber, setMobileNumber] = useState('');
    // const [name, setName] = useState("");

    const [fields, setFields] = useState(defaultFieldSet);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());

    const [isPasswordSixChar, setIsPasswordSixChar] = useState(false);
    const [isPasswordContainNumber, setIsPasswordContainNumber] = useState(false);
    const [isPasswordContainUppercase, setIsPasswordContainUppercase] = useState(false);

    const [isAllPasswordValidate, setIsPasswordValidate] = useState(false)

    // const handelOnChange = (e: any) => {
    //     const stateName = e.target.name;
    //     const stateValue = e.target.value;

    //     setFields(pre => ({
    //         ...pre,
    //         [stateName]: stateValue
    //     }));

    //     let runTimeValidationObject: any = {};

    //     if ("mobileNumber" === stateName) {
    //         runTimeValidationObject[stateName] = {
    //             v: stateValue,
    //             regax: phoneRegax,
    //             m: "Invalid phone number"
    //         }
    //     }

    //     // Password validation
    //     if (stateName === "password") {
    //         if (e.target.value.length < 6) {
    //             setIsPasswordSixChar(true)
    //             // setPasswordValidationMessage("Password must be at least 6 characters");
    //         } else if (!/[A-Z]/.test(e.target.value)) {
    //             setIsPasswordContainNumber(true)
    //             // setPasswordValidationMessage("Password must contain at least one uppercase letter");
    //         } else if (!/[0-9]/.test(e.target.value)) {
    //             setIsPasswordContainUppercase(true)
    //             // setPasswordValidationMessage("Password must contain at least one number");
    //         } else {
    //             // setPasswordValidationMessage("");
    //         }
    //     }



    //     if (isEmptyObject(runTimeValidationObject)) {
    //         clearValidation(stateName);
    //     } else {
    //         runTimeValidationField(runTimeValidationObject);
    //     }

    //     // clearValidation(stateName);
    // }

    const handelOnChange = (e: any) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        // Update the fields state
        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));

        // Runtime validation object to capture field-specific validation messages
        let runTimeValidationObject: any = {};

        if (stateName === "mobileNumber") {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: phoneRegax,
                m: "Invalid phone number"
            };
        }

        // Password validation
        // if (stateName === "password") {
        //     // Check length
        //     setIsPasswordSixChar(stateValue.length >= 6);
        //     // Check for uppercase
        //     setIsPasswordContainUppercase(/[A-Z]/.test(stateValue));
        //     // Check for number
        //     setIsPasswordContainNumber(/[0-9]/.test(stateValue));

        // }

        // setIsPasswordValidate(isPasswordContainNumber && isPasswordContainUppercase && isPasswordSixChar ? true : false)

        // You can add further logic for other fields if needed

        // If the validation object is empty, clear the validation (optional)
        if (Object.keys(runTimeValidationObject).length === 0) {
            clearValidation(stateName);
        } else {
            runTimeValidationField(runTimeValidationObject);
        }
    };




    const runTimeValidationField = (dataSet: { [x: string]: any }) => {
        if (!isEmptyObject(dataSet)) {
            for (const key in dataSet) {
                const value = dataSet[key]?.v;
                const regax = dataSet[key]?.regax;
                const message = dataSet[key]?.m;
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

    const clearValidation = (stateName: string) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
    }

    const validation = (stateHandler: { [x: string]: any }, required_fields: string[] = []) => {
        let valid = true;
        if (!isEmptyObject(stateHandler) && required_fields.length) {
            for (let i = 0; i < required_fields.length; i++) {
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
        } else {
            required_fields.forEach(item => setFieldsErrors(pre => ({
                ...pre,
                [item]: "This fields is required!"
            })));
        }

        return valid;
    }

    const handleFormSubmit = (e: any) => {

        let valid = false;
        valid = validation(fields, ["password", "name", "mobileNumber"]);

        console.log({
            isPasswordSixChar,
            isPasswordContainNumber,
            isPasswordContainUppercase,
            isAllPasswordValidate,
        })

        if (valid) {
            const splitName = fields?.name.split(" ");
            const first_name = splitName[0];
            const last_name = splitName.length > 1 ? splitName[1] : "";
            const type = 'e';

            handleRegitrationEmailByPassword({ first_name, last_name, type, common_credential: fields?.mobileNumber, password: fields?.password })
        }
        // Do something with the form data, like sending it to the server
        // handleCheckAuth({ data: mobileNumber })
    };

    return (
        <div>
            <p className='para1'>VERIFY YOUR EMAIL TO COMPLETE YOUR <br /> REGISTRATION</p>
            <p className='para1'>ENTER PASSWORD FOR <strong>{loggedEmail}</strong></p>

            <div>
                <Image src={iconmail} alt="iconpass" className={`logo-m`} />
            </div>


            <div className="from my-4">

                <div className='flex items-center border bg-white px-2'>
                    <input type={showPass ? "text" : "password"} className="p-1 w-100 outline-none" placeholder="Password" name="password" value={fields?.password} onChange={handelOnChange} />
                    <div>
                        {
                            showPass ? <RemoveRedEyeRoundedIcon className='cursor-pointer' onClick={() => setShowPass((prev) => !prev)} /> : <VisibilityOffRoundedIcon className='cursor-pointer' onClick={() => setShowPass((prev) => !prev)} />
                        }
                    </div>
                </div>

                {/* <div>
                    <p>
                        <span className=''>
                            {
                                isPasswordSixChar ?
                                    <CheckRoundedIcon className='text-xl rounded text-green-800 bg-green-300' /> :
                                    <ClearRoundedIcon className='text-xl rounded text-pink-600' />
                            }
                        </span>
                        <span className='text-xs'>Password must be at least 6 characters</span>
                    </p>
                    <p>
                        <span className=''>
                            {
                                isPasswordContainUppercase ?
                                    <CheckRoundedIcon className='text-xl rounded text-green-800 bg-green-300' /> :
                                    <ClearRoundedIcon className='text-xl rounded text-pink-600' />
                            }
                        </span>
                        <span className='text-xs'>Password must contain at least one uppercase letter</span>
                    </p>
                    <p>
                        <span className=''>
                            {
                                isPasswordContainNumber ?
                                    <CheckRoundedIcon className='text-xl rounded text-green-800 bg-green-300' /> :
                                    <ClearRoundedIcon className='text-xl rounded text-pink-600' />
                            }
                        </span>
                        <span className='text-xs'>Password must contain at least one number</span>
                    </p>
                </div> */}

                {/* <span> <Image src={iconv} alt="icon5" className={`icon2-m-nw`} /></span> */}
            </div>
            <span style={{ color: "red", fontSize: "0.6rem" }}>{fieldsErrors?.password}</span>


            <form>
                <div className="row">
                    <div className="col-md-6">
                        <div className="frm">
                            <label htmlFor="exampleInputEmail1" className="form-label new">Name </label>
                            <input type="text" className="form-control new" placeholder="*Full Name" name="name" value={fields?.name} onChange={handelOnChange} />
                            <span><Image src={icon5} alt="icon5" className={`icon2-m`} /></span>
                        </div>
                        <span style={{ color: "red", fontSize: "0.6rem" }}>{fieldsErrors?.name}</span>
                    </div>
                    <div className="col-md-6">
                        <div className="frm">
                            <label htmlFor="exampleInputEmail1" className="form-label new">Mobile Number <span>*</span></label>
                            <input type="text" className="form-control new" placeholder="*Enter Mobile Number" name="mobileNumber" value={fields?.mobileNumber} onChange={handelOnChange} />
                            <span><Image src={icon6} alt="icon6" className={`icon2-m`} /></span>
                        </div>
                        <span style={{ color: "red", fontSize: "0.6rem" }}>{fieldsErrors?.mobileNumber}</span>
                    </div>
                </div>
            </form>
            <button type="submit" className="btn1 mt-4" onClick={handleFormSubmit}>Sign Up</button>


        </div>
    )
}

export default RegistrationEmailPassword