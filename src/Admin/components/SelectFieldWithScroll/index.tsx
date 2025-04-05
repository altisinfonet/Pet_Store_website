import { MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'

const SelectFieldWithScroll = ({ handleChange, value, menuItemArray, lable, selectFieldRootCls, name }: Props) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // const handleScroll = () => {
  //   if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
  //     return;
  //   }
  //   fetchData();
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [isLoading]);
  useEffect(() => {
    const handleScroll = () => {
      console.log('handleScroll--------------->')
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight

      ) {
        console.log('--++---444444444444444444');

        // return;
      }
      // loadMorePosts();
    };
    console.log('--++---');

    const dropdown: any = document.getElementById('customerDropdown');
    console.log('droP: ', dropdown)
    dropdown.addEventListener('scroll', handleScroll);
    return () => dropdown?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${selectFieldRootCls}`} id='customerDropdown'>
      <select>
        {menuItemArray.map((i: any, e: number) => <option key={e} value={i?.value}>{i?.name}</option>)}

      </select>
      {/* <Select

        value={value}
        onChange={(e) => handleChange(e)}
        fullWidth
        className='!px-4 !py-1 selectFieldCls'
        name={name}
      >
        {menuItemArray.map((i: any, e: number) => <MenuItem key={e} value={i?.value}>{i?.name}</MenuItem>)}
      </Select> */}
    </div>
  )
}

interface Props {
  handleChange: CallableFunction,
  value?: String | undefined,
  menuItemArray?: any,
  lable?: string,
  selectFieldRootCls?: string;
  name?: string
}

export default SelectFieldWithScroll