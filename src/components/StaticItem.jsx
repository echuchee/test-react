import React from "react";

import "./StaticItem.css";

const StaticItem = ({ id, sItem }) => {
	let className = "staticitem";
	if (sItem === "2" || sItem === "1" || sItem === "3") { // todo
		className = "staticitem2";
	}
	return (
		<div key={id} className={className}>
			{id}
		</div>
	);
};

export default StaticItem;
