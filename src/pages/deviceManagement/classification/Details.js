/* eslint-disable */
import React,{ Component } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Divider,
  Modal,
  Breadcrumb,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';


function mapStateToProps(state) {
  return {
    detailObj: state.equipmentLedger.detailObj,
    initState: state.equipmentLedger.initState,
    cardsLoading: state.loading.effects['equipmentLedger/querySmsEquipmentBaseInfoList'],
  };
}

//List的主体方法
class List extends Component{
  state = {

  }
  maintainColumns = [
    {
      title: '保养人',
      dataIndex: 'maintainPersonName',
    },
    {
      title: '保养部门',
      dataIndex: 'organizationName',
    },
    {
      title: '保养时间',
      dataIndex: 'maintainDate',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
  repairColumns = [
    {
      title: '申请时间',
      dataIndex: 'applyDate',
    },
    {
      title: '责任人',
      dataIndex: 'personLiableName',
    },
    {
      title: '责任部门',
      dataIndex: 'organizationName',
    },
    {
      title: '维修人',
      dataIndex: 'applyPersonName',
    },
    {
      title: '维修时间',
      dataIndex: 'repairDate',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
  componentDidMount() {
    const id = this.props.location.state.id;
    const data = this.props.location.state.data;
    this.props.dispatch({
      type: 'equipmentLedger/getSmsEquipmentBaseInfo',
      payload: {
        id:id,
      },
    });

  }
//翻页方法
  changeSize(page){
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        pageNum:page-1,
      },
    });
  }

  render() {
    const { cardsLoading,initEquipmentList } = {};
    const { detailObj } = this.props;
    return (
      <div>
        <Breadcrumb style={{ marginBottom: 32 }} >
          <Breadcrumb.Item>设备管理</Breadcrumb.Item>
          <Breadcrumb.Item>设备详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Row  style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>设备信息</div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={6}>
              <div><span>设备编号：</span><span>{detailObj.equipmentCode}</span></div>
            </Col>
            <Col span={6}>
              <div><span>设备名称：</span><span>{detailObj.equipmentName}</span></div>
            </Col>
            <Col span={6}>
              <div><span>设备类型：</span><span>{detailObj.equipmentType}</span></div>
            </Col>
            <Col span={6}>
              <div><span>设备状态：</span><span>{detailObj.equipmentStatus=== '0'?'故障':'正常'}</span></div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={6}>
              <div><span>设备厂家：</span><span>{detailObj.equipmentManufacturer}</span></div>
            </Col>
            <Col span={6}>
              <div><span>设备型号：</span><span>{detailObj.equipmentModel}</span></div>
            </Col>
            <Col span={6}>
              <div><span>生产时间：</span><span>{detailObj.equipmentManufactureTime}</span></div>
            </Col>
            <Col span={6}>
              <div><span>备注：</span><span>{detailObj.remark}</span></div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={6}>
              <div><span>设备二维码：</span><span><img alt="" src="https://baike.baidu.com/pic/%E4%BA%8C%E7%BB%B4%E7%A0%81/2385673/0/2934349b033b5bb571dc8c5133d3d539b600bc12?fr=lemma&ct=single#aid=0&pic=2934349b033b5bb571dc8c5133d3d539b600bc12"></img></span></div>
            </Col>
          </Row>
        </div>
        <Divider style={{ marginBottom: 32 }} />
        <div>
          <Row  style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>设备负责人信息</div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <div><span>设备责任人：</span><span>{detailObj.equipmentPersonLiableName}</span></div>
            </Col>
            <Col span={6}>
              <div><span>责任人部门：</span><span>{detailObj.organizationName}</span></div>
            </Col>
            <Col span={6}>
              <div><span>下次保养时间：</span><span>{detailObj.nextRepairTime}</span></div>
            </Col>
            <Col span={6}>
              <div><span>联系电话：</span><span>{detailObj.equipmentPersonLiableName}</span></div>
            </Col>
          </Row>
        </div>
        <Divider style={{ marginBottom: 32 }} />
        <Row  style={{ marginBottom: 16 }}>
          <Col span={24}>
            <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>设备维修信息</div>
          </Col>
        </Row>
        <Table
          style={{marginTop:20}}
          columns={this.repairColumns}
          dataSource={detailObj.smsEquipmentRepairInfoList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initEquipmentList,
            onChange:this.changeSize.bind(this),
          }}
        />
        <Row  style={{ marginBottom: 16,marginTop:16 }}>
          <Col span={24}>
            <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>设备保养信息</div>
          </Col>
        </Row>
        <Table
          style={{marginTop:20}}
          columns={this.maintainColumns}
          dataSource={detailObj.smsEquipmentMaintainInfoList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initEquipmentList,
            onChange:this.changeSize.bind(this),
          }}
        />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
