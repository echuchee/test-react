/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	<App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/

import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import App2 from './App2';
import App3 from './App3';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<div className="header">
			<h1>Puzzlezz</h1>
			<p>This is all a <b>WIP</b>. For now it requires the word chunks to be done in order. Example: You cannot assign a word chunk to the bottom word without the one above it being populated.</p>
			<p>The section on the right will contain the hidden word with the word chunks placed in order vertically(for now!)</p>
			<p>The worlds are random from a giant list of <b>41,231</b> 9 letter words. There is logic to prevent any words that would cause one grid to have two of the same three letter chunks.</p>
			<p>The validate button will highlight the correct/incorrect spots. This should work for the hidden word as well.</p>
			<p>The cheat button shows you the full list of words(excluding the hidden final word for now!)</p>
		</div>
		<App order="1" />
		<App2 order="2" />
		<App3 order="3" />
	</React.StrictMode>,
);