# Hozyan Website

Современный fullstack интернет-магазин стройматериалов `Хозяин`:
- клиент: `React + Vite + Framer Motion`
- сервер: `Node.js + Express + Sequelize ORM + SQLite`
- auth/security: `JWT`, `bcrypt`, `helmet`, серверная валидация (`zod`)
- админка: `/admin` с ролями `ADMIN`, `MANAGER`, `CONTENT_MANAGER`

## Быстрый старт

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Данные для входа в админку

- Email: `admin@hozyan.ru`
- Password: `Admin123!`

## Что реализовано

- Публичный сайт: главная, каталог, карточка товара, корзина, checkout, кабинет, о компании, контакты
- Современный UI: sticky header, glassmorphism, темная/светлая тема, skeleton loading, hover-анимации, fade/slide эффекты, lazy loading, поиск с автодополнением
- E-commerce: корзина, избранное, заказ, имитация онлайн-оплаты (метод CARD => статус PAID)
- Админ-панель: дашборд, CRUD товаров, модерация отзывов, управление заказами, управление пользователями и ролями

## Деплой на Render

Используйте файл `render.yaml` в корне:
- сервис `hozyan-api` (Node web service)
- сервис `hozyan-client` (Static site)

Обязательно задайте:
- `DB_STORAGE` (например `./data/hozyan.sqlite`)
- `JWT_SECRET`
- `CORS_ORIGIN` (домен фронта Render)

После первого деплоя API выполните seed:

```bash
npm run seed
```

