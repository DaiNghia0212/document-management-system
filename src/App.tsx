import { publicRoutes, privateRoutes } from '~/routers/routes'
import { ThemeProvider } from 'styled-components'
import AuthProvider from '~/context/AuthContext'
import { theme } from '~/global/theme'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import PrivateRoute from './routers/PrivateRoute'
import Layout from './components/layouts/Layout'
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {publicRoutes.map((route, index) => (
              <Route key={index} path={route.path} Component={route.component} />
            ))}
            {privateRoutes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <>
                      {route.excludeTitle ? (
                        <Layout title={route.component.name}>
                          <PrivateRoute Component={route.component} />
                        </Layout>
                      ) : (
                        <Layout>
                          <PrivateRoute Component={route.component} />
                        </Layout>
                      )}
                    </>
                  }
                />
              )
            })}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
