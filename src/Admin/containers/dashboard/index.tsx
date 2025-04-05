import React, { useEffect, useState } from 'react'
import InventoryIcon from '@mui/icons-material/Inventory';
import ListIcon from '@mui/icons-material/List';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import Orders from '../orders';
import { styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow } from '@mui/material';
import moment from 'moment';
import LaunchIcon from '@mui/icons-material/Launch';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
// import { _get } from '../../../services';
import getUrlWithKey from '../../util/_apiUrl';
import { formatNumber } from '../../util/_common';
import { useRouter } from "next/router";
import { _get } from '../../services';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);
// dashboard: {
//     dashboard_item_count: "/dashboard-item-count",
//     dashboard_order_list: "/dashboard-order-list",
//     dashboard_user_list: "/dashboard-user-list"
//   }
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

const Dashboard = () => {
    let router = useRouter();
    const { dashboard_item_count, dashboard_order_list, dashboard_user_list } = getUrlWithKey("dashboard")

    const [itemCounts, setItemCounts] = useState<any>();
    const [dashboardOrderList, setDashboardOrderList] = useState<any[]>([]);
    const [dashboardUserList, setDashboardUserList] = useState<any[]>([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const { data: itemCount } = await _get(`${dashboard_item_count}`);
                const { data: orderList } = await _get(`${dashboard_order_list}`);
                const { data: userList } = await _get(`${dashboard_user_list}`);

                if (itemCount && itemCount?.success && itemCount?.data) {
                    setItemCounts(itemCount?.data);
                }

                if (orderList && orderList?.success && orderList?.data) {
                    setDashboardOrderList(orderList?.data);
                }

                if (userList && userList?.success && userList?.data) {
                    setDashboardUserList(userList?.data);
                }
            } catch (error: any) {
                console.log('err: ', error);
                if (error && error.status === 401) {
                    // setRetryCount((prev: any) => prev + 1)
                    router.push("/admin/login");
                    // window.location.reload();
                }
            }
        }

        fetchData();
    }, []);

    const ShowCard = ({ cardRootExtraCls, name, count, more }: any) => {
        return (
            <Link href={more ? `${more}` : `#`} data-aos="fade-right" >
                <div className={`group relative shadow-ppa-8xl bg-white border-l-[4px] border-solid rounded-[6px] h-fit w-full p-4 ${cardRootExtraCls}`}>
                    <div className='flex flex-col items-start gap-2'>
                        <h1 className={`uppercase text-[120%] font-bold leading-[1]`}>{name}</h1>
                        <h2 className={`uppercase text-[#000000] text-[100%] font-bold flex items-center gap-2`}>{count}</h2>
                    </div>
                    {more && <div className='group-hover:flex hidden absolute top-2 right-2 cursor-pointer'><LaunchIcon className='text-[#3838ff]' /></div>}
                </div>
            </Link>
        )
    }

    const handleOrderRedirect = () => {
        router.push('/admin/orders');
    }

    const handleUserRedirect = () => {
        router.push('/admin/users');
    }

    const header = [
        { field: 'No.' },
        { field: 'Order' },
        { field: 'Date' },
        { field: 'Status' },
        { field: 'Total' },
    ];

    const orderData = [{}, {}, {}, {}, {}, {}, {}]

    const userheader = [
        { field: 'No.' },
        { field: 'Name' },
        { field: 'Email' },
        { field: 'Role' }
    ]

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                // label: 'My First dataset',
                // backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                // hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                // hoverBorderColor: 'rgba(75,192,192,1)',
                data: [65, 59, 80, 81, 56, 55, 40],
            },
        ],
    };

    //   const options = {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         position: 'top',
    //       },
    //       title: {
    //         display: true,
    //         text: 'Line Chart Example',
    //       },
    //     },
    //   };

    return (
        <div className='flex flex-col gap-6'>
            <div className='grid lg:grid-cols-4 grid-cols-2 gap-4 shadow-ppa-8xl p-4 rounded-lg '>
                <ShowCard
                    cardRootExtraCls={`hover:bg-[#0000EE09] border-[#3838ff] text-[#000000]`}
                    moreRootCls={`bg-[#2d2d2d]`}
                    name={"PRODUCTS"}
                    count={<><InventoryIcon className="h-6 w-6" />{(itemCounts && itemCounts?.total_published_products) ? formatNumber(itemCounts?.total_published_products) : 0}</>}
                    more={"/admin/products"}
                />
                <ShowCard
                    cardRootExtraCls={`hover:bg-[#0000EE09] border-[#3838ff] text-[#000000]`}
                    moreRootCls={`bg-[#2d2d2d]`}
                    name={"ORDERS"}
                    count={
                        <>
                            {/* <ListIcon className="h-7 w-7" />  */}
                            Pending: &nbsp;
                            {(itemCounts && itemCounts?.total_pending_orders) ? formatNumber(itemCounts?.total_pending_orders) : 0} &nbsp;&nbsp;

                            {/* <ListIcon className="h-7 w-7" />  */}
                            Completed: &nbsp;
                            {(itemCounts && itemCounts?.total_published_orders) ? formatNumber(itemCounts?.total_published_orders) : 0}
                        </>
                    }
                    more={"/admin/orders"}
                />
                <ShowCard
                    cardRootExtraCls={`hover:bg-[#0000EE09] border-[#3838ff] text-[#000000]`}
                    moreRootCls={`bg-[#2d2d2d]`}
                    name={"USERES"}
                    count={<><SupervisorAccountIcon className="h-7 w-7" />{(itemCounts && itemCounts?.total_published_users) ? formatNumber(itemCounts?.total_published_users) : 0}</>}
                    more={"/admin/users"}
                />
                <ShowCard
                    cardRootExtraCls={`hover:bg-[#0000EE09] border-[#3838ff] text-[#000000]`}
                    moreRootCls={``}
                    name={"REVENUE"}
                    count={<><AutoGraphIcon className="h-7 w-7" />{(itemCounts && itemCounts?.total_revenue) ? formatNumber(itemCounts?.total_revenue) : 0}</>}
                />
            </div>

            <hr />

            <div className='flex lg:flex-row flex-col gap-6 shadow-ppa-8xl p-4 rounded-lg' data-aos="fade-up">
                <div className='flex flex-col items-start w-full' >
                    <h1 className={`font-semibold text-[100%] text-[#3838ff] leading-[1] mb-5 uppercase`} data-aos="zoom-in">Order received last 7 days</h1>
                    <div className='shadow-ppa-8xl bg-white w-full rounded-md'>
                        <Table className='table-auto w-full productTableCls' >
                            <TableHead>
                                <TableRow
                                    hover
                                    role="checkbox"
                                    className='bg-slate-200 hover:!bg-slate-200'
                                // sx={{ cursor: 'pointer' }}
                                >
                                    {header.map((col, index) =>
                                        <TableCell className={`!font-semibold ${col.field === "Order" ? "!text-start" : "!text-center"}`} key={index}>{col.field}</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody onClick={handleOrderRedirect}>

                                {(dashboardOrderList && dashboardOrderList?.length) ? dashboardOrderList.map((v: any, i: number) =>
                                    <StyledTableRow
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        className='group hover:!bg-[#6d8ad70f] !cursor-pointer'
                                        key={i}
                                    >
                                        <StyledTableCell className='relative !w-[5%] !text-center !border-0 !text-[13px]'>
                                            {i + 1}
                                        </StyledTableCell>
                                        <StyledTableCell className='relative !w-[45%] !text-start !border-0  !text-[13px]' >
                                            #{`${v?.order_id} ${v?.order && v?.order?.user && v.order.user?.first_name} ${v?.order && v?.order?.user && v.order.user?.last_name}`}
                                        </StyledTableCell>
                                        <StyledTableCell className='!text-center !border-0  !text-[13px]'>
                                            {moment(v?.date_completed).format("MMM DD, YYYY") || "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='!flex justify-center !border-0  !text-[13px]'>
                                            <p className={`${"bg-[#16a34a10] !text-[#16a34a]"} font-medium text-white py-1 px-3 rounded-full w-fit !text-[13px]`}>{v?.order_status && v?.order_status?.title}</p>
                                        </StyledTableCell>
                                        <StyledTableCell className='!text-center !border-0 !text-[13px]'>
                                            {`${v?.currency_symbol}${v?.total_sales ? formatNumber(v?.total_sales) : 0}`}
                                        </StyledTableCell>
                                        {/* <TableCell className=''>
                                        <SpeakerNotesIcon className="h-5 w-5 cursor-pointer" onClick={() => setDataSet({ edit: true, isNote: true, isDetails: false, id: v?.id })} />
                                    </TableCell> */}
                                    </StyledTableRow>) : null}

                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* <hr className='border-l h-auto'/> */}

                <div className='flex flex-col items-start w-full'>
                    <h1 className={`font-semibold text-[100%] text-[#3838ff] leading-[1] mb-5 uppercase`} data-aos="zoom-in">New customer arrived last 7 days</h1>
                    <div className='shadow-ppa-8xl bg-white w-full rounded-md'>
                        <Table className='table-auto w-full productTableCls' >
                            <TableHead>
                                <TableRow
                                    hover
                                    role="checkbox"
                                    className={`bg-slate-200 hover:!bg-slate-200`}
                                // sx={{ cursor: 'pointer' }}
                                >
                                    {userheader.map((col, index) =>
                                        <TableCell className={`!font-semibold ${col.field === "Name" || col.field === "Email" ? "!text-start" : "!text-center"}`} key={index}>{col.field}</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody onClick={handleUserRedirect}>

                                {(dashboardUserList && dashboardUserList?.length) ? dashboardUserList.map((v: any, i: number) =>
                                    <StyledTableRow
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        className='group hover:!bg-[#6d8ad70f] !cursor-default'
                                        key={i}
                                    >
                                        <StyledTableCell className='relative !w-[5%] !text-center !border-0 !text-[13px]'>
                                            {i + 1}
                                        </StyledTableCell>
                                        <StyledTableCell className='relative !w-[35%] !text-start !border-0 !text-[13px]' >
                                            {`${v?.first_name} ${v?.last_name}`}
                                        </StyledTableCell>
                                        <StyledTableCell className='relative !w-[35%] !text-start !border-0 !text-[13px]' >
                                            {`${v?.email}`}
                                        </StyledTableCell>
                                        <StyledTableCell className='!flex justify-center !border-0 '>
                                            <p className={`${"bg-[#ff780010] !text-[#ff7800]"} font-medium text-white py-1 px-3 rounded-full w-fit !text-[13px]`}>{`${v?.role && v?.role?.label}`}</p>
                                        </StyledTableCell>

                                    </StyledTableRow>) : null}

                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* <hr /> */}

            {/* <div className='shadow-ppa-8xl p-4 rounded-lg' data-aos="fade-up">
            <Line data={data} className='!w-full' />
            </div> */}
        </div>
    )
}

export default Dashboard