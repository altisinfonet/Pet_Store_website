import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import breed from "../../../public/assets/icon/breed-1.png"


import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { capitalize } from '../../util/_common'
import { setLinkName } from '../../reducer/linkNameReducer'
import { useDispatch } from 'react-redux'

const MegaMenu1 = ({ menueArr, megaMenuClose, menueCloseMouseLeave }: any) => {
  const router = useRouter()
  const dispatch = useDispatch()


  const listingType = useSelector((state: any) => state?.listingTypeReducer?.value)
  const [menuLoopType, setMenuLoopType]: any = useState([])
  useEffect(() => {
    if (listingType?.type === "sbb") {
      const _SBB = menueArr?.length ? menueArr?.filter((val: any) => val?.menu_item_id?.name === "SHOP BY BREED").map((v: any, i: number) => v?.menu_item_id?.options) : null
      if (_SBB?.length) {
        setMenuLoopType(..._SBB)
      }
    }
  }, [listingType])


  const groupSize = 8; // Define the size of each group

  const newMenuLoop = [];
  for (let i = 0; i < menuLoopType?.length; i += groupSize) {
    newMenuLoop.push(menuLoopType?.slice(i, i + groupSize));
  }


  return (
    <>
      <div className="container-mgm fade-down z-index-999 position-relative">
        {/* <div className="mega-menu" style={{ overflowY: "auto", height: "20rem" }}> */}
        <div className="mega-menu overflowY-auto h-20rem" onMouseLeave={menueCloseMouseLeave}>


          {newMenuLoop?.length ? newMenuLoop.map((v: any, i: number) =>
            <div key={i} className={`${i >= 1 ? `mt-4 pt-2` : ``} row`}>
              {v?.length ? v.map((val: any, idx: number) =>
                <div key={idx} className="col cursor-pointer" onClick={() => { router.push(`/shop/breed/${val?.slug}`); megaMenuClose(); dispatch(setLinkName(val?.name)) }}>
                  <Link href={`/shop/breed/${val?.slug}`}>
                    <div><img src={val?.productTermImage?.image || "/assets/icon/breed-1.png"} alt="Megamenu-img" className={`breed-mg`} width={100} height={98} sizes="(min-width: 100px) 50vw, 100vw" /></div>
                    <h5 className='breed-title uppercase'>{val?.name}</h5>
                  </Link>
                </div>) : null}
            </div>) : null}
        </div>
      </div>


    </>
  )
}

export default MegaMenu1