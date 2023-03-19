import React, { useState } from "react";
import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import styled from "styled-components";
import Droppable from "./components/Droppable";
import Item from "./components/Item";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";
import WordBank from "./components/WordBank";
import "./App.css";
const chunk = require('lodash.chunk')

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// shuffleArray(fullWords);

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 30px 20px;
  cursor: pointer;
`;

// shuffleArray(bank);

function App(params) {
	console.log("HERE123");
	const allWords = require('an-array-of-english-words');
	const order = params.order;
	const firstPrefixes = [];
	let answers = {};
	let l9words = allWords.filter(w => w.length === 9);
	let fullWords = [];
	let poppedWord = "";
	let bank = [];
	// ["marsupial", "bamboozle", "paintball", "lethargic", "whirlwind", "authority", "intrinsic", "archenemy", "coriander", "orchestra"];
	grabRandomWords(10);

	function grabRandomWords(number) {
		const size = l9words.length;
		const usedNums = [];
		for (let i = 0; i < 10; i++) {
			const num = getRandomInt(size);
			if (i == 0) {
				poppedWord = l9words[num];
				// console.log("POPPED WORD: " + poppedWord);
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
								// console.log("SKIPPED: " + tempWord + " because existing: " + splitW);
								// console.log("BANK: " + bank);
								u2 = false;
							}
						})
						if (u2) {
							fullWords.push(l9words[num]);
							unique = true;
							firstPrefixes.push(splitWords[0])
							bank.push(splitWords[1], splitWords[2]);
							answers[splitWords[1]] = { "col": "1", "row": i - 1 };
							answers[splitWords[2]] = { "col": "2", "row": i - 2 };
						}

					}
				}
			}
		}
	}

	function splitWord(word) {
		return [word.substring(0, 3), word.substring(3, 6), word.substring(6, 9)]
	}
	// console.log("THE WORDS: " + fullWords);
	const chunks = chunk(bank, 7);
	const [itemGroups, setItemGroups] = useState({
		1: [],
		2: [],
		b1: chunks[0],
		b2: chunks[1],
		b3: chunks[2],
		e1: []
	});
	const [activeId, setActiveId] = useState(null);

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);
	function checkMe() {
		let allTrue = true;
		Object.keys(itemGroups).map(listKey => {
			itemGroups[listKey].forEach((word, index) => {
				const answer = answers[word];
				let tempElement = document.getElementById(order + "" + word);
				if (answer.row === index && answer.col === listKey) {
					tempElement.style.backgroundColor = "lightgreen";
				} else {
					allTrue = false;
					tempElement.style.backgroundColor = "#ffc0b3"
				}
			})
		});
	}

	function nodeToString(node) {
		var tmpNode = document.createElement("div");
		tmpNode.appendChild(node.cloneNode(true));
		var str = tmpNode.innerHTML;
		tmpNode = node = null; // prevent memory leaks in IE
		return str;
	}

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

	const handleDragStart = ({ active }) => {
		setActiveId(active.id);
	}

	const handleDragCancel = () => setActiveId(null);

	const handleDragOver = ({ active, over }) => {
		const overId = over?.id;

		if (!overId) {
			return;
		}

		const activeContainer = active.data.current.sortable.containerId;
		const overContainer = over.data.current?.sortable.containerId || over.id;

		if (activeContainer !== overContainer) {
			setItemGroups((itemGroups) => {
				const activeIndex = active.data.current.sortable.index;
				const overIndex =
					over.id in itemGroups
						? itemGroups[overContainer].length + 1
						: over.data.current.sortable.index;
				return moveBetweenContainers(
					itemGroups,
					activeContainer,
					activeIndex,
					overContainer,
					overIndex,
					active.id
				);
			});
		}
	};

	const handleDragEnd = ({ active, over }) => {
		if (!over) {
			setActiveId(null);
			return;
		}

		if (active.id !== over.id) {
			const activeContainer = active.data.current.sortable.containerId;
			const overContainer = over.data.current?.sortable.containerId || over.id;
			const activeIndex = active.data.current.sortable.index;
			const overIndex =
				over.id in itemGroups
					? itemGroups[overContainer].length + 1
					: over.data.current.sortable.index;
			setItemGroups((itemGroups) => {
				let newItems;
				if (activeContainer === overContainer) {
					newItems = {
						...itemGroups,
						[overContainer]: arrayMove(
							itemGroups[overContainer],
							activeIndex,
							overIndex
						),
					};
				} else {
					newItems = moveBetweenContainers(
						itemGroups,
						activeContainer,
						activeIndex,
						overContainer,
						overIndex,
						active.id
					);
				}
				return newItems;
			});
		}
		setActiveId(null);
	};

	const moveBetweenContainers = (
		items,
		activeContainer,
		activeIndex,
		overContainer,
		overIndex,
		item
	) => {
		const returned = {
			...items,
			[activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
			[overContainer]: insertAtIndex(items[overContainer], overIndex, item),
		};
		return returned;
	};
	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragCancel={handleDragCancel}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<WordBank words={fullWords} />
			<div className="container">
				{Object.keys(itemGroups).map((group) => (
					<Droppable
						id={group}
						items={itemGroups[group]}
						activeId={activeId}
						key={group}
						order={params.order}
					/>
				))}
			</div>
			<div className="button">
				<Button onClick={checkMe}>
					Validate
				</Button>
			</div>
			<DragOverlay>{activeId ? <Item id={activeId} dragOverlay /> : null}</DragOverlay>
		</DndContext>
	);
}

export default App;
