import React, { useEffect } from 'react'
import Menue from '../../../Admin/containers/menue'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const MenuePage = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "menu" }))

  return (
    <div>
      <Menue />
    </div>
  )
}

export default withProtectedRoute(MenuePage)