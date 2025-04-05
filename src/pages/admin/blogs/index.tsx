import React, { useEffect } from 'react'
import Blogs from '../../../Admin/containers/blogs'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Blog = () => {

    let dispatch = useDispatch()

        dispatch(setPageLink({ key: "blogs", subKey: "allBlogs" }))

    return (
        <Blogs />
    )
}

export default withProtectedRoute(Blog)