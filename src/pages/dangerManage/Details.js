/* eslint-disable */
import React,{ Component } from "react";
import {
  Row,
  Col,
  Form,
  Descriptions,
  Table,
  Divider,
  Breadcrumb,
  Steps,
  Tag,
  Carousel,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment'
import { getAttachments } from '@/services/global';

function mapStateToProps(state) {
  return {
    dangerDataInfo: state.dangerManage.dangerDataInfo,
    initState: state.equipmentLedger.initState,
    attachments:state.dangerManage.attachments,
    cardsLoading: state.loading.effects['dangerManage/saveDangerInfo'],
  };
}

//List的主体方法
class List extends Component{
  state = {

  }
  //隐患复查
  reviewColumns = [
    {
      title: '复查部门',
      dataIndex: 'reviewOrganizationName',
    },
    {
      title: '复查人',
      dataIndex: 'reviewUserName',
    },
    {
      title: '复查结果',
      dataIndex: 'reviewResult',
    },
    {
      title: '复查附件',
      dataIndex: 'remark',
    },
    {
      title: '复查时间',
      dataIndex: 'createDate',
      render:(text) => {
        return (<Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>)
      }
    },
  ];
  //隐患整改
  repairColumns = [
    {
      title: '整改部门',
      dataIndex: 'repairOrganizationName',
    },
    {
      title: '整改人',
      dataIndex: 'repairUserName',
    },
    {
      title: '整改意见',
      dataIndex: 'repairOpinion',
    },
    {
      title: '整改结果',
      dataIndex: 'repairResult',
    },
    {
      title: '整改附件',
      dataIndex: 'remark',
    },
    {
      title: '整改时间',
      dataIndex: 'createDate',
      render:(text) => {
        return (<Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>)
      }
    },
  ];
  componentDidMount() {
    const id = this.props.location.state.id;
    this.props.dispatch({
      type: 'dangerManage/queryDangerDataInfo',
      payload: {
        id:id,
      },
    }).then(() => {
      //查图片
      this.props.dispatch({
        type: 'dangerManage/getAttachments',
        payload: {
          targetId:id,
        },
      });
      console.log(this.props.attachments);
    });

  }
  //翻页方法
  changeSize(page){
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        pageNum:page-1,
      },
    });
  }

  render() {
    const { cardsLoading,initEquipmentList } = {};
    const { dangerDataInfo,attachments } = this.props;
    const Step = Steps.Step;
    return (
      <div>
        <Breadcrumb style={{ marginBottom: 32 }} >
          <Breadcrumb.Item>隐患管理</Breadcrumb.Item>
          <Breadcrumb.Item>隐患详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Descriptions bordered title="隐患信息">
            <Descriptions.Item label="隐患地址">{dangerDataInfo.dangerAddress}</Descriptions.Item>
            <Descriptions.Item label="隐患级别">{dangerDataInfo.dangerLevelName}</Descriptions.Item>
            <Descriptions.Item label="隐患类型">{dangerDataInfo.dangerTypeName}</Descriptions.Item>
            <Descriptions.Item label="隐患状态" span={3}>{dangerDataInfo.dangerStatus=== true?'故障':'正常'}</Descriptions.Item>
            <Descriptions.Item label="备注" span={3}>
              {dangerDataInfo.remark}
            </Descriptions.Item>
            <Descriptions.Item label="隐患图片" span={3}>
              {
                attachments.map((item) =>{
                  return <img src={'http://192.168.1.19/'+item.fileUrl} alt={'隐患图片'} style={{width:450,height:250}}/>
                })
              }
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ marginBottom: 32 }} >隐患进行情况</Divider>
          <Steps current={parseInt(dangerDataInfo.dangerStatus)}>
            <Step title="隐患上报" description="隐患上报,待整改" />
            <Step title="隐患整改" description="整改中" />
            <Step title="隐患复查" description="待复查" />
          </Steps>
        </div>
        <Divider style={{ marginBottom: 32 }} />
        <Row  style={{ marginBottom: 16 }}>
          <Col span={24}>
            <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>隐患整改信息</div>
          </Col>
        </Row>
        <Table
          style={{marginTop:20}}
          columns={this.repairColumns}
          dataSource={dangerDataInfo.smsDangerRepairList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initEquipmentList,
            onChange:this.changeSize.bind(this),
          }}
        />
        <Row  style={{ marginBottom: 16,marginTop:16 }}>
          <Col span={24}>
            <div className="gutter-box" style={{fontSize:16,fontWeight:"bold"}}>隐患复查信息</div>
          </Col>
        </Row>
        <Table
          style={{marginTop:20}}
          columns={this.reviewColumns}
          dataSource={dangerDataInfo.smsDangerReviewList}
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
