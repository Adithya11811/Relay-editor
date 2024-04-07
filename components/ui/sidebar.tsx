import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from './form';

interface SideBarProps {
  files: any[];
  project: any; // Adjust the type to match the actual project object
  setFileContent: React.Dispatch<React.SetStateAction<string>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setFilename: React.Dispatch<React.SetStateAction<string>>;
  setExtension: React.Dispatch<React.SetStateAction<string>>;
  extension:string;
  fileContents: any; // Change the type to match the actual structure of file contents
}

export const SideBar = ({ files, project, setFileContent,setExtension,extension, setFilename, setCode, fileContents }: SideBarProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [fileName, setFileName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [creatingFile, setCreatingFile] = useState(false);
  const projectId = project?.projectId ||"";
  const handleFileClick = (file: any) => {
    const [fileBaseName, fileExt] = file.name.split('.');
    if (fileBaseName && fileExt) { // Ensure both parts are present
      setFilename(file.name);
      setFileName(fileBaseName);
      setExtension(fileExt);
      const fileContentKey = `${fileBaseName}_${fileExt}`;
      if (fileContents[fileContentKey]) { // Check if the file content exists
        setCode(fileContents[fileContentKey]);
      } else {
        console.error(`File content not found for ${file.name}`);
      }
    } else {
      console.error(`Invalid file name format: ${file.name}`);
    }
  };

  const createNewFile = async () => {
    try {
      setCreatingFile(true);
      await axios.post('/api/createFile', { project, extension, file_name: newFileName });
      setCreatingFile(false);
      setNewFileName('');
      setOpen(false); // Close the dialog after creating the file
     await axios.post('/api/getProject',{projectId})
      // Fetch updated file list or perform any other necessary action
    } catch (error) {
      console.error('Error creating file:', error);
      setCreatingFile(false);
    }
  };

  return (
    <div className="hover:border hover:border-green-600 p-2 bg-gray-800/40 text-md w-72">
      <div className="m-2">
        <Button variant="runner" className="text-center w-full" onClick={() => setOpen(true)}>+ File</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            
          </DialogTrigger>
          <DialogContent>
            <button className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold mb-2">Enter new file name:</h3>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="border border-gray-300 text-black rounded px-3 py-2 mb-2 w-full"
                placeholder="Enter file name..."
              />
              <Button
                variant="runner"
                onClick={createNewFile}
                disabled={!newFileName || creatingFile}
                className="w-full"
              >
                {creatingFile ? 'Creating...' : 'Create File'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex mx-2 flex-col justify-start items-start">
        <h2>{project?.projectName}</h2>
        {/* Display other project details if needed */}
      </div>
      <div className="file-list ml-4">
        <ul>
          {files.map((file: any) => (
            <li key={file.id} onClick={() => handleFileClick(file)}>
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
