import React, { useEffect } from "react";
import "../App.scss";

function Modal(props) {
  useEffect(() => {
    //
  }, []);

  return (
    <div className="screen modal-outer flex">
      <div className="modal">{props.text}</div>
    </div>
  );
}

export default Modal;
