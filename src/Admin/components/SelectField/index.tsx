import { MenuItem, Select } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { _SUCCESS } from '../../util/_reactToast'
import getUrlWithKey from '../../util/_apiUrl'

const SelectField = ({ handleChange, value, menuItemArray, lable, selectFieldRootCls, selectFieldCls, name, lableCls, checkedIds, needId, needtitle, placeholder, disabled }: Props) => {

  // console.log(menuItemArray, checkedIds, "checkedIds_menuItemArray")

  const disabledTag = (id: any) => {
    let checkTags: any = false
    if (checkedIds?.length) {
      checkTags = checkedIds?.filter((v: any) => +v?.att_id === id).map((val: any) => +val?.att_id === id && +val?.att_id)
    }
    return checkTags[0]
  }
  // console.log(value, "____value");
  console.log(disabledTag([{ id: 2 }]), "disabledTag");

  return (
    <div className={`${selectFieldRootCls}`}>
      <label className={`${lableCls}`}>{lable}</label>
      <Select
        value={value ? value : "pl"}
        onChange={(e) => handleChange(e)}
        fullWidth
        className={`${selectFieldCls} !text-sm !px-4 !py-1.5 selectFieldCls`}
        name={name}
        placeholder='aisgdik'
        disabled={disabled ? disabled : false
        }
       
      >
        {placeholder ? <MenuItem value={"pl"} disabled>{placeholder}</MenuItem> : null}
        {menuItemArray?.length ? menuItemArray.map((i: any, e: number) => <MenuItem sx={{ textTransform: "capitalize" }} className='bg-white hover:bg-white' disabled={disabledTag(+i?.id)} key={e} value={needId ? i?.id : i?.value ? i?.value : i?.name}>{needtitle ? i?.title : i?.name}</MenuItem>) : null}
      </Select>
    </div>
  )
}

interface Props {
  handleChange: CallableFunction,
  value?: any,
  menuItemArray?: any,
  lable?: string,
  selectFieldRootCls?: string;
  selectFieldCls?: string;
  name?: string,
  lableCls?: string,
  checkedIds?: any,
  needId?: boolean,
  needtitle?: boolean,
  placeholder?: any;
  disabled?: boolean
}

export default SelectField