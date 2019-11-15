/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row,Col,Tag,Icon,InputNumber  } from 'antd';
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
    initSecurityTarget: state.securityTarget.initSecurityTarget,
    listLoading: state.loading.effects['securityTarget/querySecurityTarget'],//加载时转圈
    initState: state.securityTarget.initState,
  };
}

/**
 * 安全目标
 */
class List extends Component {
  state = {
    keyword:'',
    userRoles:[],
    userId:'',
  }

  columns = [
    {
      title: '目标编号',
      dataIndex: 'targetCode',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '目标名称',
      dataIndex: 'targetName',
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      render:(text) => {
        return text === '0'? (<Tag color='green'>目标</Tag>): (<Tag color='green'>指标</Tag>)
      }
    },
    {
      title: '目标状态',
      dataIndex: 'runCycleName',
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
        </span>
      ),
    }
  ];
  componentDidMount() {
    this.props.dispatch({
      type: 'securityTarget/querySecurityTarget',
      payload: {
        targetCode: '',
        targetName: '',
        targetType: '',
        pageNum:'',
        pageSize:'',
      },
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
          type: 'securityTarget/deleteSecurityTarget',
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
    this.props.history.push({ pathname: '/planManage/securityTarget/add', state: { isAdd:0,data:data } })
  }
  //查看
  handleDetail(data){
    this.props.history.push({ pathname: '/planManage/securityTarget/details', state: { id:data.id,data:data } })
  }
  changeSize = (page) => {
    this.props.dispatch({
      type: 'userManage/getUserList',
      payload: {
        targetName: '',
        targetType: '',
        pageSize:'',
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
  handleSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        const filedValues = {
          ...values,
          'targetCode': typeof(values['targetCode']) == "undefined"?"":values['targetCode'] ,
          'targetName': typeof(values['targetName']) == "undefined"?"":values['targetName'],
          'targetType': typeof(values['targetType']) == "undefined"?"":values['targetType']
        };

        this.props.dispatch({
          type: 'securityTarget/querySecurityTarget',
          payload: {
            targetCode: filedValues.targetCode,
            targetName: filedValues.targetName,
            targetType: filedValues.targetType,
            pageNum:'',
            pageSize:'',
          },
        });
        console.log(this.props.initSecurityTarget)
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
            <FormItem label="目标编号">
              {getFieldDecorator('targetCode')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="目标名称">
              {getFieldDecorator('targetName')(<Input style={{ width: '100%' }} />)}
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
            <FormItem label="目标编号">
              {getFieldDecorator('targetCode')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="目标名称">
              {getFieldDecorator('targetName')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="目标类型">
              {getFieldDecorator('targetType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">目标</Option>
                  <Option value="1">指标</Option>
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
    const { initSecurityTarget,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/planManage/securityTarget/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initSecurityTarget.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initSecurityTarget.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);


