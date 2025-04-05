import React, { useEffect, useState } from 'react'
import TextField from '../../../components/TextField';
import PinkPawsbutton from '../../../components/PinkPawsbutton';
import { isEmptyObject } from '../../../util/_common';
import axios from 'axios';
import { _ERROR, _SUCCESS } from '../../../../util/_reactToast';
import getUrlWithKey from '../../../util/_apiUrl';
import { useAuth } from '../../../services/context/AuthContext';
import { useRouter } from 'next/navigation';
// Use the useAuth hook in your components
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CryptoJS from "crypto-js";
import { encryptPayload } from '../../../../util/_encryption_api_payload';
const Login = () => {
    const { login, user } = useAuth();
    const router = useRouter();

    const defaultFieldSet = {
        credential: "",
        password: ""
    }

    const [fields, setFields] = useState(defaultFieldSet);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [invalid, setInvalid] = useState<boolean>(false);
    const [showPass, setShowPass] = useState<boolean>(false)
    const { signin } = getUrlWithKey("users");

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

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const clearValidation = (stateName: string) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
    }

    const handelOnChange = (e: any) => {
        // console.log('llg: ', e.target.checked);
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));

        clearValidation(stateName);
    }


    // const encryptData = (data: object) => {
    //     const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    //     if (!secretKey) {
    //         console.error("Encryption key is missing!");
    //         return null;
    //     }
    //     return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    // };

    // const handleSubmit = async () => {
    //     const encryptedDatas = encryptData({
    //         credential: fields?.credential,
    //         password: fields?.password
    //     });
    //     console.log(encryptedDatas, "65ds4fd6s541")

    //     return
    //     try {
    //         setButtonDisabled(true);
    //         let valid = validation(fields, ["credential", "password"]);

    //         if (valid) {
    //             const encryptedData = encryptData({
    //                 credential: fields?.credential,
    //                 password: fields?.password
    //             });

    //             if (!encryptedData) {
    //                 throw new Error("Encryption failed!");
    //             }

    //             let data: any = await login(encryptedData);
    //             console.log("handleSubmit login", data);
    //             if (data?.success) {
    //                 setFields(defaultFieldSet);
    //                 router.push('/');
    //             }
    //             setInvalid(false);
    //         } else {
    //             setInvalid(false);
    //         }
    //     } catch (error: any) {
    //         _ERROR(error?.response?.data?.message || "Something went wrong!");
    //         console.log('error: ', error);
    //         setInvalid(true);
    //     } finally {
    //         setButtonDisabled(false);
    //     }
    // };

    const handleSubmit = async () => {
        try {
            let valid = false;
            setButtonDisabled(true);
            valid = validation(fields, ["credential", "password"]);
            if (valid) {
                // const encryptedPayload = encryptPayload({
                //     credential: fields.credential,
                //     password: fields.password
                // });
                // console.log(encryptedPayload)
                let data: any = await login(fields.credential, fields.password);
                // const { data } = await axios.post(`${signin}`, { data: encryptedPayload },{ withCredentials: true });
                // const { data } = await axios.post(`${signin}`, { data: encryptedPayload }, { withCredentials: true });
                // console.log("handleSubmitlogin", data);
                if (data?.success) {
                    router.push('/admin');
                    console.log(data);
                    setFields(defaultFieldSet);
                    setButtonDisabled(false);
                    // setTimeout(() => {
                    //     router.push('/admin/');
                    // }, 2000);
                    // window.location.reload();
                }
                setInvalid(false);
            } else {
                setButtonDisabled(false);
                setInvalid(false);
            }
        } catch (error: any) {
            _ERROR(error?.response?.data?.massage || "Something went wrong!");
            router.push('/admin/login');
            setButtonDisabled(false);
            console.log('error1541', error);
            setInvalid(true);
        }
    }

    useEffect(() => {
        console.log('sufgh1fghfgfg ', user);
        if (user && user?.id) {
            // router.back();
            router.push("/admin");
        }
    }, [user]);

    const invalidHtml = () => {
        return (
            <div className="css-haw22i absolute top-[8%]">
                <section data-testid="form-error" className="css-17m1kaw">
                    <div className="css-1trnsdp flex items-center gap-2">
                        <div className="css-14zxvl1">
                            <span aria-hidden="true" className="css-1afrefi">
                                <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                                    <g fill-rule="evenodd">
                                        <path d="M12.938 4.967c-.518-.978-1.36-.974-1.876 0L3.938 18.425c-.518.978-.045 1.771 1.057 1.771h14.01c1.102 0 1.573-.797 1.057-1.771L12.938 4.967z" fill="red"></path>
                                        <path d="M12 15a1 1 0 01-1-1V9a1 1 0 012 0v5a1 1 0 01-1 1m0 3a1 1 0 010-2 1 1 0 010 2" fill="#ffffff"></path>
                                    </g>
                                </svg>
                            </span>
                        </div>
                        <div data-testid="form-error--content" className="css-t8lj6l">
                            <span className="css-xal9c7 text-red-500">Incorrect email address and / or password.</span>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (<>
        {/* credential */}
        <div className='flex container h-screen items-center justify-center relative'>
            <div className='lg:w-[40%] w-[70%] h-fit sm:p-16 p-8 shadow-ppa-6xl rounded-2xl bg-white z-10 relative'>
                {invalid && invalidHtml()}
                <div className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
                    <div className='relative flex'>
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                    </div>
                    Login as an admin
                </div>
                <div className=''>
                    <p className='py-2'>Username or Email</p>
                    <div className='flex flex-col gap-2'>
                        <div className='w-full border border-solid border-offWhite-02'><TextField className='!w-full p-1' placeholder='Enter username or email' name='credential' handelState={handelOnChange} onKeyDown={handleKeyPress} value={fields?.credential} /></div>
                        <span style={{ color: "red" }}>{fieldsErrors?.credential}</span>
                    </div>
                </div>

                <div className=''>
                    <p className='py-2'>Password</p>
                    <div className='flex flex-col gap-2'>
                        <div className='w-full border border-solid border-offWhite-02 relative'>
                            <TextField className='!w-full p-1' placeholder='Enter password' type={showPass ? 'text' : 'password'} name='password' handelState={handelOnChange} onKeyDown={handleKeyPress} value={fields?.password} />
                            <div className='absolute top-1 right-2 cursor-pointer' onClick={() => setShowPass(!showPass)}>{showPass ? <RemoveRedEyeIcon fontSize='small' className='text-gray-500' /> : <VisibilityOffIcon fontSize='small' className='text-gray-500' />}</div>
                        </div>
                        <span style={{ color: "red" }}>{fieldsErrors?.password}</span>
                    </div>
                </div>
                <div className='w-full flex items-center justify-between py-2'>
                    <p className='text-pink-700 font-semibold cursor-pointer underline' onClick={() => router.push("/user")}>
                        Forgot password
                    </p>
                    <PinkPawsbutton
                        variant={"solid"}
                        name={"Login"}
                        icon={""}
                        handleClick={handleSubmit}
                        pinkPawsButtonExtraCls={""}
                        style={{}}
                        disabled={buttonDisabled}
                        title={""}
                    />
                </div>
            </div>
            <div className='lg:w-[42%] w-[72%] h-[23rem] shadow-ppa-6xl rounded-2xl absolute -rotate-[8deg] bg-gradient-to-r from-pink-400 to-pink-500'></div>
        </div>
    </>);
}

export default Login;