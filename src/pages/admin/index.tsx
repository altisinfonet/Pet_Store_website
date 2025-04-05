import React from 'react'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../Admin/reducer/pageLinkReducer'
import withProtectedRoute from '../../Admin/services/withProtectedRoute'
import Dashboard from '../../Admin/containers/dashboard'

const HomePage = () => {

    let dispatch = useDispatch()

    dispatch(setPageLink({ key: "dashboard" }))

  return (
    <div>
        <Dashboard />
    </div>
  )
}

export default withProtectedRoute(HomePage)