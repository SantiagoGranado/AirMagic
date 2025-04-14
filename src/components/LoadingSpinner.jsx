import React from "react";
import "../css/LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <center>
        <div id="rotation">
          <div id="circle">
            <div id="rotation">
              <img
                src="https://i.ibb.co/S7Dkk4M/pngwing-com.png"
                width="50px"
                height="50px"
                alt="Spinner"
              />
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default LoadingSpinner;
