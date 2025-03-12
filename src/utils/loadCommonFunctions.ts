import { proto } from '@whiskeysockets/baileys';
import { UpsertConfigs } from '../middlewares/onMessagesUpsert';
import fs from 'node:fs';
import { baileysIs, download, extractDataFromMessage } from './helpers';
import { BOT_EMOJI } from '../configs';

type CommonFunctionsConfig = Omit<
  UpsertConfigs,
  keyof { messages: proto.IWebMessageInfo[] }
> & {
  webMessage: proto.IWebMessageInfo;
};

export const loadCommonFunctions = ({
  socket,
  webMessage,
}: CommonFunctionsConfig) => {
  const { args, commandName, isReply, prefix, remoteJid, replyJid, userJid } =
    extractDataFromMessage(webMessage);

  const isImage = baileysIs(webMessage, 'image');
  const isVideo = baileysIs(webMessage, 'video');
  const isSticker = baileysIs(webMessage, 'sticker');

  const downloadImage = async (
    webMessage: proto.IWebMessageInfo,
    fileName: string,
  ) => {
    return await download(webMessage, fileName, 'image', 'png');
  };

  const downloadSticker = async (
    webMessage: proto.IWebMessageInfo,
    fileName: string,
  ) => {
    return await download(webMessage, fileName, 'sticker', 'webp');
  };

  const downloadVideo = async (
    webMessage: proto.IWebMessageInfo,
    fileName: string,
  ) => {
    return await download(webMessage, fileName, 'video', 'mp4');
  };

  const sendText = async (text: string) => {
    return await socket.sendMessage(remoteJid as string, {
      text: `${BOT_EMOJI} ${text}`,
    });
  };

  const sendReply = async (text: string) => {
    return await socket.sendMessage(
      remoteJid as string,
      { text: `${BOT_EMOJI} ${text}` },
      { quoted: webMessage },
    );
  };

  const sendReact = async (emoji: string) => {
    return await socket.sendMessage(remoteJid as string, {
      react: {
        text: emoji,
        key: webMessage.key,
      },
    });
  };

  const sendSuccessReact = async () => {
    return await sendReact('✅');
  };

  const sendWaitReact = async () => {
    return await sendReact('⏳');
  };

  const sendWarningReact = async () => {
    return await sendReact('⚠️');
  };

  const sendErrorReact = async () => {
    return await sendReact('❌');
  };

  const sendSuccessReply = async (text: string) => {
    await sendSuccessReact();
    return await sendReply(`✅ ${text}`);
  };

  const sendWaitReply = async (text: string) => {
    await sendWaitReact();
    return await sendReply(`⏳ Aguarde! ${text}`);
  };

  const sendWarningReply = async (text: string) => {
    await sendWarningReact();
    return await sendReply(`⚠️ Atenção! ${text}`);
  };

  const sendErrorReply = async (text: string) => {
    await sendErrorReact();
    return await sendReply(`❌ Erro! ${text}`);
  };

  const sendStickerFromFile = async (file: string | Buffer | URL) => {
    return await socket.sendMessage(remoteJid as string, {
      sticker: fs.readFileSync(file),
    });
  };

  const sendImageFromFile = async (file: string | Buffer | URL) => {
    return await socket.sendMessage(remoteJid as string, {
      image: fs.readFileSync(file),
    });
  };

  return {
    socket,
    remoteJid,
    userJid,
    prefix,
    commandName,
    args,
    isReply,
    isImage,
    isVideo,
    isSticker,
    replyJid,
    webMessage,
    sendText,
    sendReply,
    sendStickerFromFile,
    sendImageFromFile,
    sendReact,
    sendSuccessReact,
    sendWaitReact,
    sendWarningReact,
    sendErrorReply,
    sendSuccessReply,
    sendWaitReply,
    sendWarningReply,
    sendErrorReact,
    downloadImage,
    downloadSticker,
    downloadVideo,
  };
};
