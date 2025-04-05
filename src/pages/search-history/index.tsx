import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useRead } from '../../hooks';
import getUrlWithKey from '../../util/_apiUrl';
import Link from 'next/link';
import Image from 'next/image';
import customArrowLink from "../../../public/assets/icon/customArrowLink.svg";
import emptyBox from '../../../public/assets/images/emptyBox.png';
import { lowerCase } from '../../util/_common';
import moment from 'moment-timezone';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const SearchHistory = () => {
    const router = useRouter();
    const { get_search_history } = getUrlWithKey("client_apis");
    const [openDialog, setOpenDialog] = useState(false);

    const { sendData: getWishListSH }: any = useRead({
        selectMethod: "get",
        url: get_search_history,
    });

    const handleDialogOpen = () => setOpenDialog(true);
    const handleDialogClose = () => setOpenDialog(false);

    // Group search history by date
    const groupByDate = (history: any) => {
        return history.reduce((acc: any, item: any) => {
            if (!item.reg_date) return acc;

            const parsedDate = moment(item.reg_date, ["D/M/YYYY, h:mm:ss a", "YYYY-MM-DDTHH:mm:ss.SSSZ"], true);

            if (!parsedDate.isValid()) {
                console.warn("Invalid date format:", item.reg_date);
                return acc;
            }

            const dateKey = parsedDate.format('YYYY-MM-DD');

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }

            acc[dateKey].push(item);
            return acc;
        }, {});
    };

    const groupedHistory = groupByDate(getWishListSH || []);


    // Function to format date label
    const formatDateLabel = (date: string) => {
        const today = moment().format('YYYY-MM-DD');
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
        const currentDate = moment(date);

        if (date === today) {
            return `Today, ${currentDate.format('MMMM D, YYYY')}`;
        }
        if (date === yesterday) {
            return `Yesterday - ${currentDate.format('dddd, MMMM D, YYYY')}`;
        }
        return currentDate.format('dddd, MMMM D, YYYY');
    };

    return (
        <div className="container">
            <div className="my-account mt-3">
                <div className="tm-w-full w-100 d-flex justify-content-between">
                    <h3 className="w-fit sp-title accountHeader">Search History</h3>
                    <button className="show-btn1 mb-3 h-fit" onClick={() => router.push('/myaccount')}>
                        <i className="fa-solid fa-arrow-left-long" style={{ padding: "4px" }}></i>
                        <span>Back</span>
                    </button>
                </div>

                <div className='mt-3'>
                    {getWishListSH?.length ? (
                        Object.keys(groupedHistory).map((date: any, index: number) => {
                            const isToday = moment(date).isSame(moment(), 'day');
                            console.log(date, "d54fg5d31f")
                            return (
                                <div
                                    key={index}
                                    className='px-3 py-1 pb-4 overflow-hidden'
                                    style={{
                                        backgroundColor: isToday ? "#fdf2f8" : "#f9fafb",
                                        marginBottom: "15px",
                                        borderRadius: "10px",
                                        boxShadow: isToday
                                            ? "0px 4px 15px rgba(0, 0, 0, 0.3)"
                                            : "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    <h4 className="date-label">{formatDateLabel(date)}</h4>
                                    <div className="grid-container">
                                        {groupedHistory[date].map((v: any, i: number) => (
                                            <div key={i} className="card-button">
                                                <div className="left-section">
                                                    <div className="icon-section">
                                                        <i className="fa fa-search search-icon" style={{ color: '#e4509d' }}></i>
                                                    </div>
                                                    <div className="content-section">
                                                        <Link href={`/shop/${lowerCase(v?.searchterm)}?type=search`}>
                                                            <div className='flex gap-2'>
                                                                <p className="name">{v?.searchterm || "No Name"}</p>
                                                                <div className='line' style={{ backgroundColor: "#cbd5e1", width: "2px", height: "20px" }}></div>
                                                                <span className="url" style={{
                                                                    color: "#007bff", fontSize: "14px",
                                                                    textOverflow: "ellipsis",
                                                                    overflow: "hidden",
                                                                    whiteSpace: "nowrap",
                                                                }}>{`${window.location.origin}/shop/${lowerCase(v?.searchterm)}?type=search`}</span>
                                                            </div>
                                                            <p className="date-time">
                                                                {moment.utc(v?.reg_date).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A")}
                                                            </p>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <Image src={emptyBox} alt="no_data_ill" width={192} height={108} />
                            <h4 className="flex flex-col items-center justify-center w-full h-full gap-1">
                                <span style={{ fontSize: '18px' }}>Oops! No search history found</span>
                                <span style={{ fontSize: '14px' }}>
                                    <Link href="/" className="color-e4509d">
                                        Go to homepage
                                    </Link>
                                </span>
                            </h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchHistory;
