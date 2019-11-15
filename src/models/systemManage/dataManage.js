import * as dataManage from '../../services/systemManage';

export default {
  namespace : 'dataManage',
  state     : {
    dataTypeList:[],
    dataList:[],
    dataTypeListAll:[],
    initState:'',
  },
  effects: {
    // 查询数据类型列表带分页
    * getDataTypeList({ payload }, { call, put }) {
      const rsp = yield call(dataManage.getDataTypeList, payload);
      yield put({ type: 'initDataTypeList', payload: rsp.data });
    },
    // 查询数据类型列表不带分页
    * getDataTypeListAll({ payload }, { call, put }) {
      const rsp = yield call(dataManage.getDataTypeListAll, payload);
      yield put({ type: 'initDataTypeListAll', payload: rsp.data });
    },
    // 新增数据类型
    * saveDataType({ payload }, { call, put }) {
      const rsp = yield call(dataManage.saveDataType, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改数据类型
    * updateDataType({ payload }, { call, put }) {
      const rsp = yield call(dataManage.updateDataType, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除数据类型
    * deleteDataType({ payload }, { call, put }) {
      const rsp = yield call(dataManage.deleteDataType, payload);
      yield put({ type: 'initState', payload: rsp });
    },

    // 查询数据字典列表
    * getDataList({ payload }, { call, put }) {
      const rsp = yield call(dataManage.getDataList, payload);
      yield put({ type: 'initDataList', payload: rsp.data });
    },
    // 新增数据字典
    * saveData({ payload }, { call, put }) {
      const rsp = yield call(dataManage.saveData, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改数据字典
    * updateData({ payload }, { call, put }) {
      const rsp = yield call(dataManage.updateData, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 删除数据字典
    * deleteData({ payload }, { call, put }) {
      const rsp = yield call(dataManage.deleteData, payload);
      yield put({ type: 'initState', payload: rsp });
    },
  },
  reducers: {
    initDataTypeList(state, {payload}) {
      return {
        ...state,
        dataTypeList:payload,
      };
    },
    initDataTypeListAll(state, {payload}) {
      return {
        ...state,
        dataTypeListAll:payload,
      };
    },
    initDataList(state, {payload}) {
      return {
        ...state,
        dataList:payload,
      };
    },
    initState(state, {payload}) {
      return {
        ...state,
        initState:payload,
      };
    }
  }
};
