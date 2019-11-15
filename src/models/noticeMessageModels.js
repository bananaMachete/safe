/* eslint-disable */
import * as noticeMessageService from '../services/noticeMessageService';

export default {

  namespace: "noticeMessage",
  state: {
    initState: '',
    initNoticeMessageList:[],
    detailObj: {},
  },
  effects: {
    // 查询通知列表
    * queryNoticeMessageList({ payload }, { call, put }) {
      const rsp = yield call(noticeMessageService.queryNoticeMessageList, payload);
      yield put({ type: 'initNoticeMessageList', payload: rsp.data });
    },
    // 保存通知基础信息
      * saveNoticeMessageInfo({ payload }, { call, put }) {
      const rsp = yield call(noticeMessageService.saveNoticeMessageInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 更新通知基础信息
    * updateNoticeMessageInfo({ payload }, { call, put }) {
      const rsp = yield call(noticeMessageService.updateNoticeMessageInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除通知基础信息
    * deleteNoticeMessageInfo({ payload }, { call, put }) {
      const rsp = yield call(noticeMessageService.deleteNoticeMessageInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //通知详情页
    * getNoticeMessageInfo({ payload }, { call, put }) {
      const rsp = yield call(noticeMessageService.getNoticeMessageInfo, payload);
      yield put({ type: 'initDetailObject', payload: rsp.data });
    },
    //根据用户ID查询通知列表
    * queryNoticeMessageListByUserId({ payload }, { call, put }) {
      const rsp = yield call(noticeMessageService.getNoticeMessageByUserId, payload);
      yield put({ type: 'initNoticeMessageList', payload: rsp.data });
    },
  },
  reducers: {
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    initNoticeMessageList(state, {payload}) {
      return {
        ...state,
        initNoticeMessageList:payload,
      };
    },
    initDetailObject(state,{payload}) {
      return {
        ...state,
        detailObj:payload,
      }
    }
  }
}
