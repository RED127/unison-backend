import { Response } from 'express';
import { Request } from '../types';
import Notifications from '../models/Notifications';

export const converTostring = (date: any) => {
  let mm: any = parseInt(
    String((new Date().valueOf() - new Date(date).valueOf()) / 60 / 1000)
  );
  let hh: any = '';
  let dd: any = '';
  if (mm < 60) {
    return `${mm} mins ago`;
  }
  hh = parseInt(String(mm / 60));
  if (hh > 23) {
    dd = parseInt(String(hh / 24));
    return `${dd} days ago`;
  } else {
    return `${hh} hours ago`;
  }
};

export const getNotification = async (req: Request, res: Response) => {
  let results: any = await Notifications.aggregate([
    { $match: { userId: req.id, status: false } },
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
        from: 'users',
        localField: 'rquserId',
        foreignField: 'userid',
        as: 'rquser'
      }
    },
    {
      $unwind: '$rquser'
    },
    {
      $project: {
        _id: 1,
        title: '$title',
        date: '$date',
        user: {
          id: 1,
          username: 1
        },
        rquser: {
          id: 1,
          username: 1
        },
        server: {
          id: 1,
          name: 1,
          icon: 1
        }
      }
    }
  ]);
  for (let i in results) {
    results[i].datestr = converTostring(results[i].date);
  }

  results.sort(function (a: any, b: any) {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf();
  });
  res.json(results);
};

export const allupdateNotification = async (req: Request, res: Response) => {
  const up = await Notifications.updateMany(
    { userId: req.id, status: false },
    { status: true }
  );
  res.json('success');
};

export const updateNotification = async (req: Request, res: Response) => {
  const { _id } = req.body;
  const up = await Notifications.findByIdAndUpdate(_id, { status: true });
  getNotification(req, res);
};
