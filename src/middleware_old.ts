// import { NextRequest } from 'next/server'
// import { isAuthenticated } from './src/services/context/AuthContext'
// import getUrlWithKey from './src/util/_apiUrl';
// // import { isAuthenticated } from '@lib/auth'
// const { signin, me } = getUrlWithKey("users");
// // Limit the middleware to paths starting with `/api/`
// // export const config = {
// //     matcher: '/api/:function*',
// // }

// export function middleware(request: NextRequest) {
//     // Call our authentication function to check the request

//     if (!false) {
//         // Respond with JSON indicating an error message
//         return Response.json(
//             { success: false, message: 'authentication failed' },
//             { status: 401 }
//         )
//     }
// }

// import { isAuthenticated } from "@/Utils/Auth";
import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getUrlWithKey from "./util/_apiUrl";
// import { isAuthenticated } from "./services/authCheck";


const protectedRoutes = ["/blogs"];


export default function middleware(req: NextRequest) {
  // console.log("con:: ", isAuthenticated());

  // const { me } = getUrlWithKey("users");

  // const fetch = async () => {
    
  //   try {
  //     const response = await axios.get(`${me}`, { withCredentials: true });
  //     console.log("middleware-response", response)
  //     if (response?.data && response?.data?.success && protectedRoutes.includes(req.nextUrl.pathname)) {
  //       const absoluteURL = new URL(req.nextUrl.pathname, req.nextUrl.origin);
  //       return NextResponse.redirect(absoluteURL.toString());
  //     }
  //   } catch (error) {
  //     console.log("middleware-response", error)
  //     if (!false && protectedRoutes.includes(req.nextUrl.pathname)) {
  //       const absoluteURL = new URL("/login", req.nextUrl.origin);
  //       return NextResponse.redirect(absoluteURL.toString());
  //     }
  //     // console.error('Error fetching data:', error);
  //     // router.push("/login");
  //   }
  // }

  // fetch();

  // if (!false && protectedRoutes.includes(req.nextUrl.pathname)) {
  //   const absoluteURL = new URL("/login", req.nextUrl.origin);
  //   return NextResponse.redirect(absoluteURL.toString());
  // }
}