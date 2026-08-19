"use client";

import { useState, useEffect } from 'react';

export default function Portal() {
  const [userId] = useState(12); // Usuário de teste criado anteriormente
  const [products, setProducts] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const prodRes = await fetch('http://localhost:3000/api/products');
      setProducts(await prodRes.json());

      const myRes = await fetch(`http://localhost:3000/api/my-courses/${userId}`);
      setMyCourses(await myRes.json());
    } catch (err) {
      console.error("Erro ao buscar dados", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Roda apenas uma vez quando a página carrega

  const handleBuy = async (productId) => {
    setMessage('Processando pagamento...');
    try {
      await fetch('http://localhost:3000/api/payment/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId })
      });
      setMessage('Compra realizada! Aula liberada.');
      fetchData(); // Atualiza a lista para mostrar o player
    } catch (err) {
      setMessage('Erro ao processar pagamento.');
    }
  };

  const isPurchased = (productId) => myCourses.some(c => c.id === productId);

  return (
    <main style={{ fontFamily: 'Arial', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '50px' }}>
      <h1 style={{ color: '#38bdf8', fontSize: '2.5rem' }}>Portal do Aluno</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>ID do Aluno: {userId} (Modo Teste)</p>

      {message && <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '30px', color: '#10b981' }}>{message}</div>}

      <div style={{ display: 'grid', gap: '30px' }}>
        {products.length === 0 && <p>Nenhum curso disponível ainda. Crie um no painel admin!</p>}
        
        {products.map(product => (
          <div key={product.id} style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '1.5rem' }}>{product.title}</h2>
              <p style={{ color: '#94a3b8' }}>Preço: R$ {product.price}</p>
            </div>
            
            <div>
              {isPurchased(product.id) ? (
                <div style={{ width: '400px' }}>
                  <video src={product.file_url} controls width="100%" style={{ borderRadius: '8px', border: '1px solid #38bdf8' }} />
                </div>
              ) : (
                <button 
                  onClick={() => handleBuy(product.id)}
                  style={{ padding: '15px 30px', backgroundColor: '#f59e0b', border: 'none', borderRadius: '8px', color: 'black', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  Comprar Acesso
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}