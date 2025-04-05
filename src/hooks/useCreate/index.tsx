import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";

const useCreate = ({ url, callData }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendData, setSendData] = useState(null);
  const [success, setSuccess] = useState(null);

  // const API_URL = useGetApiUrl({ path: url });

  useEffect(() => {
    console.log("call useeffect", { url, callData })
    const fetchGeneralData = async () => {
      try {
        const { data } = await axios.post(url, callData, { withCredentials: true });
        if (data?.success) {
          setSuccess(data)
          setSendData(data?.data);
        }
        setLoading(false);
      } catch (error: any) {
        // setError(error);

        if (error.response && error.response.data) {
          // Handle other server errors
          setError(error.response.data);
        } else {
          // Handle other errors
          setError("An error occurred. Please try again later.");
        }

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

  return { sendData, loading, error, success };
};

interface Props {
  callData: object;
  url: string;
}

export default useCreate;
