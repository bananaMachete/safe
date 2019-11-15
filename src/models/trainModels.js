/* eslint-disable */
import * as trainService from '../services/trainService';

/**
 * 培训管理
 */
export default {

  namespace: "train",
  state: {
    initState: '',
    initTrainList:[],
  },
  effects: {
    // 查询维保单位列表
    * queryTrainList({ payload }, { call, put }) {
      const rsp = yield call(trainService.queryTrain, payload);
      yield put({ type: 'initTrainList', payload: rsp.data });
    },
    // 保存维保单位信息
    * saveTrain({ payload }, { call, put }) {
      const rsp = yield call(trainService.saveTrain, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 更新维保单位信息
    * updateTrain({ payload }, { call, put }) {
      const rsp = yield call(trainService.updateTrain, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除维保单位信息
    * deleteTrain({ payload }, { call, put }) {
      const rsp = yield call(trainService.deleteTrain, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //维保单位详情页
    * getTrain({ payload }, { call, put }) {
      const rsp = yield call(trainService.queryTrain, payload);
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
    initTrainList(state, {payload}) {
      return {
        ...state,
        initTrainList:payload,
      };
    },
  }
}
