import { Request as ExpressRequest } from 'express';

export type Payload = {
  user?: any;
  userId: string;
  id: string;
};
export type Request = ExpressRequest & Payload;

export type NetworkType = {
  name: string;
  icon: string;
};

export type INFT = {
  name: string;
  description: string;
  image: string;
  video: string;
  network: NetworkType;
};
