import { useState, useEffect } from 'react';
import { _get, _post, _put } from '../../services';
import getUrlWithKey from '../../util/_apiUrl';

const useMeta = ({ getdataMetaData, createMetaData, updateMetaData, type }: any) => {
    const { create_meta, update_meta, get_slug_by_meta } = getUrlWithKey("pages");

    const [getmeta, setGetMeta] = useState<any>(null);
    const [createmeta, setCreateMeta] = useState<any>(null);
    const [updatemeta, setUpdateMeta] = useState<any>(null);

    const getdata = {
        metaData: {
            ...getdataMetaData,
            table_name: getdataMetaData?.table_name || "",
            table_slug: getdataMetaData?.table_slug || ""
        }
    };

    const createdata = {
        metaData: {
            ...createMetaData,
            table_id: createMetaData?.table_id || "",
            table_name: createMetaData?.table_name || "",
            key: "_meta_info",
            value: {
                mata_title: createMetaData?.mata_title || "",
                meta_key: createMetaData?.meta_key || "",
                meta_descriptions: createMetaData?.meta_descriptions || ""
            }
        }
    };

    const updateData = {
        metaData: {
            ...updateMetaData,
            table_id: updateMetaData?.table_id || "",
            table_name: updateMetaData?.table_name || "",
            key: "_meta_info",
            value: {
                mata_title: updateMetaData?.mata_title || "",
                meta_key: updateMetaData?.meta_key || "",
                meta_descriptions: updateMetaData?.meta_descriptions || ""
            },
            meta_id: updateMetaData?.meta_id || ""
        }
    };

    const GetMeta = async (data: any) => {
        try {
            const { meta }: any = await _put(get_slug_by_meta, data?.metaData);
            if (meta?.success) {
                setGetMeta(meta?.data);
            }
        } catch (error) {
            console.log(error, "_error");
        }
    };

    const CreateMeta = async (data: any) => {
        try {
            if (data?.metaData?.table_id) {
                const { meta }: any = await _post(create_meta, data?.metaData);
                if (meta?.success) {
                    setCreateMeta(meta?.data);
                }
            }
        } catch (error) {
            console.log(error, "_error");
        }
    };

    const UpdateMeta = async (data: any) => {
        try {
            if (data?.metaData?.meta_id) {
                const { meta }: any = await _post(update_meta, data?.metaData);
                if (meta?.success) {
                    setUpdateMeta(meta?.data);
                }
            }
        } catch (error) {
            console.log(error, "_error");
        }
    };

    useEffect(() => {
        if (type === "create") {
            CreateMeta(createdata);
        } else if (type === "update") {
            UpdateMeta(updateData);
        } else if (type === "get") {
            GetMeta(getdata);
        }
    }, [type, getdataMetaData, createMetaData, updateMetaData]);

    return { getmeta, createmeta, updatemeta };
};

export default useMeta;
