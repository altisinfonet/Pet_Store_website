import { FormHelperText, InputLabel } from '@mui/material'
import React from 'react'

const TextAreaField = ({ label, className, style, name, value, handelState, placeholder, helperText, textareaRoot }: Props) => {
    return (
        <div className={`flex flex-col items-start ${textareaRoot}`}>
            {label ? <InputLabel className={"text-sm font-medium text-black"}>{label}</InputLabel> : null}
            <textarea
                className={`TextAreaFieldCls ${className}`}
                style={style}
                name={name}
                value={value}
                onChange={(e) => { handelState ? handelState(e) : null }}
                placeholder={placeholder}
            />
            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </div>
    )
}

interface Props {
    label?: string;
    className?: string,
    style?: object,
    name?: string,
    value?: string | number,
    handelState?: CallableFunction | undefined,
    placeholder?: string,
    helperText?: string,
    textareaRoot?: string
}

export default TextAreaField