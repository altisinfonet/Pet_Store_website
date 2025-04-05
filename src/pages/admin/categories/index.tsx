import React, { useEffect } from 'react'
import CategoriesPage from '../../../Admin/containers/categories'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Categories = () => {

  let dispatch = useDispatch()

        dispatch(setPageLink({ key: "products", subKey: "categories" }))

  return (
    <div><CategoriesPage /></div>

  )
}

export default withProtectedRoute(Categories)