import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";

const useCreate = ({ url, callData }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendData, setSendData] = useState(null);

  // const API_URL = useGetApiUrl({ path: url });

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await axios.post(url, callData);
        // console.log(data, "<<_wrylfdata_>>");
        if (data?.success) {
          setSendData(data?.data);
          setError(null);
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
      setSendData(null)
    }
  }, [url]);

  return { sendData, loading, error };
};

interface Props {
  callData: object;
  url: string;
}

export default useCreate;
