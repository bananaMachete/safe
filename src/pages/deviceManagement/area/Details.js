/* eslint-disable */
import React,{ Component } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Descriptions,
  Divider,
  Badge
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';


function mapStateToProps(state) {
  return {
    detailObj: state.areaFunction.detailObj,
    initState: state.areaFunction.initState,
    cardsLoading: state.loading.effects['equipmentLedger/querySmsEquipmentBaseInfoList'],
  };
}
//List的主体方法
class List extends Component{
  state = {

  }
  componentDidMount() {
    const id = this.props.location.state.id;
    this.props.dispatch({
      type: 'areaFunction/getSmsAreaInfo',
      payload: {
        id:id,
      },
    })
  }

  render() {
    const { detailObj } = this.props;
    var att = detailObj.attachments === undefined ? "":detailObj.attachments;
    console.log(att);
    return (
      <div>
        <Descriptions title="区域信息" bordered>
          <Descriptions.Item label="项目编号">{detailObj.projectCode}</Descriptions.Item>
          <Descriptions.Item label="项目名称">{detailObj.projectName}</Descriptions.Item>
          <Descriptions.Item label="设备状态"><Badge status={detailObj.projectStatus==='0'?'error':'default'} text={detailObj.projectStatus==='0'?'在建':'建成'} /></Descriptions.Item>
          <Descriptions.Item label="上线时间" >{moment(detailObj.projectFinishDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="设备责任人">{detailObj.securityPersonLiableName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{detailObj.personLiableTelephone}</Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>
            {detailObj.remark}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">平面图</Divider>
        <div>
          <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={6}>
              <div><img alt="平面图" src={att.fileUrl === undefined?"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566989888300&di=5a30699a73d5a4020b85ea49872f6cd8&imgtype=0&src=http%3A%2F%2Fwww.yejibang.com%2Fstatic%2Fuploadfile%2F201305%2Fimage%2F20130528112655_89993.jpg":att.fileUrl} style={{width:650,height:450}}/></div>
              <div><Button type="primary" htmlType="submit">打印</Button></div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
