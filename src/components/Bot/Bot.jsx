export default () => {

    return(
        <div className='z-0 w-7/12 h-full flex flex-col overflow-auto justify-evenly items-center py-4 ' >
            <div className="bg-sky-700/30 w-11/12 h-5/6 rounded shadow shadow-sky-600/30" >
            </div>
            <span suppressContentEditableWarning={true} style={{scrollbarWidth: "thin", scrollbarColor: "whitesmoke lightgray"}} className="bg-sky-700/5 overflow-y-auto max-h-52 p-1 w-11/12 border-2 border-soild border-sky-700/50 rounded outline-sky-700/50 focus:outline-sky-700/80 transition-colors" contentEditable >hello</span>
        </div>
    );
}