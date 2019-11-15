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
  Timeline,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';


function mapStateToProps(state) {
  return {
    detailObj: state.patrolPlan.detailObj,
    initState: state.patrolPlan.initState,
    cardsLoading: state.loading.effects['equipmentLedger/querySmsEquipmentBaseInfoList'],
  };
}

//List的主体方法
class List extends Component{
  state = {

  }
  componentDidMount() {
    const id = this.props.location.state.data.id;
    const data = this.props.location.state.data;
    this.props.dispatch({
      type: 'patrolPlan/getInspectionPlanInfo',
      payload: {
        id:id,
      },
    });

  }

  render() {
    const { cardsLoading,initEquipmentList } = {};
    const { detailObj } = this.props;
    console.log(detailObj);
    return (
      <div>
        <Breadcrumb style={{ marginBottom: 32 }} >
          <Breadcrumb.Item>计划详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Row  style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>计划信息</div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={6}>
              <div><span>计划编号：</span><span>{detailObj.planCode}</span></div>
            </Col>
            <Col span={6}>
              <div><span>计划名称：</span><span>{detailObj.planName}</span></div>
            </Col>
            <Col span={6}>
              <div><span>计划状态：</span><span>{detailObj.planStatus=== '0'?'在建':'建成'}</span></div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={6}>
              <div><span>计划开始时间：</span><span>{detailObj.beginDate}</span></div>
            </Col>
            <Col span={6}>
              <div><span>计划结束时间：</span><span>{detailObj.endDate}</span></div>
            </Col>
            <Col span={6}>
              <div><span>备注：</span><span>{detailObj.remark}</span></div>
            </Col>
          </Row>
        </div>
        <Divider style={{ marginBottom: 32 }} />
        <div>
          <Row  style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>计划负责人信息</div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <div><span>责任人：</span><span>{detailObj.personLiableName}</span></div>
            </Col>
            <Col span={6}>
              <div><span>部门：</span><span>{detailObj.organizationName}</span></div>
            </Col>
          </Row>
        </div>
        <Divider style={{ marginBottom: 32 }} />
        <div>
          <Row  style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>计划执行情况</div>
            </Col>
          </Row>
          <Timeline>
            <Timeline.Item>执行巡检 2015-09-01</Timeline.Item>
            <Timeline.Item>执行巡检 2015-09-02</Timeline.Item>
            <Timeline.Item>执行巡检 2015-09-03</Timeline.Item>
            <Timeline.Item>执行巡检 2015-09-04</Timeline.Item>
          </Timeline>,
        </div>
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
