/* eslint-disable */
import * as dangerManage from '../services/dangerManage';
import * as global from '../services/global';
import * as loginService from '@/services/global';

export default {
  namespace : 'dangerManage',
  state     : {
    initDangerList:[],
    initState:'',
    dangerLevel:[],
    dangerType:[],
    dangerDataInfo:{},
    initDangerRepairList:[],
    initDangerReviewList:[],
    dangerRepairInfo:{},
    dangerReviewInfo:{},
    dangerCount:{},
    dangerAnalysis:[],
    attachments:[],
  },
  effects: {
    // 查询隐患列表
    * queryDangerList({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.queryDangerList, payload);
      yield put({ type: 'initDangerList', payload: rsp.data });
    },
    // 保存隐患信息
    * saveDangerInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.saveDangerInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除隐患信息queryDangerDataInfo
    * deleteDangerInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.deleteDangerInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 查询隐患级别
    * queryDangerLevel({ payload }, { call, put }) {
      const rsp = yield call(global.getDataListAll, payload);
      yield put({ type: 'initDangerLevel', payload: rsp.data });
    },
    // 查询隐患类别
    * queryDangerType({ payload }, { call, put }) {
      const rsp = yield call(global.getDataListAll, payload);
      yield put({ type: 'initDangerType', payload: rsp.data });
    },
    // 查询隐患详情
    * queryDangerDataInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.queryDangerDataInfo, payload);
      yield put({ type: 'initDangerDataInfo', payload: rsp.data });
    },
    /****分割线*************隐患整改*****************/
    // 查询隐患整改列表
    * queryDangerRepairList({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.queryDangerRepairList, payload);
      yield put({ type: 'initDangerRepairList', payload: rsp.data });
    },
    // 保存隐患整改信息
    * saveDangerRepairInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.saveDangerRepairInfo, payload);
      console.log(rsp.data);
      yield put({ type: 'initState', payload: rsp });
    },
    * updateDangerRepairInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.updateDangerRepairInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //查询详情
    * queryDangerRepairInfo({ payload }, { call, put }){
      const rsp = yield call(dangerManage.queryDangerRepairInfo, payload);
      yield put({ type: 'initDangerRepairInfo', payload: rsp.data });
    },
    // 删除隐患整改信息
    * deleteDangerRepairInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.deleteDangerRepairInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    /****分割线*************隐患复查*****************/
    // 查询隐患复查列表
    * queryDangerReviewList({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.queryDangerReviewList, payload);
      yield put({ type: 'initDangerReviewList', payload: rsp.data });
    },
    // 保存隐患复查信息
    * saveDangerReviewInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.saveDangerReviewInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    * updateDangerReviewInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.updateDangerReviewInfo, payload);
      console.log(rsp.data);
      yield put({ type: 'initState', payload: rsp });
    },
    * queryDangerReviewInfo({ payload }, { call, put }){
      const rsp = yield call(dangerManage.queryDangerReviewInfo, payload);
      yield put({ type: 'initDangerReviewInfo', payload: rsp.data });
    },
    // 删除隐患复查信息
    * deleteDangerReviewInfo({ payload }, { call, put }) {
      const rsp = yield call(dangerManage.deleteDangerReviewInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    /****分割线*************隐患统计*****************/
    * findCountByUserId({ payload }, { call, put }){
      const rsp = yield call(dangerManage.findCountByUserId, payload);
      yield put({ type: 'initDangerCount', payload: rsp.data });
    },
    /****分割线*************隐患统计*****************/
    * findDangerMouthAnalysis({ payload }, { call, put }){
      const rsp = yield call(dangerManage.findDangerMouthAnalysis, payload);
      yield put({ type: 'initDangerAnalysis', payload: rsp.data });
    },
    /****分割线*************查附件图片*****************/
    // 查附件图片
    * getAttachments({ payload }, { call, put }) {
      const rsp = yield call(global.getAttachments, payload);
      yield put({ type: 'initAttachment', payload: rsp.data });
    }
  },
  reducers: {
    initDangerList(state, {payload}) {
      return {
        ...state,
        initDangerList:payload,
      };
    },
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    initDangerLevel(state, {payload}) {
      return {
        ...state,
        dangerLevel:payload,
      };
    },
    initDangerType(state, {payload}) {
      return {
        ...state,
        dangerType:payload,
      };
    },
    initDangerDataInfo(state, {payload}) {
      return {
        ...state,
        dangerDataInfo:payload,
      };
    },
    initDangerRepairList(state, {payload}) {
      return {
        ...state,
        initDangerRepairList:payload,
      };
    },
    initDangerReviewList(state, {payload}) {
      return {
        ...state,
        initDangerReviewList:payload,
      };
    },
    initDangerRepairInfo(state, {payload}) {
      return {
        ...state,
        dangerRepairInfo:payload,
      };
    },
    initDangerReviewInfo(state, {payload}) {
      return {
        ...state,
        dangerReviewInfo:payload,
      };
    },
    initDangerCount(state, {payload}) {
      return {
        ...state,
        dangerCount:payload,
      };
    },
    initDangerAnalysis(state, {payload}) {
      return {
        ...state,
        dangerAnalysis:payload,
      };
    },
    initAttachment(state, {payload}) {
      return {
        ...state,
        attachments:payload,
      };
    },
  }
};
