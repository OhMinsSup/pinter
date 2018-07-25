import { Request, Response, Router } from 'express';
import Tag, { ITag } from '../database/models/Tag';
import Pin, { IPin } from '../database/models/Pin';
import User, { IUser } from '../database/models/User';
import { serializeTag, serializeTagPin } from '../lib/serialize';

class CommonRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private async getTags(req: Request, res: Response): Promise<any> {
        const { sort = 'latest' } = req.query;
        const availableSort = ['latest', 'name'];

        if (availableSort.indexOf(sort) === -1) {
            return res.status(400).json({
                name: '존재하지 않는 정렬입니다'
            });
        }

        const sortBy = Object.assign(
            {},
            sort === 'latest' ? { _id: -1 } : { name: 'asc' } 
        );

        try {
            const tagData = await Tag.find().sort(sortBy);
            res.json(tagData.map(serializeTag));
        } catch (e) {
            res.status(500).json(e);
        }
    }

    private async getTagInfo(req: Request, res: Response): Promise<any> {
        const { tag } = req.params;

        try {
            const { pin }: ITag = await Tag.findByTagName(tag);
            const pinData = await Promise.all(pin.map(pinId => Pin.readPinById(pinId._id)));
            res.json(pinData.map(serializeTagPin));
        } catch (e) {
            res.status(500).json(e);
        }
    }

    private async recommendFollow(req: Request, res: Response): Promise<any> {
        try {
            const user = await User.aggregate([

            ])
            res.json({
                user
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    public routes(): void {
        const { router } = this;

        router.get('/tags', this.getTags);
        router.get('/tags/:tag', this.getTagInfo);
    }
}

export default new CommonRouter().router;