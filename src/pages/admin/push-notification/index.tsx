import React from 'react'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import PushNotification from '../../../Admin/containers/pushNotification'

const PushNotificationPage = () => {
    let dispatch = useDispatch()

    dispatch(setPageLink({ key: "push-notification" }))
    return (
        <div className=''>
            <PushNotification />
        </div>
    )
}

export default withProtectedRoute(PushNotificationPage)