import { Schema, model, Document, Model } from 'mongoose';
import { generateToken } from '../../lib/token';

export interface IUser extends Document {
    _id: string;
    username: string;
    email?: string;
    profile?: {
        displayName?: string;
        thumbnail?: string;
    },
    social?: {
        facebook?: {
            id?: string,
            accessToken?: string
        },
        google?: {
            id?: string,
            accessToken?: string
        }
    },
    generate(profile: IUser): Promise<any>
}

export interface IUserModel extends Model<IUser> {
    findByEmailOrUsername(type: 'email' | 'username', value: string): Promise<any>;
    findBySocial(provider: string, socialId: string | number): Promise<any>;
    findByDisplayName(value: string): Promise<any>;
}

const User = new Schema({
    username: String,
    email: String,
    profile: {
        displayName: String,
        thumbnail: {
            type: String,
            default: 'https://avatars.io/platform/userId'
        }
    },
    social: {
        facebook: {
            id: String,
            accessToken: String
        },
        google: {
            id: String,
            accessToken: String
        }
    },
});

User.statics.findByEmailOrUsername = function(type: 'email' | 'username', value: string): Promise<any> {
    return this.findOne({
        [type]: value
    });
};

User.statics.findByDisplayName = function(value: string): Promise<any> {
    return this.findOne({
        'profile.displayName': value
    });
}

User.statics.findBySocial = function(provider: string, socialId: string | number): Promise<any> {
    const key = `social.${provider}.id`;

    return this.findOne({
        [key]: socialId
    });
};

User.methods.generate = async function(profile: IUser): Promise<any> {
    const { _id, username } = this;

    if(!profile) {
        throw new Error('user profile not found');
    }

    const { profile: { displayName, thumbnail } } = profile;
    const auth = {
        _id,
        username,
        displayName,
        thumbnail
    };
    return generateToken(auth);
}

const UserModel = model<IUser>('User', User) as IUserModel;

export default UserModel;