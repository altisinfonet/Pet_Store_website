import React from 'react'
import ButtonField from '../ButtonField'
import SearchField from '../SearchField'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Pageination = ({
    items,
    value,
    handleClickFirst,
    handleClickNext,
    handleClickPrevious,
    handleClickLast,
    handleChange,
    totalpageNo,
    disabledMid }: Props) => {
    return (
        <div className='flex items-center justify-end gap-2'>
            <p className='p-0 m-0 text-[90%]'>{items} items</p>
            <ButtonField buttonCls={`!p-0.5 !px-3 !min-w-fit`} buttonTxt={<KeyboardDoubleArrowLeftIcon className=' !h-6 !text-base'/>} handleClick={() => handleClickFirst ? handleClickFirst() : null} />
            <ButtonField buttonCls={`!p-0.5 !px-3 !min-w-fit`} buttonTxt={<KeyboardArrowLeftIcon className=' !h-6 !text-base'/>} handleClick={() => handleClickNext ? handleClickNext() : null} />
            <SearchField disabled={disabledMid ? disabledMid : true} textFieldCls={"w-[3rem] text-center pageinationInput !text-[90%]"} value={value} handleState={(e: any) => handleChange ? handleChange(e) : null} /><span className='text-[90%] p-0 m-0'> of {totalpageNo}</span>
            <ButtonField buttonCls={`!p-0.5 !px-3 !min-w-fit`} buttonTxt={<KeyboardArrowRightIcon className=' !h-6 !text-base'/>} handleClick={() => handleClickPrevious ? handleClickPrevious() : null} />
            <ButtonField buttonCls={`!p-0.5 !px-3 !min-w-fit`} buttonTxt={<KeyboardDoubleArrowRightIcon className=' !h-6 !text-base'/>} handleClick={() => handleClickLast ? handleClickLast() : null} />
        </div>
    )
}

interface Props {
    handleClickFirst?: CallableFunction,
    handleClickNext?: CallableFunction,
    handleClickPrevious?: CallableFunction,
    handleClickLast?: CallableFunction,
    value?: any,
    items?: number | string,
    handleChange?: CallableFunction,
    totalpageNo?: string | number,
    disabledMid?: boolean
}

export default Pageination