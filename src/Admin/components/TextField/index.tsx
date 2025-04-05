import { FormHelperText, InputLabel } from '@mui/material'
import React from 'react'

const TextField = ({ label, className, style, name, id, value, handelState, blur, placeholder, helperText, onKeyDown, disabled, type, textFieldRoot, autoFocus, min }: Props) => {
    return (
        <div className={`flex flex-col items-start ${textFieldRoot}`}>
            {label ? <InputLabel className={"text-sm font-medium text-black capitalize"}>{label}</InputLabel> : null}
            <input
                className={`TextAreaFieldCls ${className}`}
                style={style}
                id={id}
                name={name}
                value={value}
                onBlur={blur}
                autoFocus={autoFocus}
                onChange={(e) => { handelState ? handelState(e) : null }}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                disabled={disabled}
                type={type ? type : 'text'}
                min={min ? min : ""}
            />
            {helperText ? <FormHelperText className={helperText ? "text-red-500" : ""}>{helperText}</FormHelperText> : null}
        </div>
    )
}

interface Props {
    label?: string,
    id?: string,
    className?: string,
    style?: object,
    name?: string,
    value?: string | number,
    handelState?: CallableFunction | undefined,
    onKeyDown?: any,
    blur?: any,
    placeholder?: string,
    helperText?: string,
    disabled?: boolean,
    type?: string,
    textFieldRoot?: string,
    autoFocus?: boolean,
    min?: string
}

export default TextField