import React from 'react'
import OrderPage from '../../containers/client/order'
import MetaHead from '../../templates/meta'

const Order = () => {
  return (
    <div>
      <MetaHead meta_title="order" meta_description="order" keywords={"keywords"}/>
      <OrderPage />
    </div>
  )
}

export default Order