import { proto } from '@whiskeysockets/baileys';
import { UpsertConfigs } from '../middlewares/onMessagesUpsert';
import { baileysIs, extractDataFromMessage } from './helpers';

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

    const isImage = baileysIs(webMessage, 'image')
    const isVideo = baileysIs(webMessage, 'video')
    const IsSticker = baileysIs(webMessage, 'sticker')
};
