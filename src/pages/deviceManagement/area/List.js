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
  Tag,
  Table,
  Divider,
  Modal,
  message
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
    initAreaList: state.areaFunction.initAreaList,
    initState: state.areaFunction.initState,
    cardsLoading: state.loading.effects['areaFunction/querySmsAreaList'],
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
    code:"",
    name:"",
    status:""
  }
  columns = [
    {
      title: '项目ID',
      dataIndex: 'projectCode',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '项目状态',
      dataIndex: 'projectStatus',
      render:(text)=>{
        return text === '0'? (<span>在建</span>):(<span>建成</span>)
      }
    },
    {
      title: '责任人',
      dataIndex: 'securityPersonLiableName',
      render:(text,value)=>{
        return (<a onClick={this.handlePeopleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '联系电话',
      dataIndex: 'personLiableTelephone',
    },
    {
      title: '上线时间',
      dataIndex: 'projectFinishDate',
      render:(text) => {
        return (<Tag color='red'>{moment(text).format('YYYY-MM-DD')}</Tag>)
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <a onClick={this.handleEditor.bind(this,record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
        </span>
      ),
    }
  ];
  //查询,调用models的公布的方法
  componentDidMount() {
    this.props.dispatch({
      type: 'areaFunction/querySmsAreaList',
      payload: {
        pageNum:0,
        projectCode: "",
        projectName: "",
        projectStatus: ""
      },
    });
  }
  //人物详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/systemManage/userManage/details', state: {userId:data.securityPersonLiableId } })
  }
  //编辑和查看
  handleEditor(data){
    this.props.history.push({ pathname: '/deviceManagement/area/add', state: { isAdd:0,data:data } })
  }
  //查看
  handleDetail(data){
    this.props.history.push({ pathname: '/deviceManagement/area/details', state: { id:data.id,data:data } })
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
          type: 'areaFunction/deleteSmsAreaInfo',
          payload: {
            id:data.id,
          }
        }).then(() => {
          if (that.props.initState.code === 0) {
            message.success('删除成功！');
            close();
            that.props.dispatch({
              type: 'areaFunction/querySmsAreaList',
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
  //查看
  handleInfo(data){
    const that = this;
    this.props.dispatch({
      type: 'areaFunction/getSmsAreaInfo',
      payload: {
        id:data.id,
      },
    });
  }

  //翻页方法
  changeSize(page){
    this.props.dispatch({
      type: 'areaFunction/querySmsAreaList',
      payload: {
        pageNum:page-1,
      },
    });
  }
  handleSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const filedValues = {
          ...values,
          'projectCode': typeof(values['projectCode']) == "undefined"?"":values['projectCode'],
          'projectName': typeof(values['projectName']) == "undefined"?"":values['projectName'],
          'projectStatus': typeof(values['projectStatus']) == "undefined"?"":values['projectStatus']
        };
        console.log(filedValues)
        this.props.dispatch({
          type: 'areaFunction/getSmsAreaTreeDateInfo',
          payload: {
            pageNum:0,
            projectCode: filedValues.projectCode,
            projectName: filedValues.projectName,
            projectStatus: filedValues.projectStatus
          }
        })
      }
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
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目编号">
              {getFieldDecorator('projectCode')(<Input  placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')((<Input  placeholder="请输入" />))}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary"  htmlType="submit">
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
            <FormItem label="项目编号">
              {getFieldDecorator('projectCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')((<Input placeholder="请输入" />))}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目状态">
              {getFieldDecorator('projectStatus')(
                <Select placeholder="请选择"  style={{ width: '100%' }}>
                  <Option value="0">在建</Option>
                  <Option value="1">建成</Option>
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
    const { cardsLoading,initAreaList } = this.props;
    console.log("in"+initAreaList)
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" style={{margin:"10px"}}><Link to={{pathname:'/deviceManagement/area/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initAreaList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initAreaList.length,
            onChange:this.changeSize.bind(this),
          }}
        />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
