import React from 'react'
import Wishlist from '../../containers/client/wishList'
import MetaHead from '../../templates/meta'

const index = () => {
    return (
        <div>
            <MetaHead meta_title="wishlist" meta_description="wishlist" keywords={"keywords"} />
            <Wishlist listType="WISHLIST" />
        </div>
    )
}

export default index