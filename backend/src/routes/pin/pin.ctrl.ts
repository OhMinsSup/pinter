import { Request, Response, Router } from 'express';
import * as joi from 'joi';
import { diff } from 'json-diff';
import Tag, { ITag } from '../../database/models/Tag';
import Pin, { IPin } from '../../database/models/Pin';
import User, { IUser } from '../../database/models/User';
import Like from '../../database/models/Like';
import Locker from '../../database/models/Locker';
import Comment from '../../database/models/Comment';
import TagLink from '../../database/models/TagLink';
import {
    filterUnique,
} from '../../lib/common';
import { serializePin, serializePinList } from '../../lib/serialize';

export const writePin = async (req: Request, res: Response): Promise<any> => {
    type BodySchema = {
        relationUrl: string;
        body: string;
        urls: string[];
        tags: string[];
    };

    const schema = joi.object().keys({
        relationUrl: joi.string(),
        body: joi.string(),
        urls:  joi.array().items(joi.string()).required(),
        tags: joi.array().items(joi.string()).required(),
    });

    const result = joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).json({
            name: 'WRONG_SCHEMA',
            payload: result.error,
        });
    }

    const { relationUrl, body, urls, tags }: BodySchema = req.body;
    const userId: string = req['user']._id;
    const uniqueTags: string[] = filterUnique(tags);

    try {            
        const tagIds: string[] = await Promise.all(uniqueTags.map(tag => Tag.getTagId(tag)));

        const pin = await new Pin({
            relationUrl,
            body,
            urls,
            user: userId,
        }).save();

        const pinId = pin._id;      
        await TagLink.Link(pinId, tagIds);
        await User.pinCount(userId);

        res.json({
            pinId,
        });
    } catch (e) {
        res.status(500).json(e);
    }
};

export const updatePin = async (req: Request, res: Response): Promise<any> => {
    type BodySchema = {
        relationUrl: string,
        body: string,
        urls: string,
        tags: string[],
    };

    const schema = joi.object().keys({
        relationUrl: joi.string(),
        body: joi.string(),
        urls: joi.array().items(joi.string()).required(),
        tags: joi.array().items(joi.string()).required(),
    });

    const result: any = joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).json({
            name: 'WRONG_SCHEMA',
            payload: result.error,
        });
    }

    const { relationUrl, body, urls, tags }: BodySchema = req.body;
    const pinId: string = req['pin']._id;

    if (tags) {
        const currentTags: any[] = await TagLink.getTagNames(pinId);
        const tagNames: string[] = currentTags.map(tag => tag.tagId.name);
        const tagDiff: string[] = diff(tagNames.sort(), tags.sort()) || [];
        const tagsToRemove: string[] = tagDiff.filter(info => info[0] === '-').map(info => info[1]);
        const tagsToAdd: string[] = tagDiff.filter(info => info[0] === '+').map(info => info[1]);
        
        try {
            await TagLink.removeTagsPin(pinId, tagsToRemove);
            await TagLink.addTagsToPin(pinId, tagsToAdd);

            const pin: IPin = await Pin.findByIdAndUpdate(pinId, {
                relationUrl,
                body,
                urls,
            }, {
                new: true,
            }).lean();

            res.json({
                pinId: pin._id,
            });
        } catch (e) {
            res.status(500).json(e);
        }

    }
};

export const deletePin = async (req: Request, res: Response): Promise<any> => {
    const pinId: string = req['pin']._id;
    const userId: string = req['user']._id;

    try {
        await Promise.all([
            TagLink.deleteMany({ pinId }).lean(),
            Like.deleteMany({ pin: pinId }).lean(),
            Comment.deleteMany({ pin: pinId }).lean(),
            Locker.deleteMany({ pin: pinId }).lean(),
        ]);

        await Pin.deleteOne({
            _id: pinId,
        }).lean();
        await User.unpinCount(userId);

        res.json({
            pin: true,
        });
    } catch (e) {
        res.status(500).json(e);
    }
};

export const readPin = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const pinData: IPin = await Pin.readPinById(id);                
        const tagData: ITag = await TagLink.getTagNames(id);        
        res.json(serializePin(pinData, tagData));
    } catch (e) {
        res.status(500).json(e);
    }
};

export const listPin = async (req: Request, res: Response): Promise<any> => {
    const { displayName } = req.params;
    const { cursor } = req.query;
    
    let userId: string = null;

    try {
        if (displayName) {
            let user: IUser = await User.findByDisplayName(displayName);                        
            
            userId = user._id;
        }
        
        const pin: IPin[] = await Pin.readPinList(userId, cursor);
        const next = pin.length === 20 ? `/pin/${displayName ? `${displayName}/user` : '' }?cursor=${pin[19]._id}` : null;
        const pinWithData = pin.map(serializePinList);
        res.json({
            next,
            pinWithData,
        });
    } catch (e) {
        res.status(500).json(e);
    }
};