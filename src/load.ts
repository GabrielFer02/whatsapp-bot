import { WASocket } from '@whiskeysockets/baileys';
import { onMessagesUpsert } from './middlewares/onMessagesUpsert';

export const load = (socket: WASocket) => {
  socket.ev.on('messages.upsert', ({messages}) => {
    setTimeout(() => {
      onMessagesUpsert({socket, messages})
    }, 500);
  });
};
