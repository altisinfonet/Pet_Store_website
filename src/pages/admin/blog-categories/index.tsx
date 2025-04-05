import React, { useEffect } from 'react'
import BlogCategoriesPage from '../../../Admin/containers/blogCategories'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Categories = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "blogs", subKey: "blogCategories" }))

  return (
    <div><BlogCategoriesPage /></div>

  )
}

export default withProtectedRoute(Categories)