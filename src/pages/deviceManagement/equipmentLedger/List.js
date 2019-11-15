/* eslint-disable */
import React,{ Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  InputNumber,
  DatePicker,
  Table,
  Divider,
  Modal,
  message,
  Tag
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../../index.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;


function mapStateToProps(state) {
  return {
    initEquipmentList: state.equipmentLedger.initEquipmentList,
    initState: state.equipmentLedger.initState,
    cardsLoading: state.loading.effects['equipmentLedger/querySmsEquipmentBaseInfoList'],
  };
}

//List的主体方法
class List extends Component{
  state = {
    visible: false,
    ModalTitle:'',
    ModalFileName:'',
    ModalFileUrl:'',
    ModalContent:'',
    keyword:'',
    expandForm: false,
  }
  columns = [
    {
      title: '设备编号',
      dataIndex: 'equipmentCode',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
    },
    {
      title: '设备分类',
      dataIndex: 'typeName',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '设备状态',
      dataIndex: 'equipmentStatus',
      render:(text) => {
        return text === '0'? (<Tag color='red'>故障</Tag>):(<Tag color='green'>正常</Tag>)
      }
    },
    {
      title: '设备责任人',
      dataIndex: 'equipmentPersonLiableName',
      render:(text,value)=>{
        return (<a onClick={this.handlePeopleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '下次维修时间',
      dataIndex: 'nextRepairTime',
      render:(text) => {
        return <Tag color='red'>{moment(text).format('YYYY-MM-DD')}</Tag>
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <a onClick={this.handleEditor.bind(this,record)}>编辑</a>
              <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
              <Divider type="vertical" />
          <a onClick={this.handleMaintain.bind(this,record)}>保养</a>
              <Divider type="vertical" />
          <a onClick={this.handleRepair.bind(this,record)}>维修</a>
        </span>
      ),
    }
  ];
  //查询,调用models的公布的方法
  componentDidMount() {
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        equipmentCode:'',
        equipmentName:'',
        equipmentStatus:'',
        scrapTime:'',
        equipmentType:'',
        installArea:'',
        pageNum:0,
      },
    });
  }
  //人物详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/systemManage/userManage/details', state: {userId:data.equipmentPersonLiableId } })
  }
  //编辑
  handleEditor(data){
    this.props.history.push({ pathname: '/deviceManagement/equipmentLedger/add', state: { isAdd:0,data:data } })
  }
  //查看
  handleDetail(data){
    this.props.history.push({ pathname: '/deviceManagement/equipmentLedger/details', state: { id:data.id,data:data } })
  }
  //保养
  handleMaintain(data){
    this.props.history.push({pathname: '/deviceManagement/equipmentMaintain/add', state: { isAdd:1,data:data }})
  }
  //维修
  handleRepair(data){
    this.props.history.push({pathname: '/deviceManagement/equipmentRepair/add', state: { isAdd:1,data:data }})
  }
  handleDelete(data){
    const that = this;
    confirm({
      title: '确认删除该条数据',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk(close) {
        that.props.dispatch({
          type: 'equipmentLedger/deleteSmsEquipmentBaseInfo',
          payload: {
            id:data.id,
          }
        }).then(() => {
          if (that.props.initState.code === 0) {
            message.success('删除成功！');
            close();
            that.props.dispatch({
              type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
              payload: {
                pageNum:0,
              },
            });
          } else {
            message.error('删除失败！');
          }
        })
      }
    })
  }
  //翻页方法
  changeSize(page){
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        pageNum:page-1,
        equipmentCode:'',
        equipmentName:'',
        equipmentStatus:'',
        scrapTime:'',
        equipmentType:'',
        installArea:'',
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };
  //条件查询方法
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const filedValues = {
          ...values,
          //报废日期
          'scrapTime': typeof(values['scrapTime']) == "undefined"?"":values['scrapTime'].format('YYYY-MM-DD'),
          'pageNum':0,
          'equipmentCode': typeof(values['equipmentCode']) == "undefined"?"":values['equipmentCode'],
          'equipmentName': typeof(values['equipmentName']) == "undefined"?"":values['equipmentName'],
          'equipmentStatus': typeof(values['equipmentStatus']) == "undefined"?"":values['equipmentStatus'],
          'equipmentType': typeof(values['equipmentType']) == "undefined"?"":values['equipmentType']
        };

        this.props.dispatch({
          type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
          payload: filedValues,
        }).then(() => {
          //业务处理
          console.log(this.props.initEquipmentList);
        });
      }
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('equipmentCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('equipmentName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('equipmentCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('equipmentName')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备状态">
              {getFieldDecorator('equipmentStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">正常</Option>
                  <Option value="0">故障</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="报废日期">
              {getFieldDecorator('scrapTime')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入报废日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备类型">
              {getFieldDecorator('equipmentType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };



  render() {
    const { cardsLoading,initEquipmentList } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" style={{margin:"10px"}}><Link to={{pathname:'/deviceManagement/equipmentLedger/add',state:{isAdd:1}}}>新增</Link></Button>
          <Button type="primary" style={{margin:"10px"}}><Link to={{pathname:'add',state:{isAdd:1}}}>导入</Link></Button>
          <Button type="primary" style={{margin:"10px"}}><Link to={{pathname:'add',state:{isAdd:1}}}>导出</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initEquipmentList.content}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initEquipmentList.totalElements,
            onChange:this.changeSize.bind(this),
          }}
        />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
