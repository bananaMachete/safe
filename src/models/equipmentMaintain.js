/* eslint-disable */
import * as equipmentMaintainService from '../services/equipmentMaintainService';
import * as system from '../services/systemManage';
import request from '@/util/request';

export default {

  namespace: "equipmentMaintain",
  state: {
    initState: '',
    initEquipmentList:[],
    detailObj:{},
    orgList:[],
    initEquipmentClass:[],
  },
  effects: {
    // 查询设备保养列表
    * querySmsEquipmentMaintainInfoList({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.querySmsEquipmentMaintainInfoList, payload);
      yield put({ type: 'initEquipmentList', payload: rsp.data });
    },
    // 保存设备保养信息
      * saveSmsEquipmentMaintainInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.saveSmsEquipmentMaintainInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 保存设备保养信息
    * updateSmsEquipmentMaintainInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.updateSmsEquipmentMaintainInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除设备保养信息
    * deleteSmsEquipmentMaintainInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.deleteSmsEquipmentMaintainInfo, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    //设备保养详情页
    * getSmsEquipmentMaintainInfo({ payload }, { call, put }) {
      const rsp = yield call(equipmentMaintainService.getSmsEquipmentMaintainInfo, payload);
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
