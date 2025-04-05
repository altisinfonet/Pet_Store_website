import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import withProtectedRoute from "../../services/withProtectedRoute";

const Layout = ({ sideBar, children, container, linkArray }: Props) => {
  return (
    <div className="flex h-full min-h-screen">
      {sideBar && <Sidebar linkArray={linkArray} />}
      <div className="flex flex-col justify-between w-full h-auto">
        {/* <Header container={container} /> */}
        <div className="h-full w-full p-4">{children}</div>
        <Footer container={container} />
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

interface Props {
  sideBar: boolean;
  children: any;
  container: boolean;
  linkArray: []
}

export default withProtectedRoute(Layout);
