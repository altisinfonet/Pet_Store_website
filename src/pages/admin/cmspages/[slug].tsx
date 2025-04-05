import React, { useEffect, useState } from 'react'
import TextField from '../../../Admin/components/TextField';
import CreateIcon from '@mui/icons-material/Create';
import Link from 'next/link';
import CkEditor from '../../../Admin/components/CkEditor';
import PinkPawsbutton from '../../../Admin/components/PinkPawsbutton';
import { _get, _post } from '../../../Admin/services';
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import { useRouter } from 'next/router';
import { _SUCCESS } from '../../../Admin/util/_reactToast';
import ActionDrop from '../../../Admin/components/ActionDrop';
import withProtectedRoute from '../../../Admin/services/withProtectedRoute';
import { Checkbox } from '@mui/material';
import { getAdminSetting, getStatus } from '../../../Admin/util/_common';
import SimpleCard from '../../../Admin/components/SimpleCard';
import TextAreaField from '../../../Admin/components/TextAreaField';

const Page = ({ newPage }: any) => {
  const router = useRouter();
  const { slug }: any = router.query;

  const [editProductName, setEditProductName]: any = useState(false);
  const [pageName, setPageName]: any = useState("");
  const [openPermalink, setOpenPermalink] = useState(false);
  const [permalink, setPermalink]: any = useState("");
  const [pageDetails, setPageDetails]: any = useState({});
  const [pageDescription, setPageDescription]: any = useState();
  const [productShortDescription, setProductShortDescription]: any = useState();
  const [actionValue, setActionValue] = useState("default");
  const [metaId, setPageMetaId] = useState();
  const [dMetaId, setDPageMetaId] = useState();
  const [metaInfoMetaId, setMetaInfoMetaId] = useState("");
  const [meta, setMeta] = useState();
  const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded`;
  const [statusDropdown, setStatusDropdown] = useState<any[]>([]);
  const [statusAction, setStatusAction] = useState<string>("");
  const [pageMetaInfo, setPageMetaInfo] = useState({
    meta_title: "",
    meta_description: "",
    meta_key: ""
  });
  const [pageMetaInfoMeta_description, setPageMetaInfoMeta_description]: any = useState()
  const [noDisplayPage, setNoDisplayPage] = useState<boolean>(false);
  const [newSlug, setNewSlug] = useState<string>("");

  useEffect(() => {
    setPageMetaInfo((pre) => ({
      ...pre,
      meta_description: pageMetaInfoMeta_description
    }))
  }, [pageMetaInfoMeta_description])

  const { get_page_by_slug, update_page, create_page, admin_get_slug, get_template, delete_page } = getUrlWithKey("pages");

  const onEditPermalink = (pl: any) => {
    setOpenPermalink(true)
    setPermalink(pl)
  }

  const updatePage = async () => {
    try {
      if (pageDetails && pageDetails?.id) {
        const dataSet = {
          page_id: pageDetails?.id,
          title: pageName,
          slug: permalink,
          description: pageDescription,
          status_id: +statusAction,
          meta: [
            {
              page_meta_id: metaId,
              key: "page_template",
              value: {
                data: actionValue,
                redirect: actionValue ? actionValue !== 'default' && true : false,
                _redirect: `/${actionValue}`
              },
            },
            {
              page_meta_id: dMetaId,
              key: "_not_page",
              value: {
                data: noDisplayPage,
              },
            },
            {
              page_meta_id: metaInfoMetaId,
              key: "_meta_info",
              value: pageMetaInfo,
            },
          ]
        }
        const { data } = await _post(update_page, dataSet);
        if (data?.success) {
          _SUCCESS("Page Updated Successfully!");
          router.push(`/admin/cmspages`);
        }
      } else {
        const dataSet = {
          page_id: pageDetails?.id,
          title: pageName,
          slug: permalink,
          description: pageDescription,
          status_id: +statusAction,
          meta: [
            {
              key: "page_template",
              value: {
                data: actionValue,
                redirect: actionValue ? actionValue !== 'default' && true : false,
                _redirect: `/${actionValue}`
              },
            },
            {
              key: "_not_page",
              value: {
                data: noDisplayPage,
              },
            },
            {
              key: "_meta_info",
              value: pageMetaInfo,
            },
          ]
        }
        //console.log("dataSet-page-create", dataSet);return;
        const { data } = await _post(create_page, dataSet);
        if (data?.success) {
          _SUCCESS("Page Craeted Successfully!");
          router.push(`/admin/cmspages`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchPage = async (onlyMeta?: boolean) => {
    try {
      const { data } = await _get(`${get_page_by_slug}/${slug}`);

      if (data?.success && data?.data && !onlyMeta) {
        setPageName(data?.data?.title);
        setPageDetails(data?.data);
        setPermalink(data?.data?.slug);
        setPageDescription(data?.data?.description);
        setStatusAction(data?.data?.status_id);
        if (data?.data?.page_metas && data?.data?.page_metas?.length) {
          for (let d = 0; d < data.data.page_metas.length; d++) {
            let da = data.data.page_metas[d];
            if (da['key'] === "page_template") {
              setActionValue(da['value']['data']);
              setPageMetaId(da['page_meta_id']);
            }
            if (da['key'] === "_not_page") {
              setNoDisplayPage(da['value']['data']);
              setDPageMetaId(da['page_meta_id']);
            }
            if (da['key'] === "_meta_info") {
              setPageMetaInfo(da['value']);
              setMetaInfoMetaId(da['page_meta_id']);
            }
          }
        }
      }
      if (data?.success && data?.data && onlyMeta && !newPage) {
        console.log("slug-page-data", data);
        if (data?.data?.page_metas && data?.data?.page_metas?.length) {
          for (let d = 0; d < data.data.page_metas.length; d++) {
            let da = data.data.page_metas[d];
            if (da['key'] === "_meta_info") {
              setPageMetaInfo(da['value']);
              setMetaInfoMetaId(da['page_meta_id']);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchSlug = async () => {
    if (pageName) {
      try {
        const { data } = await _get(`${admin_get_slug}/${pageName}`);
        if (data?.success && data?.data) {
          setNewSlug(data?.data?.data);
          setPermalink(data?.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // const actionArray = [
  //   { value: "default", name: "Default Template" },
  //   { value: "cart", name: "Cart Template" },
  // ]
  const [actionArray, setActionArray] = useState<{ value: string, name: string }[]>([
    { value: "default", name: "Full Width" },
    { value: "home_page", name: "Home Page" }
  ]);
  const fetchTemplates = async () => {
    try {
      const { data } = await _get(`${get_template}`);
      if (data?.success && data?.data) {
        setActionArray(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }



  const handleChangeAction = (e: any) => {
    console.log("handleChangeAction", e);
    setActionValue(e.target.value);
  }

  const handleStatusChangeAction = (e: any) => {
    console.log("handleChangeAction", e);
    setStatusAction(e.target.value);
  }

  const handelApply = async () => {
    // try {
    //   if (pageDetails && pageDetails?.id) {
    //     const dataSet = {
    //       page_id: pageDetails?.id,
    //       key: "page_template",
    //       value: {
    //         data: actionValue,
    //         redirect: actionValue ? actionValue !== 'default' && true : false,
    //         _redirect: `/${actionValue}`
    //       },
    //     }
    //     const { data } = await _post(update_page, { meta: dataSet });
    //     if (data?.success) {
    //       _SUCCESS("Page Template Updated Successfully!");
    //     }
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  const handelNoDisplayPage = (e: any) => {
    setNoDisplayPage(e?.target?.checked)
  }

  const handelDefaultMeta = async (e: any) => {
    if (e?.target?.checked) {
      const dataSet = await getAdminSetting("_DEFAULT_META_INFO");
      if (dataSet?.id) {
        dataSet?.meta_description && setPageMetaInfo((pre: any) => ({
          ...pre,
          meta_description: dataSet?.meta_description
        }));

        dataSet?.meta_keyword && setPageMetaInfo((pre: any) => ({
          ...pre,
          meta_key: dataSet?.meta_keyword
        }));

        dataSet?.meta_title && setPageMetaInfo((pre: any) => ({
          ...pre,
          meta_title: dataSet?.meta_title
        }));
      }
      console.log("dataset", dataSet);
    } else {
      if (newPage) {
        setPageMetaInfo({
          meta_title: "",
          meta_description: "",
          meta_key: ""
        });
        setMetaInfoMetaId("");
      } else {
        fetchPage(true);
      }
    }
  }

  useEffect(() => {
    if (slug && !newPage) {
      fetchPage();
    }
    fetchTemplates();
  }, [slug]);

  useEffect(() => {
    const getStatusArr = async () => {
      try {
        const statusarr: any[] = await getStatus();
        const f = statusarr.filter((item: any, _) => item?.title === "Draft");
        const fs = statusarr.filter((item: any, _) => item?.title !== "Pending Review");
        setStatusAction(f[0]?.id);
        setStatusDropdown(fs);
      } catch (error) {
        console.log(error);
      }
    }
    getStatusArr();
  }, [])


  return (
    <div className='flex flex-col gap-4'>
      <div className='w-full border border-solid shadow-md rounded h-12'>
        <div className='flex flex-row items-center justify-between !h-full'>
          <TextField
            className={`w-full !h-full !text-[120%] ${field_text_Cls}`}
            textFieldRoot='w-full !h-full'
            autoFocus={newPage ? true : false}
            value={pageName}
            name='permalink'
            blur={() => { fetchSlug(); }}
            handelState={(e: any) => setPageName(e.target.value)}
            placeholder='Add Title'
          />
          {/* {!newPage && <CreateIcon className='!h-5 !w-auto cursor-pointer' onClick={() => { setEditProductName(true) }} />} */}
        </div>
      </div>
      {!newPage && <div className='flex items-center gap-1'>
        <span>Permalink:</span>
        {openPermalink ?
          <div className='flex flex-row items-center flex-wrap gap-1'>
            {process.env.NEXT_PUBLIC_BASE_URL}/
            <TextField
              className={`w-full ${field_text_Cls}`}
              textFieldRoot='w-full'
              autoFocus={true}
              value={permalink}
              name='permalink'
              blur={() => setOpenPermalink(false)}
              handelState={(e: any) => setPermalink(e.target.value)}
            />
          </div>
          :
          <Link target='_blank' href={`${process.env.NEXT_PUBLIC_BASE_URL}/${permalink ? permalink : pageDetails?.slug}`}>{process.env.NEXT_PUBLIC_BASE_URL}/{permalink ? permalink : pageDetails?.slug}</Link>}
        <CreateIcon className='!h-5 !w-auto cursor-pointer' onClick={() => onEditPermalink(permalink ? permalink : pageDetails?.slug)} />
      </div>}

      {
        newSlug && <div className='flex items-center gap-1'>
          <span>Permalink:</span>
          {openPermalink ?
            <div className='flex flex-row items-center flex-wrap gap-1'>
              {process.env.NEXT_PUBLIC_BASE_URL}/
              <TextField
                className={`w-full ${field_text_Cls}`}
                autoFocus={true}
                value={permalink}
                name='permalink'
                blur={() => setOpenPermalink(false)}
                handelState={(e: any) => setPermalink(e.target.value)}
              />
            </div>
            :
            <Link target='_blank' href={`${process.env.NEXT_PUBLIC_BASE_URL}/${permalink ? permalink : pageDetails?.slug}`}>{process.env.NEXT_PUBLIC_BASE_URL}/{permalink ? permalink : pageDetails?.slug}</Link>}
          <CreateIcon className='!h-5 !w-auto cursor-pointer' onClick={() => onEditPermalink(permalink ? permalink : pageDetails?.slug)} />
        </div>
      }

      {/* product description */}
      <SimpleCard childrenClassName={`flex flex-col items-center justify-center gap-2 !p-0`} headingClassName='!bg-white' heading={<span className='font-medium'>Page description</span>}>
        <div className='p-4 flex flex-col gap-2 w-full'>
          <CkEditor
            value={pageDescription}
            handleChange={setPageDescription}
          />
        </div>
      </SimpleCard>

      <SimpleCard childrenClassName={`flex flex-col items-center justify-center gap-2 !p-4`} headingClassName='!bg-white' heading={<span className='font-medium'>Page settings</span>}>

        <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 w-full'>
          <div className='flex flex-col w-full'>
            <p className=''>Page Template</p>
            <ActionDrop
              btnValue="Apply"
              selectFieldRootCls='!w-full'
              handleChange={handleChangeAction}
              menuItemArray={actionArray}
              value={actionValue}
              handleClick={() => handelApply()}
              btn
            // handleClick={() => actionValue === "restore" && handleToggle()}
            />
          </div>

          <div className='flex flex-col w-full'>
            <p className=''>Display Status</p>
            <ActionDrop
              btnValue="Apply"
              selectFieldRootCls='!w-full'
              handleChange={handleStatusChangeAction}
              menuItemArray={statusDropdown}
              value={statusAction}
              handleClick={() => handelApply()}
              btn
              needId={true}
              needtitle={true}
            />
          </div>

          <div className='flex w-full items-center'>
            <Checkbox className='!pr-2 !py-1 !p-0' checked={noDisplayPage} onChange={handelNoDisplayPage} />
            <p className=''> Display not as a Page?</p>
          </div>
        </div>
      </SimpleCard>

      <SimpleCard
        childrenClassName={`flex flex-col items-center justify-center gap-2 !p-4`}
        headingClassName='!bg-white'
        heading={
          <div className='flex items-center w-full gap-4'>
            <span className='font-medium'>Meta Information</span>
            <hr className='border-l border-solid h-6' />
            <div className='flex items-center'>
              <Checkbox className='!pr-2 !py-1 !p-0' onChange={handelDefaultMeta} />
              <p className=''> Use Default Meta Information?</p>
            </div>
          </div>
        }>
        <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 w-full'>

          <div className='flex flex-col w-full'>
            <p className=''>Meta Title</p>
            <TextField
              className={`w-full ${field_text_Cls}`}
              textFieldRoot='w-full'
              value={pageMetaInfo?.meta_title}
              name='Meta Title'
              handelState={(e: any) => setPageMetaInfo((pre) => ({
                ...pre,
                meta_title: e.target.value
              }))}
            />
          </div>

          <div className='flex flex-col w-full'>
            <p className=''> Meta Keywords</p>
            <TextField
              className={`w-full ${field_text_Cls}`}
              textFieldRoot='w-full'
              value={pageMetaInfo?.meta_key}
              name='Meta Keywords'
              handelState={(e: any) => setPageMetaInfo((pre) => ({
                ...pre,
                meta_key: e.target.value
              }))}
            />
          </div>
        </div>
        <div className='w-full'>
          <div className='flex flex-col w-full'>
            <p className=''>Meta Description</p>
            {/* <TextField
              className={`w-full ${field_text_Cls}`}
              textFieldRoot='w-full'
              value={pageMetaInfo?.meta_description}
              name='Meta Description'
              handelState={(e: any) => setPageMetaInfo((pre) => ({
                ...pre,
                meta_description: e.target.value
              }))}
            /> */}
            {/* <CkEditor
              value={pageMetaInfoMeta_description || pageMetaInfo?.meta_description}
              handleChange={setPageMetaInfoMeta_description}
            /> */}
            <TextAreaField
              className={`w-full ${field_text_Cls}`}
              textareaRoot='w-full'
              value={pageMetaInfo?.meta_description}
              name='Meta Description'
              handelState={(e: any) => setPageMetaInfo((pre: any) => ({
                ...pre,
                meta_description: e.target.value
              }))}
            />
          </div>
        </div>
      </SimpleCard>
      <div className='flex justify-end w-full'>
        <PinkPawsbutton disabled={!pageName} name='Save Page' pinkPawsButtonExtraCls='text-lg font-semibold' handleClick={() => pageName ? updatePage() : null} />
      </div>
    </div>
  )
}

export default withProtectedRoute(Page)
