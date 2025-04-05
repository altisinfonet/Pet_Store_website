import React from 'react'
import TextField from '../../components/TextField'
import { InputLabel } from '@mui/material';

export default function Form({ fieldsErrors, handelOnChange, fields }: Props) {
    return (
        <div className='p-4 flex items-start gap-2.5'>
            <div className='flex w-[100%] flex-col gap-4'>
                <div className='border border-solid border-gray-400'>
                    <p className='px-4 py-2'>Personal Options</p>
                    <hr />
                    <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                        <InputLabel className={"text-sm font-medium text-black"}>Username</InputLabel>
                        <div className='w-full border border-solid border-offWhite-02'>
                            
                            <TextField className='!w-full p-1' placeholder='Enter Username (required)' name='name' handelState={handelOnChange} value={fields?.name} />
                        </div>
                        <span style={{ color: "red" }}>{fieldsErrors?.name}</span>

                        <div className='w-full border border-solid border-offWhite-02'><TextField className='!w-full p-1' placeholder='Enter category name' name='name' handelState={handelOnChange} value={fields?.name} /></div>
                        <span style={{ color: "red" }}>{fieldsErrors?.name}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface Props {
    fieldsErrors: any;
    handelOnChange: Function;
    fields: any;
}
