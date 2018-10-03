import { Response, Request } from 'express';
import * as joi from 'joi';
import Group, { IGroup } from '../../database/models/Group';
import GroupUser from '../../database/models/GroupUser';
import { serializeGroup } from '../../lib/serialize';

export const createGroup = async (req: Request, res: Response): Promise<any> => {
    type BodySchema = {
        title: string,
        contents: string,
        cover: string,
    }

    const schema = joi.object().keys({
        title: joi.string().min(1).max(15).required(),
        contents: joi.string().min(1).required(),
        cover: joi.any()
    });

    const result = joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).json({
            name: 'WRONG_SCHEMA',
            payload: result.error
        });
    }

    const { title, contents, cover }: BodySchema = req.body;
    const userId: string = req['user']._id;

    try {
        const query = Object.assign(
            {},
            cover ? {
                creator: userId,
                title,
                contents,
                cover,
            } : {
                creator: userId,
                title,
                contents,
                cover: '',
            }
        )   

        const group = await new Group(query);
        await new GroupUser({
            user: userId,
            group: group._id
        });
        
        res.json({
            title: group.title,
            groupId: group._id,
        });
    } catch (e) {
        res.status(500).json(e);
    }
}

export const writeGroupPin = async (req: Request, res: Response): Promise<any> => {
    type BodySchema = {
        pinId: string,
        groupId: string,
    }
    const { pinId, groupId }: BodySchema = req.body;

    try {
        
    } catch (e) {
        res.status(500).json(e);
    }
}

export const listGroup = async (req: Request, res: Response): Promise<any> => {
    const { cursor } = req.query;

    try {
        const group: IGroup[] = await Group.readGroupList(cursor);
        const next = group.length === 10 ? `/group/?cursor=${group[9]._id}` : null;
        const groupWithData = group.map(serializeGroup);
        
        res.json({
            next,
            groupWithData,
        });
    } catch (e) {
        res.status(500).json(e);
    }
}