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
  Steps,
} from 'antd';
import { connect } from 'dva';



function mapStateToProps(state) {
  return {
    maintenanceData: state.maintenance.data,
    initState: state.maintenance.initState,
    cardsLoading: state.loading.effects['maintenance/saveDangerInfo'],
  };
}

//List的主体方法
class List extends Component{
  state = {

  }
  componentDidMount() {
    const id = this.props.location.state.id;
    console.log("cost id"+id)
    const  that = this;
    this.props.dispatch({
      type: 'maintenance/getMaintenanceById',
      payload: {
        id:id
      },
    })
  }
  render() {
    const { cardsLoading } = {};
    const { maintenanceData } = this.props;
    console.log(JSON.stringify(maintenanceData));
    return (
      <div>
        <Breadcrumb style={{ marginBottom: 32 }} >
          <Breadcrumb.Item>维保单位管理</Breadcrumb.Item>
          <Breadcrumb.Item>维保单位详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Row  style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>详细信息</div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 30 }}>
            <Col span={6}>
              <div><span>统一社会编码：</span><span>{maintenanceData.name}</span></div>
            </Col>
            <Col span={6}>
              <div><span>维保单位名称：</span><span>{maintenanceData.name}</span></div>
            </Col>
            <Col span={24}>
              <div><span>维保单位简介：</span><span>{maintenanceData.details}</span></div>
            </Col>
            <Col span={6}>
              <div><span>单位地址：</span><span>{maintenanceData.address}</span></div>
            </Col>
            <Col span={6}>
              <div><span>法人：</span><span>{maintenanceData.corporation}</span></div>
            </Col>
            <Col span={6}>
              <div><span>单位联系电话：</span><span>{maintenanceData.phone}</span></div>
            </Col>
          </Row>

        </div>
        <Divider style={{ marginBottom: 32 }} />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
