/* eslint-disable */
import React,{ Component } from "react";
import { Table,Divider,Button,Input,Modal,message,Avatar,Select,Checkbox, Row,Col,Badge,Icon,InputNumber  } from 'antd';
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
    inspectionTarget: state.checkItem.inspectionTarget,
    listLoading: state.loading.effects['checkItem/queryInspectionTarget'],
    initState: state.checkItem.initState,
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
      title: '指标编号',
      dataIndex: 'targetCode',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '指标名称',
      dataIndex: 'targetName',
    },
    {
      title: '检查周期',
      dataIndex: 'runCycleName',
    },
    {
      title: '所属系统',
      dataIndex: 'equipmentClassName',
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
      type: 'checkItem/queryInspectionTarget',
      payload: {
        targetCode: '',
        targetName: '',
        pageNum:'',
        equipmentClassId:'',
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
          'targetCode': typeof(values['targetCode']) == "undefined"?"":values['targetCode'] ,
          'targetName': typeof(values['targetName']) == "undefined"?"":values['targetName']
        };
        console.log(filedValues)

        this.props.dispatch({
          type: 'checkItem/queryInspectionTarget',
          payload: {
            targetCode: filedValues.targetCode,
            targetName: filedValues.targetName,
            pageNum:'',
            pageSize:'',
            equipmentClassId:'',
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
          type: 'checkItem/deleteInspectionTarget',
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
  //人物详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/deviceManagement/details', state: { id:data.id,data:data } })
  }
  handleEditorInfo(data){
    this.props.history.push({ pathname: '/planManage/checkItem/add', state: { isAdd:0,data:data } })
  }
  //查看
  handleDetail(data){
    this.props.history.push({ pathname: '/planManage/checkItem/details', state: { id:data.id,data:data } })
  }
  changeSize = (page) => {
    this.props.dispatch({
      type: 'userManage/getUserList',
      payload: {
        username:this.state.username,
        name:this.state.name,
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
  //普通查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="指标编号">
              {getFieldDecorator('targetCode')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="指标名称">
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
    const { inspectionTarget,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className="tr">
          <Button type="primary" className='add fl'><Link to={{pathname:'/planManage/checkItem/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={inspectionTarget.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: inspectionTarget.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);


