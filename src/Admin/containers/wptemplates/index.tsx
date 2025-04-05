import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../util/_apiUrl'
import { _get, _post } from '../../services'
import ActionDrop from '../../components/ActionDrop'
import axios from 'axios'
import { _SUCCESS } from '../../util/_reactToast'
import { styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow } from '@mui/material'


const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000000",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const WpTemplates = () => {

  const { get_sobot_template } = getUrlWithKey("theam_option")
  const { a_get_with_id, a_update, a_create } = getUrlWithKey("admin_setting");

  const initialThemeArr = [
    { name: "OTP", value: "", endpoint: "_OTPWHATSAPP" },
    { name: "Order Invoice", value: "", endpoint: "_ORDERINVOICE" },
  ]

  const [themesArr, setThemesArr] = useState<any[]>(initialThemeArr)
  const [themeData, setThemeData] = useState<any[]>([])
  const [themeType, setThemeType]: any = useState<object>({})

  const GetSettings = async () => {
    try {
      if (themesArr?.length) {
        const updatedThemesArr = await Promise.all(
          themesArr.map(async (v: any) => {
            const { data: tempResult } = await axios.get(`${a_get_with_id}/${v?.endpoint}`);
            if (tempResult?.success && tempResult?.data?.setting_id === v?.endpoint) {
              const value = JSON.parse(tempResult?.data?.metadata);
              if (value?.value) {
                return { ...v, value: value.value };
              }
            }
            return v;
          })
        );
        setThemesArr(updatedThemesArr);
      }
    } catch (error) {
      console.log(error, "__error");
    }
  };

  useEffect(() => {
    const GetTemplate = async (url: string) => {
      try {
        const { data } = await _get(url)
        if (data?.success) {
          setThemeData(data?.data)
        }
      } catch (error) {
        console.log(error, "__error")
      }
    }

    GetSettings();
    GetTemplate(get_sobot_template);
  }, [])


  useEffect(() => {
    const getOnValueSelect = async () => {
      let tempID = undefined;
      console.log(themeType, "themeType")
      try {
        if (themeType?.endpoint) {
          const { data: tempResult } = await axios.get(`${a_get_with_id}/${themeType?.endpoint}`);
          if (tempResult?.success) {
            tempID = tempResult?.data?.id;
          }
        }
        console.log(tempID, "tempID")
        if (tempID) {
          const { data } = await _post(a_update, { setting_id: themeType?.endpoint, id: tempID, metadata: JSON.stringify({ value: themeType?.value }) });
          if (data?.success) {
            GetSettings();
            _SUCCESS("Template Set Successfully!!!");
          }
        } else {
          const { data } = await _post(a_create, { setting_id: themeType?.endpoint, metadata: JSON.stringify({ value: themeType?.value }) });
          if (data?.success) {
            GetSettings();
            _SUCCESS("Template Set Successfully!!!");
          }
        }
      }
      catch (error) {
        console.log(error.message);
      }
    }

    if (themeType?.value) {
      getOnValueSelect();
    }
  }, [themeType?.value])


  return (
    <div className=''>
      <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid '>
        <TableHead>
          <TableRow
            hover
            role="checkbox"
            className='bg-slate-200 hover:!bg-slate-200'
            sx={{ cursor: 'pointer' }}
          >
            <TableCell className='!w-[25%]' padding="checkbox">Index</TableCell>
            <TableCell className='!w-[75%]' padding="checkbox">Sobot Templates</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {themesArr?.length ? themesArr.map((v: any, i: number) => <StyledTableRow
            hover
            key={i}
            sx={{ cursor: 'pointer' }}
            className='hover:!bg-[#6d8ad70f]'

          >
            <StyledTableCell className='!w-[25%]' padding="checkbox"><span className='text-base font-semibold capitalize'>{v?.name}</span></StyledTableCell>
            <StyledTableCell className='!w-[75%]' padding="checkbox">
              <ActionDrop
                btnValue="Apply"
                className={`w-full py-2`}
                selectFieldRootCls={`!w-full bg-white`}
                handleChange={(e: any) => setThemeType({ name: v?.name, endpoint: v?.endpoint, value: e.target.value })}
                menuItemArray={themeData}
                value={v?.value}
                btn={true}
              />
            </StyledTableCell>
          </StyledTableRow>)
            : null}
        </TableBody>
      </Table>
    </div>
  )
}

export default WpTemplates