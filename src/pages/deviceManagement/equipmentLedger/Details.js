/* eslint-disable */
import React,{ Component ,useRef } from "react";
import {
  Row,
  Col,
  Form,
  Badge,
  Table,
  Divider,
  Descriptions,
  Button,
  Tag,
  message
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import img  from '../../../assets/288553c1-3cdc-4a89-9785-85edfc4bd91f.png'
import ReactToPrint from "react-to-print";

function mapStateToProps(state) {
  return {
    detailObj: state.equipmentLedger.detailObj,
    initState: state.equipmentLedger.initState,
    cardsLoading: state.loading.effects['equipmentLedger/querySmsEquipmentBaseInfoList'],
    areaObj:state.areaFunction.detailObj,
  };
}

//List的主体方法
class List extends Component{
  state = {
    qrcodeImg:'', // 二维码图片地址
  }
  maintainColumns = [
    {
      title: '保养人',
      dataIndex: 'maintainPersonName',
    },
    {
      title: '保养部门',
      dataIndex: 'organizationName',
    },
    {
      title: '保养时间',
      dataIndex: 'maintainDate',
      render:(text) => {
        return <Tag color='red'>{moment(text).format('YYYY-MM-DD')}</Tag>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
  repairColumns = [
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      render:(text) => {
        return <Tag color='red'>{text}</Tag>
      }
    },
    {
      title: '责任人',
      dataIndex: 'personLiableName',
    },
    {
      title: '责任部门',
      dataIndex: 'organizationName',
    },
    {
      title: '维修人',
      dataIndex: 'applyPersonName',
    },
    {
      title: '维修时间',
      dataIndex: 'repairDate',
      render:(text) => {
        return <Tag color='red'>{moment(text).format('YYYY-MM-DD')}</Tag>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
  componentDidMount() {
    const id = this.props.location.state.id;
    this.props.dispatch({
      type: 'equipmentLedger/getSmsEquipmentBaseInfo',
      payload: {
        id:id,
      },
    }).then(()=>{
      //查询区域信息
      this.props.dispatch({
        type: 'areaFunction/getSmsAreaInfo',
        payload: {
          id:this.props.detailObj.installArea,
        },
      })
      console.log(this.props.areaObj)
    });
  }
  //翻页方法
  changeSize(page){
    this.props.dispatch({
      type: 'areaFunction/getSmsAreaInfo',
      payload: {
        id:this.props.detailObj.id,
      },
    });
  }

  render() {
    const { cardsLoading,initEquipmentList } = {};
    const { detailObj,areaObj } = this.props;
    console.log(areaObj);
    return (
      <div>
        <div id={'billDetails'} ref={(el)=> this.refs = el}>
          <Descriptions title="设备信息" bordered>
            <Descriptions.Item label="设备编号">{detailObj.equipmentCode}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{detailObj.equipmentName}</Descriptions.Item>
            <Descriptions.Item label="设备类型">{detailObj.typeName}</Descriptions.Item>
            <Descriptions.Item label="设备状态"><Badge status={detailObj.equipmentStatus==='0'?'error':'default'} text={detailObj.equipmentStatus==='0'?'故障':'正常'} /></Descriptions.Item>
            <Descriptions.Item label="设备厂家" span={2}>{detailObj.equipmentManufacturer}</Descriptions.Item>
            <Descriptions.Item label="备注" span={3}>
              {detailObj.remark}
            </Descriptions.Item>
            <Descriptions.Item label="设备型号">{detailObj.equipmentModel}</Descriptions.Item>
            <Descriptions.Item label="生产时间" >{detailObj.equipmentManufactureTime}</Descriptions.Item>
            <Descriptions.Item label="到期时间" ><Badge status="default" text={detailObj.scrapTime} /></Descriptions.Item>
            <Descriptions.Item label="设备二维码" span={3}><img alt="设备二维码" src={'http://192.168.1.19/'+detailObj.qrCode} style={{width:150,height:150}}/></Descriptions.Item>
            <Descriptions.Item label="所在位置">{detailObj.installAreaName}</Descriptions.Item>
            <Descriptions.Item label="设备责任人">{detailObj.equipmentPersonLiableName}</Descriptions.Item>
            <Descriptions.Item label="责任人部门">{detailObj.organizationName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{areaObj.personLiableTelephone}</Descriptions.Item>
            <Descriptions.Item label="下次保养时间">{detailObj.nextRepairTime}</Descriptions.Item>
          </Descriptions>
        </div>
        <ReactToPrint
          trigger={() => <a href="#"><Button type="primary">打印设备铭牌</Button></a>}
          content={() => this.refs}
          onAfterPrint={()=>{
            message.success('打印成功！');
          }}
        />
        <Divider style={{ marginBottom: 32 }} orientation="left">设备位置信息</Divider>
        <div>
          <Row gutter={16}>
            <Col span={6}>
              <div><span><img alt={areaObj.projectName} src={areaObj.attachments === undefined?"http://192.168.1.19/img/af69c9e500804aa39aee29bb70ca7e94.png":areaObj.attachments.fileUrl} style={{width:650,height:450}}/></span></div>
            </Col>
          </Row>
        </div>
        <Divider style={{ marginBottom: 32 }} orientation="left">设备维修信息</Divider>
        <Table bordered
          style={{marginTop:20}}
          columns={this.repairColumns}
          dataSource={detailObj.smsEquipmentRepairInfoList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initEquipmentList,
            onChange:this.changeSize.bind(this),
          }}
        />
        <Divider style={{ marginBottom: 32 }} orientation="left">设备保养信息</Divider>
        <Table bordered
          style={{marginTop:20}}
          columns={this.maintainColumns}
          dataSource={detailObj.smsEquipmentMaintainInfoList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initEquipmentList,
            onChange:this.changeSize.bind(this),
          }}
        />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
