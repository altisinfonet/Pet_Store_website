const Header = ({container}: Props) => {
  return (
    <div className="h-14 flex items-center justify-between px-4 sticky top-0 shadow-md bg-white z-50 w-full">
      {/* <img src={logo} alt="logo" width={52} height={52}/> */}
      {/* <div className={container ? `container` : ``}>header</div> */}
    </div>
  );
};

interface Props {
  container: boolean
}

export default Header;
