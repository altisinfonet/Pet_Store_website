import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../util/_apiUrl';
import { useCreate, useRead } from '../../hooks';
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RenderRazorpayWallet from '../../components/RenderRazorpayWallet';
import { _put } from '../../services';
import moment from 'moment';
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DataTable from 'react-data-table-component';
interface WalletData {
    id: string;
    total_amount: number;
}

interface Transaction {
    created_at: string;
    payment_id: string | null;
    transaction_type: 'DEBIT' | 'CREDIT';
    amount: number;
    current_amount: number;
}

const MyWallet = () => {
    var currencyFormatter = require('currency-formatter');
    const router = useRouter();
    const {
        get_total_wallet_amount,
        razor_pay_order_create,
        wallet_transaction_details
    } = getUrlWithKey("client_apis")
    const [waleGetUrl, setWaleGetUrl] = useState<string>(null);
    const [amount, setAmount] = useState<string>("");
    const [razorPayOrderUrl, setRazorPayOrderUrl] = useState(null);
    const [razorpayOrderId, setrazorpayOrderId] = useState(null);
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [trunsactionDetails, setTrunsactionDetails]: any = useState<object>()
    const [updatedWalletData, setUpdatedWalletData] = useState<WalletData | null>(null);
    const [open, setOpen] = useState(false);
    const [amountError, setAmountError] = useState<string | null>(null)
    const { sendData: walet_amount }: any = useRead({
        selectMethod: "get",
        url: waleGetUrl,
    });

    console.log(trunsactionDetails, "5fjh666fg")
    const { sendData: orderPaymentRes }: any = useCreate({
        url: razorPayOrderUrl,
        callData: { amount: +amount * 100, currency: "INR" },
    });

    const columns = [
        {
            name: 'Date',
            selector: (row: Transaction) => moment(row.created_at).format('DD-MM-YYYY'),
            center: true,
            wrap: true,
            cell: (row: Transaction) => <div>{moment(row.created_at).format('DD-MM-YYYY')}</div>,
        },
        {
            name: 'Desc',
            selector: (row: Transaction) => row.payment_id || 'N/A',
            center: true,
            wrap: true,
        },
        {
            name: 'Debit',
            selector: (row: Transaction) => row.transaction_type === 'DEBIT' ? `₹${row.amount.toLocaleString()}` : '---',
            center: true,
            wrap: true,
            cell: (row: Transaction) => (
                <div>{row.transaction_type === 'DEBIT' ? `₹${row.amount.toLocaleString()}` : '---'}</div>
            ),
        },
        {
            name: 'Credit',
            selector: (row: Transaction) => row.transaction_type === 'CREDIT' ? `₹${row.amount.toLocaleString()}` : '---',
            center: true,
            wrap: true,
            cell: (row: Transaction) => (
                <div>{row.transaction_type === 'CREDIT' ? `₹${row.amount.toLocaleString()}` : '---'}</div>
            ),
        },
        {
            name: 'Balance',
            selector: (row: Transaction) => `₹${row.current_amount.toLocaleString()}`,
            center: true,
            cell: (row: Transaction) => <div>₹{row.current_amount.toLocaleString()}</div>,
            wrap: true
        },
    ];


    const handleOpen = () => {
        setOpen(true)
        setAmount("")
    };
    const handleClose = () => {
        setOpen(false);
        setAmountError("");
        setAmount("")
    }

    const handleAmountChange = (event: any) => {
        const inputValue = event.target.value;
        if (/^\d*$/.test(inputValue)) {
            setAmount(inputValue);
        }
    };

    const handleRechargeClick = () => {
        if (!amount) {
            setAmountError("Please enter amount!")
            setTimeout(() => {
                setAmountError("");
            }, 3000);
        } else {
            setRazorPayOrderUrl(razor_pay_order_create);
            setOpen(false)
        }
    };



    const WalletTableData = async (startDate: any, endDate: any) => {

        try {
            const { data } = await _put(wallet_transaction_details, { start_date: startDate, end_date: endDate })
            if (data?.success) {
                setTrunsactionDetails(data?.data?.reverse())
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const ClearTabelFilterData = () => {
        const today = new Date();
        const end = today.toISOString().split("T")[0];
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startFormatted = start.toISOString().split("T")[0];
        setStartDate(end)
        setEndDate(end)
        if (startFormatted && end) {
            WalletTableData(startFormatted, end);
        }
    }


    // After successful payment, call the get_total_wallet_amount API to refresh the balance
    const handlePaymentSuccess = () => {
        const today = new Date();
        const end = today.toISOString().split("T")[0];
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startFormatted = start.toISOString().split("T")[0];
        // Trigger the API call to get the updated wallet balance
        setWaleGetUrl(get_total_wallet_amount);
        if (startFormatted && end) {
            WalletTableData(startFormatted, end);
        }
        setAmount(""); // Reset the amount after payment
        setrazorpayOrderId(null); // Reset the order ID after payment
    };

    const updateWallet = (data: any) => {
        console.log(data, "5fjh666fg")
        if (walet_amount?.id === data?.id) {
            setUpdatedWalletData(data); // Update wallet data
        }
    };

    useEffect(() => {
        setWaleGetUrl(get_total_wallet_amount);
    }, []);

    useEffect(() => {
        if (orderPaymentRes && orderPaymentRes?.orderId) {
            setRazorPayOrderUrl(null);
            setrazorpayOrderId(orderPaymentRes?.orderId);
            // setAmount("")
        }
    }, [orderPaymentRes?.orderId]);

    useEffect(() => {
        setWaleGetUrl(get_total_wallet_amount);
    }, []);

    useEffect(() => {
        const today = new Date();
        const end = today.toISOString().split("T")[0]; // Current date formatted as YYYY-MM-DD
        const start = new Date(today);
        start.setDate(today.getDate() - 6); // 6 days ago
        const startFormatted = start.toISOString().split("T")[0]; // Start date formatted as YYYY-MM-DD

        setStartDate(end); // Set start date to 6 days ago
        setEndDate(end); // Set end date to today

        // If both dates are set, filter table data
        if (startFormatted && end) {
            WalletTableData(startFormatted, end);
        }
    }, []);
    return (
        <div className="container">
            <div className="my-account mt-3">
                <div className="tm-w-full w-100 d-flex justify-content-between ">
                    <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">My Wallet</h3>
                    <button className="show-btn1 mb-3 h-fit"
                        onClick={() => router.push('/myaccount')}
                    >
                        <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                        <span style={{ paddingRight: "9px" }}>back</span>
                    </button>
                </div>

                <div className="tm-w-full w-100 mt-3">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="v-pills-profile"
                            role="tabpanel"
                            aria-labelledby="v-pills-profile-tab"
                        >
                            <div className="acc-card">
                                <div className="card-body">
                                    <div className="flex justify-between items-center">
                                        {/* Wallet Balance */}
                                        <div>
                                            <h3 className="acc-title">
                                                ₹
                                                {updatedWalletData && updatedWalletData?.id
                                                    ? updatedWalletData?.total_amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    : walet_amount?.id
                                                        ? walet_amount?.total_amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        : '0.00'}
                                            </h3>
                                            <p className="acc-para1">Wallet Balance</p>
                                        </div>

                                        {/* Add Recharge Button */}
                                        <div>
                                            <button
                                                className="recharge-button"
                                                onClick={handleOpen}
                                            >
                                                <i className="fa-solid fa-wallet"></i>
                                                Add Balance
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Modal open={open} onClose={handleClose}>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: "auto",
                                        bgcolor: "background.paper",
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2,
                                    }}
                                >

                                    <IconButton
                                        onClick={handleClose}
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            color: "grey.500", // Icon color
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>

                                    <Typography variant="h5" align="center" className="recharge font-semibold">
                                        My Wallet
                                    </Typography>
                                    <div className="acc-card1">
                                        <div className="card-body">
                                            <span className="acc-svg">
                                                <AccountBalanceWalletIcon />
                                            </span>
                                            <h3 className="recharge text-center pt-3">
                                                Recharge Your Wallet
                                            </h3>
                                            <p className="acc-para text-center">
                                                Add money to your wallet using Credit/ Debit card, UPI
                                                or Net Banking
                                            </p>

                                            <div
                                                className="relative flex items-center gap-2 amoutboxwrap_input"
                                                style={{ width: "70%", margin: "1rem auto" }}
                                            >
                                                {/* <label for="exampleFormControlInput1" class="form-label">Email address</label> */}
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        fontWeight: "600",
                                                        left: "15px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        zIndex: "1",
                                                        fontSize: "70%",
                                                    }}
                                                >
                                                    ₹
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    style={{ margin: "0", paddingLeft: "30px", paddingRight: "100px", }}
                                                    id="exampleFormControlInput1"
                                                    placeholder="Enter Amount"
                                                    value={amount}
                                                    onChange={handleAmountChange}
                                                />

                                                <button
                                                    className="re-btn"
                                                    style={{ right: "4px", transform: "translateY(-50%)", position: "absolute", }}
                                                    onClick={handleRechargeClick}
                                                >
                                                    Recharge
                                                </button>
                                            </div>
                                            {amountError && (
                                                <p style={{ position: "absolute", top: "85%", left: "18%", fontSize: "14px", color: "red", textAlign: "center", marginTop: "0.5rem", fontWeight: "600" }}>
                                                    {amountError}
                                                </p>
                                            )}

                                        </div>
                                    </div>
                                </Box>
                            </Modal>

                            <div
                                className="tab-pane fade mt-4 show active"
                                id="v-pills-messages"
                                role="tabpanel"
                                aria-labelledby="v-pills-messages-tab"
                            >

                                <div style={{
                                    boxShadow: "0 5px 8px rgb(0,0,0,0.5)",
                                    borderRadius: "10px",
                                    padding: "8px"
                                }}>
                                    <div className="flex items-center justify-between mb-2 show_wallet_filter_root">
                                        <h4 className="m-0">All Transaction Details</h4>
                                        <div className="flex items-end justify-end gap-2 filter" style={{ width: "60%" }}>
                                            <div className="flex flex-col items-start w-full">
                                                <span style={{ fontSize: "15px", fontWeight: "bold" }}>Start Date</span>
                                                <input type="date" className="form-control cursor-pointer" value={startDate} onChange={(e: any) => setStartDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                                            </div>
                                            <div className="flex flex-col items-start w-full">
                                                <span style={{ fontSize: "15px", fontWeight: "bold" }}>End Date</span>
                                                <input type="date" className="form-control cursor-pointer" value={endDate} onChange={(e: any) => setEndDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                                            </div>

                                            <div className='flex gap-2 items-center justify-center w-full'>
                                                <button
                                                    className="show-btn1 text-white m-0 px-4 w-full"
                                                    style={{ height: "36px" }}
                                                    onClick={() => {
                                                        WalletTableData(startDate, endDate)
                                                    }
                                                    }
                                                >
                                                    Filter
                                                </button>

                                                <button
                                                    className="show-btn1 text-white m-0 px-4 w-full"
                                                    style={{ height: "36px" }}
                                                    onClick={() =>
                                                        ClearTabelFilterData()
                                                    }
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-container">
                                        <DataTable
                                            columns={columns}
                                            data={trunsactionDetails || []}
                                            pagination
                                            paginationRowsPerPageOptions={[5, 10, 20, 50]}
                                            customStyles={{
                                                headRow: {
                                                    style: {
                                                        backgroundColor: '#e4509d',
                                                        color: 'white',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        '@media (max-width: 768px)': {
                                                            fontSize: '14px',
                                                            padding: '5px',
                                                        },
                                                    },
                                                },
                                                headCells: {
                                                    style: {
                                                        borderBottom: '1px solid #ddd',
                                                        fontSize: '18px',
                                                        '@media (max-width: 768px)': {
                                                            fontSize: '14px',
                                                            padding: '5px',
                                                        },
                                                    },
                                                },
                                                cells: {
                                                    style: {
                                                        border: '1px solid #ddd',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        color: '#9CA3AF',
                                                        '@media (max-width: 768px)': {
                                                            fontSize: '12px',
                                                            padding: '4px',
                                                        },
                                                    },
                                                },
                                                pagination: {
                                                    style: {
                                                        padding: '10px',
                                                        '@media (max-width: 768px)': {
                                                            padding: '5px',
                                                            fontSize: '12px',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>


                            </div>


                        </div>

                    </div>
                </div>
            </div>

            {
                razorpayOrderId && (
                    <RenderRazorpayWallet
                        updateWallet={updateWallet}
                        razorpayOrderId={razorpayOrderId}
                        amount={Number(amount)}
                        currency={"INR"}
                        keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
                        keySecret={process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}
                        orderId={razorpayOrderId}
                        // response={() => {
                        //     setWaleGetUrl(get_total_wallet_amount);
                        //     setAmount("");
                        //     setrazorpayOrderId(null);
                        // }}
                        response={handlePaymentSuccess}
                    />
                )
            }
        </div>

    )
}

export default MyWallet