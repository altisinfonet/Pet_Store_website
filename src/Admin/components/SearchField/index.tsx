import { TextField } from '@mui/material'
import React from 'react'

const SearchField = ({ textFieldCls, value, handleState, handleChange, disabled, placeholder }: Props) => {
    return (
        <TextField variant="outlined" placeholder={placeholder} disabled={disabled} value={value} onChange={(e: any) => handleState ? handleState(e.target.value) : null} className={`!p-0 searchText ${textFieldCls}`} />
    )
}

interface Props {
    textFieldCls?: string,
    value?: any,
    handleState?: CallableFunction | undefined,
    handleChange?: any,
    disabled?: boolean,
    placeholder?: any,
}

export default SearchField