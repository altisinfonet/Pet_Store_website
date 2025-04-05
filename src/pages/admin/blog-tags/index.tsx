import React, { useEffect } from 'react'
import BlogTagPage from '../../../Admin/containers/blogTags'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Tags = () => {

  let dispatch = useDispatch()

    dispatch(setPageLink({ key: "blogs", subKey: "blogTags" }))

  return (
    <div><BlogTagPage /></div>

  )
}

export default withProtectedRoute(Tags)