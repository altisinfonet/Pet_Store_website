import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Link from 'next/link';
import { _put } from '../../services';
import parse from 'html-react-parser';


const PushNotification = () => {

    const [allNotification, setAllNotification] = useState<any>(null);

    const getData = async (payload: any) => {
        try {
            const response = await _put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notification-list`, payload);
            const data = await response.data;
            // const currentList = data && data.data && data.data.sort((a:any,b:any)=>a.created_at - b.created_at)
            // setAllNotification(currentList && currentList)
            setAllNotification(data && data.data)
        } catch (error) {
            throw new Error(error);
        }
    };

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalNotificationData, setTotalNotificationData] = useState(0)


    const getTotalNotication = async () => {
        try {
            const response = await _put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notification-list`, { notification_type: "ALL_USER" });
            const data = response && response.data;
            setTotalNotificationData(data && data.data.length)
            // console.log(data && data)
        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {

        getTotalNotication()
    }, [])


    useEffect(() => {
        try {
            getData({ notification_type: "ALL_USER", page: page + 1, rowPerPage: rowsPerPage });
        } catch (error) {
            console.log(error);
        }
    }, [page, rowsPerPage])



    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const numbersarray: number[] = Array.from({ length: 100 }, (_, index) => index + 1);


    return (
        <>
            <div className=' p-0 my-0 w-[100%] mx-auto'>
                <div className='flex justify-end items-center my-5'>
                    <Link href="/admin/push-notification/add-notification" className='px-4 py-2  rounded d-flex align-items-center justify-content-center text-decoration-none bg-[#2271b1] text-white'>
                        <AddRoundedIcon />
                        <span>Add Notification</span>
                    </Link>
                </div>
                <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
                    <Table aria-label="simple table" stickyHeader className='border' >
                        <TableHead className='border'
                            sx={{
                                border: '1px solid #ccc',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                padding: '10px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <TableRow>
                                <TableCell className='fw-bold' align='center' style={{backgroundColor:"#e0e0e0"}}>Sl.no</TableCell>
                                <TableCell className='fw-bold' align='center' style={{backgroundColor:"#e0e0e0"}}>Title</TableCell>
                                <TableCell className='fw-bold' align='center' style={{backgroundColor:"#e0e0e0"}}>Description</TableCell>
                                <TableCell className='fw-bold' align='center' style={{backgroundColor:"#e0e0e0"}}>Image</TableCell>
                                <TableCell className='fw-bold' align='center' style={{backgroundColor:"#e0e0e0"}}>Creation time</TableCell>
                                {/* <TableCell className='fw-bold'>Campaign</TableCell>
                                <TableCell className='fw-bold'>Start</TableCell>
                                <TableCell className='fw-bold'>End</TableCell>
                                <TableCell className='fw-bold'>Status</TableCell>
                                <TableCell className='fw-bold'>Target</TableCell>
                                <TableCell className='fw-bold'>Last Update</TableCell>
                                <TableCell className='fw-bold'>Sends / Impressions</TableCell>
                                <TableCell className='fw-bold'>Clicks / Opens</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                allNotification && allNotification
                                    .map((notification: any, index: any) => (
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={notification.id} className='hover:bg-gray-50' >
                                            <TableCell component="th" align='center' scope="row">{index + 1}</TableCell>
                                            <TableCell component="th" align='center' scope="row">{parse(notification.title)}</TableCell>
                                            <TableCell component="th" align='center' scope="row">{parse(notification.body)}</TableCell>
                                            <TableCell component="th" align='center' scope="row" >
                                                {
                                                    notification.image ? <img src={notification.image} alt={`${notification.title}__notification_${notification.title}`} className='h-[100px] w-[100px] object-contain mx-auto' /> : <span className='font-bold text-[25px]'>- -</span>
                                                }
                                            </TableCell>
                                            <TableCell component="th" align='center' scope="row">{new Date(notification.created_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={totalNotificationData && totalNotificationData}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </>
    )
}

export default PushNotification