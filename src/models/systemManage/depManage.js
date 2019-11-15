import * as depManage from '../../services/systemManage';

export default {
  namespace : 'depManage',
  state     : {
    data:{},
    initState:'',
    initCompanyList:[],
    companyListArray:[],
    initCompanyOrganizationsList:[],
    currentCompany:{},
  },
  effects: {
    // 新增单位
    * saveCompany({ payload }, { call, put }) {
      const rsp = yield call(depManage.saveCompany, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 新增组织结构
    * saveOrganization({ payload }, { call, put }) {
      const rsp = yield call(depManage.saveOrganization, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 查询单位列表
    * queryCompanyList({ payload }, { call, put }) {
      const rsp = yield call(depManage.queryCompanyList, payload);
      yield put({ type: 'initCompanyList', payload: rsp.data });
    },
    // 查询单位列表(数组格式)
    * queryCompanyListArray({ payload }, { call, put }) {
      const rsp = yield call(depManage.queryCompanyList, payload);
      yield put({ type: 'initCompanyListArray', payload: rsp.data.content });
    },
    // 根据单位ID查询组织机构列表
    * getOrganizationsById({ payload }, { call, put }) {
      const rsp = yield call(depManage.getOrganizationsById, payload);
      yield put({ type: 'initCompanyOrganizationsList', payload: rsp.data });
    },
    // 删除单位
    * deleteCompany({ payload }, { call, put }) {
      const rsp = yield call(depManage.deleteCompany, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改单位
    * updateCompany({ payload }, { call, put }) {
      const rsp = yield call(depManage.updateCompany, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 获取当前登录人单位/company/getOrganizations
    * getCurrentCompany({ payload }, { call, put }) {
      const rsp = yield call(depManage.getCurrentCompany, payload);
      yield put({ type: 'initCurrentCompany', payload: rsp.data });
    },
    // 删除组织机构
    * deleteOrganization({ payload }, { call, put }) {
      const rsp = yield call(depManage.deleteOrganization, payload);
      yield put({ type: 'initState', payload: rsp });
    },
    // 修改组织机构
    * updateOrganization({ payload }, { call, put }) {
      const rsp = yield call(depManage.updateOrganization, payload);
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
    initCompanyList(state, {payload}) {
      return {
        ...state,
        initCompanyList:payload,
      };
    },
    initCompanyListArray(state, {payload}) {
      return {
        ...state,
        companyListArray:payload,
      };
    },
    initCompanyOrganizationsList(state, {payload}) {
      return {
        ...state,
        initCompanyOrganizationsList:payload,
      };
    },
    initCurrentCompany(state, {payload}) {
      return {
        ...state,
        currentCompany:payload,
      };
    },
  }
};
