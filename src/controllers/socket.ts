import PendingProjects from '../models/PendingProjects';
import { CronJob } from 'cron';

let Sockets: any = null;

const Socket = (io: any) => {
  io.on('connection', (client: any) => {
    console.log('--connected');
  });

  const FetchEndPendingprojects = async () => {
    const endprojects: any = await PendingProjects.find({
      date: {
        $lte: new Date()
      }
    });
    let ids: any = {};
    for (let i in endprojects) {
      const project: any = endprojects[i];
      ids[project.serverId] = true;
    }
    await PendingProjects.deleteMany({
      date: {
        $lte: new Date()
      }
    });
    io.sockets.emit('rejectproject', ids);
  };

  const sesjob = new CronJob('*/30 * * * * *', async function () {
    FetchEndPendingprojects();
  });
  sesjob.start();
  Sockets = io;
};
export default Socket;

export const getSocket = () => {
  return Sockets;
};
