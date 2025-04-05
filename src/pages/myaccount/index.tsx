import React from 'react'
import MyAccount from '../../containers/client/myAccount'
import MetaHead from '../../templates/meta'

const index = () => {
    return (
        <div>
            <MetaHead meta_title="my account" meta_description="my account" keywords={"keywords"} />
            <MyAccount />
        </div>
    )
}

export default index