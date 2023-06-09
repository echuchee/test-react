import React from "react";

import "./StartList.css"; // change
import StaticItem from "./StaticItem";

const StartList = ({ id, items, sItem }) => {
	let className = "startlist";
	if (sItem === "2" || sItem === "1" || sItem === "3") { // todo
		className = "startlist2";
	}
	return (
		<ul id="startlist" className={className}>
			{items.map((item) => (
				<StaticItem key={item} id={item} sItem={sItem} />
			))}
		</ul>
	);
};

export default StartList;
