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

        if (!(sessionId in collaboration)) {
            collaboration[sessionId] = {
                'participant' : []
            };
        }
        collaboration[sessionId]['participant'].push(socket.id);

        socket.on('change', (delta) => {
            const sessId = socketIdToSessionId[socket.id];
            if (sessId in collaboration) {
                const participants = collaboration[sessId]['participant'];
                for (let participant of participants) {
                    if (participant !== socket.id) {
                        io.to(participant).emit('change', delta);
                    }
                }
            } else {
                console.warn('WARNING! CHANGE TO NONEXISTENT SESSION');
            }
        })
    });
};