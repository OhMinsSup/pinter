import { createAction, handleActions } from 'redux-actions';
import porduce from 'immer';
import { createPromiseThunk, GenericResponseAction } from 'src/lib/common';
import * as groupAPI from '../../lib/API/group';

const SET_MAKE_GRUOP = 'group/SET_MAKE_GRUOP';
const SET_GROUP_PIN = 'group/SET_GROUP_PIN';
const CREATE_SUBMI_GROUP = 'group/CREATE_SUBMI_GROUP';
const SET_NAV_ACTIVE = 'group/SET_NAV_ACTIVE';
const GROUP_APP_PIN_SAVE = 'group/GROUP_APP_PIN_SAVE';
const GET_GROUP = 'group/GET_GROUP';
const GET_GROUP_SUCCESS = 'group/GET_GROUP_SUCCESS';

export const groupCreators = {
  createSubmitGroup: createAction(CREATE_SUBMI_GROUP, groupAPI.createGroupAPI),
  setGroupPin: createAction(SET_GROUP_PIN, (visible: boolean) => visible),
  setMakeGroup: createAction(SET_MAKE_GRUOP, (visible: boolean) => visible),
  setNavActive: createAction(SET_NAV_ACTIVE, (visible: boolean) => visible),
  groupAddPin: createAction(GROUP_APP_PIN_SAVE, groupAPI.groupAddPinAPI),
  getGroup: createPromiseThunk(GET_GROUP, groupAPI.getGroupAPI),
};

type GetGroupAction = GenericResponseAction<
  { title: string; activation: boolean; groupId: string },
  string
>;
type SetMakeGroupAction = ReturnType<typeof groupCreators.setMakeGroup>;
type SetGroupPinAction = ReturnType<typeof groupCreators.setGroupPin>;
type SetNavActiveAction = ReturnType<typeof groupCreators.setNavActive>;

export interface GroupState {
  MakeModal: {
    visible: boolean;
  };
  groupPinModal: {
    visible: boolean;
  };
  active: {
    visible: boolean;
  };
  group: {
    groupId: string;
    title: string;
    activation: boolean;
  };
}

const initialState: GroupState = {
  MakeModal: {
    visible: false,
  },
  groupPinModal: {
    visible: false,
  },
  active: {
    visible: false,
  },
  group: {
    title: '',
    activation: false,
    groupId: '',
  },
};

export default handleActions<GroupState, any>(
  {
    [SET_MAKE_GRUOP]: (state, action: SetMakeGroupAction) => {
      return porduce(state, draft => {
        if (action.payload === undefined) return;
        draft.MakeModal.visible = action.payload;
      });
    },
    [SET_GROUP_PIN]: (state, action: SetGroupPinAction) => {
      return porduce(state, draft => {
        if (action.payload === undefined) return;
        draft.groupPinModal.visible = action.payload;
      });
    },
    [SET_NAV_ACTIVE]: (state, action: SetNavActiveAction) => {
      return porduce(state, draft => {
        if (action.payload === undefined) return;
        draft.active.visible = action.payload;
      });
    },
    [GET_GROUP_SUCCESS]: (state, action: GetGroupAction) => {
      const {
        payload: { data },
      } = action;
      return porduce(state, draft => {
        if (data === undefined) return;
        draft.group = data;
      });
    },
  },
  initialState
);