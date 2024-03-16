"use client"
import Editor from "@monaco-editor/react";
import { SideBar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";


const ProjectsPage = ({...props}) =>{
    const [code,setCode] = useState("");
    function run(){
        console.log(code);
    }
    return(
        <div className="flex flex-col justify-center align-middle">
            <Button variant="runner" onClick={run} className="m-auto mt-2 mb-2">
                Run
            </Button>
            
        <div className="flex flex-row">
            <SideBar/>
              <Editor 
                className='mb-20 border rounded-xl'
                theme='vs-dark'
                height="80vh"
                defaultLanguage="javascript"
                defaultValue="// some comment"
                language={props.language}
                value={props.value} 
                onChange={(e)=>setCode(e)}/>
        </div>
        </div>
        
    )
}

export default ProjectsPage;