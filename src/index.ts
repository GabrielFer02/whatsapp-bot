import { connect } from './connection';

async function start() {
  const socket = await connect();

  load(socket);
}

start();
