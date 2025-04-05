import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";

const useRead = ({ url, callData, selectMethod }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendData, setSendData] = useState([]);
  const [rawData, setRawData]: any = useState()
  // const API_URL = useGetApiUrl({ path: url });
  const method: any = selectMethod == "put" ? axios.put : selectMethod == "get" && axios.get
  // console.log(url?.length, "url__")
  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const { data } = await (selectMethod === "put" ? method(url, callData, { withCredentials: true }) : selectMethod === "get" ? method(url, { withCredentials: true }) : null);


        if (data?.success) {
          setRawData(data)
          setSendData(data.data);
          setError("");
          setLoading(false)
        }

      } catch (error) {

        if (error.response && error.response.status === 401) {
          // Handle 401 access denied error
          // For example, redirect to login page or display an error message
          setError("access_denied");
        } else if (error.response && error.response.data && error.response.data.error) {
          // Handle other server errors
          setError(error.response.data.error);
        } else if (error.response && error.response.status === 400) {
          setError(error);
        }
        else {
          // Handle other errors
          setError("An error occurred. Please try again later.");
        }

        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (error !== null) {
      setError(null)
    }

    if (url) {
      if (!url.includes('undefined')) {
        fetchGeneralData();
        setLoading(true)
      }
    }
  }, [url, callData, selectMethod]);


  return { sendData, rawData, loading, error };
};

interface Props {
  url: string;
  callData?: object;
  selectMethod: string;

}

export default useRead;
