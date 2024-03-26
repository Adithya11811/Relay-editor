"use client"
import {Editor} from "@monaco-editor/react";
import { SideBar } from "@/components/ui/sidebar";


import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";

import {languageOptions} from "@/constants/languageOptions"
import LanguagesDropdown from "@/components/project/languageDropdown";
import {  toast } from "react-toastify";
import OutputWindow from "@/components/project/outputWindow";
import OutputDetails from "@/components/project/outputDetails";
import { useSearchParams } from "next/navigation";





const ProjectsPage = ({...props}) =>{
    const params = useSearchParams();
    const projectId = params.get('projectId')
    console.log(projectId)
    const [customInput, setCustomInput] = useState("");
    // const enterPress = useKeyPress("Enter");
    // const ctrlPress = useKeyPress("Control");
    const [outputDetails, setOutputDetails] = useState({
      output:"",
      error:""
    });
    
    const [processing, setProcessing] = useState(false);
    const [code,setCode] = useState(props.code || "");
    const [language, setLanguage] = useState(languageOptions[0]);
    const [theme, setTheme] = useState("vs-dark");
    const [fileName,setFilename] = useState("");
    const onSelectChange = (sl: SetStateAction<{ id: number; name: string; label: string; value: string; }>) => {
        console.log("selected Option...", sl);
        setLanguage(sl);
    };


  // const showSuccessToast = (msg:string) => {
  //   toast.success(msg || `Compiled Successfully!`, {
  //     position: "top-right",
  //     autoClose: 1000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // };


  // const showErrorToast = (msg: string) => {
  //   toast.error(msg || `Something went wrong! Please try again.`, {
  //     position: "top-right",
  //     autoClose: 1000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // };


    axios.post("/api/getProject",{projectId}).then((response)=>{
        setFilename(response.data.project.projectName)
        setCode(response.data.fileContent)
    }).catch((error)=>{
      console.log(error)
    })   

    const run = async ()=>{
      setProcessing(true);
       axios.post("/api/runCode",{code,language:language,customInput:customInput}).
       then((response:any)=>{
        console.log(response)
        const output = response.data.data.output
        setOutputDetails({output:output,error:""})
        // showSuccessToast(`Compiled Successfully!`)

        setProcessing(false)
        return
       }).catch((err)=>{
        console.log(err);
        const error = err.response.data.error.status.description
        console.log(error)
        setOutputDetails({output:"",error:error})
        setProcessing(false);
        // showErrorToast(err);
       })
    }



    const change = (action: string, data: string) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

    const handleEditorChange = (value:string) =>{
        setCode(value);
        change("code",value);
      }

    return(
        <div className="flex flex-col justify-center align-middle">
           <div className="flex flex-row">
           <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
            </div>
            
        <div className="flex flex-row">
            <SideBar fileName={fileName}/>
             <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
                <Editor
                  height="85vh"
                  width={`100%`}
                  language={language.value || "javascript"}
                  value={code}
                  theme = {theme}
                  onChange = {handleEditorChange}
              />
            </div>
             <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <textarea
                rows= {5} 
                value={customInput}
                 onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Custom input"
                  className="focus:outline-none w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white mt-2"
      ></textarea>
            <button
              onClick={run}
              disabled={!code}
              className="mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
        </div>
        </div>
        
    )
}

export default ProjectsPage;


