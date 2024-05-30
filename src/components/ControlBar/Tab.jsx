// import { useEffect, useState } from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';

export default ({active, label, icon, index, activeIndex, setActiveIndex}) => {
    const handleTabClick = event => {
        setActiveIndex(index)
    }

    return(
        <ListItem onClick={handleTabClick} sx={{paddingX: '3px', paddingY: '0px', justifyContent: 'end', fontSize: '14px', backgroundColor: active ? "rgb(96 165 250)" : "inherit", color: active ? "rgb(23 37 84)" : "rgb(147 197 253)", scale: active ? "1.1" : "1"}} className={'rounded h-12 cursor-pointer translate-x-0 hover:-translate-x-1 hover:scale-110 transition-all hover:text-blue-950 hover:bg-blue-400'} >
            <p>{label}</p>
            <ListItemIcon sx={{minWidth: '0px', paddingLeft: '12px', paddingRight: '6px', color: 'inherit'}} className=''>
                {icon}
            </ListItemIcon>
        </ListItem>
    )
}