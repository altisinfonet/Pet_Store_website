import React from 'react'
import AddNotification from '../../../../Admin/containers/pushNotification/addNotification'
import withProtectedRoute from '../../../../Admin/services/withProtectedRoute'
import { setPageLink } from '../../../../Admin/reducer/pageLinkReducer'
import { useDispatch } from 'react-redux'

const AddNotificationPage = () => {
    let dispatch = useDispatch()

    dispatch(setPageLink({ key: "add-notification" }))
    return (
        <>
            <AddNotification/>
        </>
    )
}

export default withProtectedRoute(AddNotificationPage)