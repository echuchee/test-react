import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";

import "./Droppable.css";

const Droppable = ({ id, items, order }) => {
  let className = "droppable";

  if (id.indexOf("b") > -1) {
	className = "droppable2";
  } else if(id.indexOf("e") > -1) {
  	className = "droppable3";
  }
  const { setNodeRef } = useDroppable({ id });
  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <ul className={className} ref={setNodeRef}>
        {items.map((item) => (
          <SortableItem order={order} key={item} id={item} />
        ))}
      </ul>
    </SortableContext>
  );
};

export default Droppable;
