import React, { useState } from 'react';
import './register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Register:', { email, password });
  };

  return (
    <div className="register-container">
      <h2>Registrar</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
        />
        <label>Confirmar Senha:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme sua senha"
          required
        />
        <button type="submit">Registar</button>
      </form>
      <div className="form-footer">
    <p>
      Já tem conta? <a href="/login">Faça login aqui!</a>
    </p>
  </div>
    </div>
  );
};

export default Register;
