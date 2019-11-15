/* eslint-disable */
import React,{ Component } from "react";
import {
  Form,
  Divider,
  Breadcrumb,
  Descriptions,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';


function mapStateToProps(state) {
  return {
    detailObj: state.noticeMessage.detailObj,
  };
}

//List的主体方法
class List extends Component{
  state = {

  }
  componentDidMount() {
    const id = this.props.location.state.id;
    this.props.dispatch({
      type: 'noticeMessage/getNoticeMessageInfo',
      payload: {
        id:id,
      },
    });

  }

  render() {
    const { detailObj } = this.props;
    return (
      <div>
        <Breadcrumb style={{ marginBottom: 32 }} >
          <Breadcrumb.Item>消息中心</Breadcrumb.Item>
          <Breadcrumb.Item>消息详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Descriptions title="信息详情" bordered>
            <Descriptions.Item label="标题">{detailObj.title}</Descriptions.Item>
            <Descriptions.Item label="发送人">{detailObj.createUserName}</Descriptions.Item>
            <Descriptions.Item label="发送时间">{moment(detailObj.createDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="内容" span={3}>
              {detailObj.content}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <Divider style={{ marginBottom: 32 }} />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
