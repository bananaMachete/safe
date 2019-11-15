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
    listLoading: state.loading.effects['dangerManage/queryDangerReviewList'],
    initState: state.dangerManage.initState,
    dangerType:state.dangerManage.dangerType,
    initDangerReviewList:state.dangerManage.initDangerReviewList,
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
      title: '隐患描述',
      dataIndex: 'dangerName',
      render:(text,value)=>{
        return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      }
    },
    {
      title: '复查部门',
      dataIndex: 'reviewOrganizationName',
    },
    {
      title: '复查人',
      dataIndex: 'reviewUserName',
      render:(text) => {
        return (<Tag color='red'>{text}</Tag>)
      }
    },
    {
      title: '复查日期',
      dataIndex: 'createDate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.createDate - b.createDate,
      render:(text) => {
        return <Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>
      }
    },
    {
      title: '复查状态',
      dataIndex: 'reviewStatus',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.reviewStatus - b.reviewStatus,
      render:(text) => {
        return text === true ? ( <Tag color="green">复查完成</Tag>):(<Tag color="red">待复查</Tag>)
      }
    },
    {
      title: '复查结果',
      dataIndex: 'reviewResult',
    },
    {
      title: '操作',
      width:210,
      render: (text, record) => (
        <span>
          <a onClick={this.handleDangerReview.bind(this,record)}>通过</a>
          <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
        </span>
      ),
    }
  ];
  componentDidMount() {
    //从status里取
    this.props.dispatch({
      type: 'dangerManage/queryDangerReviewList',
      payload: {
        dangerLevel:'',
        dangerStatus:3,
        pageNum:0,
        reviewStatus:'',
        createDate:''
      },
    });
    // 查询隐患类型列表
    this.props.dispatch({
      type: 'dangerManage/queryDangerType',
      payload: {
        typeId:'2',
      },
    });
  }

  handleDangerReview(data){
    if(data.dangerStatus){
      message.warning('非待复查隐患!');
    }else {
      this.props.history.push({ pathname: '/dangerManage/dangerManage/dangerReview', state: {data:data,isAdd:0}})
    }
  }

  handleDetail(data){
    this.props.history.push({ pathname: '/dangerManage/details', state: { id:data.dangerId,data:data }})
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
          type: 'dangerManage/deleteDangerReviewInfo',
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
  handleSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        const filedValues = {
          ...values,
          'createDate': typeof(values['createDate']) == 'undefined'?"":values['createDate'].format('YYYY-MM-DD'),
          'dangerName': typeof(values['dangerName']) == "undefined"?"":values['dangerName'] ,
          'dangerLevel': typeof(values['dangerLevel']) == 'undefined'?'':values['dangerLevel'],
          'dangerStatus': typeof(values['dangerStatus']) == 'undefined'?'':values['dangerStatus'],
          'reviewUserName': typeof(values['reviewUserName']) == 'undefined'?'':values['reviewUserName'],
          'reviewStatus': typeof(values['reviewStatus']) == 'undefined'?'':values['reviewStatus'],
        };
        console.log(filedValues)
        //从status里取
        this.props.dispatch({
          type: 'dangerManage/queryDangerReviewList',
          payload: {
            dangerName:filedValues.dangerName,
            dangerLevel:filedValues.dangerLevel,
            reviewUserName:filedValues.reviewUserName,
            pageNum:'',
            reviewStatus:filedValues.reviewStatus,
            createDate:filedValues.createDate
          },
        });
        console.log(this.props.initDangerList)
      }

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
            <FormItem label="隐患描述">
              {getFieldDecorator('dangerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col><Col md={8} sm={24}>
            <FormItem label="复查人">
              {getFieldDecorator('reviewUserName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/*<Col md={8} sm={24}>*/}
          {/*  <FormItem label="复查状态">*/}
          {/*    {getFieldDecorator('reviewStatus')(*/}
          {/*      <Select placeholder="请选择" style={{ width: '100%' }}>*/}
          {/*        <Option value="0">待复查</Option>*/}
          {/*        <Option value="1">复查完成</Option>*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
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
    const { dangerType } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="隐患描述">
              {getFieldDecorator('dangerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="复查人">
              {getFieldDecorator('reviewUserName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/*<Col md={8} sm={24}>*/}
          {/*  <FormItem label="复查状态">*/}
          {/*    {getFieldDecorator('reviewStatus')(*/}
          {/*      <Select placeholder="请选择" style={{ width: '100%' }}>*/}
          {/*        <Option value="0">待复查</Option>*/}
          {/*        <Option value="1">复查完成</Option>*/}

          {/*      </Select>*/}
          {/*    )}*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
        </Row>
        <Col md={8} sm={24}>
          <FormItem label="上报日期">
            {getFieldDecorator('createDate', {
              rules: [{ type: 'object'}]
            })(
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="请输入上报日期" />
            )}
          </FormItem>
        </Col>
        {/*  <Col md={8} sm={24}>*/}
        {/*    <FormItem label="隐患类型">*/}
        {/*      {getFieldDecorator('status3')(*/}
        {/*        <Select placeholder="请选择" style={{ width: '100%' }}>*/}
        {/*          {*/}
        {/*            dangerType.map((item) => {*/}
        {/*              return (<Option key={item.id} value={item.id}>{item.name}</Option>)*/}
        {/*            })*/}
        {/*          }*/}
        {/*        </Select>*/}
        {/*      )}*/}
        {/*    </FormItem>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
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
    const { initDangerReviewList,listLoading } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initDangerReviewList.content}
          loading={listLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initDangerReviewList.totalElements,
            onChange:this.changeSize,
          }}
        />
      </div>
    );
  }
}

const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
