/**
 *用户详情页
 **/
/* eslint-disable */
import React,{ Component } from "react";
import {
  Form,
  Descriptions,
  Divider,
  Avatar,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

function mapStateToProps(state) {
  return {
    userDataInfo: state.userManage.data,
    cardsLoading: state.loading.effects['userManage/getUserById'],
  };
}

//UserDetails的主体方法
class UserDetails extends Component{
  state = {
    data:this.props.location.state.data,
  }
  componentDidMount() {
    const id = this.props.location.state.userId;
    //查人
    this.props.dispatch({
      type: 'userManage/getUserById',
      payload: {
        userId:id,
      },
    });
  }

  render() {
    const { userDataInfo } = this.props;
    return (
      <div>
        <div>
          <Descriptions title="详情信息" bordered>
            <Descriptions.Item label="单位">{userDataInfo.companyName}</Descriptions.Item>
            <Descriptions.Item label="用户部门">{userDataInfo.organizationName}</Descriptions.Item>
            <Descriptions.Item label="用户名">{userDataInfo.name}</Descriptions.Item>
            <Descriptions.Item label="岗位">{userDataInfo.post}</Descriptions.Item>
            <Descriptions.Item label="职位">{userDataInfo.position}</Descriptions.Item>
            <Descriptions.Item label="账号状态">{userDataInfo.enable==true?"启用":"禁用"}</Descriptions.Item>
            <Descriptions.Item label="电话号码">{userDataInfo.phoneNum}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{moment(userDataInfo.createDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="是否禁用">{userDataInfo.enable}</Descriptions.Item>
            <Descriptions.Item label="用户图像" span={3}>
              <Avatar shape="square" size={200} icon="user"  src={"http://192.168.1.19"+userDataInfo.imgHref}/>
            </Descriptions.Item>
          </Descriptions>
        </div>
        <Divider style={{ marginBottom: 32 }} />
      </div>
    );
  }
}
const AddForm = Form.create()(UserDetails);
export default connect(mapStateToProps)(AddForm);
