import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../../Admin/util/_apiUrl'
import { _ERROR, _SUCCESS } from '../../../util/_reactToast'
import { _get, _post, _put } from '../../../services'
import DataTable from 'react-data-table-component';
import { Tab, Tabs } from '@mui/material';
import moment from 'moment';
interface DeletedUserData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_no: string;
    username: string;
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
            letterSpacing: "2px"
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


const UserAccount = () => {
    const {
        get_delete_user_account,
        approve_delete_user_account_status,
        get_downloadable_data
    } = getUrlWithKey("users")
    const [tabIndex, setTabIndex] = useState(0);
    const [allDeletedUser, setAllDelettedUser] = useState<[]>([])
    const [downloadableData, setDownloadableData] = useState<[]>([]);
    const [searchData, setSearchData] = useState<string>("")
    const [search2Data, setSearch2Data] = useState<string>("")
    const [isHovered, setIsHovered] = useState(false);
    const [selectedAction, setSelectedAction] = useState<{ [key: string]: string }>({});
    const [rowErrors, setRowErrors] = useState<{ [key: string]: string }>({});


    const handleActionChange = (rowId: string, value: string) => {
        setSelectedAction((prevActions) => ({
            ...prevActions,
            [rowId]: value,
        }));
    };

    const handleActionClick = async (rowId: string) => {
        const Actionvalue = selectedAction[rowId];

        if (!Actionvalue) {
            setRowErrors((prevErrors) => ({
                ...prevErrors,
                [rowId]: 'Please select an action!',
            }));
            return;
        }

        const data = {
            id: +rowId,
            status: Actionvalue === "5" ? "Approve" :
                "Reject",
        };

        try {
            const res = await _post(approve_delete_user_account_status, data);
            if (res && res.status) {
                _SUCCESS(res?.data?.message || "Status updated successfully.");
                getDownloadableData();
                setSelectedAction((prevActions) => {
                    const updatedActions = { ...prevActions };
                    delete updatedActions[rowId];
                    return updatedActions;
                });
                setRowErrors((prevErrors) => {
                    const { [rowId]: removedError, ...restErrors } = prevErrors;
                    return restErrors;
                });
            }
        } catch (error) {
            _ERROR(error?.response?.data?.message || "Something went wrong!");
        }
    };

    const handleClear = () => {
        if (tabIndex === 0) {
            setSearchData("");
            getUserAccountData("");
        } else {
            setSearch2Data("");
            getDownloadableData("");
        }
    };

    const getUserAccountData = async (searchValue = searchData) => {
        try {
            const res = await _put(get_delete_user_account, { search: searchValue })
            if (res && res?.status) {
                setAllDelettedUser(res?.data?.data)
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage || "Something went wrong!")
        }
    }

    const getDownloadableData = async (searchValue = search2Data) => {
        try {
            const res = await _put(get_downloadable_data, { search: searchValue });
            if (res?.status) {
                console.log(res?.data?.data, "54fdh51fdg")
                setDownloadableData(res?.data?.data);
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage || "Something went wrong!");
        }
    };
    useEffect(() => {
        getUserAccountData()
        getDownloadableData()
    }, [])
    return (
        <div className='mt-5' style={{
            boxShadow: "0 5px 8px rgb(0,0,0,0.5)",
            borderRadius: "10px",
            padding: "8px"
        }}>
            <div style={{ position: "relative", marginBottom: "20px", height: "60px" }}>

                {/* Search div (right side) */}
                <div style={{
                    position: "absolute",
                    left: "10px",
                    top: "0",
                    display: "flex",
                    alignItems: "center",
                    width: "400px",
                    marginTop: "28px"
                }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_: any, newIndex: number) => setTabIndex(newIndex)}
                        indicatorColor="secondary"
                        textColor="secondary"
                        centered
                    >
                        <Tab label="All Deleted Users"
                            sx={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "#9CA3AF",
                                textTransform: "none",
                                "&.Mui-selected": { color: "#e91e63" },
                                "&:hover": { color: "#d81b60" }
                            }} />
                        <Tab label="Download Data"
                            sx={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "#9CA3AF",
                                textTransform: "none",
                                "&.Mui-selected": { color: "#e91e63" },
                                "&:hover": { color: "#d81b60" }
                            }} />
                    </Tabs>
                </div>

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
                        value={tabIndex === 0 ? searchData : search2Data}
                        onChange={(e: any) => { tabIndex === 0 ? setSearchData(e.target.value) : setSearch2Data(e.target.value) }}
                        style={{
                            padding: "10px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "14px",
                            width: "100%",
                            paddingRight: "40px",
                        }}
                    />
                    {((tabIndex === 0 && searchData) || (tabIndex === 1 && search2Data)) && (
                        <button
                            onClick={handleClear}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{
                                position: "absolute",
                                right: "45px",
                                top: "51%",
                                transform: "translateY(-50%)",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: isHovered ? "#e91e63" : "#999",
                                transition: "color 0.3s ease",
                            }}
                        >
                            ✖
                        </button>
                    )}

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
                        onClick={() => {
                            if (tabIndex === 0) {
                                getUserAccountData()
                            } else {
                                getDownloadableData()
                            }
                        }}
                    >
                        🔍
                    </button>
                </div>

            </div>
            {tabIndex === 0 && (
                <DataTable
                    columns={[
                        { name: 'Sl. No.', selector: (_, index) => index + 1, center: true },
                        { name: 'Date', selector: (row: any) => moment(row.date_modified).format("DD-MM-YYYY"), center: true },
                        { name: 'Name', selector: (row: DeletedUserData) => `${row.first_name} ${row.last_name}`, center: true },
                        { name: 'Email', selector: (row: DeletedUserData) => row.email, center: true },
                        { name: 'Phone', selector: (row: DeletedUserData) => row.phone_no, center: true },
                        { name: 'Username', selector: (row: DeletedUserData) => row.username, center: true }
                    ]}
                    data={allDeletedUser}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    responsive
                />
            )}

            {tabIndex === 1 && (
                <DataTable
                    columns={[
                        { name: 'Sl. No.', selector: (_: any, index: number) => index + 1, center: true },
                        { name: 'Date', selector: (row: any) => moment(row.created_at).format("DD-MM-YYYY"), center: true },
                        { name: 'User Email', selector: (row: any) => row.user_email, center: true },
                        {
                            name: 'Status',
                            selector: (row: any) => row.status?.title,
                            center: true,
                            cell: (row: any) => {
                                const status = row.status?.title;
                                let color = '';

                                if (status === 'Pending') {
                                    color = '#EAB308';
                                } else if (status === 'Approve') {
                                    color = '#65A30D';
                                } else if (status === 'Reject') {
                                    color = '#EF4444';
                                }

                                return (
                                    <span style={{ color, fontWeight:"bold" }}>{status}</span>
                                );
                            }
                        },
                        {
                            name: 'Action',
                            cell: (row: any) => {
                                const isDisabled = row.status?.title === "Approve" || row.status?.title === "Reject";
                                const defaultValue = row.status?.title === "Approve" ? "5" : row.status?.title === "Reject" ? "6" : '';
                                return (
                                    <>
                                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                            <select
                                                style={{
                                                    padding: "8px 12px",
                                                    fontSize: "14px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                    outline: "none",
                                                    color: "#475569",
                                                    fontWeight: "500",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                    maxWidth: "150px",
                                                    backgroundColor: isDisabled ? "#f0f0f0" : "white",
                                                    cursor: isDisabled ? "default" : "pointer",
                                                }}
                                                value={selectedAction[row?.id] || defaultValue}
                                                onChange={(e: any) => handleActionChange(row.id, e.target.value)}
                                                disabled={isDisabled}
                                            >
                                                <option value="">Select...</option>
                                                <option value="5">Approve</option>
                                                <option value="6">Reject</option>
                                            </select>
                                            <button
                                                style={{
                                                    backgroundColor: isDisabled ? "#f0f0f0" : "transparent",
                                                    color: isDisabled ? "#b0b0b0" : "#e91e63",
                                                    border: isDisabled ? "1px solid #b0b0b0" : "1px solid #e91e63",
                                                    padding: "6px 10px",
                                                    cursor: isDisabled ? "default" : "pointer",
                                                    fontSize: "14px",
                                                    borderRadius: "4px",
                                                    whiteSpace: "nowrap"
                                                }}
                                                onClick={() => handleActionClick(row?.id)}
                                                disabled={isDisabled}
                                            >
                                                Update
                                            </button>
                                        </div>
                                        {rowErrors[row.id] && (
                                            <span
                                                style={{
                                                    color: 'red',
                                                    fontSize: '12px',
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                {rowErrors[row.id]}
                                            </span>
                                        )}
                                    </>
                                );
                            },
                            center: true,
                            wrap: true
                        }
                    ]}
                    data={downloadableData}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    responsive
                />
            )}
        </div>
    )
}

export default UserAccount