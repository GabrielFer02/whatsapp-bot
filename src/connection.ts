import {
  ConnectionState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeWASocket,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import path from 'path';
import pino from 'pino';
import { onlyNumbers, question } from './utils/helpers';

export const connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, '..', 'assets', 'auth', 'baileys'),
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    printQRInTerminal: false,
    version,
    logger: pino({ level: 'error' }),
    auth: state,
    browser: ['chrome', 'firefox', 'safari'],
    markOnlineOnConnect: true,
  });

  if (!socket.authState.creds.registered) {
    const phoneNumber = await question('Informe seu número de telefone:');

    if (!phoneNumber) {
      throw new Error('Número de telefone inválido');
    }

    const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));

    console.log(`Código de emparelhamento: ${code}`);
  }

  socket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect } = update;

    const shouldReconnect =
      lastDisconnect?.error?.cause !== DisconnectReason.loggedOut;

    if (shouldReconnect) connect();
  });

  socket.ev.on('creds.update', saveCreds);
};
