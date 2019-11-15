import React,{ Component } from "react";
import { Breadcrumb,Tabs } from 'antd';
import router from 'umi/router';

const TabPane = Tabs.TabPane;

class DictionaryManage extends Component {
  callback(key) {
    switch (key) {
      case 'dataList':
        router.push('/systemManage/dictionaryManage/dataList');
        break;
      default:
        router.push('/systemManage/dictionaryManage/dataType');
        break;
    }
  }
  render() {
    const { location,match } = this.props;
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>系统管理</Breadcrumb.Item>
          <Breadcrumb.Item>数据字典</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey={location.pathname.replace(`${match.path}/`, '')} onTabClick={this.callback.bind(this)}>
          <TabPane tab="数据字典" key="dataList" >
            {this.props.children}
          </TabPane>
          <TabPane tab="数据类型" key="dataType" >
            {this.props.children}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DictionaryManage;
