import { Server } from 'socket.io';

export const socket = (server) => {

    const io = new Server(server);
    const lobbies = {};

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('authenticate', async (user) => {
            socket.user = user;
            console.log(`User ${user.nickname} authenticated`);

            socket.on('joinLobby', (lobbyName) => {
                handleJoinLobby(socket, user.nickname, lobbyName);
            });

            socket.on('leaveLobby', () => {
                handleLeaveLobby(socket, user.nickname);
            });

            socket.on('message', (message) => {
                handleMessage(socket, user.nickname, message);
            });

            socket.on('disconnect', () => {
                console.log(`User ${user.nickname} disconnected`);
            });
        });
    });

    function handleJoinLobby(socket, nickname, lobbyName) {
        if (!lobbies[lobbyName]) {
            lobbies[lobbyName] = { users: [] };
        }
        lobbies[lobbyName].users.push(nickname);
        socket.join(lobbyName);
        socket.currentLobby = lobbyName;

        io.to(lobbyName).emit('userJoined', {
            nickname,
            message: `${nickname} has joined the lobby ${lobbyName}.`,
        });

        io.to(lobbyName).emit('lobbyUsers', {
            lobbyName,
            users: lobbies[lobbyName].users,
        });

        console.log(`${nickname} joined lobby: ${lobbyName}`);
        console.log(`${lobbyName} has next users: ${lobbies[lobbyName].users}`);
    }

    function handleLeaveLobby(socket, nickname) {
        const lobbyName = socket.currentLobby;

        if (lobbyName && lobbies[lobbyName]) {
            lobbies[lobbyName].users = lobbies[lobbyName].users.filter((u) => u !== nickname);
            socket.leave(lobbyName);

            io.to(lobbyName).emit('userLeft', {
                nickname,
                message: `${nickname} has left the lobby ${lobbyName}.`,
            });

            io.to(lobbyName).emit('lobbyUsers', {
                lobbyName,
                users: lobbies[lobbyName].users,
            });

            console.log(`${nickname} left lobby: ${lobbyName}`);
            console.log(`${lobbyName} has next users: ${lobbies[lobbyName].users}`);
        }
    }

    function handleMessage(socket, nickname, message) {
        const lobbyName = socket.currentLobby;

        if (lobbyName) {
            io.to(lobbyName).emit('message', { nickname, message });
            console.log(`${nickname}: ${message}`);
        }
    }

};
