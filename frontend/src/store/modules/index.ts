import { combineReducers } from 'redux';
import base, { BaseState } from './base';
import auth, { AuthState} from './auth';
import user, { UserState } from './user';
import pin, { PinState } from './pin';
import setting, { SettingState } from './setting';

export default combineReducers({ 
    base: base,
    auth: auth,
    user: user,
    pin: pin,
    setting: setting
 });

// 스토어의 상태 타입 정의
export interface StoreState {
    base: BaseState;
    auth: AuthState;
    user: UserState;
    pin: PinState;
    setting: SettingState;
}