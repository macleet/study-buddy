import { useState, useRef, useEffect } from "react";

import { pdfjs, Document, Page } from 'react-pdf'

import PdfControl from "./PdfControl";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();
  
const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

export default ({containerWidth, setContainerWidth}) => {
    // const [tocText, setTocText] = useState('');
    const [page, setPage] = useState(141); // set initial as last left off point
	const [scale, setScale] = useState(1);

    const refContainer = useRef();

    window.onresize = () => {
        setContainerWidth(0);
    }

    const [mouseYStart, setMouseYStart] = useState();

    const getMousePos = event => {
        setMouseYStart(event.pageY)
    }

    const getHighlightedText = event => {
        const mouseYEnd = event.pageY; 
        const downwardSelect = mouseYStart < mouseYEnd;

        const selectedText = window.getSelection();

        let startElem = downwardSelect ? selectedText.anchorNode.parentElement : selectedText.focusNode.parentElement;
        let endElem = downwardSelect ? selectedText.focusNode.parentElement : selectedText.anchorNode.parentElement;

        let startOffset = downwardSelect ? selectedText.anchorOffset : selectedText.focusOffset;

        let startText = downwardSelect ? selectedText.anchorNode.textContent : selectedText.focusNode.textContent;
        let highlightedText = startElem == endElem ? startText.substring(selectedText.anchorOffset, selectedText.focusOffset) : startText.substring(startOffset, startText.length);

        while (startElem != endElem && startElem.nextElementSibling != null) {
            if(startElem.nextElementSibling.matches("br")) {
                startElem = startElem.nextElementSibling;
                continue;
            } else if (startElem.nextElementSibling.matches(".markedContent")) {
                startElem.nextElementSibling.childNodes.forEach(child => {
                    highlightedText += child.textContent;
                });
                startElem = startElem.nextElementSibling;
                continue;
            }

            if(startElem.nextElementSibling == endElem) {
                const endOffset = downwardSelect ? selectedText.focusOffset : selectedText.anchorOffset;
                highlightedText += endElem.textContent.substring(0, endOffset);
                break;
            }

            highlightedText += startElem.nextElementSibling.textContent;
            startElem = startElem.nextElementSibling;
        }
        console.log(highlightedText)
    }

    return(
        <>
            <PdfControl page={page} setPage={setPage} scale={scale} setScale={setScale} />
            <div style={{scrollbarWidth: "thin", scrollbarColor: "whitesmoke lightgray"}} className='z-0 w-7/12 h-full flex flex-col overflow-auto' onMouseUp={getHighlightedText} onMouseDown={getMousePos}>
                <Document ref={refContainer} className='w-fit' file="./src/cci.pdf" options={options}>
                    <Page className='shadow-xl shadow-gray-500/50' width={containerWidth * 7/12} pageNumber={page} scale={scale} />
                </Document>
            </div>
        </>
    );
}
