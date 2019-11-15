/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Select, Row,Col,Tag,Icon,} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../index.less';
import { Form } from 'antd/lib/index';

const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;
const Option = Select.Option;


function mapStateToProps(state) {
  return {
    initMaintenanceList: state.maintenance.initMaintenanceList,
    listLoading: state.loading.effects['maintenance/Maintenance'],
    initState: state.maintenance.initState,
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
      title: '单位名称',
      dataIndex: 'name',
      render:(text,value)=>{
        return (<a onClick={this.handlePeopleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '单位类型',
      dataIndex: 'companyType',
      render:(text) => {
        return text === "0" ? (<Tag color='red'>合资</Tag>):(<Tag color='green'>民营</Tag>)
      }
    },
    {
      title: '地址',
      dataIndex: 'address',
      render:(text) => {
        return (<span><Icon type="environment" />{text}</span>)
      }
    },
    {
      title: '法人',
      dataIndex: 'corporation',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '单位状态',
      dataIndex: 'companyStatus',
      render:(text) => {
        return text === "0" ? (<Tag color='red'>合作</Tag>):(<Tag color='green'>弃用</Tag>)
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
      type: 'maintenance/queryMaintenanceList',
      payload: {
        pageNum:0,
        pageSize:10,
      },
    });
  }
  //通知详情页面
  handleDetail(data){
    this.props.history.push({ pathname: '/maintenance/details', state: { id:data.id,data:data }})
  }
  //人物详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/maintenance/maintenance/details', state: { id:data.id,data:data } })
  }
  handleUpdate(data){
    this.props.history.push({ pathname: '/maintenance/Maintenance/add', state: {id:data.id, isAdd:0,data:data } })
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
          type: 'maintenance/deleteMaintenance',
          payload: data.id,
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
      type: 'maintenance/queryMaintenanceList',
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
            <FormItem label="单位名称">
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
    const { initMaintenanceList,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/maintenance/Maintenance/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initMaintenanceList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initMaintenanceList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
