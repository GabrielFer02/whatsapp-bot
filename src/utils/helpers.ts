import { proto } from '@whiskeysockets/baileys';
import readline from 'readline';

export const question = (message: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>(resolve => rl.question(message, resolve));
};

export const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');

export const extractDataFromMessage = (webMessage: proto.IWebMessageInfo) => {
  const textMessage = webMessage.message?.conversation;
  const extendedTextMessage = webMessage.message?.extendedTextMessage;
  const extendedTextMessageText = extendedTextMessage?.text;
  const imageTextMessage = webMessage.message?.imageMessage?.caption;
  const videoTextMessage = webMessage.message?.videoMessage?.caption;

  const fullMessage =
    textMessage ||
    extendedTextMessageText ||
    imageTextMessage ||
    videoTextMessage;

  if (!fullMessage) {
    return {
      remoteJid: null,
      userJid: null,
      prefix: null,
      commandName: null,
      isReply: false,
      replyJid: null,
      args: [],
    };
  }

  const isReply =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

  const replyJid =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.participant
      ? extendedTextMessage.contextInfo.participant
      : null;

  const userJid = webMessage?.key?.participant?.replace(
    /:[0-9][0-9]|:[0-9]/g,
    '',
  );

  const [command, ...args] = fullMessage.split(' ');
  const prefix = command.charAt(0);

  const commandWithoutPrefix = command.replace(new RegExp('^[/]+'), '');
};
