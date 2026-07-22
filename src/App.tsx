import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Neksus-Store</h1>
          <p className="text-muted mt-2">
            Магазин товаров
          </p>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App