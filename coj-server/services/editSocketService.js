const redisClient = require('../modules/redisClient');
const sessionPath = '/tmp_session';
const timeToLive = 1800;

module.exports = function (io) {
    //collboration session
    const collaboration = {};
    const socketIdToSessionId = {};

    io.on('connection', (socket) => {
       // console.log(socket);
       // const message = socket.handshake.query['message'];
       // console.log('message received from client ' + message);
       // io.to(socket.id).emit('message', 'hahahahhhhahhh');

        const sessionId = socket.handshake.query['sessionId'];
        socketIdToSessionId[socket.id] = sessionId;

        // if (!(sessionId in collaboration)) {
        //     collaboration[sessionId] = {
        //         'participant' : []
        //     };
        // }
        // collaboration[sessionId]['participant'].push(socket.id);

        if (!(sessionId in collaboration)) {
            redisClient.get(sessionPath + '/' + sessionId, (data) => {
                if (!data) {
                    collaboration[sessionId] = {
                        'participant' : [],
                        'cachedEvents' : []
                    }
                } else {
                    collaboration[sessionId] = {
                        'participant' : [],
                        'cachedEvents' : JSON.parse(data)
                    }
                }
                collaboration[sessionId]['participant'].push(socket.id);
            });
        } else {
            collaboration[sessionId]['participant'].push(socket.id);
        }


        socket.on('change', (delta) => {
            const sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaboration) {
                collaboration[sessionId]['cachedEvents'].push(['change', delta, Date.now()]);
            } else {
                console.warn('WARNING, SESSION NOT EXISTS');
            }
            forwardEvent(socket.id, 'change', delta);
        });

        socket.on('cursorMove', (cursor) => {
            // console.log('cursor move receive from client: ' + socket.id);
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;
            forwardEvent(socket.id, 'cursorMove', JSON.stringify(cursor));
        });

        socket.on('restoreBuffer', () => {
            const sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaboration) {
                const events = collaboration[sessionId]['cachedEvents'];
                for (let event of events) {
                    socket.emit(event[0], event[1]);
                }
            } else {
                console.warn('WARNING, SESSION NOT EXISTS');
            }
        });

        socket.on('disconnect', () => {
            const sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaboration) {
                const participants = collaboration[sessionId]['participant'];
                const index = participants.indexOf(socket.id);
                if (index >= 0) {
                    participants.splice(index, 1);
                    if (participants.length === 0) {
                        const key = sessionPath + '/' + sessionId;
                        const value = JSON.stringify(collaboration[sessionId]['cachedEvents']);
                        redisClient.set(key, value, redisClient.print);
                        redisClient.expire(key, timeToLive);
                        delete collaboration[sessionId];
                    }
                } else {
                    console.warn('CLIENT DOES NOT EXIST');
                }
            } else {
                console.warn('WARNING, SESSION NOT EXISTS');
            }
        });
    });

    const forwardEvent = function (sockentId, event, data) {
        const sessId = socketIdToSessionId[sockentId];
        if (sessId in collaboration) {
            const participants = collaboration[sessId]['participant'];
            for (let participant of participants) {
                if (participant !== sockentId) {
                    io.to(participant).emit(event, data);
                }
            }
        } else {
            console.warn('WARNING, SESSION NOT EXISTS');
        }
    }
};