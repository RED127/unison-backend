import * as Joi from 'joi';
import * as Validation from 'express-joi-validation';
import { Request, Response, NextFunction } from 'express';

export const V = Validation.createValidator({ passError: true });

export const RetrunValidation = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error && error.error && error.value && error.type) {
    return res.status(400).json(error.error.toString().replace('Error: ', ''));
  } else {
    return next(error);
  }
};

export const Validator = {
  ObjectId: Joi.object({
    id: Joi.string().min(24).max(24).required()
  }),
  UserId: Joi.object({
    userId: Joi.string().min(24).max(24).required()
  }),
  EventId: Joi.object({
    id: Joi.number().required()
  }),
  Users: {
    Auth: {
      Login: Joi.object({
        id: Joi.string().max(20).required(),
        accessToken: Joi.string().required(),
        username: Joi.string().required(),
        avatar: Joi.string().required(),
        discriminator: Joi.string().required(),
      }),
      Signup: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(6).max(30).required(),
        password: Joi.string().min(8).max(30).required(),
        recaptcha: Joi.string().min(1).required(),
        iReferral: Joi.string().allow('', null).optional(),
        rReferral: Joi.string().allow('', null).optional()
      }),
      CheckAddress: Joi.object({
        publicAddress: Joi.string().min(42).max(44).required()
      }),
      SigninAddress: Joi.object({
        publicAddress: Joi.string().min(42).max(44).required(),
        signature: Joi.string().min(1).required()
      }),
      SignupAddress: Joi.object({
        publicAddress: Joi.string().min(42).max(44).required(),
        iReferral: Joi.string().allow('', null).optional(),
        rReferral: Joi.string().allow('', null).optional()
      }),
      Forgot: Joi.object({
        email: Joi.string().email().required(),
        recaptcha: Joi.string().min(1).required()
      }),
      ChangePassword: Joi.object({
        userId: Joi.string().min(24).max(24).required(),
        'Current Password': Joi.string().min(1).required(),
        Password: Joi.string().min(8).max(30).message('').required()
      }),
      PasswordReset: Joi.object({
        userId: Joi.string().min(24).max(24).required(),
        token: Joi.string().min(1).required(),
        password: Joi.string().min(8).max(30).required()
      }),
      Info: Joi.object({
        userId: Joi.string().min(24).max(24).required(),
        update: Joi.boolean().required(),
        _id: Joi.string().min(24).max(24).optional(),
        email: Joi.string().min(1).optional(),
        username: Joi.string().min(1).optional(),
        avatar: Joi.string().min(1).allow('', null).optional(),
        cryptoAccount: Joi.string().min(42).max(44).optional(),
        publicAddress: Joi.string().min(42).max(44).optional(),
        oddsformat: Joi.string().optional(),
        iReferral: Joi.string().allow('', null).optional(),
        rReferral: Joi.string().allow('', null).optional()
      })
    }
  },
  Collab: {
    Get: Joi.object({
      page: Joi.number().required(),
      pageSize: Joi.number().required()
    }),
    Project: {
      Add: Joi.object({
        serverId: Joi.string().required(),
        description: Joi.string().required(),
        projectStatus: Joi.number().required(),
        collabStatus: Joi.number().required(),
        userType: Joi.number().required(),
        twitterLink: Joi.string().allow('', null).optional(),
        roleId: Joi.string().allow('', null).optional(),
        discordLink: Joi.string().allow('', null).optional()
      })
    },
    Collab: {
      Apply: Joi.object({
        projectId: Joi.string().required(),
        collabType: Joi.number().required(),
        format: Joi.number().optional(),
        openedSpots: Joi.number().optional(),
        description: Joi.string().allow('', null).optional(),
        requestBy: {
          projectName: Joi.string().required(),
          oneTimeReq: Joi.string().allow('', null).optional()
        },
        expiretime: Joi.number().optional(),
        expiretimemin: Joi.number().optional()
      })
    }
  }
};
