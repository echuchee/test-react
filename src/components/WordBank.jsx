import React, { useState } from "react";
import StartList from "./StartList"
import "../App.css";

const WordBank = ((words) => {
	let classZ = "container2";
	if (words.otherT) {
		classZ = words.otherT;
	}
	const setWords = words.setWords;
	const itemGroups = {
		prefixes: setWords
	}
	const theId = words.order + "-wordlist";
	const sItem = words.order;
	return (
		<div id={theId} className={classZ}>

			{Object.keys(itemGroups).map((group) => {
				return (
					<StartList
						id={group}
						items={itemGroups[group]}
						key={group}
						sItem={sItem}
					/>
				)
			})}
		</div>
	);
})
export default WordBank;
