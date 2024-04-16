import React from 'react'
import { useChat } from 'ai/react'
import { Bot, Loader2, Send, User2 } from 'lucide-react'
import Markdown from './MarkDown'
import { Button } from './ui/button'

interface GenAiProps {
  code: string
  error?: string
  lang: string
}

const msgTemplate = (lang: string, code: string, error?: string) => {
  return `Correct the code please.\nLanguage: ${lang}\nCode: ${code}\nError: ${
    error || 'Resolve the issue'
  }`
}

const GenAiContent: React.FC<GenAiProps> = ({ code, error, lang }) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: 'api/genai',
    })
//   const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     const msg = msgTemplate(lang, code, error)
//     handleSubmit(event, {
//       data: {
//         prompt: msg,
//       },
//     })
//     console.log(messages)
//   }


  function RenderForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const msg = msgTemplate(lang, code, error)
          handleSubmit(event, {
            data: {
              prompt: input+msg,
            },
          })
        }}
        className="w-full flex flex-row gap-2 items-center h-full"
      >
        <input
          type="text"
          placeholder={isLoading ? 'Generating . . .' : 'ask something . . . '}
          value={input}
          disabled={isLoading}
          onChange={handleInputChange}
          className="border-b border-dashed outline-none w-full px-4 py-2 text-[#10a008] placeholder:text-[#0842A099] text-right focus:placeholder-transparent disabled:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row"
        >
          {isLoading ? (
            <Loader2
              onClick={stop}
              className="p-3 h-10 w-10 stroke-stone-500 animate-spin"
            />
          ) : (
            <Send className="p-3 h-10 w-10 stroke-stone-500" />
          )}
        </button>
      </form>
    )
  }

  console.log(input)
  return (
    <div>

      {/* <form onSubmit={handleSubmitForm} className="">
        <Button type='submit'>Ask ai for solution</Button>
      </form> */}
      {RenderForm()}

      <div
        id="chatbox"
        className="flex flex-col-reverse w-full text-left mt-4 gap-4 whitespace-pre-wrap"
      >
        {messages.map((m, index) => (
          <div
            key={index}
            className={`p-4 shadow-md rounded-md ml-10 relative ${
              m.role === 'user' ? 'bg-stone-300' : ''
            }`}
          >
            <Markdown text={m.content} />
            {m.role === 'user' ? (
              <User2 className="absolute top-2 -left-10 border rounded-full p-1 shadow-lg" />
            ) : (
              <Bot
                className={`absolute top-2 -left-10 border rounded-full p-1 shadow-lg stroke-[#08a02e] ${
                  isLoading && index === messages.length - 1
                    ? 'animate-bounce'
                    : ''
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenAiContent
