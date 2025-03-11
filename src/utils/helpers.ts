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

  return {
    remoteJid: webMessage?.key?.remoteJid,
    prefix,
    userJid,
    replyJid,
    isReply,
    commandName: formatCommand(commandWithoutPrefix),
    args: splitByCharacters(args.join(' '), ['\\', '|', '/']),
  };
};

export const splitByCharacters = (str: string, characters: string[]) => {
  characters = characters.map(char => (char === '\\' ? '\\\\' : char));
  const regex = new RegExp(`[${characters.join('')}]`);

  return str
    .split(regex)
    .map(str => str.trim())
    .filter(Boolean);
};

export const formatCommand = (text: string) => {
  return onlyLettersAndNumbers(
    removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim()),
  );
};

export const onlyLettersAndNumbers = (text: string) => {
  return text.replace(/[^a-zA-Z0-9]/g, '');
};

export const removeAccentsAndSpecialCharacters = (text: string) => {
  if (!text) return '';

  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const baileysIs = (
  webMessage: proto.IWebMessageInfo,
  context: string,
) => {
  return !!getContent(webMessage, context);
};

export const getContent = (
  webMessage: proto.IWebMessageInfo,
  context: string,
) => {
  const messageKey = `${context}Message` as keyof proto.IMessage;
  return (
    webMessage.message?.[messageKey] ||
    webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      messageKey
    ]
  );
};
