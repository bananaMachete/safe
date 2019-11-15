/* eslint-disable */
import * as loginService from '../services/global';

export default {
  namespace : 'loginSpace',
  state     : {
    data:{},
    loginUser:{},
  },
  effects: {
    // 登录
    * toLogin({ payload }, { call, put }) {
      const rsp = yield call(loginService.toLogin, payload);
      yield put({ type: 'initToken', payload: rsp });
    },
    // 获取当前登录人信息
    * getLoginUser({ payload }, { call, put }) {
      const rsp = yield call(loginService.getLoginUser, payload);
      yield put({ type: 'initLoginUser', payload: rsp.data });
    }
  },
  reducers: {
    initToken(state, {payload}) {
      return {
        ...state,
        data:payload,
      };
    },
    initLoginUser(state, {payload}) {
      return {
        ...state,
        loginUser:payload,
      };
    }
  }
};
