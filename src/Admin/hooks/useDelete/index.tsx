import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";

const useDelete = ({ url, callData, selectMethod }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendData, setSendData] = useState<any>([]);

  // const API_URL = useGetApiUrl({ path: url });
  const method = selectMethod === "post" ? axios.post : axios.delete

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await method(url, callData);
        // console.log(data, "<<_wrylfdata_>>");
        if (data?.success) {
          setSendData(data?.data);
        }
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    if (url) {
      fetchGeneralData();
    } else {
      setSendData(null);
    }
  }, [url]);

  return { sendData, loading, error };
};

interface Props {
  callData: object;
  url: string;
  selectMethod: string
}

export default useDelete;
