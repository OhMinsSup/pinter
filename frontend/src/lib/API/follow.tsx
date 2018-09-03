import axios from 'axios';

export const followAPI = (displayName: string): Promise<any> => axios.post(`/follow/${displayName}`);
export const unfollowAPI = (displayName: string): Promise<any> => axios.delete(`/follow/${displayName}`);
export const getFollowAPI = (displayName: string): Promise<any> => axios.get(`/follow/exists/${displayName}`);
export const getFollowingAPI = (displayName: string): Promise<any> => axios.get(`/follow/${displayName}/following`);
export const getFollowerAPI = (displayName: string): Promise<any> => axios.get(`/follow/${displayName}/follower`);
export const nextAPI = (next: string): Promise<any> => axios.get(next);
