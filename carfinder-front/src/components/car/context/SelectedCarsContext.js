import React, { createContext, useState, useContext } from 'react';

const SelectedCarsContext = createContext();

export const useSelectedCars = () => useContext(SelectedCarsContext);

export const SelectedCarsProvider = ({ children }) => {
  const [selectedCars, setSelectedCars] = useState([]);

  const addCar = (car) => {
    if (selectedCars.length < 2 && !selectedCars.includes(car)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const removeCar = (car) => {
    setSelectedCars(selectedCars.filter(selectedCar => selectedCar !== car));
  };

  const resetCars = () => {
    setSelectedCars([]);
  };

  return (
    <SelectedCarsContext.Provider value={{ selectedCars, addCar, removeCar, resetCars }}>
      {children}
    </SelectedCarsContext.Provider>
  );
};