import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";

const useRead = ({ url, callData, selectMethod }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendData, setSendData] = useState<any>([]);

  // const API_URL = useGetApiUrl({ path: url });
  const method: any = selectMethod === "put" ? axios.put : selectMethod === "get" && axios.get

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const selectedMetod = selectMethod == "put" ? method(url, callData, { withCredentials: true }) : method(url, { withCredentials: true }); 
        const { data } = await selectedMetod;
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
    }
  }, [url, callData]);

  return { sendData, loading, error };
};

interface Props {
  url: string;
  callData?: object;
  selectMethod: string
}

export default useRead;
