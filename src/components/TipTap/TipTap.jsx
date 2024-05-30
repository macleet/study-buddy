import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const extensions = [
    StarterKit,
]

const attributes = {
    attributes: {
        class: 'bg-gray-200 p-2 overflow-auto w-full rounded outline outline-2 outline-slate-400'
    }
}

const content = '<br><br><br><br><br><br><br><br><br><br>';

export default () => {
    return(
        <div style={{scrollbarWidth: "thin", scrollbarColor: "whitesmoke lightgray"}} className='w-5/12 min-w-80 h-full bg-gradient-to-l from-slate-200 via-gray-300 to-slate-300 shadow-lg shadow-slate-400/50 p-8 overflow-auto'>
            <EditorProvider  slotBefore={<p></p>} slotAfter={<p></p>} extensions={extensions} editorProps={attributes} content={content} ></EditorProvider>
        </div>
    );
}
