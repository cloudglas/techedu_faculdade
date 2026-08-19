Arquitetura e Stack
A aplicação roda totalmente container

**Frontend (Página Inicial eFrontend (Landing Page e Portal): Next.js 14 (React) - Porta3001
Backend (API e Regras de Negócio): Node.js com Express - Porta3000
Banco de Dados Principal: PostgreSQL 15 - Porta5432
Cache & Filas: Redis 7 - Porta6379
**Armazenamento de Mídia (Vídeos/PDFsArmazenamento de Mídia (Vídeos/PDFs): MinIO (Compatível com S3) - Portas `9000(API) e (Console)9001

tech-edu-platform/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── app/
│           ├── layout.js
│           ├── page.js          (Landing Page)
│           ├── admin/
│           │   └── page.js      (Upload de Vídeos)
│           └── portal/
│               └── page.js      (Portal do Aluno)

# Construir as imagens, recriar volumes e iniciar em background
docker-compose up --build -V -d

# Verificar se os containers estão rodando
docker ps

# Ver os logs em tempo real do backend e frontend
docker-compose logs -f backend frontend

# Derrubar os containers
docker-compose down

Configuração do Armazenamento (MinIO)
Para que os vídeos e PDFs possam ser lidos pelo navegador do

Comando utilizado para configurar a política de acesso público via CLI

docker run --rm --net=host --entrypoint /bin/sh minio/mc -c \
"mc alias set meu-minio http://localhost:9000 admin 12345678 && \
mc anonymous set download meu-minio/techedu"

Resolução de Problemas (Solução de problemas)
Durante o desenvolvimento, enfrentamos e

1. ErCannot find module 'express'/next not found
Causa: O volume do Docker estava mapeando a pastanode_modulesdo computador para dentro do container, excluindo os pacotes que o Docker estava instalado.
Solução: Adicionado um volume anônimodocker-compose.yml( ) para proteger a- /app/node_modules
2. Erro: Rotas do Next.js (404) ou
Causa: O Next.js 14 com App Router exige a criação do arquivo para envolver as páginas. Sem ele, o contêiner quebra ao iniciar. Além disso, páginas interativas são excluídas da cláusula no topo do arquivo.layout.js"use client"
cama: Criado o comfrontend/src/app/layout.js
3. Erro: Carregar
Causa: Ar(SAA-C03)AWS...pdfque
Solução: Adicionado um desinfetante no backend antes de enviarconst safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

Fluxo Lógico de Aplicação
Cadastro/Login: Usuário clicou em "Criar Conta" na
Upload de Mídia: Acesso Admin -> Envia vídeo -> API usa Multer + MinIO para salvar no Storage -> API gera a URL pública e salva os dados do curso no Postgres./admin
Compra (Mock): Aluno acessado -> Veja o curso disponível -> Clique em "Comprar Acesso" -> API recebe o ID do usuário e do produto -> Insira a tabela (simulando webhook de pagamento aprovado)./portaluser_products
Liberação de Aula: O Frontend recarrega a lista de cursos do aluno -> O produto<video>player com uma URL pública do MinIO.