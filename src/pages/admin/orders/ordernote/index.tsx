import React, { useEffect } from 'react'
import OrdersNote from '../../../../Admin/containers/orders/orderNote'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../../Admin/reducer/pageLinkReducer'

const OrderNote = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "orders" }))

  return (
    <div>
      <OrdersNote />
    </div>
  )
}

export default OrderNote