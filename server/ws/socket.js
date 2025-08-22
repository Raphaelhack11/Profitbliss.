import { Server } from "socket.io";
import { db } from "../startup/db.js";

export function initSocketHandlers(io){
  io.on("connection", (socket) => {
    console.log("ws connected", socket.id);

    socket.on('identify', async ({ token, userId }) => {
      // for simplicity client can send userId after login; production: verify JWT and map socket->user
      socket.data.userId = userId;
      if(userId) socket.join(`user_${userId}`);
    });

    socket.on('user:message', async ({ userId, body }) => {
      if(!body) return;
      await db.run('INSERT INTO messages (userId, body, fromAdmin) VALUES (?,?,0)', [userId, body]);
      // notify admins
      io.to('admins').emit('admin:new_message', { userId, body });
      // ack
      socket.emit('message:ack', { ok:true, body });
    });

    socket.on('admin:join', ({ adminId }) => {
      socket.join('admins');
    });

    socket.on('admin:reply', async ({ userId, body }) => {
      await db.run('INSERT INTO messages (userId, body, fromAdmin) VALUES (?,?,1)', [userId, body]);
      // send to user room
      io.to(`user_${userId}`).emit('message:fromAdmin', { body });
    });

    socket.on('disconnect', () => {});
  });
                                                                                     }
