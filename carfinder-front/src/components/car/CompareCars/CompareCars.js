import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

function CompareCars() {
  const [data, setData] = useState([]); // Estado para armazenar os carros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCars, setSelectedCars] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  const fetchInfo = (page) => {
    setLoading(true);
    const url = `http://127.0.0.1:5000/carros/cars?page=${page}&pageSize=12`;
    return fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res.cars);
        setTotalPages(res.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar os carros:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInfo(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleCarClick = (car) => {
    if (selectedCars.length < 2 && !selectedCars.includes(car)) {
      setSelectedCars([...selectedCars, car]);
    } else if (selectedCars.includes(car)) {
      setSelectedCars(selectedCars.filter(selectedCar => selectedCar !== car));
    }
  };

  const compareCars = () => {
    if (selectedCars.length === 2) {
      const [carId1, carId2] = selectedCars.map(car => car._id);
      const url = `http://127.0.0.1:5000/carros/comparar?carId1=${carId1}&carId2=${carId2}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao comparar os carros');
          }
          return response.json();
        })
        .then(data => {
          setComparisonResult(data);
        })
        .catch(error => {
          console.error('Erro:', error);
        });
    }
  };

  const resetComparison = () => {
    setSelectedCars([]);
    setComparisonResult(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <h2>Selecione 2 carros para comparar</h2>
      <div className="car-grid">
        {data.map((car) => (
          <div
            key={car._id}
            onClick={() => handleCarClick(car)}
            style={{ cursor: 'pointer', backgroundColor: selectedCars.includes(car) ? 'lightgray' : 'white' }}
            className="car-card"
          >
            <img src={car.image_url} alt={car.name} />
            <div className="text-content">
              <p className="car-brand">{car.maker}</p>
              <h1 className="car-name">{car.model}</h1>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <Pagination
          count={totalPages} // Número total de páginas
          page={currentPage} // Página atual
          onChange={handlePageChange} // Função para mudar página
          shape="rounded" // Deixa os botões arredondados
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'black', // Cor do texto
              backgroundColor: '#f8f9fa;', // Cor de fundo 
              '&:hover': {
                color: 'white',
                backgroundColor: '#34495e', // Cor de fundo ao passar o mouse 
              },
              '&.Mui-selected': {
                backgroundColor: '#34495e', // Cor de fundo do item selecionado 
                color: 'white', // Cor do texto do item selecionado 
              },
            },
          }}
        />
      </div>

      <button onClick={compareCars} disabled={selectedCars.length !== 2}>Comparar</button>
      <button onClick={resetComparison}>Resetar Comparação</button>

      {comparisonResult && (
        <div>
          <h3>Resultado da Comparação</h3>
          <div className="comparison-result">
            <div className="car-details">
              <h4>Carro 1</h4>
              <img src={comparisonResult.car1.image_url} alt={comparisonResult.car1.name} />
              <p>Marca: {comparisonResult.car1.maker}</p>
              <p>Modelo: {comparisonResult.car1.model}</p>
              <p>Ano: {comparisonResult.car1.year}</p>
              <p>Preço: {comparisonResult.car1.price}</p>
              {/* Adicione mais detalhes conforme necessário */}
            </div>
            <div className="car-details">
              <h4>Carro 2</h4>
              <img src={comparisonResult.car2.image_url} alt={comparisonResult.car2.name} />
              <p>Marca: {comparisonResult.car2.maker}</p>
              <p>Modelo: {comparisonResult.car2.model}</p>
              <p>Ano: {comparisonResult.car2.year}</p>
              <p>Preço: {comparisonResult.car2.price}</p>
              {/* Adicione mais detalhes conforme necessário */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareCars;