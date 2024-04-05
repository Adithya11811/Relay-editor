"use client"
import { Editor, useMonaco } from "@monaco-editor/react";
import { SideBar } from "@/components/ui/sidebar";
import { SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import { languageOptions } from "@/constants/languageOptions";
import OutputWindow from "@/components/project/outputWindow";
import { useSearchParams } from "next/navigation";
import * as monaco from 'monaco-editor'
// import Header from "@/components/ui/EHeader";
import { AuthProvider } from "@/hooks/AuthProvider";
import { getAccountByUserId } from "@/data/user";
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui//button'
import Image from 'next/image'
import { LogoutButton } from "@/components/auth/logout-button";
import { ArrowLeft } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const ProjectsPage = () => {
  const params = useSearchParams();
  const monaco = useMonaco();
  const projectId = params.get('projectId');
  const [account, setAccount] = useState<unknown>(null)

  const id = AuthProvider();
    useEffect(() => {
      const fetchAccount = async () => {
        try {
          const response = await getAccountByUserId(id!)
          setAccount(response)
        } catch (error) {
          console.error('Error fetching account:', error)
        }
      }

      fetchAccount()
    }, [id])

  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState({
    output: "",
    error: ""
  });
  const [processing, setProcessing] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [fileName, setFilename] = useState("");
  const [project, setProject] = useState(null);
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState("");


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

  useEffect(() => {
    axios.post("/api/getProject", { projectId }).then((response) => {
      setFiles(response.data.files);
      setProject(response.data.project);
      setDirectories(response.data.directories);
      setLanguage(response.data.project.projectType);

      // setFileContent(response.data.fileContent.main_js)
    }).catch((error) => {
      console.log(error);
    });
  }, [projectId]);

  const run = async () => {
    setProcessing(true);
    axios.post("/api/runCode", { code, language })
      .then(response => {
        const output = response.data.data.output;
        setOutputDetails({ output: output, error: "" });
        setProcessing(false);
        // axios.post("/api/save", { code, files, projectId })
        //   .then(response => {
        //     console.log(response);
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
      })
      .catch(err => {
        const error = err.response.data.error;
        console.log(error)
        // axios.post("/api/save", { code, files, projectId })
        //   .then(response => {
        //     console.log(response);
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
        setOutputDetails({ output: "", error:error});
        setProcessing(false);
      });
  };
useEffect(()=>{
  setCode(code);
},[code])
  const handleEditorChange = (value: SetStateAction<string>) => {
    setCode(value);
  };

  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="h-[10vh]">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 px-6 bg-gray-800/40">
          <nav className="hidden lg:flex lg:flex-1 lg:gap-4 lg:justify-start lg:text-sm">
            <Link
              className="flex items-center gap-5 font-semibold"
              href="/profile"
            >
              <span className="">Relay</span>
            </Link>
            <Button
              variant={'link'}
              className="rounded-lg px-3 hover:scale-110 lg:mx-24 py-2 flex items-center gap-2 border-slate-700 border transition-all text-gray-400 hover:text-gray-50"
            >
              <Link
                className="flex items-center gap-2 justify-center  transition-all text-gray-400 hover:text-gray-50"
                href="/profile"
              >
                <ArrowLeft size={20} strokeWidth={0.5} />
                back
              </Link>
            </Button>
            <Button
              onClick={run}
              disabled={!code}
              className="rounded-lg px-4 hover:scale-110 lg:mx-40 py-1 flex items-center gap-2 bg-green-600 hover:bg-green-600 transition-all text- white hover:text-white"
            >
              {processing ? 'Processing...' : 'Run'}
            </Button>
            <Popover>
              <PopoverTrigger className="lg:-mx-32">
                <Button
                  variant={'link'}
                  className="border bg-transparent border-slate-700 text-gray-400 hover:text-gray-50"
                >
                  Performance
                </Button>
              </PopoverTrigger>
              <PopoverContent>Hello</PopoverContent>
            </Popover>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border-2 border-green-600 w-8 h-8 dark:border-gray-800"
                id="user-menu"
                size="icon"
                variant="ghost"
              >
                <Image
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src={account?.profileImage || '/hsec1.jpg'}
                  style={{
                    aspectRatio: '32/32',
                    objectFit: 'cover',
                  }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutButton>Logout</LogoutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {/* <Header imgUrl={account?.profileImage} /> */}
      </div>
      <div className="flex flex-row justify-end">
        <SideBar files={files} directories={directories} project={project} setFileContent={setFileContent} setCode={setCode} />
        <div className="overlay overflow-clip w-full h-full bg-[#2a2828]">
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
        </div>
        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          {/* <div className="flex flex-col items-end">
            <Button
              onClick={run}
              disabled={!code}
              className="mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
            >
              {processing ? 'Processing...' : 'Compile and Execute'}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  )
      
}

export default ProjectsPage;
 {
   /* {outputDetails && <OutputDetails outputDetails={outputDetails} />} */
 }
             {
               /* <textarea
              rows={5}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Custom input"
              className="focus:outline-none w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white mt-2"
            ></textarea> */
             }