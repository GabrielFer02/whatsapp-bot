import { verifyPrefix } from '../middlewares/datas';

export const dynamicCommand = async (paramsHandler: any) => {
  const { commandName, prefix, sendWarningReply, sendErrorReply } =
    paramsHandler;

  const { type, command } = findCommandImport(commandName);

  if (!verifyPrefix(prefix) || ) return;
};
