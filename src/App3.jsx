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
import { grabRandomWords, checkAllItems, splitWord, shuffleArray, getRandomInt } from "./utils/helpers";
const chunk = require('lodash.chunk')
const allWords = require('an-array-of-english-words');

const setWords = [];
let answers = {};
let fullWords = [];
let bank = [];
let l9words = allWords.filter(w => w.length === 9);

// let l9words = ["marsupial", "bamboozle", "paintball", "lethargic", "whirlwind", "authority", "intrinsic", "archenemy", "coriander", "orchestra"];

grabRandomWords(10, answers, bank, fullWords, setWords, "3"); // temp 2
console.log("THE WORDS: " + fullWords);

shuffleArray(bank);
const chunks = chunk(bank, 7);

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 30px 20px;
  cursor: pointer;
`;

function App3(params) {
	const order = params.order;
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
		return checkAllItems(itemGroups, answers, order);
	}

	function showCheat() {
		let tempElement = document.getElementById(order + "-wordlist");
		if (tempElement.style.visibility === "hidden") {
			tempElement.style.visibility = "visible";
		} else {
			tempElement.style.visibility = "hidden";
		}
	}

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

	const test = Object.keys(itemGroups).map((group) => (
		<Droppable
			id={group}
			items={itemGroups[group]}
			activeId={activeId}
			key={group}
			order={order}
		/>
	));

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragCancel={handleDragCancel}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div className="containerX">
				{test.slice(0, 2)}
				<WordBank setWords={setWords} otherT={"container3"} />
				{test.slice(2, 7)}
				<WordBank setWords={fullWords} otherT={"full_words"} order={order} />
			</div>
			<div className="button">
				<Button onClick={checkMe}>
					Validate
				</Button>
				<Button onClick={showCheat}>
					CHEAT
				</Button>
			</div>
			<DragOverlay>{activeId ? <Item id={activeId} dragOverlay /> : null}</DragOverlay>
		</DndContext>
	);
}

export default App3;
