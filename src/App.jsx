import './App.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import ControlBar from './components/ControlBar/ControlBar.jsx';
import TipTap from './components/TipTap/TipTap.jsx';

import ReactPdf from './components/ReactPdf/ReactPdf.jsx';
import Bot from './components/Bot/Bot.jsx';
import Videos from './components/Videos/Videos.jsx';
import Timer from './components/Timer/Timer.jsx';
import Flashcards from './components/Flashcards/Flashcards.jsx';

import { useState, useRef, useEffect } from 'react';

function App() {
    const [activeIndex, setActiveIndex] = useState(-1);
	const [containerWidth, setContainerWidth] = useState();

	const refContainer = useRef();

	useEffect(() => {
		setContainerWidth(refContainer.current.offsetWidth)
	}, [containerWidth])

	const renderSwitch = activeIndex => {
		switch (activeIndex) {
			case 0: return <Flashcards />
			case 1: return <ReactPdf containerWidth={containerWidth} setContainerWidth={setContainerWidth} />
			case 2: return <Bot />
			case 3: return <Videos />
			case 4: return <Timer />
			default:
				return <div className='z-0 w-7/12 h-full flex flex-col overflow-auto' ><p>blank</p></div>
		}
	}

	return (
		<div ref={refContainer} className='h-screen flex bg-gray-100 overflow-hidden'>
			<ControlBar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
			{renderSwitch(activeIndex)}
			<TipTap />
		</div>
	);
}

export default App
