import React,{ Component } from "react";
import { Breadcrumb,Tabs } from 'antd';
import router from 'umi/router';

const TabPane = Tabs.TabPane;
function callback(key) {
  router.push('/planManage/planTrace');
}

class SecurityPlan extends Component {
  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>目标管理</Breadcrumb.Item>
          <Breadcrumb.Item>安全计划</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="1" onTabClick={callback}>
          <TabPane tab="安全计划" key="1" >
            {this.props.children}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default SecurityPlan;
