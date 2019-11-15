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
  InputNumber,
  DatePicker,
  Table,
  Divider,
  Modal,
  message
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../../index.less';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;

function mapStateToProps(state) {
  return {
    initClassList: state.classification.initClassList,
    initState: state.classification.initState,
    cardsLoading: state.loading.effects['classification/querySmsClassList'],
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
  }
  columns = [
    {
      title: '分类编号',
      dataIndex: 'classCode',
    },
    {
      title: '分类名称',
      dataIndex: 'className',
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
    },

    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <a onClick={this.handleEditor.bind(this,record)}>编辑</a>
              <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this,record)}>删除</a>
              <Divider type="vertical" />
          <a onClick={this.handleBindInspection.bind(this,record)}>绑定检查项</a>
        </span>
      ),
    }
  ];
  //查询,调用models的公布的方法
  componentDidMount() {
    this.props.dispatch({
      type: 'classification/querySmsClassList',
      payload: {
        pageNum:0,
        className:''
      },
    });
  }
  handleSearch=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const filedValues = {
          ...values,
          'className': typeof(values['className']) == "undefined"?"":values['className']
        };
        console.log(filedValues)
        this.props.dispatch({
          type: 'classification/querySmsClassList',
          payload: {
            pageNum:"",
            className:filedValues.className
          }
        })
      }
    });

  }
  //编辑和查看
  handleEditor(data){
    this.props.history.push({ pathname: '/deviceManagement/classification/add', state: { isAdd:0,data:data } })
  }
  //绑定检查项
  handleBindInspection(data){
    this.props.history.push({ pathname: '/deviceManagement/classification/add', state: { isAdd:2,data:data } })
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
          type: 'classification/deleteSmsClassInfo',
          payload: {
            id:data.id,
          }
        }).then(() => {
          if (that.props.initState.code === 0) {
            message.success('删除成功！');
            close();
            that.props.dispatch({
              type: 'classification/querySmsClassList',
              payload: {
                pageNum:0,
                className:'',
              },
            });
          } else {
            message.error('删除失败！');
          }
        })
      }
    })
  }
  //人物详细情况
  handlePeopleDetail(data){
    this.props.history.push({ pathname: '/deviceManagement/details', state: { id:data.id,data:data } })
  }
  //查看
  handleInfo(data){
    const that = this;
    this.props.dispatch({
      type: 'classification/getSmsClassInfo',
      payload: {
        id:data.id,
      },
    });
  }
  //翻页方法
  changeSize(page){
    this.props.dispatch({
      type: 'classification/querySmsClassList',
      payload: {
        pageNum:page-1,
        className:'',
      },
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
            <FormItem label="分类名称">
              {getFieldDecorator('className')(<Input  placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { cardsLoading,initClassList } = this.props;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
        <div className="tr">
          <Button type="primary" style={{margin:"10px"}}><Link to={{pathname:'/deviceManagement/classification/add',state:{isAdd:1}}}>新增</Link></Button>
        </div>
        <Table
          style={{marginTop:20}}
          columns={this.columns}
          dataSource={initClassList}
          loading={cardsLoading}
          rowKey="id"
          pagination={{  // 分页
            defaultCurrent: 1,
            pageSize:10,
            total: initClassList.length,
            onChange:this.changeSize.bind(this),
          }}
        />
      </div>
    );
  }
}
const AddForm = Form.create()(List);
export default connect(mapStateToProps)(AddForm);
