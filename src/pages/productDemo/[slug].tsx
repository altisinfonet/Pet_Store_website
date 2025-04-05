// import { GetStaticProps } from 'next';
// import Productdetails from '../../containers/client/productdetails';
// import axios from "axios";
// import { useRouter } from 'next/router';

// interface ProductPageProps {
//     productData: any[];
// }

// const ProductPage: React.FC<ProductPageProps> = ({ productData }) => {
//     return (
//         <div>
//             <Productdetails productData={productData} />
//         </div>
//     );
// };

// export const getStaticProps: GetStaticProps<ProductPageProps> = async () => {
//     // Fetch store data from an API or database
//     const router = useRouter();
//     const { slug }: any = router.query;


//     let slugUrl = `${process.env.NEXT_PUBLIC_API_URL}` + `${process.env.NEXT_PUBLIC_API_SLUG}/front-get-product/` + slug
//     const res: any = await axios.get(slugUrl);
//     const productData: any[] = await res.data.data;

//     return {
//         props: {
//             productData,
//         },
//     };
// };

// export default ProductPage;

import React from 'react'

const OpenUpperCode = () => {
  return (
    <div>OpenUpperCode</div>
  )
}

export default OpenUpperCode