import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import { useRead } from '../../../Admin/hooks';
import { _SUCCESS } from '../../../Admin/util/_reactToast';
import RightSideModal from '../../../Admin/components/RightSideModal';
import ActionDrop from '../../../Admin/components/ActionDrop';
import withProtectedRoute from '../../../Admin/services/withProtectedRoute';
import { useDispatch } from 'react-redux';
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer';

const Settings = () => {
    const { getUserReviewPermission, updateReviewPermission } = getUrlWithKey("users");

    const [openFullModal, setOpenFullModal] = useState(false);
    const [actionValue, setActionValue] = useState(1);
    const route = useRouter();

    const { sendData: permissionData }: any = useRead({ selectMethod: "get", url: getUserReviewPermission });

    useEffect(() => {
        setOpenFullModal(true);
    }, []);


    useEffect(() => {
        if (permissionData?.id) {
            setActionValue(permissionData?.code)
        }
    }, [permissionData])

    console.log('permissionData: ', permissionData);
    const actionArray = [
        { value: 1, name: "Verified Buyer" },
        { value: 2, name: "Verified User" },
    ]

    const handleChangeAction = async (e: any) => {
        let updatedPermission = e.target.value;
        setActionValue(e.target.value);
        if (actionValue) {
            const { data } = await axios.post(`${updateReviewPermission}`, { review_permission_code: +updatedPermission });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                route.push('/admin/reviews');
            }
        }
    }

    const handelApply = async () => {
        console.log("handelApply", actionValue);
        // if (actionValue === 'delete' && checked?.length) {
        //     const { data } = await axios.post(`${delete_multiple_product_category}`, { product_category_ids: checked });
        //     if (data?.success) {
        //         console.log("handelApply-data", data);
        //         _SUCCESS(data?.massage);
        //         setFields(defaultFieldSet);
        //         setPageNo(1)
        //         setGetProd({ page: pageNo, rowsPerPage: 10 })
        //         setActionValue("bulkAction");
        //         setChecked([]);
        //         setTotalCategoryGetUrl(total_items_category);
        //     }
        // }
    }

    let dispatch = useDispatch()

    dispatch(setPageLink({ key: "reviews", subKey: "reviewsSettings" }))

    return (
        <div>
            <RightSideModal modalStat={openFullModal} handleClose={() => { setOpenFullModal(false); route.push('/admin/reviews'); }} heading={'Update Review Global Setting'} widthClss='lg:w-[24vw]'>
                <div className=' flex items-start gap-2.5'>
                    <div className='flex w-full flex-col'>
                        <ActionDrop
                            btnValue="Apply"
                            selectFieldRootCls='!w-full'
                            handleChange={handleChangeAction}
                            menuItemArray={actionArray}
                            value={actionValue}
                            btn={true}
                        // handleClick={() => handelApply()}
                        // handleClick={() => actionValue === "restore" && handleToggle()}
                        />
                    </div>
                </div>
            </RightSideModal>
        </div>
    )
}

export default withProtectedRoute(Settings)