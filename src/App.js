import './App.scss';
import './assets/scss/reset.scss'
import Table from './components/Table';
import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className='container'>
      <Routes >
        <Route path="/" element={<Table />} />
      </Routes>
    </div>
  );
}

export default App;
