/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Select, Row,Col,Tag} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../index.less';
import { Form } from 'antd/lib/index';
import moment from 'moment';
const FormItem = Form.Item;
const confirm = Modal.confirm;


function mapStateToProps(state) {
  return {
    initNoticeMessageList: state.noticeMessage.initNoticeMessageList,
    listLoading: state.loading.effects['noticeMessage/queryNoticeMessageListByUserId'],
    initState: state.noticeMessage.initState,
    loginUser: state.loginSpace.loginUser,
  };
}

class List extends Component {
  state = {
    dangerLevel:'',
    dangerStatus:'',
    visible: false,
    loginUser:{},
  }

  columns = [
    {
      title: '标题',
      dataIndex: 'noticeMessage.title',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '内容',
      dataIndex: 'noticeMessage.content',
    },
    {
      title: '发布人',
      dataIndex: 'createUserName',
      render:(text,value)=>{
        return (<a onClick={this.handlePeopleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '发布时间',
      dataIndex: 'createDate',
      render:(text) => {
        return (<Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>)
      }
    },
    {
      title: '是否已读',
      dataIndex: 'readFlag',
      render:(text) => {
        return text === false? (<Tag color='red'>未读</Tag>):(<Tag color='green'>已读</Tag>)
      }
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
    //获取当前登录的用户
    this.props.dispatch({
      type: 'loginSpace/getLoginUser',
    }).then(() => {
      this.setState({
        loginUser: this.props.loginUser
      })
      this.props.dispatch({
        type: 'noticeMessage/queryNoticeMessageListByUserId',
        payload: {
          userId: 1,
          pageNum: 0,
        },
      });
    })
  }
  //通知详情页面
  handleDetail(data){
    this.props.history.push({ pathname: '/noticeMessage/Message/details', state: { id:data.messageId,data:data }})
  }
  //人物详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/deviceManagement/details', state: { id:data.id,data:data } })
  }

  handleUpdate(data){
    console.log(data);
    this.props.history.push({ pathname: '/noticeMessage/Message/add', state: { isAdd:0,data:data } })
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
          type: 'noticeMessage/deleteNoticeMessageInfo',
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
      type: 'dangerManage/queryDangerList',
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
            <FormItem label="通知标题">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="通知内容">
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
    const { initNoticeMessageList,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/noticeMessage/Message/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initNoticeMessageList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initNoticeMessageList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
