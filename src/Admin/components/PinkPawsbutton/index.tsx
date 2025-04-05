import React, { useEffect, useState } from "react";

const PinkPawsbutton = ({
  variant,
  name,
  icon,
  handleClick,
  pinkPawsButtonExtraCls,
  style,
  disabled,
  title,
}: Props) => {
  const [toVariant, setToVariant] = useState("solid");

  useEffect(() => {
    if (variant) {
      setToVariant(variant);
    }
  }, [toVariant]);

  return (
    <>
      <div
        title={title}
        style={style}
        className={`${pinkPawsButtonExtraCls} pinkPawsButtonCls boxShadow_1 w-fit ${disabled
          ? "disablePinkPawsButton cursor-default"
          : `cursor-pointer ${toVariant === "solid"
            ? "solidButton"
            : toVariant === "outlined" && "outlineButton"
          }`
          }`}
        onClick={() => disabled ? console.log(title) : handleClick() ? handleClick() : null}
      >
        {/* {icon && <div>{icon}</div>} */}
        {icon}
        {/* <img src={carSpeed} alt="carSpeed" /> */}
        {name && <span>{name}</span>}
      </div>
    </>
  );
};

interface Props {
  variant?: string;
  name?: any;
  icon?: any;
  handleClick?: CallableFunction | undefined;
  pinkPawsButtonExtraCls?: string;
  style?: object;
  disabled?: boolean;
  title?: string;
}

export default PinkPawsbutton;
