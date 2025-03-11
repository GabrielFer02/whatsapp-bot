import { proto } from '@whiskeysockets/baileys';
import { UpsertConfigs } from '../middlewares/onMessagesUpsert';

type CommonFunctionsConfig = Omit<
  UpsertConfigs,
  keyof { messages: proto.IWebMessageInfo[] }
> & {
  webMessage: proto.IWebMessageInfo;
};

export const loadCommonFunctions = ({
  socket,
  webMessage,
}: CommonFunctionsConfig) => {};
