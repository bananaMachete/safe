/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row,Col,Tag ,Icon,InputNumber,Progress } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { Form } from 'antd/lib/index';
import styles from '../../index.less';

const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;
const Option = Select.Option;

function mapStateToProps(state) {
  return {
    inspectionPlan: state.patrolPlan.inspectionPlan,
    listLoading: state.loading.effects['patrolPlan/queryInspectionPlan'],
    initState: state.patrolPlan.initState,
  };
}
class List extends Component {
  state = {
    keyword:'',
    userRoles:[],
    userId:'',
  }

  columns = [
    {
      title: '计划编号',
      dataIndex: 'planCode',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
    },
    {
      title: '计划期限',
      dataIndex: 'beginDate',
      render:(text) => {
        return <Tag color='red'>{text}</Tag>
      }
    },
    {
      title: '计划进度',
      dataIndex: 'planRatio',
      render:(text) => {
        return (<span><Progress percent={Number(text)} size="small" /></span>)
      }
    },
    {
      title: '执行人',
      dataIndex: 'personLiableName',
      render:(text,value)=>{
        return (<a onClick={this.handlePeopleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '审核状态',
      dataIndex: 'planStatus',
      render:(text) => {
        return text === '0'? (<Tag color="blue">待审核</Tag>): text === '1' ? (<Tag color="yellow">已审核</Tag>) : (<Tag color="green">已完成</Tag>)
      }
    },
    {
      title: '执行部门',
      dataIndex: 'organizationName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      width:210,
      render: (text, record) => (
        <span>
          <a onClick={this.handleEditorInfo.bind(this,record)}>详情</a>
        </span>
      ),
    }
  ];
  componentDidMount() {
    this.props.dispatch({
      type: 'patrolPlan/queryInspectionPlan',
      payload: {
        planCode: '',
        planName: '',
        pageNum:'',
        pageSize:'',
        planStatus:''
      },
    });
  }
  //人物详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/deviceManagement/details', state: { id:data.id,data:data } })
  }
  //查看
  handleDetail(data){
    this.props.history.push({ pathname: '/planManage/patrolPlan/details', state: { id:data.id,data:data } })
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
          type: 'patrolPlan/deleteInspectionPlan',
          payload: data.id
        }).then(() => {
          if (that.props.initState.code === 0) {
            message.success('删除成功！');
            close();
            that.componentDidMount();
          } else {
            message.error('删除失败！请稍后重试');
            close();
          }
        })
      }
    })
  }
  handleEditorInfo(data){
    this.props.history.push({ pathname: '/planManage/patrolPlan/details', state: { isAdd:0,data:data } })
  }
  changeSize = (page) => {
    this.props.dispatch({
      type: 'userManage/getUserList',
      payload: {
        planCode: '',
        planName: '',
        pageSize:'',
        planStatus:'',
        pageNum:page-1,
      },
    });
  }
  handleUserNameSearch(value){
    this.setState({username:value},() =>(
      this.props.dispatch({
        type: 'userManage/getUserList',
        payload: {
          username:this.state.username,
          name:this.state.name,
          pageNum:0,
        },
      })
    ));
  }
  handleNameSearch(value){
    this.setState({name:value},() =>(
      this.props.dispatch({
        type: 'userManage/getUserList',
        payload: {
          username:this.state.username,
          name:this.state.name,
          pageNum:0,
        },
      })
    ));
  }
  handleSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        const filedValues = {
          ...values,
          'planCode': typeof(values['planCode']) == "undefined"?"":values['planCode'] ,
          'planName': typeof(values['planName']) == "undefined"?"":values['planName'],
          'pageSize': typeof(values['pageSize']) == "undefined"?"":values['pageSize'],
          'pageNum': typeof(values['pageNum']) == "undefined"?"":values['pageNum'],
          'planStatus': typeof(values['planStatus']) == "undefined"?"":values['planStatus']
        };
        console.log(filedValues)
        this.props.dispatch({
          type: 'patrolPlan/queryInspectionPlan',
          payload: filedValues
        });
      }

    });

  }
  //普通查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="计划编号">
              {getFieldDecorator('planCode')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="计划名称">
              {getFieldDecorator('planName')(<Input style={{ width: '100%' }} />)}
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
  //高级查询
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="计划编号">
              {getFieldDecorator('planCode')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="计划名称">
              {getFieldDecorator('planName')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="计划类型">
              {getFieldDecorator('planStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">已审核</Option>
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
  //普通查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="计划编号">
              {getFieldDecorator('planCode')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="计划名称">
              {getFieldDecorator('planName')(<Input style={{ width: '100%' }} />)}
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
  //高级查询
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="计划编号">
              {getFieldDecorator('planCode')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="计划名称">
              {getFieldDecorator('planName')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="计划类型">
              {getFieldDecorator('planStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">已审核</Option>
                  <Option value="2">已完成</Option>
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
    const { inspectionPlan,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/planManage/patrolPlan/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={inspectionPlan.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: inspectionPlan.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);


