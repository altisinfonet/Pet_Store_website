import React from 'react'
import ThankYouPage from '../../containers/client/thankYou'
import MetaHead from '../../templates/meta'

const ThankYou = () => {
  return (
    <div>
      <MetaHead meta_title="thankyou" meta_description="thankyou" keywords={"keywords"} />
      <ThankYouPage />
    </div>
  )
}

export default ThankYou