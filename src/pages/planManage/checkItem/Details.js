/* eslint-disable */
import React,{ Component } from "react";
import {
  Form,
  PageHeader,
  Descriptions
} from 'antd';
import { connect } from 'dva';



function mapStateToProps(state) {
  return {
    detailObj: state.checkItem.detailObj,
    initState: state.checkItem.initState,
    cardsLoading: state.loading.effects['equipmentLedger/querySmsEquipmentBaseInfoList'],
  };
}
//CheckItemDetail的主体方法
class CheckItemDetail extends Component{
  state = {

  }
  componentDidMount() {
    const id = this.props.location.state.data.id;
    this.props.dispatch({
      type: 'checkItem/getInspectionTargetInfo',
      payload: {
        id:id,
      },
    });
    //查已绑定的维保分类
    this.props.dispatch({
      type: 'equipmentLedger/getEquipmentClassListByPlanId',
      payload: {
        planId:id,
      },
    })
  }

  render() {
    const { detailObj } = this.props;
    return (
      <div>
        <PageHeader title="标准详情"  />
        <div>
          <Descriptions bordered>
            <Descriptions.Item label="标准编号">{detailObj.targetCode}</Descriptions.Item>
            <Descriptions.Item label="标准名称">{detailObj.targetName}</Descriptions.Item>
            <Descriptions.Item label="标准周期">{detailObj.runCycleName}</Descriptions.Item>
            <Descriptions.Item label="所属分类">{detailObj.equipmentClassName}</Descriptions.Item>
            <Descriptions.Item label="所属单位" span={2}>{detailObj.companyName}</Descriptions.Item>
            <Descriptions.Item label="备注" span={3}>
              {detailObj.remark}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    );
  }
}
const AddForm = Form.create()(CheckItemDetail);
export default connect(mapStateToProps)(AddForm);
