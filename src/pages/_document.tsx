import { Html, Head, Main, NextScript } from "next/document";
import { useRouter } from "next/router";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon/favicon.png" />

        <meta charSet="utf-8" />

        {/* <link href="assets/animation/animations.min.css" rel="stylesheet" /> */}
        {/* <script type="text/javascript" src="assets/js/bootstrap.bundle.min.js" async></script>
        <script type="text/javascript" src="assets/js/jquery-3.6.0.min.js" async></script> */}
        {/* <link rel="canonical" href="https://pinkstore.altisinfonet.in/" /> */}
        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FF4P7D6YJQ"></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-FF4P7D6YJQ');`}
        </script>

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
