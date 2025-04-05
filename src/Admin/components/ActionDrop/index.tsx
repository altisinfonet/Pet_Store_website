import React from 'react'
import SelectField from '../SelectField'
import ButtonField from '../ButtonField'

const ActionDrop = ({ btnValue, className, handleChange, menuItemArray, value, handleClick, selectFieldRootCls, selectFieldCls, btn, needId, needtitle, name, disabled, checkedIds }: Props) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            <SelectField checkedIds={checkedIds} name={name} needId={needId} needtitle={needtitle} selectFieldCls={`${selectFieldCls}`} selectFieldRootCls={`w-40 ${selectFieldRootCls}`} handleChange={(e: any) => handleChange ? handleChange(e) : null} menuItemArray={menuItemArray} value={value} disabled={disabled ? disabled : false} />
            {!btn ? <ButtonField buttonCls={``} buttonTxt={`${btnValue === "Apply" ? 'Apply' : btnValue === "Filter" ? 'Filter' : ""}`} handleClick={() => handleClick ? handleClick() : null} disabled={disabled ? disabled : false} /> : null}
        </div>
    )
}

interface Props {
    btnValue: string,
    className?: string,
    handleChange?: CallableFunction,
    menuItemArray?: any,
    value?: any,
    handleClick?: CallableFunction,
    selectFieldRootCls?: string,
    selectFieldCls?: string,
    btn?: boolean,
    needId?: boolean,
    needtitle?: boolean,
    name?: string;
    disabled?: boolean;
    checkedIds?: any[];
}

export default ActionDrop