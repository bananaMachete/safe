import React,{ Component } from "react";
import { Breadcrumb,Tabs } from 'antd';
import router from 'umi/router';

const TabPane = Tabs.TabPane;
function callback(key) {
  router.push('/planManage/planTrace');
}

class PlanTrace extends Component {
  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>计划管理</Breadcrumb.Item>
          <Breadcrumb.Item>计划追踪</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="1" onTabClick={callback}>
          <TabPane tab="计划追踪" key="1" >
            {this.props.children}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PlanTrace;
