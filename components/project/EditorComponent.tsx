import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import supabase from "@/utils/supabase";  

interface Props{
    language:string;
    code:string;
    projectId:string|null;
    setCode:any;
}
export const EditorComponent = ({language,code,projectId,setCode}:Props)=>{
    const monaco = useMonaco();
    const handleEditorChange = (value: any) => {
        setCode(value);
        // channel.send({
        //     type: 'broadcast',
        //     event: 'code-changes',
        //     payload: { message: code },
        // }) 
    }
//     const channel = supabase.channel(projectId!)
//     channel.subscribe((status) => {
//         if (status !== 'SUBSCRIBED') {
//             return null
//         }
        
//     })
//   useEffect(()=>{
//     channel.on('broadcast', { event: "code-changes" }, (payload: any) => {
//       setCode(payload.payload.message)
//     });
//   },[channel, setCode])
    useEffect(() => {
        // Load and apply the theme
        import("monaco-themes/themes/Dracula.json")
            .then(themeData => {
                monaco?.editor.defineTheme("dracula", themeData);
                monaco?.editor.setTheme("dracula");
            })
            .catch(error => {
                console.error("Failed to load Monaco theme:", error);
            });
    }, [monaco]);

    return(
        <Editor
            height="90vh"
            width={`100%`}
            language={language}
            value={code}
            theme="dracula"
            options={{
                minimap: {
                    enabled: false,
                },
                fontSize: 18,
                // cursorStyle: 'block',
                wordWrap: 'on',
                automaticLayout: true,
                wordBasedSuggestionsOnlySameLanguage: true,
                cursorBlinking: 'phase',
            }}
            onChange={handleEditorChange}
        />
    )
    
}