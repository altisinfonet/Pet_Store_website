import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import RepeaterTable from '../../components/repeaterTable';
import { _delete, _put } from '../../../services';
import getUrlWithKey from '../../util/_apiUrl';
import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
import ActionDrop from '../../components/ActionDrop';
import Pageination from '../../components/Pageination';
import { useRead } from '../../../hooks';
import { _SUCCESS } from '../../../util/_reactToast';
import PinkPawsbutton from '../../components/PinkPawsbutton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { _ERROR } from '../../util/_reactToast';

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

const PagesList = () => {

  const router = useRouter();

  const { get_all_pages } = getUrlWithKey("pages");
  const [pageNo, setPageNo] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: rowsPerPage, search: '' });
  const [confirmStatus, setConfirmStatus]: any = useState(false);
  const [delete_page_id, setDeletePageId] = useState("");
  const [checked, setChecked] = useState<any[]>([]);

  const header = [
    { field: 'Title' },
    { field: 'Author' },
    { field: 'Status' },
    { field: 'Slug' },
    { field: 'Action' },
  ];

  const [tableList, setTableList] = useState<any[]>([]);

  const addNewUser = () => {
    router.push("/admin/cmspages/create-page");
  }

  const searchRes = (value: any) => {
    console.log("searchRes", value);
    const url = value ? `${total_items}/${value}` : `${total_items}`;
    setPageNo(1);
    fetchPages({ page: 1, rowsPerPage: 10, search: value });
    setTotalUserGetUrl(url);
  }

  const [actionValue, setActionValue] = useState("delete")
  const actionArray = [
    // { value: "bulkAction", name: "Bulk action" },
    { value: "delete", name: "Delete" },
  ]
  const handelApply = async () => {
    // console.log("handelApply", actionValue, checked);
    // if (actionValue === 'delete' && checked?.length) {
    //   const { data } = await axios.post(`${delete_multiple_user}`, { user_ids: checked });
    //   if (data?.success) {
    //     console.log("handelApply-data", data);
    //     _SUCCESS(data?.massage);
    //     // setFields(defaultFieldSet);
    //     setPageNo(1)
    //     setGetProd({ page: pageNo, rowsPerPage: 10 })
    //     setActionValue("bulkAction");
    //     setChecked([]);
    //     setTotalUserGetUrl(total_items);
    //   }
    // }
  }
  const handleChangeAction = (e: any) => {
    setActionValue(e.target.value);
  }
  const [totalUserGetUrl, setTotalUserGetUrl] = useState("");
  const { total_items, delete_page } = getUrlWithKey("pages");
  const { sendData: totalUsersView }: any = useRead({ selectMethod: "get", url: totalUserGetUrl });

  const getTotalPage = (): number => {
    console.log("list?.totalPage", totalUsersView?.totalPage)
    if (totalUsersView?.totalPage && totalUsersView?.totalPage !== 0) {
      return totalUsersView?.totalPage;
    } else if (totalUsersView?.totalPage === 0) {
      return 1;
    } else {
      return 0;
    }
  }

  const fetchPages = async (c_getProd?: any) => {
    try {
      const { data } = await _put(get_all_pages, c_getProd ? c_getProd : getProd);
      console.log("pagelist-data", data);
      if (data?.success && data?.data && data.data?.length) {
        setTableList(data.data)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const pageDelete = async () => {
    try {
      const { data } = await _delete(`${delete_page}/${delete_page_id}`);
      if (data?.success) {
        _SUCCESS("Delete Page Successfully!");
        fetchPages();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handelTableCheckBox = (e: any, v: any) => {
    const arr = [...checked];
    if (e?.target?.checked) {
      arr.push(v);
      setChecked(arr);
    } else {
      setChecked(arr.filter((item: any) => item !== v))
    }
  }

  const handelAllChecked = (e: any) => {
    if (e?.target?.checked && tableList && tableList?.length) {
      const arr = [];
      for (let g = 0; g < tableList.length; g++) {
        if (tableList[g] && tableList[g]?.id && tableList[g]?.slug !== "home") {
          arr.push(tableList[g]?.id);
        }
      }
      setChecked(arr);
    } else {
      setChecked([]);
    }
  }

  useEffect(() => {
    setGetProd({ ...getProd, page: pageNo });
    fetchPages({ ...getProd, page: pageNo });
  }, [pageNo])

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    setTotalUserGetUrl(total_items);
  }, []);

  useEffect(() => {
    console.log("totalUserView", totalUsersView)
    if (totalUsersView?.totalItem) {
      setTotalUserGetUrl("");
    }
  }, [totalUserGetUrl]);

  return (
    <div>
      <div className='w-full flex flex-col items-start justify-center gap-2'>
        <SearchAndAddNewComponent buttonTxt={'Search Users'} addNewProduct={addNewUser} name={'Add New Page'} res={searchRes} />
        <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
          <ActionDrop
            btnValue="Apply"
            handleChange={handleChangeAction}
            menuItemArray={actionArray}
            value={actionValue}
            handleClick={() => handelApply()}
            disabled={checked.length ? false : true}
          // handleClick={() => actionValue === "restore" && handleToggle()}
          />
          <div className='flex flex-wrap items-center gap-2'>
            {/* <PinkPawsbutton name='Add New User' variant={"solid"} handleClick={addNewUser} /> */}
          </div>
          {/* <Pageination
                    // items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={pageNo}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : pageNo - 1)}
                    handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo > 999 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(pageNo)}
                /> */}

          <Pageination
            items={totalUsersView?.totalItem}
            value={pageNo}
            totalpageNo={getTotalPage()}
            handleClickFirst={() => setPageNo(1)}
            handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
            handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
            handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
            handleClickLast={() => setPageNo(getTotalPage())}
          />
        </div>

        {/* <Table className='lg:table hidden table-auto w-full productTableCls '> */}
        <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
          <TableHead>
            <TableRow
              hover
              role="checkbox"
              className='bg-slate-200 hover:!bg-slate-200'
              sx={{ cursor: 'pointer' }}
            >
              <TableCell padding="checkbox">
                <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === tableList?.length ? true : false} />
              </TableCell>
              {header.map((col, index) =>
                <TableCell className='' key={index}>{col.field}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableList?.length && tableList?.map((i: any, e: number) => {
              const link = i?.slug.toLowerCase()
              return (
                <StyledTableRow
                  hover
                  sx={{ cursor: 'pointer' }}
                  className='group'
                  key={e}
                >
                  <StyledTableCell className='!w-[8%]' padding="checkbox">
                    <Checkbox disabled={link === 'home'} checked={checked.includes(i?.id)} onClick={(e) => link !== 'home' ? handelTableCheckBox(e, i?.id) : null} size="small" />
                  </StyledTableCell>
                  <StyledTableCell className='relative w-[35%]'>
                    {i?.title}
                    <p className='group-hover:flex hidden absolute left-[3%] text-xs font-semibold cursor-pointer'>
                      |<span className='text-green-600' onClick={() => router.push(`/admin/cmspages/${link}`)}>&nbsp;Edit&nbsp;</span>
                      |{link !== 'home' && <><span className='text-red-600' onClick={() => { setDeletePageId(i?.id); setConfirmStatus(true) }}>&nbsp;Trash&nbsp;</span>|</>}
                    </p>
                  </StyledTableCell>
                  <StyledTableCell className=''>
                    {'Admin'}
                  </StyledTableCell>
                  <StyledTableCell className=''>
                    {i?.status?.title}
                  </StyledTableCell>
                  <StyledTableCell className=''>
                    {i?.slug}
                  </StyledTableCell>
                  <StyledTableCell className='w-[10%]'>
                    <div className='flex items-center gap-2'>
                      <EditIcon className='text-green-700' onClick={() => { router.push(`/admin/cmspages/${link}`) }} />
                      <DeleteIcon className={`${link === 'home' ? "text-gray-400" : "text-red-500"}`}
                        onClick={() => {
                          // if (link !== 'home') {
                          //   setDeletePageId(i?.id);
                          //   setConfirmStatus(true)
                          // }
                          if (!checked.includes(i?.id)) {
                            _ERROR('Please select the checkbox before deleting.');
                          } else {
                            if (link !== 'home') {
                              setDeletePageId(i?.id);
                              setConfirmStatus(true);
                            }
                          }
                        }} />
                    </div>
                  </StyledTableCell>

                </StyledTableRow>)
            })}
          </TableBody>
        </Table>
      </div>

      {/* <div className='mt-10'>
        <RepeaterTable />
      </div> */}

      <Dialog
        open={confirmStatus}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className='w-80 h-40 p-4'>
          <div className='bg-white flex flex-col justify-between h-full'>
            <p className='flex flex-col items-center justify-center'>
              <span>Do you want to delete this record?</span>
            </p>
            <div className='flex items-center gap-4'>
              <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { pageDelete(); setConfirmStatus(false) }} />
              <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => setConfirmStatus(false)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PagesList