import React, { useEffect } from 'react'
import Page from '../[slug]'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../../Admin/reducer/pageLinkReducer'

const CreatePage = () => {

    let dispatch = useDispatch()

      dispatch(setPageLink({ key: "pages" }))

    return (
        <div>
            <Page newPage={true} />
        </div>
    )
}

export default CreatePage
