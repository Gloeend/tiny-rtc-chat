# API Documentation

## Table of Contents

- [Data Types](#data-types)
- [REST API](#rest-api)
- [WebSocket Events](#websocket-events)
- [Error Handling](#error-handling)

---

## Data Types

### Participant

Представляет участника комнаты.

```typescript
interface Participant {
  socketId: string;    // Уникальный Socket.IO ID
  userId: string;      // Пользовательский ID (по умолчанию = socketId)
  nickname: string;    // Отображаемое имя пользователя (по умолчанию = User{socketId})
  joinedAt: Date;      // Время присоединения к комнате
}
```

**Example:**
```json
{
  "socketId": "abc123def456",
  "userId": "user_42",
  "nickname": "Alice",
  "joinedAt": "2024-11-25T12:30:00.000Z"
}
```

---

### Room

Представляет видеочат комнату.

```typescript
interface Room {
  id: string;              // UUID комнаты
  name: string;            // Название комнаты
  participants: Participant[];  // Список участников
  createdAt: Date;         // Время создания
  maxParticipants: number; // Максимум участников (по умолчанию: 10)
}
```

**Example:**
```json
{
  "id": "c57cd5a1-bae9-4411-9675-61e561a246a1",
  "name": "Gaming Room",
  "participants": [
    {
      "socketId": "abc123",
      "userId": "user_1",
      "nickname": "Bob",
      "joinedAt": "2024-11-25T12:30:00.000Z"
    }
  ],
  "createdAt": "2024-11-25T12:00:00.000Z",
  "maxParticipants": 10
}
```

---

### CreateRoomData

Данные для создания комнаты.

```typescript
interface CreateRoomData {
  name: string;            // Название комнаты (обязательное, макс. 100 символов)
  maxParticipants?: number; // Максимум участников (2-10, по умолчанию: 10)
}
```

**Example:**
```json
{
  "name": "My Gaming Room",
  "maxParticipants": 5
}
```

---

### WebRTC Types

#### OfferData

Данные для WebRTC offer.

```typescript
interface OfferData {
  targetUserId: string;              // User ID получателя
  offer: RTCSessionDescriptionInit;  // SDP offer
}
```

**Example:**
```json
{
  "targetUserId": "user_42",
  "offer": {
    "type": "offer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

#### AnswerData

Данные для WebRTC answer.

```typescript
interface AnswerData {
  targetUserId: string;               // User ID получателя
  answer: RTCSessionDescriptionInit;  // SDP answer
}
```

**Example:**
```json
{
  "targetUserId": "user_42",
  "answer": {
    "type": "answer",
    "sdp": "v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

#### IceCandidateData

Данные для ICE candidate.

```typescript
interface IceCandidateData {
  targetUserId: string;          // User ID получателя
  candidate: RTCIceCandidateInit; // ICE candidate
}
```

**Example:**
```json
{
  "targetUserId": "user_42",
  "candidate": {
    "candidate": "candidate:1 1 UDP 2130706431 192.168.1.100 54321 typ host",
    "sdpMLineIndex": 0,
    "sdpMid": "0"
  }
}
```

---

### Socket Event Types

#### JoinRoomData

Данные для присоединения к комнате.

```typescript
interface JoinRoomData {
  roomId: string;    // UUID комнаты
  userId?: string;   // Опциональный ID пользователя
  nickname?: string; // Опциональный никнейм пользователя
}
```

**Example:**
```json
{
  "roomId": "c57cd5a1-bae9-4411-9675-61e561a246a1",
  "userId": "user_42",
  "nickname": "Alice"
}
```

---

## REST API

Base URL: `http://localhost:3001/api`

### Endpoints

#### `GET /health`

Health check endpoint для мониторинга.

**Response:** `200 OK`
```typescript
{
  status: string;      // "ok"
  timestamp: string;   // ISO 8601 timestamp
}
```

**Example:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-25T12:00:00.000Z"
}
```

---

#### `GET /api/rooms`

Получить список всех активных комнат с полной информацией.

**Response:** `200 OK`
```typescript
{
  rooms: Array<{
    id: string;              // UUID комнаты
    name: string;            // Название комнаты
    participantCount: number; // Текущее количество участников
    maxParticipants: number;  // Максимум участников
    createdAt: string;        // ISO 8601 timestamp
  }>;
}
```

**Example:**
```json
{
  "rooms": [
    {
      "id": "c57cd5a1-bae9-4411-9675-61e561a246a1",
      "name": "Gaming Room",
      "participantCount": 3,
      "maxParticipants": 10,
      "createdAt": "2024-11-25T12:00:00.000Z"
    },
    {
      "id": "d68de6b2-cbfa-5522-a786-72f672b357b2",
      "name": "Work Meeting",
      "participantCount": 0,
      "maxParticipants": 5,
      "createdAt": "2024-11-25T12:05:00.000Z"
    }
  ]
}
```

---

#### `POST /api/rooms`

Создать новую комнату.

**Request Body:**
```typescript
{
  name: string;            // Название комнаты (обязательное, макс. 100 символов)
  maxParticipants?: number; // Максимум участников (2-10, по умолчанию: 10)
}
```

**Example Request:**
```json
{
  "name": "My Gaming Room",
  "maxParticipants": 5
}
```

**Response:** `201 Created`
```typescript
{
  roomId: string;          // UUID новой комнаты
  name: string;            // Название комнаты
  maxParticipants: number; // Максимум участников
  createdAt: string;       // ISO 8601 timestamp
}
```

**Example Response:**
```json
{
  "roomId": "c57cd5a1-bae9-4411-9675-61e561a246a1",
  "name": "My Gaming Room",
  "maxParticipants": 5,
  "createdAt": "2024-11-25T12:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Ошибка валидации (отсутствует name, превышена длина, некорректный maxParticipants)
- `500 Internal Server Error` - Ошибка создания комнаты

---

#### `GET /api/rooms/:id`

Получить информацию о комнате.

**Parameters:**
- `id` (path) - UUID комнаты

**Response:** `200 OK`
```typescript
{
  id: string;              // UUID комнаты
  name: string;            // Название комнаты
  participantCount: number; // Текущее количество участников
  maxParticipants: number;  // Максимум участников
  createdAt: string;        // ISO 8601 timestamp
}
```

**Example:**
```json
{
  "id": "c57cd5a1-bae9-4411-9675-61e561a246a1",
  "name": "My Gaming Room",
  "participantCount": 3,
  "maxParticipants": 5,
  "createdAt": "2024-11-25T12:00:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Комната не найдена
- `500 Internal Server Error` - Внутренняя ошибка сервера

---

> **Note:** Ручное удаление комнат отключено для безопасности. Пустые комнаты автоматически удаляются после таймаута (см. `config.room.emptyRoomTimeout`).

---

## WebSocket Events

Base URL: `ws://localhost:3001`

### Client → Server Events

#### `join-room`

Присоединиться к комнате.

**Payload:**
```typescript
{
  roomId: string;    // UUID комнаты
  userId?: string;   // Опциональный ID пользователя
  nickname?: string; // Опциональный никнейм пользователя
}
```

**Example:**
```javascript
socket.emit('join-room', {
  roomId: 'c57cd5a1-bae9-4411-9675-61e561a246a1',
  userId: 'user_42',
  nickname: 'Alice'
});
```

**Success Response:**
- Событие `existing-users` с массивом объектов Participant
- Другим участникам отправляется `user-connected` с данными нового участника

**Errors:**
- `error: "Room not found"` - Комната не существует
- `error: "Could not join room. Room might be full."` - Комната заполнена
- `error: "Invalid room ID"` - Невалидный ID комнаты

---

#### `leave-room`

Покинуть комнату.

**Payload:**
```typescript
roomId: string;  // UUID комнаты
```

**Example:**
```javascript
socket.emit('leave-room', 'c57cd5a1-bae9-4411-9675-61e561a246a1');
```

**Side Effects:**
- Другим участникам отправляется `user-disconnected`
- Пользователь удаляется из списка участников

**Errors:**
- `error: "Invalid room ID"` - Невалидный ID комнаты

---

#### `offer`

Отправить WebRTC offer другому участнику.

**Payload:**
```typescript
{
  targetUserId: string;              // User ID получателя
  offer: RTCSessionDescriptionInit;  // SDP offer
}
```

**Example:**
```javascript
const offer = await peerConnection.createOffer();
socket.emit('offer', {
  targetUserId: 'user_42',
  offer: offer
});
```

**Side Effects:**
- Получателю отправляется событие `offer` с SDP и senderUserId

**Errors:**
- `error: "Invalid target user ID"` - Невалидный targetUserId
- `error: "Invalid offer data"` - Невалидные данные offer
- `error: "Target user not found"` - Пользователь не найден
- `error: "You must join a room first"` - Отправитель не в комнате

---

#### `answer`

Отправить WebRTC answer другому участнику.

**Payload:**
```typescript
{
  targetUserId: string;               // User ID получателя
  answer: RTCSessionDescriptionInit;  // SDP answer
}
```

**Example:**
```javascript
const answer = await peerConnection.createAnswer();
socket.emit('answer', {
  targetUserId: 'user_42',
  answer: answer
});
```

**Side Effects:**
- Получателю отправляется событие `answer` с SDP и senderUserId

**Errors:**
- `error: "Invalid target user ID"` - Невалидный targetUserId
- `error: "Invalid answer data"` - Невалидные данные answer
- `error: "Target user not found"` - Пользователь не найден
- `error: "You must join a room first"` - Отправитель не в комнате

---

#### `ice-candidate`

Отправить ICE candidate другому участнику.

**Payload:**
```typescript
{
  targetUserId: string;          // User ID получателя
  candidate: RTCIceCandidateInit; // ICE candidate
}
```

**Example:**
```javascript
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('ice-candidate', {
      targetUserId: 'user_42',
      candidate: event.candidate
    });
  }
};
```

**Side Effects:**
- Получателю отправляется событие `ice-candidate` с candidate и senderUserId

**Errors:**
- `error: "Invalid target user ID"` - Невалидный targetUserId
- `error: "Invalid ICE candidate data"` - Невалидные данные candidate
- `error: "Target user not found"` - Пользователь не найден
- `error: "You must join a room first"` - Отправитель не в комнате

---

### Server → Client Events

#### `user-connected`

Новый пользователь присоединился к комнате.

**Payload:**
```typescript
participant: Participant;  // Полные данные нового участника
```

**Example:**
```javascript
socket.on('user-connected', (participant) => {
  console.log('New user joined:', participant.nickname, participant.socketId);
  // Инициировать WebRTC соединение
});
```

---

#### `user-disconnected`

Пользователь покинул комнату или отключился.

**Payload:**
```typescript
userId: string;  // User ID отключившегося участника
```

**Example:**
```javascript
socket.on('user-disconnected', (userId) => {
  console.log('User left:', userId);
  // Закрыть peer connection для этого userId
});
```

---

#### `existing-users`

Список пользователей уже в комнате (отправляется при join).

**Payload:**
```typescript
participants: Participant[];  // Массив участников комнаты
```

**Example:**
```javascript
socket.on('existing-users', (participants) => {
  console.log('Users in room:', participants.map(p => `${p.nickname} (${p.socketId})`));
  // Инициировать WebRTC соединения с каждым
  participants.forEach(participant => {
    // Создать peer connection для participant.socketId
  });
});
```

---

#### `room-closed`

Комната была закрыта администратором.

**Payload:** none

**Example:**
```javascript
socket.on('room-closed', () => {
  console.log('Room was closed');
  // Закрыть все соединения и покинуть комнату
});
```

---

#### `room-created`

Создана новая комната. Broadcast всем подключенным клиентам.

**Payload:**
```typescript
{
  id: string;              // UUID комнаты
  name: string;            // Название комнаты
  participantCount: number; // Текущее количество участников (0)
  maxParticipants: number;  // Максимум участников
  createdAt: string;        // ISO 8601 timestamp
}
```

**Example:**
```javascript
socket.on('room-created', (room) => {
  console.log('New room created:', room.name, room.id);
  // Добавить комнату в UI список
  rooms.push(room);
});
```

---

#### `offer`

Получен WebRTC offer от другого участника.

**Payload:**
```typescript
{
  offer: RTCSessionDescriptionInit;  // SDP offer
  senderUserId: string;              // User ID отправителя
}
```

**Example:**
```javascript
socket.on('offer', async ({ offer, senderUserId }) => {
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit('answer', {
    targetUserId: senderUserId,
    answer: answer
  });
});
```

---

#### `answer`

Получен WebRTC answer от другого участника.

**Payload:**
```typescript
{
  answer: RTCSessionDescriptionInit;  // SDP answer
  senderUserId: string;               // User ID отправителя
}
```

**Example:**
```javascript
socket.on('answer', async ({ answer, senderUserId }) => {
  await peerConnection.setRemoteDescription(answer);
});
```

---

#### `ice-candidate`

Получен ICE candidate от другого участника.

**Payload:**
```typescript
{
  candidate: RTCIceCandidateInit;  // ICE candidate
  senderUserId: string;            // User ID отправителя
}
```

**Example:**
```javascript
socket.on('ice-candidate', async ({ candidate, senderUserId }) => {
  await peerConnection.addIceCandidate(candidate);
});
```

---

#### `error`

Ошибка при выполнении операции.

**Payload:**
```typescript
message: string;  // Сообщение об ошибке
```

**Example:**
```javascript
socket.on('error', (message) => {
  console.error('Server error:', message);
  // Показать уведомление пользователю
});
```

**Possible Error Messages:**
- `"Room not found"` - Комната не существует
- `"Could not join room. Room might be full."` - Комната заполнена
- `"Invalid room ID"` - Невалидный ID комнаты
- `"Invalid user ID"` - Невалидный ID пользователя
- `"Invalid target user ID"` - Невалидный targetUserId для WebRTC
- `"Target user not found"` - Целевой пользователь не найден
- `"You must join a room first"` - Отправитель не в комнате
- `"Invalid offer data"` - Невалидные данные offer
- `"Invalid answer data"` - Невалидные данные answer
- `"Invalid ICE candidate data"` - Невалидные данные candidate

---

## Error Handling

### REST API Errors

Все REST API ошибки возвращаются в формате:

```typescript
{
  error: string;  // Описание ошибки
}
```

**HTTP Status Codes:**
- `200 OK` - Успешный запрос
- `201 Created` - Ресурс создан
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

### WebSocket Errors

Все WebSocket ошибки отправляются через событие `error`:

```javascript
socket.on('error', (message: string) => {
  // Обработать ошибку
});
```

### Validation Errors

Класс `ValidationError` используется для всех ошибок валидации:

```typescript
class ValidationError extends Error {
  name: 'ValidationError';
  message: string;
}
```

Валидация применяется к:
- Room ID (должен быть непустой строкой)
- User ID (должен быть непустой строкой)
- WebRTC offer/answer/candidate данным
- Target user ID для peer-to-peer сообщений

---

## Connection Flow

### Полный flow подключения к видеозвонку:

```
1. Client → Server: POST /api/rooms
   Server → Client: { roomId: "uuid" }

2. Client → Server: WebSocket connect

3. Client → Server: emit('join-room', { roomId, userId, nickname })
   Server → Client: emit('existing-users', [participants])
   Server → Other Clients: emit('user-connected', participant)

4. For each existing user:
   Client → Server: emit('offer', { targetUserId, offer })
   Server → Target: emit('offer', { offer, senderUserId })

   Target → Server: emit('answer', { targetUserId, answer })
   Server → Client: emit('answer', { answer, senderUserId })

   Both peers exchange ICE candidates:
   Client → Server: emit('ice-candidate', { targetUserId, candidate })
   Server → Target: emit('ice-candidate', { candidate, senderUserId })

5. WebRTC connection established ✅

6. On disconnect:
   Client → Server: emit('leave-room', roomId)
   Server → Other Clients: emit('user-disconnected', userId)
```

---

## Configuration

### Environment Variables

```bash
PORT=3001                              # Порт сервера
CORS_ORIGIN=http://localhost:5173      # CORS origin
```

### Room Configuration

```typescript
room: {
  maxParticipants: 10,       // Максимум участников в комнате
  cleanupInterval: 60000,    // Интервал очистки (мс)
  emptyRoomTimeout: 3600000, // Таймаут пустой комнаты (мс) - 1 час
}
```

---

## Rate Limits

Currently no rate limiting is implemented. For production deployment, consider adding:

- Request rate limiting (express-rate-limit)
- WebSocket connection limits
- Room creation limits per IP
- Message throttling for WebRTC signals

---

## Security Considerations

### Current Implementation

- ✅ CORS настроен
- ✅ Валидация всех входных данных
- ✅ Ограничение участников комнаты

### Recommended for Production

- [ ] Аутентификация (JWT tokens)
- [ ] Авторизация (room ownership)
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] HTTPS/WSS
- [ ] Helmet.js для security headers
