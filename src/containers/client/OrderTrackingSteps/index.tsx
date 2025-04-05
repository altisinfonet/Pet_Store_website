// import React from "react";
// import { ProgressBar, Step } from "react-step-progress-bar";
// import "react-step-progress-bar/styles.css";
// import { FaCheck } from "react-icons/fa";
// import { ImRadioChecked } from "react-icons/im";

// interface TrackingStepsProps {
//     activeStep: number;
// }

// const TrackingSteps: React.FC<TrackingStepsProps> = ({ activeStep }) => {
//     const steps = [
//         "Order Placed",
//         "Processing",
//         "Shipped",
//         "Out for Delivery",
//         "Delivered",
//     ];

//     // Calculate the progress percentage
//     const progressPercentage = (activeStep / (steps.length - 1)) * 100;
//     console.log(progressPercentage, activeStep, "fdgh565d2")
//     return (
//         <div style={{ padding: "20px", textAlign: "center" }}>
//             <ProgressBar
//                 percent={progressPercentage}
//                 filledBackground="linear-gradient(to right, #4caf50, #81c784)"
//             >
//                 {steps.map((label: any, index: number) => (
//                     <Step key={index}>
//                         {({ accomplished }) => (
//                             <div
//                                 style={{
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     alignItems: "center",
//                                     color: progressPercentage >= 0 && accomplished ? "#4caf50" : "#9e9e9e",
//                                 }}
//                             >
//                                 <div
//                                     className={` ${index === activeStep && accomplished
//                                         ? "trackOrderCheckbox"
//                                         : ""
//                                         }`}
//                                     style={{
//                                         marginTop: "16px",
//                                         width: 30,
//                                         height: 30,
//                                         borderRadius: "50%",
//                                         backgroundColor: progressPercentage >= 0 && accomplished
//                                             ? "#4caf50"
//                                             : "#9e9e9e",
//                                         display: "flex",
//                                         justifyContent: "center",
//                                         alignItems: "center",
//                                         color: "white",
//                                     }}
//                                 >
//                                     {progressPercentage >= 0 ? (
//                                         accomplished ? <FaCheck /> : <ImRadioChecked />
//                                     ) : (
//                                         <ImRadioChecked />
//                                     )}
//                                     {/* {accomplished ? <FaCheck /> : <ImRadioChecked />} */}
//                                     {/* {index + 1} */}
//                                 </div>
//                                 <div style={{ marginTop: 8, fontSize: "12px", fontWeight: "bold" }}>{label}</div>
//                             </div>
//                         )}
//                     </Step>
//                 ))}
//             </ProgressBar>
//         </div>
//     );
// };

// export default TrackingSteps;

import { Tooltip, useMediaQuery } from "@mui/material";
import React from "react";
import { FaClipboardList, FaShoppingCart, FaCreditCard, FaTruck, FaMapMarkerAlt } from "react-icons/fa";

interface TrackingStepsProps {
    activeStep: number;
}

const steps = [
    { label: "Order Placed", icon: <FaClipboardList /> },
    { label: "Processing", icon: <FaShoppingCart /> },
    { label: "Shipped", icon: <FaCreditCard /> },
    { label: "Out for Delivery", icon: <FaTruck /> },
    { label: "Delivered", icon: <FaMapMarkerAlt /> },
];

const TrackingSteps: React.FC<TrackingStepsProps> = ({ activeStep }) => {
    const isSmallScreen = useMediaQuery("(max-width: 600px)");
    console.log(activeStep, "564df56g4f6ds5")
    const isCancelled = activeStep === -1;
    return (
        <div className="tracking-container">
            {/* Progress Bar */}
            <div className="progress-bar">
                <div
                    className="progress-line"
                    style={{
                        width: isCancelled ? "100%" : `${(activeStep / (steps.length - 1)) * 100}%`,
                        background: isCancelled ? "#e4509d80" : "",
                    }}
                ></div>
            </div>

            {/* Steps */}
            <div className="tracking-steps">
                {steps.map((step, index) => (
                    <div key={index} className={`step ${index <= activeStep ? "active" : ""} ${isCancelled ? "cancelled" : ""}`}>
                       
                        <Tooltip title={step.label} arrow disableHoverListener={!isSmallScreen}>
                            <div className="icon-wrapper">{step.icon}</div>
                        </Tooltip>
                        <span className="label">{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackingSteps;
