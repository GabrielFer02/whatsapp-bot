import { proto, WASocket } from '@whiskeysockets/baileys';
import { loadCommonFunctions } from '../utils/loadCommonFunctions';
import { dynamicCommand } from '../utils/dynamicCommand';

export type UpsertConfigs = {
  socket: WASocket;
  messages: proto.IWebMessageInfo[];
};

export const onMessagesUpsert = async ({ socket, messages }: UpsertConfigs) => {
  if (!messages.length) return;

  const webMessage = messages[0];
  const commonFunctions = loadCommonFunctions({ socket, webMessage });

  await dynamicCommand(commonFunctions);
};
