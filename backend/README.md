# WebRTC Signaling Server

Бэкенд для мини-клона Discord с поддержкой WebRTC видеозвонков и real-time коммуникации.

## Особенности

- 🎥 **WebRTC сигнализация** через Socket.IO
- 🏠 **Управление комнатами** с лимитом участников
- 🔄 **REST API** для операций с комнатами
- ✅ **Валидация данных** и обработка ошибок
- 🧹 **Автоматическая очистка** пустых комнат
- 📝 **TypeScript** с полной типизацией
- 🎯 **Модульная архитектура**

## Требования

- Node.js >= 18
- npm >= 9

## Установка

```bash
npm install
```

## Запуск

### Development режим
```bash
npm run dev
```

### Production режим
```bash
npm run build
npm start
```

Сервер будет доступен на `http://localhost:3001`

## Переменные окружения

Создайте `.env` файл в корне проекта:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

## Архитектура

```
src/
├── server.ts              # Точка входа приложения
├── config/
│   └── index.ts          # Конфигурация (порт, CORS, лимиты)
├── types/
│   └── index.ts          # TypeScript интерфейсы и типы
├── utils/
│   └── validation.ts     # Валидация входящих данных
├── services/
│   └── room.service.ts   # Бизнес-логика управления комнатами
└── handlers/
    ├── room.handler.ts   # REST API обработчики
    └── socket.handler.ts # WebSocket обработчики
```

### Слои архитектуры

1. **Server** - инициализация Express, Socket.IO, middleware
2. **Handlers** - обработка HTTP/WebSocket запросов
3. **Services** - бизнес-логика (singleton паттерн)
4. **Utils** - вспомогательные функции (валидация)

## API Документация

### REST API

Базовый путь: `/api`

#### Получить список комнат
```http
GET /api/rooms
```

**Ответ:**
```json
{
  "rooms": [
    {
      "id": "uuid-1",
      "name": "Gaming Room",
      "participantCount": 3,
      "maxParticipants": 10,
      "createdAt": "2024-11-25T12:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "name": "Work Meeting",
      "participantCount": 0,
      "maxParticipants": 5,
      "createdAt": "2024-11-25T12:05:00.000Z"
    }
  ]
}
```

#### Создать комнату
```http
POST /api/rooms
Content-Type: application/json
```

**Тело запроса:**
```json
{
  "name": "My Room",
  "maxParticipants": 5
}
```

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| name | string | Да | Название комнаты (макс. 100 символов) |
| maxParticipants | number | Нет | Максимум участников (2-10, по умолчанию 10) |

**Ответ:**
```json
{
  "roomId": "uuid",
  "name": "My Room",
  "maxParticipants": 5,
  "createdAt": "2024-11-25T12:00:00.000Z"
}
```

#### Получить информацию о комнате
```http
GET /api/rooms/:id
```

**Ответ:**
```json
{
  "id": "uuid",
  "name": "My Room",
  "participantCount": 3,
  "maxParticipants": 5,
  "createdAt": "2024-11-25T12:00:00.000Z"
}
```

#### Health Check
```http
GET /health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-25T12:00:00.000Z"
}
```

### WebSocket Events

#### Client → Server

##### `join-room`
Присоединиться к комнате.

```typescript
socket.emit('join-room', {
  roomId: string,
  userId?: string  // опционально, по умолчанию socket.id
});
```

##### `leave-room`
Покинуть комнату.

```typescript
socket.emit('leave-room', roomId: string);
```

##### `offer`
Отправить WebRTC offer.

```typescript
socket.emit('offer', {
  target: string,                    // socket.id получателя
  offer: RTCSessionDescriptionInit
});
```

##### `answer`
Отправить WebRTC answer.

```typescript
socket.emit('answer', {
  target: string,                     // socket.id получателя
  answer: RTCSessionDescriptionInit
});
```

##### `ice-candidate`
Отправить ICE candidate.

```typescript
socket.emit('ice-candidate', {
  target: string,                 // socket.id получателя
  candidate: RTCIceCandidateInit
});
```

#### Server → Client

##### `user-connected`
Новый пользователь присоединился к комнате.

```typescript
socket.on('user-connected', (socketId: string) => {
  // socketId нового пользователя
});
```

##### `user-disconnected`
Пользователь покинул комнату.

```typescript
socket.on('user-disconnected', (socketId: string) => {
  // socketId отключившегося пользователя
});
```

##### `existing-users`
Список пользователей уже в комнате (при join).

```typescript
socket.on('existing-users', (socketIds: string[]) => {
  // Массив socket.id существующих участников
});
```

##### `room-closed`
Комната была закрыта.

```typescript
socket.on('room-closed', () => {
  // Комната удалена администратором
});
```

##### `room-created`
Создана новая комната (broadcast всем подключенным клиентам).

```typescript
socket.on('room-created', (room: {
  id: string;
  name: string;
  participantCount: number;
  maxParticipants: number;
  createdAt: string;
}) => {
  // Добавить комнату в список
});
```

##### `offer`
Получен WebRTC offer от другого участника.

```typescript
socket.on('offer', ({ offer, sender }) => {
  // offer: RTCSessionDescriptionInit
  // sender: string (socket.id отправителя)
});
```

##### `answer`
Получен WebRTC answer от другого участника.

```typescript
socket.on('answer', ({ answer, sender }) => {
  // answer: RTCSessionDescriptionInit
  // sender: string (socket.id отправителя)
});
```

##### `ice-candidate`
Получен ICE candidate от другого участника.

```typescript
socket.on('ice-candidate', ({ candidate, sender }) => {
  // candidate: RTCIceCandidateInit
  // sender: string (socket.id отправителя)
});
```

##### `error`
Ошибка при выполнении операции.

```typescript
socket.on('error', (message: string) => {
  // Сообщение об ошибке
});
```

## Конфигурация

### Лимиты комнат

- **Максимум участников:** 10 человек
- **Интервал очистки:** 60 секунд
- **Таймаут пустой комнаты:** 1 час

Настраивается в `src/config/index.ts`:

```typescript
room: {
  maxParticipants: 10,
  cleanupInterval: 60000,      // 1 минута
  emptyRoomTimeout: 3600000,   // 1 час
}
```

## Примеры использования

### Создание и подключение к комнате

```typescript
// 1. Создать комнату через REST API
const response = await fetch('http://localhost:3001/api/rooms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Gaming Room',
    maxParticipants: 5,
  }),
});
const { roomId, name } = await response.json();

// 2. Подключиться через WebSocket
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.emit('join-room', {
  roomId,
  userId: 'user123',
});

// 3. Слушать события
socket.on('existing-users', (users) => {
  console.log('Users in room:', users);
});

socket.on('user-connected', (socketId) => {
  console.log('New user joined:', socketId);
});
```

### WebRTC подключение

```typescript
// Создать peer connection
const pc = new RTCPeerConnection();

// Отправить offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

socket.emit('offer', {
  target: targetSocketId,
  offer: offer,
});

// Получить answer
socket.on('answer', async ({ answer, sender }) => {
  await pc.setRemoteDescription(answer);
});

// Обработать ICE candidates
pc.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('ice-candidate', {
      target: targetSocketId,
      candidate: event.candidate,
    });
  }
};

socket.on('ice-candidate', async ({ candidate, sender }) => {
  await pc.addIceCandidate(candidate);
});
```

## Обработка ошибок

Все ошибки валидации отправляются через событие `error`:

```typescript
socket.on('error', (message) => {
  console.error('Server error:', message);
  // Обработать ошибку
});
```

Возможные ошибки:
- `Room not found` - комната не существует
- `Could not join room. Room might be full.` - комната заполнена
- `Invalid room ID` - невалидный ID комнаты
- `Invalid user ID` - невалидный ID пользователя
- Ошибки валидации WebRTC данных

## Graceful Shutdown

Сервер корректно обрабатывает сигналы завершения:

```bash
# SIGTERM или SIGINT
kill <PID>
# или
Ctrl+C
```

При завершении:
1. Закрываются все WebSocket соединения
2. Завершается HTTP сервер
3. Процесс завершается с кодом 0

## Разработка

### Структура файлов

- **server.ts** - настройка Express, Socket.IO, запуск сервера
- **handlers/** - обработчики запросов (тонкий слой)
- **services/** - бизнес-логика (можно легко протестировать)
- **types/** - типы TypeScript (переиспользуются на фронте)
- **utils/** - утилиты и валидация
- **config/** - конфигурация приложения

### Добавление новых фич

1. Добавить типы в `types/index.ts`
2. Расширить сервис в `services/`
3. Добавить обработчики в `handlers/`
4. Обновить документацию

## Будущие улучшения

- [ ] Поддержка аватарок (binary через Socket.IO)
- [ ] Персистентность данных (PostgreSQL/Redis)
- [ ] Аутентификация и авторизация
- [ ] Rate limiting
- [ ] Metrics и мониторинг
- [ ] Unit и integration тесты
- [ ] Docker контейнеризация
- [ ] CI/CD pipeline

## Технологии

- [Express](https://expressjs.com/) - HTTP сервер
- [Socket.IO](https://socket.io/) - WebSocket коммуникация
- [TypeScript](https://www.typescriptlang.org/) - типизация
- [uuid](https://github.com/uuidjs/uuid) - генерация ID комнат

## Лицензия

MIT
