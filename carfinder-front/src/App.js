import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './header';
import CarGrid from './components/car/cargrid';
import Footer from './footer';
import Login from './components/login/login';
import Register from './components/register/register';
import './App.css';
import CarDetails from './components/car/cardetails';
import CompareCars from './components/car/CompareCars/CompareCars';
import { SelectedCarsProvider } from './components/car/context/SelectedCarsContext';

function App() {
  return (
    <div className="App">
      <SelectedCarsProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/carros" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/carros" element={<CarGrid />} />
          <Route path="/carros/:carId" element={<CarDetails />} />
          <Route path="/comparar" element={<CompareCars />} />
        </Routes>
        <Footer />
      </SelectedCarsProvider>
    </div>
  );
}

export default App;