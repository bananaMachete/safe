/* eslint-disable */
import * as customerService from '../services/customerService';

export default {

  namespace: "customer",
  state: {
    initState: '',
    initCustomerList:[],
  },
  effects: {
    // 查询维保单位列表
    * queryCustomerList({ payload }, { call, put }) {
      const rsp = yield call(customerService.queryCustomer, payload);
      yield put({ type: 'initCustomerList', payload: rsp.data });
    },
    // 保存维保单位信息
    * saveCustomer({ payload }, { call, put }) {
      const rsp = yield call(customerService.saveCustomer, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 更新维保单位信息
    * updateCustomer({ payload }, { call, put }) {
      const rsp = yield call(customerService.updateCustomerData, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除维保单位信息
    * deleteCustomer({ payload }, { call, put }) {
      const rsp = yield call(customerService.deleteCustomer, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //维保单位详情页
    * getCustomer({ payload }, { call, put }) {
      const rsp = yield call(customerService.queryCustomer, payload);
      yield put({ type: 'initState', payload: rsp });
    },

  },
  reducers: {
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    initCustomerList(state, {payload}) {
      return {
        ...state,
        initCustomerList:payload,
      };
    },
  }
}
