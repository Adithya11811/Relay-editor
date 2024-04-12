import Link from 'next/link'
import React from 'react'
import { FaJs, FaPython } from 'react-icons/fa'
import { TbBrandCpp } from 'react-icons/tb'
import { SiCodio, SiTypescript } from 'react-icons/si'
import {motion} from 'framer-motion'
import { IoLogoJavascript } from 'react-icons/io'

interface Project {
  projectType: string
  projectName: string
  projectDescription: string
  projectId: string
}

interface ProjectCardProps {
  project: Project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { projectType, projectName, projectDescription, projectId } = project

  // Define a function to get the icon based on projectType
  const getIcon = (type: string) => {
    switch (type) {
      case 'c':
        return <SiCodio />
      case 'cpp':
        return <TbBrandCpp />
      case 'javascript':
        return <IoLogoJavascript />
      case 'python':
        return <FaPython />
      default:
        return <SiTypescript />
    }
  }

  // Get the icon based on projectType
  const icon = getIcon(projectType)
  const url = `/editor?projectId=${projectId}`
  return (
    <Link href={url}>
      <motion.div
        className="bg-gray-800/40 rounded-lg shadow-md p-4 m-4 flex flex-col items-center justify-center w-[200px] hover:border-2 hover:border-green-500"
        whileHover={{ scale: 1.1, borderColor: '#10B981' }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-3xl text-blue-500 mb-4">{icon}</div>
        <div>
          <h2 className="text-xl text-green-500 opacity-75 hover:shadow-xl font-semibold">
            {projectName}
          </h2>
          <p className="text-gray-600">{projectDescription}</p>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProjectCard
