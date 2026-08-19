const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const Minio = require('minio');
const promClient = require('prom-client');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === INSTRUMENTAÇÃO SRE (PROMETHEUS) ===
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

// Métrica customizada: Contador de requisições HTTP
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Middleware para medir todas as requisições
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Rota que o Prometheus vai acessar para coletar as métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Conexão com o Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Conexão com o MinIO
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const upload = multer({ storage: multer.memoryStorage() });

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(100)
    );
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      type VARCHAR(50),
      price DECIMAL(10, 2),
      file_url VARCHAR(500)
    );
    CREATE TABLE IF NOT EXISTS user_products (
      user_id INT REFERENCES users(id),
      product_id INT REFERENCES products(id),
      PRIMARY KEY (user_id, product_id)
    );
  `);
  console.log("Banco de dados inicializado!");
}

app.get('/api/health', (req, res) => res.json({ status: 'Backend online!' }));

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id', [name, email, password]);
    res.status(201).json({ message: 'Usuário criado!', userId: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: 'Email já cadastrado' });
  }
});

app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = Date.now() + '-' + safeName;
    await minioClient.putObject('techedu', fileName, req.file.buffer);
    const fileUrl = `http://localhost:9000/techedu/${fileName}`;
    res.status(200).json({ message: 'Arquivo enviado!', url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
});

app.post('/api/admin/create-product', async (req, res) => {
  const { title, type, price, file_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (title, type, price, file_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, type, price, file_url]
    );
    res.status(201).json({ message: 'Produto criado!', productId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

app.post('/api/payment/mock', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await pool.query('INSERT INTO user_products (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, productId]);
    res.status(200).json({ message: 'Pagamento confirmado! Acesso liberado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
});

app.get('/api/my-courses/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.* FROM products p
      JOIN user_products up ON p.id = up.product_id
      WHERE up.user_id = $1
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cursos do aluno' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initDB();
  console.log(`Backend rodando na porta ${PORT}`);
});
