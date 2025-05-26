# Elos - Plataforma de Apoio e Denúncia para Pessoas LGBT+

Este é um projeto completo com **frontend** em Next.js e **backend** com Node.js, Prisma ORM e banco de dados **MySQL**. O Elos é uma plataforma dedicada a oferecer apoio jurídico e psicológico para pessoas LGBT+, além de funcionar como um canal seguro para o envio de denúncias. O sistema conta com autenticação de usuários, registro de histórico de denúncias e solicitações e integração entre frontend e backend para garantir uma experiência segura e acessível.

---

## 🚀 Tecnologias

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)

---

## 🧩 Funcionalidades

- Autenticação de usuários (cadastro e login)
- Redirecionamento para a página de histórico após login
- Integração entre frontend e backend localmente
- Banco de dados com MySQL e Prisma

---

## 🧑‍💻 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/elos-frontend.git
cd elos-frontend
```

### 2. Rodando o backend
```bash
cd elos-backend

// Instale as dependências

npm install
# ou
yarn install

// Configure o banco de dados

Crie um arquivo .env com a variável:
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"

// Rode as migrações com Prisma

npx prisma migrate dev

// Inicie o servidor backend

npm run dev
# ou
yarn dev

O backend estará rodando normalmente em http://localhost:3001 (ou a porta que você configurou).
```

### 3. Rodando o frontend
```bash
cd ../elos-frontend

// Instale as dependências

npm install
# ou
yarn install

// Inicie o servidor frontend

npm run dev
# ou
yarn dev

Acesse http://localhost:3000 para visualizar a aplicação.
```

