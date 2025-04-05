import { Button } from '@mui/material' 
import React from 'react' 
 
const ButtonField = ({ handleClick, buttonTxt, buttonCls, disabled }: Props) => { 
    return ( 
        <Button variant="outlined" className={`px-4 !py-0.5 normal-case ${buttonCls}`} onClick={() => handleClick()} disabled={disabled ? disabled : false}>{buttonTxt}</Button> 
    ) 
} 
 
interface Props { 
    handleClick: CallableFunction, 
    buttonTxt?: any, 
    buttonCls?: string, 
    disabled?: boolean 
} 
 
export default ButtonField