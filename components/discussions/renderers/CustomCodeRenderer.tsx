'use client'

function CustomCodeRenderer({ data }: any) {
  data

  return (
    <pre className="bg-gray-900 rounded-md p-4">
      <code className="text-white text-sm">{data.code}</code>
    </pre>
  )
}

export default CustomCodeRenderer
