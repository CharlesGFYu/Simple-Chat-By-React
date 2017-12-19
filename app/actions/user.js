import { socketEmit, dispatchAction } from './common.js'
import {
    MERGE_USER_INFO,
    PUSH_EXPRESSION,
    PUSH_BLOCK,
    DELETE_BLOCK,
    SET_ONLINE_STATE
} from '../constants/user.js'

export const login = socketEmit('login');
export const signUp = socketEmit('signUp');
export const getUserInfo = socketEmit('getUserInfo');
export const createRoom = socketEmit('createRoom');
export const updateUserInfo = socketEmit('updateUserInfo');
// payload object
export const mergeUserInfo = socketEmit(MERGE_USER_INFO);

export const pushExpression = socketEmit(PUSH_EXPRESSION);

export const addBlockContact = socketEmit('addBlock');
export const removeBlockContact = socketEmit('removeBlock');
export const getBlockList = socketEmit('getBlockList');

export const pushBlock = socketEmit(PUSH_BLOCK);
export const deleteBlock = socketEmit(DELETE_BLOCK);
export const setOnlineState = socketEmit(SET_ONLINE_STATE);