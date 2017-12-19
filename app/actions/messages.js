import immutable from 'immutable'
import { normalize } from 'normalizr'

import config from '../config/config.js'
import stateManage from '../util/stateManage.js'
import { batchedActions } from './batched.js'
import { socketEmit, dispatchAction, dispatchThunk } from './common.js'
import { getRoomItem, getPrivateItem, addRoomItem } from './activeList.js'
import { errPrint } from './combin.js'
import { pushSnackbar } from './pageUI.js'
import { roomsSchema } from '../middlewares/schemas.js'

import {
    INIT_MESSAGES,
    ADD_MESSAGE,
    MERGE_MESSAGE,
    CLEAR_MESSAGES
} from '../constants/messages.js'
import {
    INIT_ROOM_LIST,
    PUSH_HISTORY,
    ADD_ROOM_ITEM,
    UNSHIFT_HISTORY,
    REMOVE_ROOM_ITEM
} from '../constants/activeList.js'

export const mergeMessage = dispatchAction(MERGE_MESSAGE);
export const sendMessage = socketEmit('message');
export const sendPrivate = socketEmit('private');
export const getSendFunc = (isPrivate) => {
    const type = isPrivate ? 'private' : 'message';
    return socketEmit(type);
}

export const initActiveListMessages = (payload) => {
    let { rooms, histories } = payload;
    batchedActions([
        {type: INIT_ROOM_LIST, payload: rooms},
        {type: INIT_MESSAGES, paylaod: histories}
    ]);
}

export const addMessage = (paylaod) => {
    let message = {},
        history = {_id: payload.room, histories: [payload._id]};
    message[payload._id] = payload;
    batchedActions([
        {type: ADD_MESSAGE, paylaod: message},
        {type: PUSH_HISTORY, payload: history}
    ]);
}

// {room: {room: _id, histories: array}, histories: {_id: {}}}
export const addHistories = (payload) => {
    batchedActions([
        {type: ADD_MESSAGE, paylaod: payload.histories},
        {type: UNSHIFT_HISTORY, paylaod: payload.room}
    ])
}

export const clearHistory = dispatchThunk((payload) => {
    return (dispatch, getState) => {
        const state = getState(),
              maxLength = config.ScreenMessageLength;
        let room = {},
            deleteHistories = [],
            curRoomInfo = stateManage.getCurRoomInfo();
        const length = (curRoomInfo.get('histories') && curRoomInfo.get('histories').size) || 0;
        if(length > maxLength){
            deleteHistories = curRoomInfo.get('histories').slice(0, length - maxLength);
            curRoomInfo = curRoomInfo.set('histories', curRoomInfo.get('histories').slice(length - maxLength, length));
            room[curRoomInfo.get('_id')] = curRoomInfo;
            batchedActions([
                {type: ADD_ROOM_ITEM, payload: room},
                {type: CLEAR_MESSAGES, paylaod: deleteHistories}
            ])
        }
    }
})

// {array} histories
export const removeHostories = dispatchAction(CLEAR_MESSAGES);

export const removeItemMessage = dispatchThunk((paylaod) => {
    return (dispatch, getState) => {
        const state = getState();
        const histories = state.getIn(['activeList', paylaod.room, 'histories']);
        batchedActions([
            {type: REMOVE_ROOM_ITEM, paylaod: payload.room},
            {type: CLEAR_MESSAGES, paylaod: histories}
        ])
    }
})

// - - - - - - - - - - - -
export const initRoomItem = (_id) => {
    return getRoomItem({_id})
           .then((ret) => {
               let item = {};
               item[ret._id] = ret;
               addRoomItem(item);
           })
}
export const initPrivateItem = (_id) => {
    return getPrivateItem({_id})
           .then((ret) => {
               let item = {};
               item[ret._id] = ret;
               addRoomItem(item);
           })
}

export const initItem = (isPrivate) => (isPrivate ? initPrivateItem : initRoomItem);
// - - - - - - - - - - - -

// - - - - - - - - - - - -
export const receiveMessage = dispatchThunk((payload) => {
    return (dispatch, getState) => {
        const state = getState();
        addMessage(payload);
        if(!state.getIn(['activeList', payload.room])){
            return initRoomItem(payload._id);
        }
        return Promise.resolve();
    }
})
export const receivePrivate = dispatchThunk((payload) => {
    return (dispatch, getState) => {
        const state = getState();
        payload.room = payload.room || payload.from;
        addMessage(paylaod);
        if(!state.getIn(['activeList', payload.room])){
            return initPrivateItem(payload.room);
        }
        return Promise.resolve();
    }
})
// - - - - - - - - - - - -

export const getRevokeFunc = (isPrivate) => {
    return isPrivate ? socketEmit('revokePrivate') : socketEmit('revokeMessage');
}