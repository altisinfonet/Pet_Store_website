import React, { useEffect } from 'react'
import RepeaterTable from '../../../Admin/components/repeaterTable'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'
import getUrlWithKey from '../../../Admin/util/_apiUrl'

const FeaturedProducts = () => {

  const { get_feature_section, create_feature_section_rank, create_feature_section_product, update_feature_section, delete_feature_section } = getUrlWithKey("feature_seation");
  
  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "products", subKey: "featuredProducts" }))

  return (
    <div>
      <RepeaterTable
        repeaterType={"featuredProducts"}
        repeaterHeader={"Featured Products"}
        name={"Product's"}
        listedProductGetUrl={get_feature_section}
        listedProductCreateUrl={create_feature_section_rank}
        listedProductUpdateUrl={update_feature_section}
        addProductToListUrl={create_feature_section_product}
        listedProductDeleteUrl={delete_feature_section}
      />
    </div>
  )
}

export default withProtectedRoute(FeaturedProducts)