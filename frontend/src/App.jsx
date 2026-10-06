import { useState } from 'react'

function App() {
  const [response, setResponse] = useState(null)
  const apiUrl = "http://localhost:3000/api/v1"

  const testEndpoint = async () => {
    try {
      const res = await fetch(apiUrl + "/test")
      const data = await res.json()
      console.log(data)
      setResponse(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <button onClick={() => testEndpoint()}>Prova test backend</button>
      <div>{response && response.message}</div>
    </>
  )
}

export default App
