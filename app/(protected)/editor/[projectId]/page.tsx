"use client"
import {Editor} from "@monaco-editor/react";
import { SideBar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";

import {languageOptions} from "@/constants/languageOptions"
import LanguagesDropdown from "@/components/project/languageDropdown";
import { defineTheme } from "@/lib/defineTheme";
import monacoThemes from "monaco-themes/themes/themelist.json";import {  toast } from "react-toastify";
import OutputWindow from "@/components/project/outputWindow";
import OutputDetails from "@/components/project/outputDetails";
import { customStyles } from "@/constants/customStyles";
import Select from "react-select";



const ProjectsPage = ({...props}) =>{
    const [customInput, setCustomInput] = useState("");
    // const enterPress = useKeyPress("Enter");
    // const ctrlPress = useKeyPress("Control");
    const [outputDetails, setOutputDetails] = useState({
      compile_output:"",
      time:0,
      status:{
        id:0,
        description:""
      },
      memory:0,
      stderr:"" 
    });
    const [processing, setProcessing] = useState(false);
    const [ code,setCode] = useState(props.code || "");
    const [language, setLanguage] = useState(languageOptions[0]);
    const [theme, setTheme] = useState("vs-dark");
    const onSelectChange = (sl: SetStateAction<{ id: number; name: string; label: string; value: string; }>) => {
        console.log("selected Option...", sl);
        setLanguage(sl);
    };


    function handleThemeChange(th: any) {
        const theme = th;
        console.log("theme...", theme);

        if (["light", "vs-dark"].includes(theme.value)) {
            setTheme(theme);
        } else {
          defineTheme(theme.value).then((_) => setTheme(theme));
        }
    }



  const showSuccessToast = (msg:string) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };


  const showErrorToast = (msg: string) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

    const run = async ()=>{
      setProcessing(true);
       axios.post("/api/runCode",{code,language:language,customInput:customInput}).
       then((response:any)=>{
        let status= response.data.data.status;
        const stdout = response.data.data.stdout
        const time = response.data.data.time
        const memory = response.data.data.memory
        const stderr = response.data.data.stderr
        const output = {
          compile_output:stdout,
          time,
          memory,
          status:status,
          stderr:stderr
        }
        setOutputDetails(output)
        showSuccessToast(`Compiled Successfully!`)

        setProcessing(false)
        return
       }).catch((err)=>{
        console.log(err);
        setProcessing(false);
        showErrorToast(err);
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

      const themeOptions =Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))

    return(
        <div className="flex flex-col justify-center align-middle">
           <div className="flex flex-row">
           <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
         <div className="px-4 py-2">
          <Select
                placeholder={`Select Theme`}
                options={themeOptions}
                value={theme}
                styles={customStyles}
                onChange={handleThemeChange}
          />
        </div>
            </div>
            
        <div className="flex flex-row">
            <SideBar/>
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


