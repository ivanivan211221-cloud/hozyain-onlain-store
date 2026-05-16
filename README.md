# Hozyan Website

Современный fullstack интернет-магазин стройматериалов `Хозяин`:
- клиент: `React + Vite + Framer Motion`
- сервер: `Node.js + Express + Sequelize ORM + PostgreSQL`
- auth/security: `JWT`, `bcrypt`, `helmet`, серверная валидация (`zod`)
- админка: `/admin` с ролями `ADMIN`, `MANAGER`, `CONTENT_MANAGER`

## Быстрый старт (если вы «вообще не умеете» — по шагам)

### Шаг 0: PostgreSQL на компьютере

Самый простой вариант — **Docker** (один раз установили [Docker Desktop](https://www.docker.com/products/docker-desktop/), дальше команды из папки проекта).

1. Откройте терминал **в корне репозитория** (где лежит файл `docker-compose.yml`).
2. Выполните:

```bash
docker compose up -d
```

или из корня репозитория: `npm run db:up`

Подождите, пока контейнер `postgres` станет «healthy». База уже создана: пользователь `hozyan`, пароль `hozyan_local`, имя БД `hozyan`. Контейнер слушает **порт 5433** на вашем компьютере (чтобы не мешать другому PostgreSQL, если он уже занял порт 5432).

Строка `DATABASE_URL` в `server/.env` уже настроена на `localhost:5433` — менять ничего не нужно, если вы используете этот `docker-compose.yml`.

Остановить Postgres:

```bash
docker compose down
```

или: `npm run db:down`

**Если Docker пишет «Virtualization support not detected»** — на ПК не включена аппаратная виртуализация (Intel VT-x / AMD-V) в BIOS/UEFI или в Windows не включены нужные компоненты (Hyper-V / платформа виртуальных машин / WSL2). Исправление: [системные требования Docker](https://docs.docker.com/desktop/install/windows-install/) и настройки BIOS — это отдельная задача у админа ПК.

**Проще для диплома без Docker:** возьмите **бесплатный Postgres в облаке** ([Neon](https://neon.tech) или [Supabase](https://supabase.com)), создайте проект, скопируйте **Connection string** и вставьте в `server/.env` как `DATABASE_URL=...` (часто в конце строки уже есть `?sslmode=require` — так и должно быть). Затем в папке `server`: `npm run seed`. На компьютере не нужны ни Docker, ни локальный PostgreSQL.

Если Docker не хотите и облако не подходит — установите [PostgreSQL](https://www.postgresql.org/download/windows/) вручную, создайте базу `hozyan` и пользователя, и подставьте свою строку в `DATABASE_URL` (формат как в `server/.env.example`).

### Шаг 1: Backend

```bash
cd server
copy .env.example .env
```

На macOS / Linux: `cp .env.example .env`

В файле `server/.env` строка `DATABASE_URL` уже подходит для Docker из шага 0 (**порт 5433**). Секрет `JWT_SECRET` для диплома можно оставить `change_me` только на своём ПК; на сервере в проде — длинная случайная строка.

```bash
npm install
npm run seed
npm run dev
```

API: `http://localhost:4000` (проверка: `http://localhost:4000/api/health`).

### Шаг 2: Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

Сайт: `http://localhost:5173/`.

Если у вас уже был `server/.env` со старым SQLite: откройте файл и **добавьте** строку `DATABASE_URL=...` из актуального `server/.env.example` (или замените `.env` целиком из примера), затем снова `npm run seed`.

## Данные для входа в админку

- Email: `admin@hozyan.ru`
- Password: `Admin123!`

## Облачная база (Neon / Supabase) без Docker

1. Зарегистрируйтесь на [Neon](https://neon.tech) или [Supabase](https://supabase.com) и создайте проект PostgreSQL.
2. Скопируйте **Connection string** (URI), начинается с `postgres://` или `postgresql://`.
3. Вставьте в `server/.env` как `DATABASE_URL=...`  
   У Neon/Supabase в строке часто есть `?sslmode=require` — тогда SSL включится сам.

## Что реализовано

- Публичный сайт: главная, каталог, карточка товара, корзина, checkout, кабинет, о компании, контакты
- Современный UI: sticky header, темная/светлая тема, skeleton loading, поиск с автодополнением
- E-commerce: корзина, избранное, заказ, имитация онлайн-оплаты (метод CARD => статус PAID)
- Админ-панель: дашборд, CRUD товаров, модерация отзывов, заказы, пользователи и роли

## Деплой на Render

В корне есть `render.yaml`: сервис API, статический клиент и **отдельная база PostgreSQL** на Render.

После деплоя при необходимости выполните seed (или положитесь на `preDeployCommand` в манифесте).

Задайте в панели Render при необходимости:
- `CORS_ORIGIN` — URL вашего фронта
- `JWT_SECRET` — если не используете автогенерацию из blueprint
