/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row,Col,Tag,Icon,InputNumber } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../../index.less';
import { Form } from 'antd/lib/index';

const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;
const Option = Select.Option;

function mapStateToProps(state) {
  return {
    initSecurityPlan: state.securityPlan.initSecurityPlan,
    listLoading: state.loading.effects['securityPlan/querySecurityPlan'],
    initState: state.securityPlan.initState,
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
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
    },
    {
      title: '计划类型',
      dataIndex: 'planStatus',
      render:(text) => {
        return text === '0'? (<Tag color="blue">启用</Tag>):(<Tag color="green">未启用</Tag>)
      }
    },
    {
      title: '责任部门',
      dataIndex: 'organizationName',
    },
    {
      title: '责任人',
      dataIndex: 'personLiableName',
    },
    {
      title: '所属单位',
      dataIndex: 'companyName',
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
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={this.handleEditorInfo.bind(this,record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handleEditorInfo.bind(this,record)}>追踪</a>
        </span>
      ),
    }
  ];
  componentDidMount() {
    this.props.dispatch({
      type: 'securityPlan/querySecurityPlan',
      payload: {
        planName:'',
        planStatus:'',
        planCode:'',
        pageNum:'',
        pageSize:'',
      },
    });
  }
  handleSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        const filedValues = {
          ...values,
          'planName': typeof(values['planName']) == "undefined"?"":values['planName'] ,
          'planCode': typeof(values['planCode']) == "undefined"?"":values['planCode'],
          'planStatus': typeof(values['planStatus']) == "undefined"?"":values['planStatus'],
        };
        console.log(filedValues)

        this.props.dispatch({
          type: 'securityPlan/querySecurityPlan',
          payload: {
            planName:filedValues.planName,
            planStatus:filedValues.planStatus,
            planCode:filedValues.planCode,
            pageNum:'',
            pageSize:'',
          },
        });
        console.log(this.props.initSecurityTarget)
      }

    });

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
          type: 'securityPlan/deleteSecurityPlan',
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
    this.props.history.push({ pathname: '/planManage/securityPlan/add', state: { isAdd:0,data:data } })
  }
  changeSize = (page) => {
    this.props.dispatch({
      type: 'userManage/getUserList',
      payload: {
        pageNum:page-1,
        planName:'',
        planStatus:'',
        planCode:'',
        pageSize:'',
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
                  <Option value="0">启用</Option>
                  <Option value="1">未启用</Option>
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
    const { initSecurityPlan,listLoading } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" style={{margin:"10px"}}><Link to={{pathname:'/planManage/securityPlan/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initSecurityPlan.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initSecurityPlan.length,
            onChange:this.changeSize.bind(this),
          }}
        />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);


