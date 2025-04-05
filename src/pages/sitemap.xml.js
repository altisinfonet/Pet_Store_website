// pages/sitemap.xml.js

// import { getSortedPostsData } from "../lib/posts";
import getUrlWithKey from '../util/_apiUrl'
let getSortedPostsData = [
  { id: "tips-for-setting-a-daily-schedule-that-benefits-you-and-your-pet" }

];

const URL = "https://pinkstore.altisinfonet.in";

function generateSiteMap(product_slugs, product_category_slugs, product_attribute_terms, page_slugs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
     <!-- Add the static URLs manually -->
     <sitemap>
        <loc>${URL}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
     </sitemap>
     ${product_slugs
      .map(slug => {
        return `
           <sitemap>
               <loc>${`${URL}/product/${slug}`}</loc>
              <lastmod>${formatDate(new Date())}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>1.0</priority>
           </sitemap>
         `;
      })
      .join("")}
      ${product_category_slugs
      .map(slug => {
        return `
           <sitemap>
               <loc>${`${URL}/product_category${slug}`}</loc>
                <lastmod>${formatDate(new Date())}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.9</priority>
           </sitemap>
         `;
      })
      .join("")}
      ${product_attribute_terms
      .map(slug => {
        return `
           <sitemap>
               <loc>${`${URL}/shop${slug}`}</loc>
                <lastmod>${formatDate(new Date())}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
           </sitemap>
         `;
      })
      .join("")}
      ${page_slugs
      .map(slug => {
        return `
           <sitemap>
               <loc>${`${URL}${slug}`}</loc>
                <lastmod>${formatDate(new Date())}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.7</priority>
           </sitemap>
         `;
      })
      .join("")}
   </sitemapindex>
 `;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export async function getServerSideProps({ res }) {
  // const posts = getSortedPostsData();
  const { sitemap_items } = getUrlWithKey("commons")
  const ress = await fetch(`${sitemap_items}`)
  const data = await ress.json()

  // Generate the XML sitemap with the blog data

  const sitemap = generateSiteMap(data?.data?.product_slugs, data?.data?.product_category_slugs, data?.data?.product_attribute_terms, data?.data?.page_slugs);

  res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() { }
