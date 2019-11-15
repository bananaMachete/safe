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
import Link from 'umi/link';


function mapStateToProps(state) {
  return {
    dangerDataInfo: state.dangerManage.dangerDataInfo,
    initState: state.equipmentLedger.initState,
    cardsLoading: state.loading.effects['dangerManage/saveDangerInfo'],
  };
}

//List的主体方法
class List extends Component{
  state = {

  }
  componentDidMount() {
    const id = this.props.location.state.id;
    this.props.dispatch({
      type: 'dangerManage/queryDangerDataInfo',
      payload: {
        id:id,
      },
    });

  }

  render() {
    const { dangerDataInfo } = this.props;

    return (
      <div>
        <Breadcrumb style={{ marginBottom: 32 }} >
          <Breadcrumb.Item>隐患管理</Breadcrumb.Item>
          <Breadcrumb.Item>隐患详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Row  style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>详细信息</div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={6}>
              <div><span>标题：</span><span>{dangerDataInfo.dangerAddress}</span></div>
            </Col>
            <Col span={24}>
              <div><span>内容：</span><span>{dangerDataInfo.dangerLevelName}</span></div>
            </Col>
            <Col span={6}>
              <div><span>发送时间：</span><span>{dangerDataInfo.dangerType}</span></div>
            </Col>
            <Col span={6}>
              <div><span>阅读状态：</span><span>{dangerDataInfo.dangerStatus=== true?'已读':'未读'}</span></div>
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
