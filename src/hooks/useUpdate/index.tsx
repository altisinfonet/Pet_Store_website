import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";

const useUpdate = ({ url, callData, selectMethod }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendData, setSendData] = useState([]);
  const [serverData, setServerData] = useState({});
  const [data, setData] = useState([]);

  // const API_URL = useGetApiUrl({ path: url });
  const method: any = selectMethod === "post" ? axios.post : axios.put

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await method(url, callData, { withCredentials: true });
        if (data?.success) {
          setData(data)
          setSendData(data?.data);
          setServerData({ success: data?.success, message: data?.massage })
        }
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    if (error !== null) {
      setError(null)
    }

    if (url) {
      fetchGeneralData();
    }
  }, [url]);

  return { sendData, loading, error, data, serverData };
};

interface Props {
  callData?: object;
  url: string;
  selectMethod?: string
}

export default useUpdate;
