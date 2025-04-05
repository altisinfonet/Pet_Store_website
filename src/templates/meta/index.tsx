import Head from 'next/head';
import { useRouter } from 'next/router';

const MetaHead = ({ meta_title, meta_description, meta_image, newMenuArrData, URL, keywords }: any) => {


    const router = useRouter()

    console.log(router?.asPath, "router_pathanem")

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
                <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
                <link rel="stylesheet" href="assets/css/all.css" />
                <link rel="stylesheet" href="assets/css/fontawesome.css" />
                <link rel="stylesheet" href="assets/css/slick.css" />
                <link rel="stylesheet" href="assets/css/slick-theme.css" />
                <link rel="stylesheet" href="assets/css/style.css" />
                <link rel="stylesheet" href="assets/css/styleII.css" />
                <link rel="stylesheet" href="assets/css/pp_library.css" />
                <link rel="stylesheet" href="assets/animation/animations.min.css" />
                {/* <script type="text/javascript" src="assets/js/bootstrap.bundle.min.js" async></script>
            <script type="text/javascript" src="assets/js/jquery-3.6.0.min.js" async></script> */}

                <title>{meta_title || 'PinkPaws Store'}</title>
                <meta name="description" content={meta_description || 'Wellcome to PinkPaws'} />
                <meta name="keywords" content={keywords ? keywords : 'Default keywords'} />

                {/* Open Graph / Facebook */}
                <meta property="og:title" content={meta_title || 'PinkPaws Store'} />
                <meta property="og:description" content={meta_description || 'Wellcome to PinkPaws'} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:image" content={meta_image || "/assets/icon/ppslog.png"} /> {/* Update with the actual PinkPaws image URL */}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta_title || 'PinkPaws Store'} />
                <meta name="twitter:description" content={meta_description || 'Wellcome to PinkPaws'} />
                <meta name="twitter:image" content={meta_image || "/assets/icon/ppslog.png"} /> {/* Update with the actual PinkPaws image URL */}

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />

                {/* Additional SEO tags */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />

                {/* Charset */}
                <meta charSet="UTF-8" />

                {/* Theme color */}
                <meta name="theme-color" content="#000000" />
                <link rel="canonical" href={`https://pinkstore.altisinfonet.in${router?.asPath}`} />
            </Head>
            <h1 className='d-none'>{meta_title || 'PinkPaws Store'}</h1>
        </>
    );
}

export default MetaHead;
