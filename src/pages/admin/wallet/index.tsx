import React, { useEffect, useState } from 'react'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloseIcon from "@mui/icons-material/Close";
import { _post, _put } from '../../../services';
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import { _ERROR } from '../../../util/_reactToast';

interface Transaction {
    created_at: string;
    payment_id: string | null;
    transaction_type: 'DEBIT' | 'CREDIT';
    amount: number;
    current_amount: number;
    remarks: string,
    order_wallet: any,
    user: {
        email: string
        first_name: string,
        last_name: string
    }
}

const customStyles = {
    header: {
        style: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#e91e63",
        },
    },
    rows: {
        style: {
            fontSize: "14px",
            fontWeight: "500",
        },
    },
    headCells: {
        style: {
            fontSize: "14px",
            fontWeight: "600",
            color: "#fff",
            backgroundColor: "#e91e63",
            borderRight: "1px solid #ddd",
            letterSpacing:"2px"
        },
    },
    cells: {
        style: {
            fontSize: "15px",
            fontWeight: "600",
            color: "#475569",
            letterSpacing: "1px",
            wordSpacing: "1px",
            borderRight: "1px solid #ddd",
            borderLeft: "1px solid #ddd",
            padding: "5px 15px"
        },
    },
};

const lableCls = "text-gray-600 font-semibold";
const selectFieldCls = "text-sm bg-white border border-gray-300 rounded-md";

const Wallet = () => {
    const {
        gift_user_wallet_amount,
        wallet_transaction_details
    } = getUrlWithKey("wallet")
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [razorpayOrderId, setrazorpayOrderId] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [transactionDetails, setTransactionDetails]: any = useState<object[]>([]);
    const [originalData, setOriginalData]: any = useState<object[]>([]);
    const [startDate, setStartDate] = useState<string>(moment().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"));
    const [errors, setErrors] = useState({
        email: '',
        amount: '',
    });
    const [selectedOption, setSelectedOption] = useState('All');
    const [placeholder, setPlaceholder] = useState("Select an option");
    
    const columns = [
        {
            name: 'Date',
            selector: (row: Transaction) => moment(row.created_at).format('DD-MM-YYYY'),
            center: true,
            wrap: true,
            width: "10rem",
            cell: (row: Transaction) => <div>{moment(row.created_at).format('DD-MM-YYYY')}</div>,
        },
        {
            name: 'User Name',
            selector: (row: Transaction) =>
                `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim(),
            center: true,
            wrap: true,
        },
        {
            name: 'User Email',
            selector: (row: Transaction) =>
                `${row.user?.email || ''}`.trim(),
            center: true,
            wrap: true,
        },
        {
            name: 'Desc',

            selector: (row: Transaction) =>
                row.transaction_type === "DEBIT"
                    ? `${row.remarks} (#${row.order_wallet?.order_id || 'N/A'})`
                    : row.transaction_type === "CREDIT"
                        ? row.remarks
                        : 'N/A',
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

    const menuItemArray = [
        { id: '1', value: 'All', name: 'All' },
        { id: '2', value: 'Weekly', name: 'Weekly' },
        { id: '3', value: 'Monthly', name: 'Monthly' },
        { id: '4', value: 'Yearly', name: 'Yearly' }
    ];

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
        setEmail("")
        setAmount("")
        setTransactionId("")
        setErrors({
            email: '',
            amount: '',
        })
    }


    const WalletTableData = async (startDate: any, endDate: any) => {

        try {
            const { data } = await _put(wallet_transaction_details, { start_date: startDate, end_date: endDate })
            if (data?.success) {
                setTransactionDetails(data?.data)
                setOriginalData(data?.data)
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "__error")
        }
    }

    const handleFilter = async () => {
        try {
            const { data } = await _put(wallet_transaction_details, { start_date: startDate, end_date: endDate })
            if (data?.success) {
                setTransactionDetails(data?.data)
                setOriginalData(data?.data)
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "__error")
        }
    };



    const handleClear = async () => {
        const today = new Date();
        const end = today.toISOString().split("T")[0];
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startFormatted = start.toISOString().split("T")[0];
        WalletTableData(startFormatted, end);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
        if (!searchValue) {
            setTransactionDetails(originalData);
            return;
        }
        const filteredData = originalData.filter((transaction: Transaction) => {
            const fullName = `${transaction?.user?.first_name} ${transaction?.user?.last_name}`.toLowerCase();
            const email = transaction?.user?.email.toLowerCase();
            return fullName && fullName?.includes(searchValue) || email && email?.includes(searchValue);
        });
        setTransactionDetails(filteredData);
    };

    const handleSubmit = async () => {
        let formErrors = { email: '', amount: '' };
        const today = new Date();
        const end = today.toISOString().split("T")[0];
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startFormatted = start.toISOString().split("T")[0];
        // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email) {
            formErrors.email = 'Email/ID is required*';
        }
        // else if (!emailRegex.test(email)) {
        //     formErrors.email = 'Invalid email format*';
        // }

        if (!amount) {
            formErrors.amount = 'Amount is required*';
        }

        if (formErrors.email || formErrors.amount) {
            setErrors(formErrors);
        } else {
            const data = {
                amount: +amount,
                email_id: email,
                transaction_id: transactionId
            };

            try {
                const res = await _post(gift_user_wallet_amount, data);
                if (res && res?.status) {
                    console.log(res, res?.data, "6s4df65d1");
                    setEmail("");
                    setAmount("");
                    setTransactionId("");
                    WalletTableData(startFormatted, end);
                    handleClose();
                    setErrors({
                        email: "",
                        amount: ""
                    });
                } else {
                    console.log("Error with the response");
                    WalletTableData(startFormatted, end);
                }
            } catch (error) {
                _ERROR(error?.response?.data?.massage || "User not found!, please enter valid Email/ID.")
                WalletTableData(startFormatted, end);
                console.log("ErrorduringAPIcall", error);
            }
        }
    };

    useEffect(() => {
        const today = new Date();
        const end = today.toISOString().split("T")[0];
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        const startFormatted = start.toISOString().split("T")[0];

        setStartDate(end);
        setEndDate(end);
        if (startFormatted && end) {
            WalletTableData(startFormatted, end);
        }
    }, []);
    return (
        <>

            {/* Recharge Wallet Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        maxWidth: '90%',
                        bgcolor: "#fff",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                        border: "2px solid #f0f0f0",
                        textAlign: "center",
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "#aaa",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Wallet Icon */}
                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            background: "#ffe1f0",
                            borderRadius: "50%",
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#e91e63",
                            fontSize: "30px",
                        }}
                    >
                        <AccountBalanceWalletIcon fontSize="inherit" />
                    </div>

                    {/* Subtitle */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: "18px",
                            fontWeight: "500",
                            mt: 2,
                            mb: 1,
                            color: "#e91e63",
                        }}
                    >
                        Recharge User Wallet
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#666",
                            mb: 3,
                        }}
                    >
                        Add money to user wallet via
                        <span style={{ fontWeight: "bold", color: "#000" }}> valid user Email/user Id</span>
                        {/* using Credit/Debit card, UPI, or Net Banking */}
                    </Typography>

                    {/* Inputs */}
                    <div style={{ marginBottom: "20px" }}>

                        {/* User Email/ID */}
                        <div style={{ position: "relative", marginBottom: "15px" }}>
                            <input
                                type="text"
                                placeholder="User Email/ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                }}
                            />
                            {errors.email && (
                                <p style={{ position: "absolute", top: "74%", left: "1%", color: 'red', fontSize: '12px' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Amount */}
                        <div style={{ position: "relative", marginBottom: "15px" }}>
                            <input
                                type="number"
                                placeholder="Amount(Rs.)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                }}
                            />
                            {errors.amount && (
                                <p style={{ position: "absolute", top: "74%", left: "1%", color: 'red', fontSize: '12px' }}>
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Transaction ID (Optional) */}
                        <div>
                            <input
                                type="text"
                                placeholder="Transaction ID (Optional)"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                }}
                            />
                        </div>
                    </div>

                    {/* Bottom-right Button */}
                    <div className='flex items-center justify-between'>
                        <button
                            style={{
                                backgroundColor: "transparent",
                                color: "#e91e63",
                                border: "1px solid #e91e63",
                                borderRadius: "4px",
                                padding: "10px 20px",
                                fontSize: "14px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.backgroundColor = "#d81b60";
                                target.style.border = "none";
                                target.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.backgroundColor = "transparent";
                                target.style.border = "1px solid #e91e63";
                                target.style.color = "#e91e63";
                            }}

                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        <button
                            style={{
                                backgroundColor: "#e91e63",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "10px 20px",
                                fontSize: "14px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.backgroundColor = "#d60055";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.backgroundColor = "#e91e63";
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </Box>
            </Modal >

            {/* All Transaction Detaisl */}
            <div className='mt-5' style={{
                boxShadow: "0 5px 8px rgb(0,0,0,0.5)",
                borderRadius: "10px",
                padding: "8px"
            }}
            >
                <div className='flex justify-between'>
                    <h2
                        style={{
                            marginBottom: "20px",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#9CA3AF",
                        }}
                    >
                        All Transaction Details
                    </h2>
                    <div>
                        <button
                            className="recharge-button"
                            onClick={handleOpen}
                            style={{
                                backgroundColor: "#FDEBF1",
                                border: "1px solid #e91e63",
                                color: "#e91e63",
                                padding: "0.5rem 1rem",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                fontWeight: "800",
                                transition: "transform 0.2s ease-in-out",
                            }}

                            onMouseEnter={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.transform = "scale(1.03)";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.transform = "scale(1)";
                            }}
                        >
                            <AccountBalanceWalletIcon />
                            Add Balance
                        </button>
                    </div>
                </div>

                <div style={{ position: "relative", marginBottom: "20px", height: "60px" }}>
                    {/* Date filter div (left side) */}
                    <div
                        style={{
                            position: "absolute",
                            left: "0",
                            top: "0",
                            display: "flex",
                            gap: "10px",
                            width: "600px"
                        }}
                    >
                        {/* Filter Section */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="startDate" style={{ color: "#6B7280", fontWeight: "bold", fontSize: "14px", marginBottom: "5px" }}>
                                Start Date
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    width: "200px",
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="endDate" style={{ fontSize: "14px", color: "#6B7280", fontWeight: "bold", marginBottom: "5px" }}>
                                End Date
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    width: "200px"
                                }}
                            />
                        </div>
                        <button
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "#e91e63",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "pointer",
                                width: "120px",
                                height: "40px",
                                marginTop: "28px"
                            }}
                            onClick={handleFilter}
                        >
                            Filter
                        </button>
                        <button
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "#e91e63",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "pointer",
                                width: "120px",
                                height: "40px",
                                marginTop: "28px"
                            }}
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    {/* Custom Select Dropdown */}
                    <div className="filter" style={{
                        position: "absolute",
                        width: '300px',
                        margin: '20px',
                        right: "30%",
                        top: "0",
                        display: "flex",
                        alignItems: "center",
                    }}>
                    </div>

                    {/* Search div (right side) */}
                    <div
                        style={{
                            position: "absolute",
                            right: "0",
                            top: "0",
                            display: "flex",
                            alignItems: "center",
                            width: "300px",
                            marginTop: "28px"
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearch}
                            style={{
                                padding: "10px 12px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px",
                                width: "100%",
                                paddingRight: "40px",
                            }}
                        />
                        <button
                            style={{
                                position: "absolute",
                                right: "1px",
                                top: "51%",
                                transform: "translateY(-50%)",
                                backgroundColor: "#e91e63",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "27px",
                                color: "#e91e63",
                                borderRadius: "0 3px 3px 0",
                            }}
                        >
                            🔍
                        </button>
                    </div>

                </div>



                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={transactionDetails}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    responsive
                />
            </div >
        </>
    )
}

export default Wallet