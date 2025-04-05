import React, { useState } from 'react'
import PinkPawsbutton from '../PinkPawsbutton';

const Cart = () => {
  const [check, setCheck] = useState(false);
  return (
    <div>
      This is Component Cart Page...
      <PinkPawsbutton name={'Check State'} variant={"solid"} handleClick={() => setCheck(!check)} />
      <p>{check ? "Check State True" : "Check State False"}</p>
    </div>
  )
}

export default Cart
