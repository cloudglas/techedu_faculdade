# TechEdu IA & Dev - Plataforma de Ensino com Observabilidade SRE

Plataforma de E-learning completa para cursos técnicos, certificações e livros PDF de tecnologia e IA. O projeto conta com Landing Page de vendas, carrinho de compras, painel administrativo para upload de mídias (Vídeos/PDFs) e portal do aluno com liberação de acesso baseada em pagamento (Mock). 

Além da aplicação full-stack, o projeto implementa uma stack completa de **Observabilidade SRE** (Métricas e Logs) open-source.

---

##  Arquitetura e Stack

A aplicação roda totalmente containerizada via Docker Compose, simulando um ambiente de microserviços local com 10 containers integrados.

### Diagrama de Arquitetura

![alt text](image.png)

Tecnologias Utilizadas
Frontend: Next.js 14 (React) - Porta 3001
Backend: Node.js3000
Banco de Dados: PostgreSQL 15 - Porta `5432
Cache & Filas: Redis 7 - Porta 6379
Armazenamento de Mídia: MinIO (S3 Compatible) - Portas 9000 (9001 (Console)
Métricas: Prometheus e9090 e 8080
Logs: Loki e Promtail - Porta 3100
Dashboard SRE: Grafana - Porta 3002


# Comandos do Projeto

## Docker Compose

### Subir infraestrutura completa
docker-compose up --build -V -d

### Subir sem rebuild
docker-compose up -d

### Derrubar containers
docker-compose down

### Ver status dos containers
docker-compose ps

### Ver logs em tempo real
docker-compose logs -f backend frontend

### Ver logs de um serviço específico
docker-compose logs -f backend

### Reiniciar um serviço específico
docker-compose restart backend

### Reiniciar todos os serviços
docker-compose restart

### Acessar terminal de um container
docker exec -it techedu_backend sh

## MinIO (Armazenamento)

### Criar bucket pública via CLI
docker run --rm --net=host --entrypoint /bin/sh minio/mc -c "mc alias set meu-minio http://localhost:9000 admin 12345678 && mc anonymous set download meu-minio/techedu"

### Listar arquivos no MinIO via CLI
docker run --rm --net=host --entrypoint /bin/sh minio/mc -c "mc alias set meu-minio http://localhost:9000 admin 12345678 && mc ls meu-minio/techedu"

## Banco de Dados (PostgreSQL)

### Acessar CLI do banco
docker exec -it techedu_db psql -U admin -d techedu

### Listar tabelas (dentro do psql)
\dt

### Consultar usuários
SELECT * FROM users;

### Consultar produtos
SELECT * FROM products;

### Consultar permissões de acesso
SELECT * FROM user_products;

### Sair do banco de dados
\q

## Portas de Acesso Local

### Frontend (Landing Page)
http://localhost:3001

### Frontend (Painel Admin)
http://localhost:3001/admin

### Frontend (Portal do Aluno)
http://localhost:3001/portal

### Backend (API)
http://localhost:3000/api/health

### Backend (Métricas SRE)
http://localhost:3000/metrics

### MinIO (Console Web)
http://localhost:9001

### Grafana (Dashboard SRE)
http://localhost:3002

### Prometheus (Métricas)
http://localhost:9090

### cAdvisor (Métricas de Container)
http://localhost:8080

### Loki (API Logs)
http://localhost:3100