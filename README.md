# WS DOCS

## Lib
- socket.io

## Responses
- error
- rooms
- messages
- messageAdded

## Requests
- on _**connection,**_ you get all your rooms by key 'rooms'
- on **_createRoom_** you get all your rooms by key 'rooms' (include created
- on **_paginateRoom_** you can get paginated rooms
- on **_joinRoom_** you connect to room and get last 100 messages
- on **_leaveRoom_** you disconnect from room
- on **_addMessage_** you can create new message to room
- on **_addUserToRoom_** you can add new user to current room
- on **_removeUserFromRoom_** you can remove user from room

## Interfaces

### IUser
```typescript
interface IUser {
    id?: number;
    username?: string;
    email: string;
    password?: string;    
}
```

### ILoginResponse
```typescript
interface ILoginResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}
```

### IConnectedUser
```typescript
interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}
```

### IJoinedRoom
```typescript
interface IJoinedRoom {
  id?: number;
  socketId: string;
  users: IUser;
  room: IRoom;
}
```

### IMessage
```typescript
interface IMessage {
  id?: number;
  text: string;
  user: IUser;
  room: IRoom;
  created_at: Date;
  updated_at: Date;
}
```

### IRoom 
```typescript
interface IRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: IUser[];
  created_at?: Date;
  updated_at?: Date;
}
```

### IPage
```typescript
interface IPage {
  page: number;
  limit: number;
}
```

### IMoveUser
```typescript
interface IMoveUser {
    user: IUser,
    room: IRoom
}
```

## DTOs

### UserCreateDto
```typescript
class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @Transform((param) => param.value.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
```

### UserLoginDto
```typescript
class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
```


## WS REQUEST
- createRoom 
  - To create new room only with current (authorized) user send IRoom interface without users, for example

```typescript
() => {
    sendRequest({
        name: 'some coole name',
        description: 'very cool description',
    })
}
```

- To create new room with additional users send IRoom interface with users, for example

```typescript
() => {
    sendRequest({
        name: 'some coole name',
        description: 'very cool description',
        users: [
            {
                id: 1
            }
        ]
    })
}
```

- paginateRoom
    - send pagination request to rooms for current user with IPage interface, for example 

```typescript
() => {
    sendRequest({
        page: 1,
        limit: 50
    })
}
```

- joinRoom
    - send request to join room and get last messages, for example

```typescript
() => {
    sendRequest({
        room: {
            id: 1
        },
        options: {
            page: 1,
            limit: 50 //by default set to 100
        }
    })
}
```

- leaveRoom
  - on changing room or closing frontend app send current request to leave room
  - ```typescript
    () => {
        sendRequest()
    }
    ```

- addMessage
  - to add new message inside room send next request
  - ```typescript
    () => {
        sendRequest({
            text: 'new message text',
            room: {
                id: 1
            }
        })
    }
    ```
    
- addUserToRoom
  - to add new user to room send next request
  - ```typescript 
     () => {
        sendRequest({
            user: {
                id: 1
            },
            room: {
                id: 1
            }
        })
    }
    ```
    
-removeUserFromRoom
    - send as on addUserToRoom