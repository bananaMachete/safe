/* eslint-disable */
import React,{ Component } from "react";
import {
  Form,
  Tag,
  Table,
  Divider,
  Descriptions,
  Badge,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

// treeData处理数据
function combinationData(array){
  array.map((item) => {
    item.title = item.name;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationData(item.children);
    }
  });
  return array;
}


function mapStateToProps(state) {
  return {
    detailObj: state.patrolPlan.detailObj,
    initState: state.patrolPlan.initState,
    cardsLoading: state.loading.effects['equipmentLedger/querySmsEquipmentBaseInfoList'],
    initPlanRecord:state.patrolPlan.initPlanRecord,
    //维保系统列表
    initEquipmentList:state.equipmentLedger.initEquipmentList,
  };
}


const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

//List的主体方法
class List extends Component{
  state = {

  }

  componentDidMount() {
    const id = this.props.location.state.data.id;
    //基本信息
    this.props.dispatch({
      type: 'patrolPlan/getInspectionPlanInfo',
      payload: {
        id:id,
      },
    })
    //查询巡检记录
    this.props.dispatch({
      type: 'patrolPlan/queryInspectionRecord',
      payload: {
        pageNum:'',
        pageSize:'',
        planId:id,
      },
    });
    //查已绑定的维保分类
    this.props.dispatch({
      type: 'equipmentLedger/getEquipmentClassListByPlanId',
      payload: {
        planId:id,
      },
    })
  }

  //详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/report/details', state: { id:data.id,data:data } })
  }

  columns = [
    {
      title: '维保项目',
      dataIndex: 'equipmentClassName',
      key: 'equipmentClassName',
    },
    {
      title: '维保内容',
      dataIndex: 'targetName',
      key: 'targetName',
    },
    {
      title: '维保周期',
      dataIndex: 'runCycleName',
      key: 'runCycleName',
    },
    {
      title: '维保现状',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '维保单位',
      dataIndex: 'companyName',
      key: 'companyName',
      render: text => <a>{text}</a>,
    },
  ];
  columns1 = [
    {
      title: '设备编号',
      dataIndex: 'equipmentId',
      key: 'equipmentId',
      render: text => <a>{text}</a>,
    },
    {
      title: '检查项',
      dataIndex: 'inspectionContent',
      key: 'inspectionContent',
    },
    {
      title: '是否合格',
      dataIndex: 'inspectionResult',
      key: 'inspectionResult',
      render:(text)=>{
        return (text=== true?<Tag color='red'>不合格</Tag>:<Tag color='green'>合格</Tag>)
      }
    },
    {
      title: '检查人',
      key: 'inspectionPersonName',
      dataIndex: 'inspectionPersonName',
      render:(text,value)=>{
        return (<a onClick={this.handlePeopleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '检查时间',
      key: 'inspectionDate',
      dataIndex: 'inspectionDate',
      render:(text) => {
        return <Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>
      }
    },
  ];
  render() {
    const { cardsLoading } = {};
    const { detailObj,initPlanRecord,initEquipmentList } = this.props;
    return (
      <div>
        <Divider style={{ marginBottom: 32 }} orientation="left">计划详情</Divider>
        <div>
          <Descriptions bordered>
            <Descriptions.Item label="计划编号">{detailObj.planCode}</Descriptions.Item>
            <Descriptions.Item label="计划名称">{detailObj.planName}</Descriptions.Item>
            <Descriptions.Item label="计划状态"><Badge status="processing" text={detailObj.planStatus=== '0'?'审核中':'执行中'} /></Descriptions.Item>
            <Descriptions.Item label="计划开始时间">{detailObj.beginDate}</Descriptions.Item>
            <Descriptions.Item label="计划结束时间" span={2}>{detailObj.endDate}</Descriptions.Item>
            <Descriptions.Item label="备注" span={3}>
              {detailObj.remark}
            </Descriptions.Item>
            <Descriptions.Item label="责任人">{detailObj.personLiableName}</Descriptions.Item>
            <Descriptions.Item label="部门">{detailObj.organizationName}</Descriptions.Item>
          </Descriptions>
        </div>
        <Divider style={{ marginBottom: 32 }} orientation="left">维保信息</Divider>
        <div>
        <Table
          bordered
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initEquipmentList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initEquipmentList,
            onChange:this.changeSize,
          }}
          />
        </div>
        <Divider style={{ marginBottom: 32 }} orientation="left">巡检情况</Divider>
        <div>
          <Table columns={this.columns1} dataSource={initPlanRecord.content} />
        </div>
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
