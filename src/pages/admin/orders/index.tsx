import React, { useEffect } from 'react'
import Orders from '../../../Admin/containers/orders'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const OrdersPage = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "orders" }))

  return (
    <div><Orders /></div>
  )
}

export default withProtectedRoute(OrdersPage)