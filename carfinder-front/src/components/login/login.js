import React, { useState } from 'react';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="login-container">
  <h2>Bem-vindo de volta</h2>
  <form onSubmit={handleSubmit}>
    <label>Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Digite seu email"
      required
    />
    <label>Senha</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Digite sua senha"
      required
    />
    <button type="submit">Entrar</button>
  </form>
  <div className="form-footer">
    <p>
      Não tem uma conta? <a href="/register">Cadastre-se</a>
    </p>
  </div>
</div>

  );
};

export default Login;
