import ArticleIcon from '@mui/icons-material/Article';
import List from '@mui/material/List';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import TimerIcon from '@mui/icons-material/Timer';
import StyleIcon from '@mui/icons-material/Style';
import Tab from "./Tab";

export default ({activeIndex, setActiveIndex}) => {
    // Study helper (gpt)
    // YT Video searcher
    // Annotate (Bookmark + Highlight + tag + note)
    // Timer (Pomodoro) + tracker + productivity (wasted time) tracker/manager
    // Flashcard create

    // Table of contents -> study guide (track progress) + spaced repetition
    // Task manager link

    const functionTabs = [
        [<StyleIcon />, 'Flashcards'],
        [<ArticleIcon />, 'Document'],
        [<SmartToyIcon />, 'Bot'], 
        [<SmartDisplayIcon />, 'Videos'], 
        [<TimerIcon />, 'Timer'], 
    ];

    return(
        <div className='z-40 flex flex-col w-10 hover:w-36 py-16 bg-gradient-to-tr from-blue-700 via-sky-800 to-blue-800 opacity-85 shadow-md shadow-blue-800 transition-all'>    
            <List className='flex flex-col justify-around h-full'>
                {functionTabs.map(([icon, label], index) => {
                    const active = index == activeIndex;
                    return(
                        <Tab active={active} label={label} icon={icon} key={index} index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                    );
                })}
            </List>
        </div>
    );
}
