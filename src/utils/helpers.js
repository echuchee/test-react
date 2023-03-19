export function nodeToString(node) {
	var tmpNode = document.createElement("div");
	tmpNode.appendChild(node.cloneNode(true));
	var str = tmpNode.innerHTML;
	tmpNode = node = null; // prevent memory leaks in IE
	return str;
}

export function splitWord(word) {
	return [word.substring(0, 3), word.substring(3, 6), word.substring(6, 9)]
}


/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

export function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

export function checkAllItems(itemGroups, answers, order) {
	let allTrue = true;
	Object.keys(itemGroups).map(listKey => {
		itemGroups[listKey].forEach((word, index) => {
			const answer = answers[word];
			let tempElement = document.getElementById(order + "" + word);
			// debug logging
			// console.log(word);
			// console.log("answer.row " + answer.row + " .. " + index);
			// console.log("answer.col " + answer.col + " .. " + listKey);
			if (answer.row === index && answer.col === listKey) {
				tempElement.style.backgroundColor = "lightgreen";
			} else {
				allTrue = false;
				tempElement.style.backgroundColor = "#ffc0b3"
			}
		})
	});
}

const allWords = require('an-array-of-english-words');
let l9words = allWords.filter(w => w.length === 9);

export function grabRandomWords(number, answers, bank, fullWords, setWords, order) {
	let poppedWord = "";
	const size = l9words.length;
	const usedNums = [];
	for (let i = 0; i < number; i++) {
		const num = getRandomInt(size);
		if (i == 0) {
			poppedWord = l9words[num];
			console.log("POPPED WORD: " + poppedWord);
			const pop1 = poppedWord.substring(0, 3);
			const pop2 = poppedWord.substring(3, 6);
			const pop3 = poppedWord.substring(6, 9);
			answers[pop1] = { "col": "e1", "row": 0 };
			answers[pop2] = { "col": "e1", "row": 1 };
			answers[pop3] = { "col": "e1", "row": 2 };
			usedNums.push(num);
			bank.push(pop1);
			bank.push(pop2);
			bank.push(pop3);
		} else {
			let unique = false;
			while (unique === false) {
				const num = getRandomInt(size);
				if (usedNums.indexOf(num) === -1) {
					const tempWord = l9words[num];
					const splitWords = splitWord(tempWord);
					let u2 = true;
					splitWords.map(splitW => {
						if (bank.includes(splitW)) {
							u2 = false;
						}
					})
					if (u2) {
						let index1 = 0;
						let index2 = 1;
						let index3 = 2; // static one
						if (order === "1") {
							index1 = 1;
							index2 = 2;
							index3 = 0;
						}
						if (order === "2") {
							index1 = 0;
							index2 = 2;
							index3 = 1;
						}
						if (order === "3") {
							index1 = 0;
							index2 = 1;
							index3 = 2;
						}
						fullWords.push(l9words[num]);
						unique = true;
						setWords.push(splitWords[index3])
						bank.push(splitWords[index1], splitWords[index2]);
						answers[splitWords[index1]] = { "col": "1", "row": i - 1 };
						answers[splitWords[index2]] = { "col": "2", "row": i - 1 };
					}

				}
			}
		}
	}
}
// let l9words = ["marsupial", "bamboozle", "paintball", "lethargic", "whirlwind", "authority", "intrinsic", "archenemy", "coriander", "orchestra"];

/* function cheatSolve() { // NOT WORKING
 
	 Object.keys(answers).map(answerKey => { 
	   let tempElement = document.getElementById(answerKey);
	   let index = -1;
	   let item = {};
	   let newGroup = "";
		 Object.keys(itemGroups).map((group) => {
			 if (group.length > 0 && itemGroups[group].indexOf(answerKey) > -1) {
				 newGroup = group;
				 index = group;
				 item = itemGroups[group][itemGroups[group].indexOf(answerKey)];
			 }
		 });
		   moveBetweenContainers(itemGroups, index, 0, answers[answerKey].col, 0, item);
	 // if not found
	   let finCol = answers[answerKey].col;
	   let preSize = itemGroups[newGroup].length - 1;
	   const postSize = itemGroups[finCol].length + 1;
	   console.log("PRE SIZE: "+ preSize);
	   console.log("POST SIZE: " + postSize);
	   moveBetweenContainers(itemGroups, index, preSize, finCol, postSize, item);
	 });
 
 }*/