import moment from "moment";
import React from "react";
// import "./NewTrackOrder.css"; // Import custom CSS

const NewTrackOrder = ({ trackDetailsData }: any) => {
    console.log(trackDetailsData, "5fgh6gf6")
    if (!trackDetailsData || trackDetailsData.length === 0) {
        return <div className="flex items-center justify-content-center text-lg font-semibold text-gray-400">Shipment has not been dispatched yet.</div>;
    }



    return (
        <div className="tracking-container1 p-2">
            {/* <h2>Shipment Tracking</h2> */}
            <div className="tracking-list">
                {trackDetailsData.map((step: any, index: number) => {
                    const isReached = index <= trackDetailsData.length - 1;
                    const formattedDate = moment(step.strActionDate, "DDMMYYYY").format("DDMMM,YYYY");
                    const formattedTime = moment(step.strActionTime, "HHmm").format("HH:mm A");
                    return (
                        <div key={index} className={`tracking-step ${isReached ? "active" : "disabled"}`}>
                            <div className="circle">{isReached ? "✔" : ""}</div>
                            <div className="tracking-info">
                                <h3>{step.strAction}</h3>
                                <p>
                                    {step.strOrigin} | {formattedDate} | {formattedTime}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NewTrackOrder;