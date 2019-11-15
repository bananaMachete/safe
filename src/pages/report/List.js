/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row,Col,Tag,Icon,InputNumber,DatePicker,} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../index.less';
import { Form } from 'antd/lib/index';
import moment from 'moment';
const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;
const Option = Select.Option;


function mapStateToProps(state) {
  return {
    initReportList: state.report.initReportList,
    listLoading: state.loading.effects['customer/Customer'],
    initState: state.report.initState,
  };
}

class List extends Component {
  state = {
    dangerLevel:'',
    dangerStatus:'',
    visible: false,
  }

  columns = [
    {
      title: '报告编号',
      dataIndex: 'code',
    },
    {
      title: '报告名称',
      dataIndex: 'name',
      render:(text,value)=>{
        return (<a onClick={this.handlePeopleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '报告简介',
      dataIndex: 'details',
    },
    {
      title: '报告类型',
      dataIndex: 'companyType',
      render:(text) => {
        return text === '0'? (<Tag color='red'>专题报告</Tag>):(<Tag color='green'>综合性报告</Tag>)
      }
    },
    {
      title: '甲方单位',
      dataIndex: 'firstParty',
    },
    {
      title: '报告附件',
      dataIndex: 'attachment',
      render:(text, value) => (
        <Button type="primary" shape="circle" icon="download" />
      ),
    },
    {
      title: '点击量',
      dataIndex: 'hits',
      render:(text, value) =>(
        <Tag color="#f50">{text}</Tag>
      )
    },
    {
      title: '下载量',
      dataIndex: 'downloads',
      render:(text, value) =>(
        <Tag color="#f50">{text}</Tag>
      )
    },
    {
      title: '报告日期',
      dataIndex: 'reportDay',
    },
    {
      title: '操作',
      width:210,
      render: (text, record) => (
        <span>
          <a onClick={this.handleUpdate.bind(this,record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
        </span>
      ),
    }
  ];
  componentDidMount() {
    this.props.dispatch({
      type: 'report/queryReportList',
      payload: {
        pageNum:0,
        pageSize:10,
      },
    });
  }
  //详情页面
  handleDetail(data){
    this.props.history.push({ pathname: '/report/details', state: { id:data.id,data:data }})
  }
  //详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/report/details', state: { id:data.id,data:data } })
  }

  handleUpdate(data){
    this.props.history.push({ pathname: '/report/Report/add', state: { isAdd:0,data:data } })
  }

  handleDelete(data){
    const that = this;
    console.log(data);
    confirm({
      title: '确认删除该条数据',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk(close) {
        that.props.dispatch({
          type: 'report/deleteReport',
          payload: data.messageId,
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
  changeSize = (page) => {
    this.props.dispatch({
      type: 'report/queryReportList',
      payload: {
        dangerLevel:this.state.username,
        dangerStatus:this.state.dangerStatus,
        pageNum:page-1,
      },
    });
  }
  //重置
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
            <FormItem label="报告名称">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报告类型">
              {getFieldDecorator('content')(<Input placeholder="请输入" />)}
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
            </span>
          </Col>
        </Row>
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
    const { initReportList,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/report/Report/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initReportList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initReportList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
