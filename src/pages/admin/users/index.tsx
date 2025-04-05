import React, { useEffect } from 'react'
import UsersPage from '../../../Admin/containers/users'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Categories = () => {

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageLink({ key: "users" }))
  }, [])

  return (
    <div>
      <UsersPage />
    </div>

  )
}

export default withProtectedRoute(Categories)