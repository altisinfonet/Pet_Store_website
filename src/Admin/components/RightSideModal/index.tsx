import { Box, Drawer, Modal } from '@mui/material';
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: "60%",
    bgcolor: 'background.paper',
    border: '0px solid #fff',
    boxShadow: 24,
    borderRadius: "6px",
    outline: "none"
};

const RightSideModal = ({ modalStat, handleClose, children, heading, widthClss }: Props) => {

    return (
        <div>
            <Modal
                // anchor={"right"}
                open={modalStat}
                onClose={() => handleClose()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={`${widthClss || 'lg:w-[60vw] w-[90vw]'} bg-white flex flex-col relative overflow-auto max-h-[80vh] h-fit !rounded-md pb-4 px-4`}>
                        <div className='sticky top-0 z-50'>
                            {/* <div className='flex items-center justify-between px-4 py-3 text-black bg-white shadow-md'> */}
                            <div className='flex items-center justify-between pb-3 pt-4 text-black bg-white '>
                                <p className='text-base font-semibold'>{heading}</p>
                                <div onClick={() => handleClose()} className='cursor-pointer'><CloseIcon /></div>
                            </div>
                            <div className='border-b border-solid border-[#a4abb6]'/>
                        </div>
                        <div className='pt-4'>{children}</div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

interface Props {
    modalStat: boolean;
    handleClose: CallableFunction;
    children?: any;
    heading?: string;
    widthClss?: string;
}

export default RightSideModal
