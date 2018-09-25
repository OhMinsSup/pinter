import { handleActions, createAction } from 'redux-actions';
import produce from 'immer';
import { createPromiseThunk, GenericResponseAction } from '../../lib/common';
import * as commonAPI from '../../lib/API/common';

const INITIALIZE_PROFILE = 'common/INITIALIZE_PROFILE';
const GET_PROFILE = 'common/GET_PROFILE';
const GET_PROFILE_SUCCESS = 'common/GET_PROFILE_SUCCESS';
const GET_PROFILE_PENDING = 'common/GET_PROFILE_PENDING';
const CHANGE_INPUT_PROFILE = 'common/CHANGE_INPUT_PROFILE';

const SEARCH_PIN = 'common/SEARCH_PIN';
const SEARCH_PIN_PENDING = 'common/SEARCH_PIN_PENDING';
const SEARCH_PIN_SUCCESS = 'common/SEARCH_PIN_SUCCESS';

type ChangeInputProfilePayload = { value: string, name: string };

export const commonCreators = {
    initializeProfile: createAction(INITIALIZE_PROFILE),
    changeInputProfile: createAction(CHANGE_INPUT_PROFILE, (payload: ChangeInputProfilePayload) => payload),
    getProfile: createPromiseThunk(GET_PROFILE, commonAPI.getProfileAPI),
    searchPin: createPromiseThunk(SEARCH_PIN, commonAPI.searchPinAPI)
}

type GetProfileAction = GenericResponseAction<{
    username: string,
    displayName: string,
    thumbnail: string,
    userId: string,
    follower: number,
    following: number,
    pin: number,
 }, string>;
type ChangeInputProfileAction = ReturnType<typeof commonCreators.changeInputProfile>;
type SearchPinDataAction = GenericResponseAction<{
    next: string,
    Data: any
}, string>;

export interface UserProfileSubState {
    username: string;
    displayName: string;
    thumbnail: string;
    userId: string;
    follower: number;
    following: number;
    pin: number;
    loading: boolean;
}

export interface CommonState {
    profile: UserProfileSubState
    setting: {
        displayName: string,
        thumbnail: string,
    },
    search: {
        next: string,
        loading: boolean,
        Data: any,
    }
}

const initialState: CommonState = {
    profile: {
        username: '',
        userId: '',
        thumbnail: '',
        displayName: '',
        follower: 0,
        following: 0,
        pin: 0,
        loading: false,
    },
    setting : {
        displayName: '',
        thumbnail: '',
    },
    search: {
        next: '',
        loading: false,
        Data: null,
    }
}

export default handleActions<CommonState, any>({
    [INITIALIZE_PROFILE]: (state) => {
        return produce(state, (draft) => {
            draft.profile = {
                userId: '',
                username: '',
                thumbnail: '',
                displayName: '',
                follower: 0,
                following: 0,
                pin: 0,
                loading: false,
            },
            draft.setting = {
                displayName: '',
                thumbnail: '',
            }
        })
    },
    [GET_PROFILE_PENDING]: (state) => {
        return produce(state, (draft) => {
            draft.profile.loading = true;
        })
    },
    [GET_PROFILE_SUCCESS]: (state, action: GetProfileAction) => {
        const { payload: { data } } = action;
        return produce(state, (draft) => {
            if (data === undefined) return;
            draft.profile = {
                username: data.username,
                userId: data.userId,
                thumbnail: data.thumbnail,
                displayName: data.displayName,
                follower: data.follower,
                following: data.following,
                pin: data.pin,
                loading: false
            };
            draft.setting = {
                displayName: data.displayName,
                thumbnail: data.thumbnail,
            };
        })
    },
    [CHANGE_INPUT_PROFILE]: (state, action: ChangeInputProfileAction) => {
        return produce(state, (draft) => {
            if (action.payload === undefined) return;
            draft.setting[action.payload.name] = action.payload.value;
        })
    },
    [SEARCH_PIN_PENDING]: (state) => {
        return produce(state, (draft) => {
            draft.search.loading = true;
        });
    },
    [SEARCH_PIN_SUCCESS]: (state, action: SearchPinDataAction) => {
        const { payload: { data } } = action;
        return produce(state, (draft) => {
            if (data === undefined) return;
            draft.search = {
                loading: false,
                next: data.next,
                Data: data.Data,
            }
        });
    }
}, initialState);