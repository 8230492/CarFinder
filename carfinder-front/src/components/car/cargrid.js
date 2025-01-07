import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';  // Importando o spinner
import './cargrid.css';

function CarGrid() {
  const [data, setData] = useState([]); // Estado para armazenar os carros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div className="car-grid">
        {data.map((car) => (
          <Link to={`/carros/${car._id}`} key={car._id}>
            <div className="car-card">
              <img src={car.image_url} alt={car.name} />
              <div className="text-content">
                <p className="car-brand">{car.maker}</p>
                <h1 className="car-name">{car.model}</h1>
              </div>
            </div>
          </Link>
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
    </div>
  );
}

export default CarGrid;
