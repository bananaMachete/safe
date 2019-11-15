/* eslint-disable */
import * as equipmentLedger from '../services/equipmentLedger';
import * as system from '../services/systemManage';


export default {

  namespace: "equipmentLedger",
  state: {
    initState: '',
    initEquipmentList:[],
    detailObj:{},
    orgList:[],
    initEquipmentClass:[],
    equipmentAnalyses:[],
  },
  effects: {
    // 查询设备列表
    * querySmsEquipmentBaseInfoList({ payload }, { call, put }) {
      const rsp = yield call(equipmentLedger.querySmsEquipmentBaseInfoList, payload);
      yield put({ type: 'initEquipmentList', payload: rsp.data });
    },
    // 保存设备基础信息
      * saveSmsEquipmentBaseInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentLedger.saveSmsEquipmentBaseInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改设备基础信息
    * updateSmsEquipmentBaseInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentLedger.updateSmsEquipmentBaseInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除设备基础信息
    * deleteSmsEquipmentBaseInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentLedger.deleteSmsEquipmentBaseInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //设备详情页
    * getSmsEquipmentBaseInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentLedger.getSmsEquipmentBaseInfo, payload);
      yield put({ type: 'initDetail', payload: rsp.data });
    },
    //组织查询
    * getOrganization({ payload }, { call, put }){
      const rsp = yield call(system.getOrganizationsById, payload);
      //调reducers名字
      yield put({ type: 'initOrganizations', payload: rsp.data });
    },
    //设备分类
    * getEquipmentClass({ payload }, { call, put }) {
        const rsp = yield call(equipmentLedger.equipmentClass, payload);
        //调reducers名字
        yield put({ type: 'initEquipmentClass', payload: rsp.data });
    },
    /**
     * @descrption 查询已绑定的设备
     * @author stephen
     * @param payload
     * @param call
     * @param putgetEquipmentListByPlanId
     * @returns {IterableIterator<*>}
     */
    * getEquipmentListByPlanId({ payload }, { call, put }){
      const rsp = yield call(equipmentLedger.querySmsEquipmentListByPlanId, payload);
      //调reducers名字
      yield put({ type: 'initEquipmentList', payload: rsp.data });
    },
    /**
     * @author stephen
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * getEquipmentClassListByPlanId({ payload }, { call, put }){
      const rsp = yield call(equipmentLedger.querySmsEquipmentClassListByPlanId, payload);
      //调reducers名字
      yield put({ type: 'initEquipmentList', payload: rsp.data });
    },
    /**
     *
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * getEquipmentGroupClassAnalysis({ payload }, { call, put }){
      const rsp = yield call(equipmentLedger.getEquipmentGroupClassAnalysis, payload);
      //调reducers名字
      yield put({ type: 'initEquipmentAnalyses', payload: rsp.data });
    }
  },
  reducers: {
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    },
    initEquipmentList(state, {payload}) {
      return {
        ...state,
        initEquipmentList:payload,
      };
    },
    initDetail(state, {payload}) {
      return {
        ...state,
        detailObj:payload,
      };
    },
    initOrganizations(state, {payload}) {
      return {
        ...state,
        orgList:payload,
      };
    },
    initEquipmentClass(state, {payload}) {
      return {
        ...state,
        initEquipmentClass:payload,
      };
    },
    initEquipmentAnalyses(state, {payload}) {
      return {
        ...state,
        equipmentAnalyses:payload,
      };
    },
  }
}
