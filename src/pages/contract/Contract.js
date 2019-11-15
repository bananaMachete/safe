import React,{ Component } from "react";
import { Breadcrumb,Tabs } from 'antd';
import router from 'umi/router';

const TabPane = Tabs.TabPane;
function callback(key) {
  router.push('/contract/Contract');
}

class ContractManage extends Component {
  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>合同管理</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="1" onTabClick={callback}>
          <TabPane tab="合同管理" key="1" >
            {this.props.children}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ContractManage;
