"use client";

import { useState } from 'react';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState('');

  const handleAddToCart = (product) => {
    setCartCount(cartCount + 1);
    setMessage(`${product} adicionado ao carrinho!`);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleRegister = async () => {
    setMessage('Enviando dados para o backend...');
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Usuario Teste WSL', 
          email: `teste${Date.now()}@email.com`, 
          password: '123456' 
        })
      });
      const data = await response.json();
      
      if (response.ok) setMessage(`Sucesso! Usuário criado no Banco com ID: ${data.userId}`);
      else setMessage(`Erro: ${data.error}`);
    } catch (err) {
      setMessage('Erro: O backend não respondeu.');
    }
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '50px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', right: '30px', fontSize: '1.5rem', cursor: 'pointer' }}>
        🛒 Carrinho: <strong style={{ color: '#38bdf8' }}>{cartCount}</strong>
      </div>

      {message && (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8', padding: '15px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', color: '#38bdf8' }}>TechEdu IA & Dev</h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Domine as tecnologias do futuro. Cursos de IA, Cloud, FullStack e E-books exclusivos.
        </p>
        <button 
          onClick={handleRegister}
          style={{ padding: '15px 30px', backgroundColor: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '1.1rem', marginTop: '20px', fontWeight: 'bold' }}
        >
          Criar Conta (Testa Backend e Banco)
        </button>
      </header>

      <section style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', width: '320px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#10b981' }}>Curso de IA Generativa</h2>
          <p style={{ color: '#94a3b8' }}>Aprenda a criar aplicações com LLMs e Agentes Autônomos.</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '20px' }}>R$ 297,00</p>
          <button 
            onClick={() => handleAddToCart('Curso de IA')}
            style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginTop: '15px', fontSize: '1rem', fontWeight: 'bold' }}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </section>
    </main>
  );
}