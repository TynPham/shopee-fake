import { useContext, useEffect } from 'react'
import './App.css'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './contexts/app.context'
import { localStorageEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()

  const { reset } = useContext(AppContext)

  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)

    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [])

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
