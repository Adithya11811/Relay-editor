"use client"
import { Editor, useMonaco } from "@monaco-editor/react";
import { SideBar } from "@/components/ui/sidebar";
import {  useEffect, useState } from "react";
import axios from "axios";
import OutputWindow from "@/components/project/outputWindow";
import { useSearchParams } from "next/navigation";
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

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { useRouter } from "next/navigation";
import { StarFilledIcon } from "@radix-ui/react-icons";

const ProjectsPage = () => {
  const params = useSearchParams();
  const monaco = useMonaco();
  const projectId = params.get('projectId');
  const [account, setAccount] = useState<unknown>(null)
  const router = useRouter();

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

  const [outputDetails, setOutputDetails] = useState({
    output: "",
    error: ""
  });
  const [openInvite, setOpenInvite] = useState<boolean>(false);
  const [processing, setProcessing] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [fileName, setFilename] = useState("");
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState({});
  const [extension, setExtension] = useState("")
  const [username,setUsername] = useState("")
  const [invitingUser,setInvitingUser] = useState(false)


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
    setLanguage(response.data.project.projectType);
    setFileContent(response.data.fileContents)
    const projectExtension = response.data.extension;
    const defaultFileName = `main.${projectExtension}`;
    setExtension(projectExtension);
    setFilename(defaultFileName);

    // Check if the file content exists before accessing it
    setCode(response.data.fileContents?.[`main_${projectExtension}`] || '');
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
        setFileContent(code)
        axios.post("/api/save", { code,fileName,files, project })
          .then(response => {
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(err => {
        const error = err.response.data.error;
        console.log(error)
        axios.post("/api/save", { code,fileName,files, project })
          .then(response => {
            
          })
          .catch(error => {
            console.log(error);
          });
        setOutputDetails({ output: "", error:error});
        setProcessing(false);
      });
  };
  const inviteUser= ()=>{
    axios.post('/api/invite',{username,account,project})
    .then((response)=>{
      if(response.status==200)
        setInvitingUser(false);
      setOpenInvite(false);
    }).catch((error)=>{
      console.log(error)
      setInvitingUser(false)
    })
  }

const handleEditorChange = (value: any)=>{
  setCode(value);
}
// useEffect(()=>{
//   supabase.channel(projectId!).on('postgres_changes', {
//     event: "*",
//     schema: "public",
//     table: "Files"
//   }, (payload: any) => {
//     console.log(payload)
//   }).subscribe()

// })

  return (
    <div className="flex flex-col justify-center align-middle overflow-y-clip">
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
              <div
                className="flex items-center gap-2 justify-center  transition-all text-gray-400 hover:text-gray-50"
                onClick={() => router.back()}
              >
                <ArrowLeft size={20} strokeWidth={0.5} />
                back
              </div>
            </Button>
            <Button
              onClick={run}
              disabled={!code}
              className="rounded-lg px-4 hover:scale-110 lg:mx-32 py-1 flex items-center gap-2 bg-green-600 hover:bg-green-600 transition-all text- white hover:text-white"
            >
              {processing ? (
                <Image
                  alt="Avatar"
                  className="mix-blend-multiply bg-transparent"
                  height="32"
                  src={'/gears.gif'}
                  style={{
                    aspectRatio: '32/32',
                    objectFit: 'cover',
                  }}
                  width="32"
                />
              ) : (
                'Run'
              )}
            </Button>
            {/* <Popover>
              <PopoverTrigger className="lg:-mx-32 border flex hover:scale-110 items-center gap-2 justify-center rounded-lg px-3 bg-transparent border-slate-700 text-gray-400 hover:text-gray-50">
                <FaTools />
                Performance
              </PopoverTrigger>
              <PopoverContent>Hello</PopoverContent>
            </Popover> */}
            {}
            <Button
              disabled={!code && !outputDetails?.error}
              className="border-2 border-green-500 bg-transparent"
            >
              <StarFilledIcon />
              Try Ai
            </Button>
          </nav>
          <Button
            variant="runner"
            className="text-center w-fit"
            onClick={() => setOpenInvite(true)}
          >
            Invite
          </Button>
          <Dialog open={openInvite} onOpenChange={setOpenInvite}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent>
              <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex flex-col items-start">
                <h3 className="text-lg font-semibold mb-2">Enter username:</h3>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 text-black rounded px-3 py-2 mb-2 w-full"
                  placeholder="Enter username..."
                />
                <Button
                  variant="runner"
                  onClick={inviteUser}
                  disabled={!username || invitingUser}
                  className="w-full"
                >
                  {invitingUser ? 'Inviting...' : 'Invite'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
        <SideBar
          files={files}
          setFilename={setFilename}
          project={project}
          setExtension={setExtension}
          extension={extension}
          setFileContent={setFileContent}
          setCode={setCode}
          fileContents={fileContent}
        />
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
