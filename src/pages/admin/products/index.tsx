import React, { useEffect } from 'react'
import Products from '../../../Admin/containers/products'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Product = () => {

    let dispatch = useDispatch()

    dispatch(setPageLink({ key: "products", subKey: "allProducts" }))

    return (
        <Products />
    )
}

export default withProtectedRoute(Product)