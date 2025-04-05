import React, { useEffect } from 'react'
import TagPage from '../../../Admin/containers/tags'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Tags = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "products", subKey: "tags" }))

  return (
    <div><TagPage /></div>

  )
}

export default withProtectedRoute(Tags)