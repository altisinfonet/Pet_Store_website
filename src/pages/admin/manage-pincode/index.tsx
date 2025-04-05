import React, { useEffect, useState } from "react";
import { TextField, Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, Select, MenuItem, FormControl, FormHelperText, Checkbox } from "@mui/material";
import { CloudUpload, Edit, Delete, Close, WarningAmber } from "@mui/icons-material";
import DataTable, { TableColumn } from "react-data-table-component";
import { _get, _post, _put } from "../../../services";
import getUrlWithKey from "../../../util/_apiUrl";
import { _ERROR, _INFO, _SUCCESS } from "../../../util/_reactToast";

interface StoreLocator {
    id: string;
    title: string;
    slug: string;
    site_code: number | null;
    latitude: number;
    longitude: number;
    address_1: string;
    address_2: string;
}

interface ZipCodeData {
    pinCode: string;
    storeLocation: string;
    id?: number;
}
const ZipCodeUploadForm = () => {
    const { get_all_pincode, add_non_delivery_pincode, update_pincode, delete_pincode } = getUrlWithKey("store_locator");

    const [zipCode, setZipCode] = useState("");
    const [error, setError] = useState("");
    const [files, setFiles] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [allStoreLocatorDetails, SetAllStoreLocatorDetails] = useState<StoreLocator[]>([]);
    const [selectedStoreLocator, setSelectedStoreLocator] = useState<string>('');
    const [storeError, setStoreError] = useState("")
    console.log(files, "dfh351file")
    const [zipCodesData, setZipCodesData] = useState<{ pinCode: string; storeLocation: string }[]>([]);
    const [selectedRows, setSelectedRows] = useState<ZipCodeData[]>([]);

    const columns: TableColumn<ZipCodeData>[] = [
        {
            name: "",
            cell: (row) => (
                <Checkbox
                    checked={selectedRows.some((selected) => selected.id === row.id)}
                    onChange={() => {
                        setSelectedRows((prev) =>
                            prev.some((selected) => selected.id === row.id)
                                ? prev.filter((selected) => selected.id !== row.id)
                                : [...prev, row]
                        );
                    }}
                />
            ),
            width: "50px",
            ignoreRowClick: true,
        },
        {
            name: "Pin Code",
            selector: (row) => row.pinCode,
            sortable: true,
        },
        {
            name: "Store Location",
            selector: (row) => row.storeLocation,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex items-center space-x-2">
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                        <Tooltip title="Edit Pincode">
                            <Edit />
                        </Tooltip>
                    </IconButton>
                    <div className="w-[2px] h-8 rounded-md bg-slate-300" />
                    <IconButton color="error" onClick={() => handleDeleteClick(row)}>
                        <Tooltip title="Delete Pincode">
                            <Delete />
                        </Tooltip>
                    </IconButton>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleEdit = (row: ZipCodeData) => {
        // setZipCode(row.pinCode);
        // setSelectedStoreLocator(row.storeLocation);
        setIsEdit(true);
        setZipCode(row.pinCode);

        // Find the store ID from the store title
        const store = allStoreLocatorDetails.find(store => store.title === row.storeLocation);
        setSelectedId(row.id);
        setSelectedStoreLocator(store ? store.id : "");
        console.log("35sdf465s1d", row)
    };

    // Open the delete confirmation dialog
    const handleDeleteClick = async (row: any) => {
        console.log(row, "53d4fgh641df")
        setSelectedId(row.id);
        setOpenDialog(true)
    };

    // Close the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const handleDeleteAllClick = async () => {
        try {
            const idsToDelete = selectedRows.map((row) => row.id);
            const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/delete-multiple-pincodes`, {
                ids: idsToDelete
            });
            _SUCCESS(res?.data?.massage)
            handleCloseDialog();
            getAllPincode()
            setSelectedRows([])
            console.log(res?.data, "35sdf465s1d")
        } catch (error) {
            console.log(error)
        }
    }

    // Confirm Delete (Add delete logic here)
    const handleConfirmDelete = async () => {
        console.log("Deleting ID:", selectedId);
        // Add your delete logic here (API call or state update)
        try {
            const idsToDelete = selectedRows.map((row) => row.id);
            const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/delete-multiple-pincodes`, {
                ids: [selectedId]
            });
            _SUCCESS(res?.data?.massage)
            handleCloseDialog();
            getAllPincode()
            console.log(res?.data, "35sdf465s1d")
            // setOpenDialog(false);
        } catch (error) {
            console.log(error)
        }
    };

    // Handle Zip Code Input
    const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length > 6) return;
        setZipCode(value);
        setError("");
    };

    const getAllPincode = async () => {
        try {
            // const res = await _get(get_all_pincode)
            const res = await _get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-all-pincodes`);
            if (res && res?.status) {
                const formattedData = res.data.data.map((item: any) => ({
                    id: item.id,
                    pinCode: item.pincode || "N/A",
                    storeLocation: item.store_location?.title || "N/A",
                }));

                setZipCodesData(formattedData);

                console.log(res?.data?.data, "54fsdg5fds13")
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Handle Submit Button
    const handleSubmit = async () => {
        setError("");
        setStoreError("");

        if (zipCode.length !== 6) {
            setError("Pin Code must be exactly 6 digits.");
            return;
        }

        if (!selectedStoreLocator) {
            setStoreError("Please select a store.");
            return;
        }

        try {
            let res;
            if (!isEdit) {
                const formData = new FormData();
                formData.append("pincode", zipCode);
                formData.append("store_id", selectedStoreLocator);

                res = await _post(
                    `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-non-delivery-pincode`,
                    formData
                );
            } else {
                res = await _post(
                    `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-pincode`,
                    {
                        id: selectedId,
                        pincode: zipCode,
                        store_id: selectedStoreLocator
                    }
                );
                setIsEdit(false);
            }

            if (res?.status) {
                _SUCCESS(res?.data?.massage || "Operation successful");
                getAllPincode();
                setZipCode("");
                setSelectedStoreLocator("");
                setFiles(null);
            }
        } catch (error) {
            console.error("API call failed:", error);
            _ERROR(error?.response?.data?.massage || "An error occurred while processing your request.");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

            // Validate file type
            if (!allowedTypes.includes(selectedFile.type)) {
                _INFO("Invalid file type. Only Excel files (.xls, .xlsx) are allowed.");
                e.target.value = "";
                return;
            }

            setFiles(selectedFile);
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const res = await _post(
                    `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-non-delivery-pincode`,
                    formData
                );

                if (res?.status) {
                    _SUCCESS("File uploaded successfully.")
                    getAllPincode()
                    setTimeout(() => (
                        setFiles(null)
                    ), 3000)
                    // console.log("File uploaded successfully:", res);
                } else {
                    console.error("File upload failed:", res?.data.message);
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    // Drag & Drop Handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => setDragActive(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(e.dataTransfer.files[0]);
        }
    };

    const handleStoreLocatorChange = (event: any) => {
        setSelectedStoreLocator(event.target.value);
        setStoreError("")
    };


    const getAllStoreLocator = async () => {
        try {
            const res = await _put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-store-location`, {
                "page": 1,
                "rowsPerPage": 100000000000
            });
            SetAllStoreLocatorDetails(res?.data?.data?.sort((a: any, b: any) => a.title.localeCompare(b.title)) || []);
            console.log(res?.data?.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getAllStoreLocator();
        getAllPincode()
    }, []);



    return (
        <div className="flex items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xxl space-y-4 transition-all duration-300">

                {/* Pin Code Input */}
                <div className="flex space-x-4">
                    <TextField
                        label="Enter Pin Code"
                        type="text"
                        variant="outlined"
                        value={zipCode}
                        onChange={handleZipChange}
                        fullWidth
                        error={!!error}
                        helperText={error}
                    />
                    <FormControl fullWidth error={!!storeError}>
                        <InputLabel>Select Store</InputLabel>
                        <Select
                            label="Select Store"
                            value={selectedStoreLocator || ""}
                            onChange={handleStoreLocatorChange}
                        >
                            {/* <MenuItem value="" disabled>Select locator</MenuItem> */}
                            {allStoreLocatorDetails.length > 0 ? (
                                allStoreLocatorDetails.map((store) => (
                                    <MenuItem key={store.id} value={store.id}>
                                        {store.title}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">No stores available</MenuItem>
                            )}
                        </Select>
                        {storeError && <FormHelperText>{storeError}</FormHelperText>}
                    </FormControl>
                </div>

                {/* File Upload Section */}
                <div
                    className={`border-2 border-dashed ${dragActive ? "border-blue-500" : "border-gray-400"
                        } rounded-lg p-6 text-center cursor-pointer transition-all duration-300`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="fileUpload"
                        className="hidden"
                        onChange={handleFileChange} // Only one file is allowed
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                        <p className="text-gray-500">Drag and drop a file here or</p>
                        <Button
                            variant="outlined"
                            component="span"
                            className="!border-gray-500 !text-gray-700 hover:!bg-gray-200"
                            startIcon={<CloudUpload />}
                        >
                            Browse
                        </Button>
                    </label>
                    {/* <p className="text-sm text-gray-500 mt-2">Upload one file. Max File Size: 10MB</p> */}
                    {/* {files && <p>{files.name}</p>} */}
                    {files && (
                        <div className="flex items-center justify-center space-x-2 mt-2">
                            <p>{files.name}</p>
                            <IconButton color="error" size="small" onClick={() => setFiles(null)}>
                                <Close fontSize="small" />
                            </IconButton>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center">
                    <Button
                        variant="contained"
                        // fullWidth
                        className="!bg-sky-600 hover:!bg-sky-500 transition-all duration-300 !text-white w-1/3 !py-2"
                        onClick={handleSubmit}
                    >
                        {`${isEdit ? "Update Pincode" : "Submit Pincode"}`}
                    </Button>
                </div>


                {/* Data Table */}
                {/* <div style={{ marginTop: "35px" }}> */}
                <div style={{ marginTop: "35px" }} className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Pin Codes</h2>
                    <Button
                        disabled={selectedRows?.length === 0}
                        onClick={handleDeleteAllClick}
                        variant="contained"
                        color="error"
                    >
                        Delete All
                    </Button>
                </div>
                {/* <Button disabled={selectedRows?.length === 0 ? true : false} onClick={handleDeleteAllClick}>Delete All</Button> */}
                <DataTable
                    columns={columns}
                    data={zipCodesData}
                    pagination
                    highlightOnHover
                    responsive
                    customStyles={{
                        headRow: {
                            style: {
                                backgroundColor: "#267fc6",
                                fontWeight: "bold",
                                fontSize: "15px",
                                border: "1px solid #d1d5db",
                                color: "#fff"
                            },
                        },
                        headCells: {
                            style: {
                                border: "1px solid #d1d5db",
                                textAlign: "center",
                            },
                        },
                        rows: {
                            style: {
                                minHeight: "48px",
                                border: "1px solid #d1d5db",
                            },
                        },
                        cells: {
                            style: {
                                borderRight: "1px solid #d1d5db",
                                textAlign: "center",
                                fontSize: "14px",
                                fontFamily: "serif"
                            },
                        },
                    }}
                />
                {/* </div> */}

                {/* Delete PinCode Dialog Box */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle className="flex items-center">
                        <WarningAmber className="text-yellow-600 mr-2" /> Warning
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this Pin Code?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} sx={{
                            backgroundColor: "#2271b1", color: "#fff", "&:hover": {
                                backgroundColor: "#1a5a91",
                                color: "#fff",
                            },
                        }}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error" variant="contained">
                            Confirm Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        </div>
    );
};

export default ZipCodeUploadForm;
