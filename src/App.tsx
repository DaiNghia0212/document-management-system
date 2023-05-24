import { ThemeProvider } from '@mui/material'
import { theme } from './global/theme'
import Login from './routers/auth/Login'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Login />
    </ThemeProvider>
  )
}

export default App
// import { useState } from 'react'
// import './App.css'
// import Scanner from './Scanner'
// import { QrcodeSuccessCallback } from 'html5-qrcode'

// const App = () => {
//   const [decodedResults, setDecodedResults] = useState<string[]>([])
//   const onNewScanResult = (decodedResult: string) => {
//     console.log('App [result]', decodedResult)
//     setDecodedResults((prev) => [...prev, decodedResult])
//   }

//   return (
//     <div className='App'>
//       <section className='App-section' style={{ width: '500px' }}>
//         <div className='App-section-title'> Html5-qrcode React demo</div>
//         <br />
//         <br />
//         <br />
//         <Scanner fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} />
//       </section>
//     </div>
//   )
// }

// export default App
