import Link from 'next/link'
import React from 'react'

const ShipingPolicy = () => {
    return (
        <div className='container ppl'>
            <div className='mt-4 w-full'>
                <div className="flex items-center justify-center w-full uppercase font-medium ppsL">
                    <h1 className="sp-title" style={{ fontSize: "150%" }}>SHIPPING POLICY</h1>
                </div>
            </div>

            <div className='mt-4'>
                <div className='pp_content_cls'>
                    <p>We process orders on all weekdays (Monday to Saturday), excluding public holidays.</p>
                    <p>Orders are normally dispatched within 24 hours and usually take 1-3 working days to be delivered based on your location. However, custom-made products will take longer to ship than others. You will receive an approximate timeline when you place your order. Generally, custom-made products could take between 7-10 days to reach you’.</p>
                    <p>To ensure that your order reaches you quickly and in good condition, we only ship through reputed courier agencies.</p>
                </div>
            </div>
        </div>
    )
}

export default ShipingPolicy