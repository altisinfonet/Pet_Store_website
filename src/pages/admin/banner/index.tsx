import React, { useEffect } from 'react'
import Banner from '../../../Admin/containers/banner'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const BannerPage = () => {

    let dispatch = useDispatch()

    useEffect(() => {
      dispatch(setPageLink({ key: "banner" }))
    }, [])

    return (
        <div>
            <Banner />
        </div>
    )
}

export default withProtectedRoute(BannerPage)