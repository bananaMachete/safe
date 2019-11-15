import React,{ Component } from "react";
import { Breadcrumb,Tabs } from 'antd';
import router from 'umi/router';

const TabPane = Tabs.TabPane;
function callback(key) {
  router.push('/systemManage/userManage');
}

class UserManage extends Component {
  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>系统管理</Breadcrumb.Item>
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="1" onTabClick={callback}>
          <TabPane tab="用户管理" key="1" >
            {this.props.children}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default UserManage;
