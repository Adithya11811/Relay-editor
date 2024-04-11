'use client'
// import React from 'react'
// import { useVoiceToText } from 'react-speakup'

import Projects from '@/components/ui/projects'
import { AuthProvider } from '@/hooks/AuthProvider'

// interface Options {
//   lang: string
//   continuous?: boolean
// }
// const options: Options = {
//   lang: 'en-US',
//   continuous: true, // Set continuous option to true
// }

// const VoiceToTextComponent = () => {
//   const { startListening, stopListening, transcript } =
//     useVoiceToText(options)

//   return (
//     <div>
//       <button onClick={startListening}>Start Listening</button>
//       <button onClick={stopListening}>Stop Listening</button>
//       <span>{transcript}</span>
//     </div>
//   )
// }

// export default VoiceToTextComponent
const page = () => {
  const id = AuthProvider()
  if (id === undefined) {
    return <div>Loader</div>
  } else {
    return (
      <div>
        <Projects />
      </div>
    )
  }
}
export default page
