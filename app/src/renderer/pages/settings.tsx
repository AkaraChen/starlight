import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  return (
    <div>
      <button
        className="bg-blue-400 text-white"
        onClick={() => {
          navigate(-1)
        }}
      >
        hello
      </button>
      <h1>Hello</h1>
    </div>
  )
}
