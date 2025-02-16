import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AdvertisementDetails from './pages/AdvertisementDetails'
import AdvertisementForm from './pages/AdvertisementForm'
import AdvertisementList from './pages/AdvertisementList'
import { theme } from './theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minutes
      retry: 1, 
      staleTime: 1000 * 60 * 5,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/list" element={<AdvertisementList />} />
              <Route path="/form" element={<AdvertisementForm />} />
              <Route path="/form/:id" element={<AdvertisementForm />} />
              <Route path="/item/:id" element={<AdvertisementDetails />} />
              <Route path="*" element={<Navigate to="/list" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App