import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import "./cardetails.css";

const CarDetails = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:5000/carros/cars/${carId}`, {
      headers: { Accept: "application/json" },
    })
      .then(response => response.json())
      .then(data => {
        setCar(data)
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching car:', error);
        setLoading(false);
      });
  }, [carId]);

  if (loading){
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="car-header">
        <div className="car-logo">
          <img src={car.logo} alt={`${car.brand} logo`} />
        </div>
        <div className="car-brand">{car.brand}</div>
      </div>

      <div className="details-content">
        <div className="car-image">
          <img src={car.image_url} alt={`${car.brand} ${car.model}`} />
        </div>

        <div className="car-info">
          <h2>Detalhes do Carro</h2>
          <p><strong>Marca:</strong> {car.brand}</p>
          <p><strong>Modelo:</strong> {car.model}</p>
          <p><strong>Ano:</strong> {car.year}</p>
          <p><strong>Preço:</strong> {car.price}</p>
          <p><strong>Motorização:</strong> {car.engine}</p>
          <p><strong>Consumo:</strong> {car.fuelConsumption}</p>
          <p><strong>Transmissão:</strong> {car.transmission}</p>

          <h3>Características Técnicas</h3>
          <ul>
            <li><strong>Poder:</strong> {car.power}</li>
            <li><strong>Torque:</strong> {car.torque}</li>
            <li><strong>Aceleração (0-100 km/h):</strong> {car.acceleration}</li>
            <li><strong>Velocidade Máxima:</strong> {car.topSpeed}</li>
          </ul>

          <h3>Equipamentos e Características Adicionais</h3>
          <ul>
            <li>{car.sunroof ? "Teto solar" : "Sem teto solar"}</li>
            <li>{car.bluetooth ? "Conexão Bluetooth" : "Sem Bluetooth"}</li>
            <li>{car.leatherSeats ? "Assentos em couro" : "Assentos em tecido"}</li>
            <li>{car.navigationSystem ? "Sistema de navegação" : "Sem sistema de navegação"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default CarDetails;