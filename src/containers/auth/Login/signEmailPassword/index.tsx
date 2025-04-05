import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import iconp from "../../../../../public/assets/icon/pencil.png"
import iconpass from "../../../../../public/assets/icon/password.png"
import iconmail from "../../../../../public/assets/icon/emai-otp.png"
import iconv from "../../../../../public/assets/icon/hidden.png"
import { isEmptyObject } from '../../../../util/_common'


const SignEmailPassword = ({ handleSignInEmailByPassword, loggedEmail }) => {
    const defaultFieldSet = {
        password: "",
    }

    // const [password, setPassword] = useState('');
    const [fields, setFields] = useState(defaultFieldSet);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());

    const handelOnChange = (e: any) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));

        clearValidation(stateName);
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
        valid = validation(fields, ["password"]);

        if (valid) {
            handleSignInEmailByPassword({ password: fields?.password });
        }
        // Do something with the form data, like sending it to the server
        // handleCheckAuth({ data: mobileNumber })
    };

    return (
        <>
            <p className='para1'>VERIFY YOUR EMAIL TO COMPLETE YOUR <br /> REGISTRATION</p>
            {/* <p className='para1'>ENTER OTP SENT ON    <strong>{loggedEmail}</strong>
            </p> */}

            <div>
                <Image src={iconmail} alt="iconpass" className={`logo-m`} />
            </div>

            <div className="frm my-4">

                <input type="text" className="form-control" placeholder="Password" name="password" value={fields?.password} onChange={handelOnChange} />
                {/* <span> <Image src={iconv} alt="icon5" className={`icon2-m-nw`} /></span> */}
            </div>
            <span style={{ color: "red", fontSize: "1rem" }}>{fieldsErrors?.password}</span>
            <form>

            </form>





            <button type="submit" className="btn1 mt-4" onClick={handleFormSubmit}>Verify</button>

        </>

    )
}

export default SignEmailPassword