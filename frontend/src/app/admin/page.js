"use client";

import { useState } from 'react';

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Selecione um arquivo primeiro.');

    setMessage('Enviando arquivo...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Upload concluído! Preencha os dados.');
        setVideoUrl(data.url);
      } else {
        setMessage('Erro no upload.');
      }
    } catch (err) {
      setMessage('Erro ao conectar com o backend.');
    }
  };

  const handleSaveProduct = async () => {
    setMessage('Salvando produto no banco...');
    try {
      const response = await fetch('http://localhost:3000/api/admin/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type: 'course', price: parseFloat(price), file_url: videoUrl })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Curso salvo com sucesso! ID: ' + data.productId);
        setTitle(''); setPrice(''); setVideoUrl(''); setFile(null);
      }
    } catch (err) {
      setMessage('Erro ao salvar produto.');
    }
  };

  return (
    <main style={{ fontFamily: 'Arial', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '50px' }}>
      <h1 style={{ color: '#38bdf8', fontSize: '2rem' }}>Envio de Documentos </h1>
      
      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', marginTop: '30px', maxWidth: '600px' }}>
        {!videoUrl ? (
          <form onSubmit={handleUpload}>
            <label style={{ display: 'block', marginBottom: '15px', color: '#94a3b8' }}>Selecione um Vídeo ou PDF:</label>
            <input type="file" accept="video/*,application/pdf" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: '20px', color: 'white', width: '100%' }} />
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Enviar para a Faculdade</button>
          </form>
        ) : (
          <div>
            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '20px' }}>Arquivo enviado! Preencha os dados:</p>
            <input type="text" placeholder="Título do Curso" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none', color: 'black' }} />
            <input type="number" placeholder="Preço (ex: 99.90)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none', color: 'black' }} />
            <button onClick={handleSaveProduct} style={{ padding: '12px 24px', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Curso no Banco</button>
          </div>
        )}
        {message && <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#38bdf8' }}>{message}</div>}
      </div>
    </main>
  );
}