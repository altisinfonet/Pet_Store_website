import Image from "next/image";
import logo from "../../../public/assets/images/logo.png"
import moment from "moment";
import Link from "next/link";

const Footer = ({ container }: Props) => {

  return (
    <div className="h-12 shadow-[0px_0px_4px_0px_#00000f80] w-full px-4">
      <div className={`h-full flex items-center justify-between ${container ? `container` : ``}`}>
        {/* <Image src={logo} alt="logo" className="w-auto h-8" height={1080} width={1920}/> */}
        <p className="m-0">©&nbsp;<Link className="text-color-pink-3" target="_blank" href={"https://pinkstore.altisinfonet.in/"}>PinkPaws</Link>&nbsp;®. All Rights Reserved {moment().format("YYYY")}.</p>
        <p className="flex items-center">Design and development by&nbsp;<Link className="flex items-center" target="_blank"  href="https://www.altisinfonet.com/"><span className="text-[#cc2128]">Altis</span><span className="text-[#46b0e4]">infonet</span></Link></p>
      </div>
    </div>
  );
};


interface Props {
  container: boolean
}

export default Footer;
