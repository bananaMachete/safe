/* eslint-disable */
import * as equipmentMaintainService from '../services/equipmentMaintainService';
import * as system from '../services/systemManage';
import request from '@/util/request';

export default {

  namespace: "equipmentRepair",
  state: {
    initState: '',
    initEquipmentList:[],
    detailObj:{},
    orgList:[],
    initEquipmentClass:[],
  },
  effects: {
    // 查询设备维修列表
    * querySmsEquipmentRepairInfoList({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.querySmsEquipmentRepairInfoList, payload);
      yield put({ type: 'initEquipmentList', payload: rsp.data });
    },
    // 保存设备维修基础信息
      * saveSmsEquipmentRepairInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.saveSmsEquipmentRepairInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 保存设备维修基础信息
    * updateSmsEquipmentRepairInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.updateSmsEquipmentRepairInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除设备基础信息
    * deleteSmsEquipmentRepairInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.deleteSmsEquipmentRepairInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //设备详情页
    * getSmsEquipmentMaintainRepairInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.getSmsEquipmentRepairInfo, payload);
      yield put({ type: 'initDetail', payload: rsp.data });
      console.log(rsp.data)
    },
    //组织查询
    * getOrganization({ payload }, { call, put }){
      const rsp = yield call(system.getOrganizationsById, payload);
      //调reducers名字
      yield put({ type: 'initOrganizations', payload: rsp.data });
    },

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
  }
}
