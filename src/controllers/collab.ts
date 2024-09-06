import axios from 'axios';
import { Response } from 'express';
import { Request } from '../types';
import mongoose from 'mongoose';
import Projects from '../models/Projects';
import PendingProjects from '../models/PendingProjects';
import Collabs from '../models/Collabs';
import Guilds from '../models/Guilds';
import Winners from '../models/Winners';
import Notifications from '../models/Notifications';
import { getBot, postAnnouncement } from './bot';

export const getAll = async (req: Request, res: Response) => {
  const results = await Collabs.find();
  res.json(results);
};

export const winnersAll = async (req: Request, res: Response) => {
  const results = await Winners.find();
  res.json(results);
};

export const ObjectId = (id: string) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    console.log('ObjectId', id);
  }
};

export const getServers = async (req: Request, res: Response) => {
  const { data }: any = await axios.get(
    'https://discordapp.com/api/v9/users/@me/guilds',
    {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`
      }
    }
  );
  if (!data) {
    return res.status(400).json('Interanal server error');
  }
  let ids: any = [];
  let results: any = [];
  const previtems = await Projects.find({ userId: req.user.userid });
  data.filter(async (item: any) => {
    if (
      item.permissions === '70368744177663' ||
      item.permissions === '140737488355327'
    ) {
      if (!previtems.find((obj) => obj.serverId == item.id)) {
        let temp = item;
        temp.userId = req.user.userid;
        ids.push(temp.id);
        results.push(temp);
        return temp;
      }
    }
  });

  await Guilds.deleteMany({ id: { $in: ids } });
  await Guilds.insertMany(results);

  return res.json(results);
};

export const getRoles = async (req: Request, res: Response) => {
  const { serverId }: any = req.query;
  const client = getBot();
  let guild = client.guilds.cache.get(serverId);
  const roles: any = await guild.roles.fetch();
  let options: any = [];
  roles.forEach((role: any) => {
    console.log(role.name);
  });
  return res.json(options);
};

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await Projects.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: 'guilds',
        localField: 'serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    }
  ]);
  return res.json(projects);
};

export const getMyProjects = async (req: Request, res: Response) => {
  const projects = await Projects.aggregate([
    { $match: { userId: req.user.userid } },
    {
      $lookup: {
        from: 'guilds',
        localField: 'serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    }
  ]);
  return res.json(projects);
};

export const newProject = async (req: Request, res: Response) => {
  let query = req.body;
  query.userId = req.user.userid;
  const existsPro = await Projects.find({ userId: query.userId });
  // if (existsPro.length >= 3)
  //   return res.status(400).json('You can add up to 3 projects');

  const existsServer = existsPro.filter(
    (pro) => pro.serverId === query.serverId
  );
  if (existsServer.length)
    return res.status(400).json('A project for that server already exists');

  query.date = new Date(new Date().valueOf() + 600 * 1000);
  const newProject = new PendingProjects(query);
  const project: any = await newProject.save();
  if (!project) {
    return res.status(400).json('Interanal server error');
  } else {
    return res.json(true);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { serverId } = req.body;
  const up = await Projects.findOneAndUpdate({ serverId }, req.body);
  res.json(up);
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.body;
  const result = await Projects.aggregate([
    { $match: { serverId: id, userId: req.id } },
    {
      $lookup: {
        from: 'guilds',
        localField: 'serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    }
  ]);
  let roleoptions: any = [];
  if (result.length) {
    const item = result[0];
    roleoptions = await getRolebyServerId(item.serverId);
  }

  return res.json({ project: result, roleoptions });
};

export const getRolebyServerId = async (serverId: any) => {
  const IgnoreLs = ['@everyone', 'UnisonBot1'];
  const client = getBot();
  let roleoptions: any = [
    {
      label: "I'll select later/Not Applicable",
      value: 'not'
    }
  ];
  let guild = client.guilds.cache.get(serverId);
  if (guild) {
    const roles = await guild.roles.fetch();

    roles.forEach((role: any) => {
      if (!IgnoreLs.find((obj) => obj == role.name)) {
        roleoptions.push({
          label: role.name,
          value: role.id
        });
      }
    });
    return roleoptions;
  } else {
    return roleoptions;
  }
};

export const getProject = async (req: Request, res: Response) => {
  const { id }: any = req.query;
  const projects = await Projects.aggregate([
    { $match: { userId: req.user.userid } },
    {
      $lookup: {
        from: 'guilds',
        localField: 'serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    }
  ]);
  const result = await Projects.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: 'guilds',
        localField: 'serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    },
    {
      $project: {
        _id: 1,
        description: 1,
        projectStatus: 1,
        collabStatus: 1,
        userType: 1,
        twitterLink: 1,
        discordLink: 1,
        serverId: 1,
        server: {
          id: 1,
          name: 1,
          icon: 1
        }
      }
    }
  ]);

  let myproject: any = [];
  projects.map((row) => {
    myproject.push({ id: row.serverId, name: row.server.name });
  });

  return res.json({ project: result, myProject: myproject });
};

export const subscribeNotification = async (notifiquery: any, req: Request) => {
  const notification = new Notifications(notifiquery);
  const nf = await notification.save();
  const io = req.app.get('socketio');
  io.emit('refreshnotification' /* … */);
  return;
};

export const applyProject = async (req: Request, res: Response) => {
  let query = req.body;
  query.userId = req.user.userid;
  query.enddate = new Date(new Date().valueOf() + 1800 * 1000);
  const collab = new Collabs(query);
  const result = await collab.save();
  const useritem = await Projects.findById(collab.projectId);
  let notifiquery = {
    date: new Date(),
    userId: useritem.userId,
    rquserId: req.user.userid,
    title: 'Collab Request',
    status: false,
    projectId: collab.projectId
  };
  await subscribeNotification(notifiquery, req);
  res.json(result);
};

export const getMyCollabs = async (req: Request, res: Response) => {
  const projects = await Projects.find({ userId: req.user.userid });
  let projectids: any = [];
  for (let i in projects) {
    projectids.push(projects[i]._id);
  }
  const { pageSize, page } = req.body;
  const count = await Collabs.count({
    projectId: { $in: projectids },
    inprogress: { $ne: true }
  });
  const results = await Collabs.aggregate([
    { $match: { projectId: { $in: projectids }, inprogress: { $ne: true } } },
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $unwind: '$project'
    },
    {
      $lookup: {
        from: 'guilds',
        localField: 'project.serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    },
    {
      $lookup: {
        from: 'guilds',
        localField: 'requestBy.projectName',
        foreignField: 'id',
        as: 'rqserver'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'userid',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $lookup: {
        from: 'winners',
        localField: '_id',
        foreignField: 'collabId',
        as: 'winner'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'winner.userId',
        foreignField: 'userid',
        as: 'winneruser'
      }
    },

    {
      $project: {
        _id: 1,
        userId: 1,
        collabType: 1,
        format: 1,
        openedSpots: 1,
        requestBy: 1,
        status: 1,
        createdAt: 1,
        description: 1,
        server: {
          id: 1,
          name: 1,
          icon: 1
        },
        project: {
          userType: 1
        },
        rqserver: {
          id: 1,
          name: 1,
          icon: 1
        },
        user: {
          username: 1,
          discriminator: 1,
          userid: 1,
          avatar: 1
        },
        winneruser: {
          id: 1,
          username: 1,
          discriminator: 1
        }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  ]);
  return res.json({ results, count });
};

export const getSentMyCollabs = async (req: Request, res: Response) => {
  const { pageSize, page } = req.body;
  const count = await Collabs.count({
    userId: req.user.userid,
    inprogress: { $ne: true }
  });
  const results = await Collabs.aggregate([
    { $match: { userId: req.user.userid, inprogress: { $ne: true } } },
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $unwind: '$project'
    },
    {
      $lookup: {
        from: 'guilds',
        localField: 'project.serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    },
    {
      $lookup: {
        from: 'guilds',
        localField: 'requestBy.projectName',
        foreignField: 'id',
        as: 'rqserver'
      }
    },

    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'userid',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $lookup: {
        from: 'winners',
        localField: '_id',
        foreignField: 'collabId',
        as: 'winner'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'winner.userId',
        foreignField: 'userid',
        as: 'winneruser'
      }
    },

    {
      $project: {
        _id: 1,
        userId: 1,
        collabType: 1,
        format: 1,
        openedSpots: 1,
        requestBy: 1,
        status: 1,
        createdAt: 1,
        description: 1,
        server: {
          id: 1,
          name: 1,
          icon: 1
        },
        project: {
          userType: 1
        },
        rqserver: {
          id: 1,
          name: 1,
          icon: 1
        },
        user: {
          username: 1,
          discriminator: 1,
          userid: 1,
          avatar: 1
        },
        winneruser: {
          id: 1,
          username: 1,
          discriminator: 1
        }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  ]);
  return res.json({ results, count });
};

export const getInprogressMyCollabs = async (req: Request, res: Response) => {
  const { pageSize, page } = req.body;
  const projects = await Projects.find({ userId: req.user.userid });
  let projectids: any = [];
  for (let i in projects) {
    projectids.push(projects[i]._id);
  }
  const count = await Collabs.count({
    $or: [{ userId: req.user.userid }, { projectId: { $in: projectids } }],
    inprogress: true
  });
  const results = await Collabs.aggregate([
    {
      $match: {
        $or: [{ userId: req.user.userid }, { projectId: { $in: projectids } }],
        inprogress: true
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $unwind: '$project'
    },
    {
      $lookup: {
        from: 'guilds',
        localField: 'project.serverId',
        foreignField: 'id',
        as: 'server'
      }
    },
    {
      $unwind: '$server'
    },
    {
      $lookup: {
        from: 'guilds',
        localField: 'requestBy.projectName',
        foreignField: 'id',
        as: 'rqserver'
      }
    },

    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'userid',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        collabType: 1,
        format: 1,
        openedSpots: 1,
        requestBy: 1,
        status: 1,
        createdAt: 1,
        description: 1,
        project: {
          userType: 1
        },
        server: {
          id: 1,
          name: 1,
          icon: 1
        },
        rqserver: {
          id: 1,
          name: 1,
          icon: 1
        },
        user: {
          username: 1,
          discriminator: 1,
          userid: 1,
          avatar: 1
        }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  ]);
  return res.json({ results, count });
};

export const updateCollab = async (req: Request, res: Response) => {
  const { _id, status, format } = req.body;
  const collabitem = await Collabs.findById(_id);
  const enddate = new Date(
    new Date().valueOf() +
      collabitem.expiretime * 3600 * 1000 +
      collabitem.expiretimemin * 60 * 1000
  );
  // const inprogressdate =
  //   (format == 3 ? enddate.valueOf() : new Date().valueOf()) + 1000 * 60 * 5;
  const inprogressdate =
    (format == 3 ? enddate.valueOf() : new Date().valueOf()) + 3600 * 1000 * 24;

  const up: any = await (
    await Collabs.findByIdAndUpdate(_id, {
      status: status,
      enddate,
      posted: true,
      inprogressdate,
      inprogress: true
    })
  ).populate('projectId');
  if (up) {
    let notifiquery = {
      date: new Date(),
      rquserId: req.id,
      userId: up.userId,
      title: `Collab Request ${status === 1 ? 'Accepted' : 'Rejected'}`,
      status: false,
      projectId: up.projectId
    };
    await subscribeNotification(notifiquery, req);
    if (status === 1) {
      if (up.collabType == 1) {
        if (up.projectId.channelId.length) {
          await postAnnouncement({
            description: up.description,
            channelId: up.projectId.channelId,
            collabid: up._id,
            format: up.format,
            projectid: up.requestBy.projectName
          });
        }
      } else {
        const pjitem: any = await Projects.findOne({
          serverId: up.requestBy.projectName
        });
        if (pjitem && pjitem.channelId.length) {
          await postAnnouncement({
            description: up.description,
            channelId: pjitem.channelId,
            collabid: up._id,
            format: up.format,
            projectid: up.projectId.serverId
          });
        } else {
        }
      }
    }
  }
  res.json(true);
};

export const updateChannelId = async (param: any) => {
  const up = await Projects.findOneAndUpdate(
    { serverId: param.serverId },
    { channelId: param.channelId }
  );
  return up;
};
