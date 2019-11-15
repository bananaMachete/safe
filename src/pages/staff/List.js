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
    staffList: state.staff.staffList,
    listLoading: state.loading.effects['staff/Staff'],
    initState: state.staff.initState,
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
      title: '姓名',
      dataIndex: 'name',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render:(text) => {
        return text === '0'? (<Tag color='green'>女</Tag>):(<Tag color='red'>男</Tag>)
      }
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
    },
    {
      title: '岗位信息',
      dataIndex: 'position',
    },
    {
      title: '职位信息',
      dataIndex: 'title',
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNum',
    },
    {
      title: '状态',
      dataIndex: 'delFlag',
      render:(text) => {
        return text === '0'? (<Tag color='green'>在职</Tag>):(<Tag color='red'>离职</Tag>)
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
    this.props.dispatch({
      type: 'staff/getStaffList',
      payload: {
        pageNum:0,
        pageSize:10,
      },
    });
  }
  //维保人员详情页面
  handleDetail(data){
    this.props.history.push({ pathname: '/staff/details', state: { id:data.id,data:data }})
  }

  handleUpdate(data){
    this.props.history.push({ pathname: '/staff/Staff/add', state: { isAdd:0,data:data } })
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
          type: 'staff/deleteStaff',
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
      type: 'staff/getStaffList',
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
            <FormItem label="维保人姓名">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="维保人公司">
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
    const { staffList,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/maintenance/Maintenance/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={staffList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: staffList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
