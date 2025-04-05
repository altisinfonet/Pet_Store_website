import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetApiUrl from "../useGetApiUrl";

const useTabView = () => {
  const [tabView, setTabView] = useState(false);
  const [mobView, setMobView] = useState(false);

  useEffect(() => {
    const updateView = () => {
      const updatedViewportWidth = window.innerWidth;
      const updatedViewportHeight = window.innerHeight;
      console.log("width:", updatedViewportWidth, "height:", updatedViewportHeight, "pixelView");
      if (updatedViewportWidth <= 1024 && updatedViewportWidth > 480) {
        setTabView(true);
      } else {
        setTabView(false);
      }
      if (updatedViewportWidth <= 480 && updatedViewportWidth > 319) {
        setMobView(true);
      } else {
        setMobView(false);
      }
    };

    updateView();

    window.addEventListener("resize", updateView);

    return () => {
      window.removeEventListener("resize", updateView);
    };
  }, []);

  return { tabView, mobView };
};

export default useTabView;
