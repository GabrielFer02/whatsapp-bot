import { WASocket } from '@whiskeysockets/baileys';

type PermissionProps = {
  type: string;
  socket: WASocket;
  userId: string;
  remoteId: string;
};

export const checkPermission = async ({
  type,
  socket,
  userId,
  remoteId,
}: PermissionProps) => {
  if (type === 'member') return true;

  const { participants, owner } = await socket.groupMetadata(remoteId);

  const participant = participants.find(
    participant => participant.id === userId,
  );

  if (!participant) return false;

  const isowner =
    participant.id === owner || participant.admin === 'superadmin';

  const isAdmin = participant.admin === 'admin';

  if (type === 'admin') return isowner || isAdmin;

  if (type === 'owner') return isowner;

  return false;
};
