import React, { useEffect } from 'react'
import StoreLocator from '../../../Admin/containers/storeLocator'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const StoreLocatorePage = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "storeLocatore" }))

  return (
    <div><StoreLocator /></div>
  )
}

export default withProtectedRoute(StoreLocatorePage)