import { BsBoxFill } from "react-icons/bs";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import logo from "../../../public/assets/images/headerlogo.svg";
import { IoMdArrowDropleft } from "react-icons/io";
import { RiArrowDropRightLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { _SUCCESS } from "../../util/_reactToast";
import { useAuth } from "../../services/context/AuthContext";

const Sidebar = ({ linkArray }: Props) => {
  const { logout } = useAuth()
  let router = useRouter();

  const [openSide, setOpenSlide] = useState(true);
  const [showTooltop, setShowTooltop] = useState({ id: "", name: "" });
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (selectedId) {
      localStorage.setItem("selectedId", selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    const id = localStorage.getItem("selectedId");
    if (id) {
      setSelectedId(id);
    }
  }, [router.pathname])

  let linkArrayD: any[] = [
    {
      icon: <BsBoxFill />,
      name: "sidebar links",
      link: "/",
      sublink: [{ icon: <BsBoxFill />, name: "sidebar links", link: "/" }],
    },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
    {
      icon: <BsBoxFill />,
      name: "sidebar links",
      link: "/",
      sublink: [
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
      ],
    },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
    {
      icon: <BsBoxFill />,
      name: "sidebar links",
      link: "/",
      sublink: [
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
      ],
    },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
    {
      icon: <BsBoxFill />,
      name: "sidebar links",
      link: "/",
      sublink: [
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
        { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
      ],
    },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },
    { icon: <BsBoxFill />, name: "sidebar links", link: "/" },

  ];

  let array = linkArray ? linkArray : linkArrayD

  const fetchData = async () => {
    try {
      const response: any = await logout();
      if (response && response?.success === true) {
        _SUCCESS(response?.massage);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", function () {
      var updatedViewportWidth = window.innerWidth;
      var updatedViewportHeight = window.innerHeight;
      if (updatedViewportWidth <= 1280) {
        setOpenSlide(false)
      } else {
        setOpenSlide(true)
      }
    })
  }, [])

  return (
    <div
      className={`bg-gray-950 flex flex-col relative duration-300 shadow-[0px_0px_6px_2px_#00000f80] z-[999] ${openSide ? `min-w-52 w-fit` : `min-w-10`
        }`}
    >
      <div className="h-14 bg-gray-800 text-white flex items-center gap-2 px-1 sticky top-0 z-50">
        {/* {openSide ? (
          <> */}
        {/* <Image src={logo} alt="logo" width={40} height={40} autoFocus />{" "} */}
        <h1 className={`uppercase text-center text-3xl font-bold overflow-hidden whitespace-nowrap ${openSide ? "w-full" : "w-10"}`}>PINK PAWS</h1>
        {/* </>
        ) : (
          <Image src={logo} alt="logo" width={35} height={35} autoFocus />
        )} */}
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col text-white">
          {array.map((i: any, e: number) => (
            <div
              key={e}
              className={`flex flex-col items-start p-2 cursor-pointer relative hover:bg-gray-700 gap-1.5 capitalize ${selectedId == `${i?.id}` ? `bg-gray-700` : ``
                }`}
              onClick={() => {
                selectedId == `${i?.id}`
                  ? setSelectedId("")
                  : setSelectedId(`${i?.id}`);
                i.link ? i.link === "/admin/logout" ? fetchData() : router.push(i.link) : null
                // i.link ? router.push(i.link) : null
              }}
            >
              <div className="flex items-center justify-between w-full"
                onMouseEnter={() => {
                  !openSide
                    ? setShowTooltop({ id: `${i?.id}`, name: i?.name })
                    : null;
                }}
                onMouseLeave={() => {
                  !openSide ? setShowTooltop({ id: "", name: "" }) : null;
                }}
              >
                <div className="flex items-center gap-4">
                  {i?.icon}
                  {openSide ? (
                    <span className="!text-[95%]">
                      {i?.name}
                    </span>
                  ) : (
                    <>
                      {showTooltop?.id == `${i?.id}` ? (
                        <IoMdArrowDropleft className="rotate-180 absolute left-[90%] text-gray-900" />
                      ) : null}
                      <div className="absolute bg-gray-900 min-w-40 w-fit px-2 text-left left-[110%] rounded z-10">
                        {showTooltop?.id == `${i?.id}` ? showTooltop?.name : ""}
                      </div>
                    </>
                  )}
                </div>

                {i?.sublink?.length ? (
                  selectedId == `${i?.id}` ? (
                    <RiArrowDropRightLine className="rotate-90 text-3xl" />
                  ) : (
                    <RiArrowDropRightLine className="text-3xl" />
                  )
                ) : null}
              </div>

              {selectedId == `${i?.id}` && i?.sublink?.length
                ? i?.sublink.map((itm: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1.5 items-start w-full"
                    onClick={() => router.push(itm.link)}
                  >
                    <div className="flex items-center !text-[85%] gap-4 pl-6"
                      onMouseEnter={() => {
                        !openSide
                          ? setShowTooltop({ id: `${itm?.id}`, name: itm?.name })
                          : null;
                      }}
                      onMouseLeave={() => {
                        !openSide ? setShowTooltop({ id: "", name: "" }) : null;
                      }}
                    >
                      {itm?.icon}
                      {openSide ? itm?.name :
                        <>
                          {showTooltop?.id == `${itm?.id}` ? (
                            <IoMdArrowDropleft className="rotate-180 absolute left-[93%] text-gray-900" />
                          ) : null}
                          <div className="absolute bg-gray-900 min-w-40 w-fit px-2 text-left left-[110%] rounded z-10">
                            {showTooltop?.id == `${itm?.id}` ? showTooltop?.name : ""}
                          </div>
                        </>}
                    </div>
                  </div>
                ))
                : null}
            </div>
          ))}
        </div>
        <div
          className="text-white bg-gray-800 flex items-center gap-2 p-2 h-10 shadow-[0px_0px_4px_2px_#3b3b41] capitalize text-sm cursor-pointer sticky bottom-0"
          onClick={() => setOpenSlide(!openSide)}
        >
          {openSide ? (
            <>
              <GoSidebarExpand className="w-5 h-5" />
              colaps
            </>
          ) : (
            <GoSidebarCollapse className="w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  linkArray?: []
}

export default Sidebar;
