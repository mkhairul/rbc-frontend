import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import rbcTheme from './theme/rbcTheme';
import Layout from './components/Layout';
import InventoryList from './pages/InventoryList';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';

function App() {
  return (
    <ThemeProvider theme={rbcTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<InventoryList />} />
            <Route path="add" element={<AddItem />} />
            <Route path="edit/:id" element={<EditItem />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
