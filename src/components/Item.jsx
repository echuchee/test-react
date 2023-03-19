import React from "react";

import "./Item.css";

const Item = ({ id, dragOverlay, order}) => {
  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  };
  return (
    <div id={order + "" + id} style={style} className="item">
      {id}
    </div>
  );
};

export default Item;
