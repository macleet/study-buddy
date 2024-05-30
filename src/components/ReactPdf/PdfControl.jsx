import { useRef, useState } from "react";

import { pdfjs } from "react-pdf";

import memoize from "../../utilities/memoize.js"

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import axios from 'axios';

export default ({page, setPage, scale, setScale}) => {
    const refPageInput = useRef();
    const refZoomInput = useRef();

    const handleKeyDown = event => {
        if (event.key != 'Enter' || !event.target.value || event.target.value < 1) return;
        setPage(Number(event.target.value));
    }

    const flipPage = (event) => {
        if (!event || event.currentTarget.firstChild.value == "") return;
        if (!event.currentTarget.firstChild.dataset['testid']) flipPage();

        const toAdd = event.currentTarget.firstChild.dataset['testid'].includes('Left') ? -1 : 1;
        console.log(toAdd + page);
        refPageInput.current.value = page + toAdd;
        setPage(page + toAdd);
    }

    const zoomClick = event => {
        event.currentTarget.firstChild.classList.forEach(className => {
            let newScale = scale;
            if (className == 'zoom-in' && scale <= 1.75) newScale += 0.25;
            else if (className == 'zoom-out' && scale >= 0.5) newScale -= 0.25;
            else return;

            setScale(newScale);
            refZoomInput.current.value = newScale * 100 + '%'; 
        });
    }

    const zoomSet = event => {
        if (event.key != 'Enter' || !event.target || event.target.value == '' || event.target.value.length > 4 || !/^\d+%?$/.test(event.target.value)) return;

        for (let i = 0; i < event.target.value.length; i++) {
            console.log(event.target.value.trimEnd())
        }
    }

    // 💲Expensive (OpenAI API request)
    const handleTableExtract = async () => {
        try {
            // Load pdf document
            const loadingTask = pdfjs.getDocument("./src/cci.pdf");  // statify this and line below
            const pdf = await loadingTask.promise;
            const getPageText = async pageNum => {
                // Look through first 20 pages of pdf; continue until all pages found
                const textContent = await (await pdf.getPage(pageNum)).getTextContent();
                let pageTextContent = "";
                textContent.items.forEach(item => pageTextContent += item.str);

                // Skip if not enough tokens to output significant/accurate rating
                if (pageTextContent.length < 300) return;
                return pageTextContent;
            }
            const memoizedGetPageText = memoize(getPageText);

            const getRating = async pageNum => {
                const pageTextContent = await memoizedGetPageText(pageNum);
                const { data } = pageTextContent
                    ? await axios.get('http://localhost:8000/chat-completion/toc/rating', {
                        params: { pageTextContent: pageTextContent },
                    }) 
                    : { null: null };
                return data;
            }

            // Find TOC pages from pdf
            const tocRange = [null, null];
            for (let pageNum = 1, tocPages = []; pageNum <= 20; pageNum++) {
                // If the next TOC page found is not consecutive, end TOC extraction
                if (tocPages.length > 2 && tocPages[tocPages.length-1] != pageNum-1) {
                    tocRange[0] = tocPages[0];
                    tocRange[1] = tocPages[tocPages.length-1] + 1;
                    break;
                }

                const rating = await getRating(pageNum);
                if (rating && rating >= 0.65) tocPages.push(pageNum)
            }

            // Create curriculum from TOC
            const [tocStart, tocEnd] = tocRange;
            let tocFullText = "";
            for (let pageNum = tocStart; pageNum < tocEnd; pageNum++) {
                tocFullText += await memoizedGetPageText(pageNum) + '\n';
            }
            console.log(tocFullText);
            const res = await axios.get('http://localhost:8000/chat-completion/toc', {
                params: { tocFullText: tocFullText },
                maxContentLength: 50000,
                maxBodyLength: 25000,
            })
            console.log(res);
        } catch (err) {
            if (axios.isAxiosError(err)) console.error('Axios error: ', err);
            else console.error('Unexpected error: ', err);
        }
    }

    return(
        <div className="pointer-events-auto flex justify-evenly items-center bg-gradient-to-r from-sky-900/95 via-sky-800/95 to-sky-700/95 object-contain h-14 absolute top-1 z-50 rounded-r">
            <div className="text-nowrap p-2">
                <button onClick={flipPage} className="text-blue-300 hover:text-blue-600 transition-colors" >
                    <ChevronLeftIcon className='' />
                </button>
                <input ref={refPageInput} className="text-center w-8 text-sm rounded bg-slate-100" onKeyDown={handleKeyDown} defaultValue={page} />
                <button onClick={flipPage} className="text-blue-300 hover:text-blue-600 transition-colors" >
                    <ChevronRightIcon className='' />
                </button>
            </div>
            
            <Divider flexItem orientation="vertical" variant="middle" />

            <div className="text-nowrap p-2" >
                <button onClick={zoomClick} className="text-blue-300 hover:text-blue-600 transition-colors" >
                    <ZoomInIcon className='zoom-in' />
                </button>
                <input ref={refZoomInput} className="mx-1 text-center w-11 text-sm rounded bg-slate-100" defaultValue={scale * 100 + '%'} onKeyDown={zoomSet} />
                <button onClick={zoomClick} className="text-blue-300 hover:text-blue-600 transition-colors" >
                    <ZoomOutIcon className='zoom-out' />
                </button>
            </div>

            <Divider flexItem orientation="vertical" variant="middle" />

            <div className="p-2">
                <button onClick={handleTableExtract} className="text-blue-300 hover:text-blue-600 transition-colors">
                    <FormatListNumberedIcon />
                </button>
            </div>

            <div className="flex justify-center items-center text-gray-100 h-full px-1 bg-sky-900/50 right-0 rounded-r cursor-pointer" >
                <button className="flex hover:scale-110 transition-all" >
                    <ArrowBackIosNewIcon fontSize="10px"  />
                </button>
            </div>
        </div>  
    );
}