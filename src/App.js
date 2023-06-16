
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import HjemmesideView from './Views/HjemmesideView';
import NavBar from './components/Navbar/NavBar';
import ProfilView from './Views/ProfilView';
import LeggetiljobbView from './Views/LeggetiljobbView';
import ApplicationView from './Views/ApplicationView';
import MineStillingerView from './Views/MineStillingerView';
import RedigerStilling from './components/rediger/RedigerStilling';

function App() {
  return (
    <BrowserRouter>
       <div className="App">
       <NavBar />
            { <Routes>
              <Route path="/" element={ <HjemmesideView />}/>
              <Route path="/Profil" element={ <ProfilView />}/>
              <Route path="/leggetiljobb" element={ <LeggetiljobbView />}/>
              <Route path="/MineStillinger" element={ <MineStillingerView />}/>
              <Route path="/Application" element={ <ApplicationView />}/>
              <Route path="/edit-stilling/:id" element={<RedigerStilling />} /> 
            </Routes> }
        </div>
    </BrowserRouter>
  );
}

export default App;
