/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button, message, Radio,Icon,Upload,TreeSelect
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import { getAuthHeader, getCookie } from '@/util/auth';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const sso_token = getCookie(getCookie('username'));
const authHeader = getAuthHeader(sso_token);

// treeData处理数据
function combinationData(array){
  array.map((item) => {
    item.title = item.name;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationData(item.children);
    }
  });
  return array;
}

class ReportForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    userList:[],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          //新增
          const filedValues = {
            ...values,
            //'dangerLevelName':this.state.levelName,
          };
          this.props.dispatch({
            type: 'noticeMessage/saveNoticeMessageInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！', 1, () => this.props.history.push('/noticeMessage/Message'));
            } else {
              message.error('新增失败！');
            }
          });
        }else{
          //编辑
          const filedValues = {
            ...values,
            //'dangerLevelName':this.state.levelName,
          };
          this.props.dispatch({
            type: 'noticeMessage/updateNoticeMessageInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！', 1, () => this.props.history.push('/noticeMessage/Message'));
            } else {
              message.error('修改失败！');
            }
          });
        }
      }
    });
  };

  componentDidMount() {
    if(this.state.isAdd === 0){
      console.log(this.state.data);
    }
    // 查询单位列表
    this.props.dispatch({
      type: 'depManage/queryCompanyListArray',
      payload: {
        name:'',
        pageNum:0
      },
    });
    //查部门
    this.props.dispatch({
      type: 'depManage/getCurrentCompany',
    }).then(() => {
      this.props.dispatch({
        type: 'equipmentLedger/getOrganization',
        payload:{
          id:this.props.currentCompany.id
        }
      }).then(() => {
        const treeDate = this.props.orgList;
        this.setState({
          orgList:combinationData(treeDate),
        })
      })
    })
  }
//部门选择方法,改变人员选择
  onSelect = (value) => {
    //调用查询方法
    this.props.dispatch({
      type:'userManage/getUserListByOrg',
      payload:{
        id:value
      }
    }).then(() => {
      this.setState({
        userList:this.props.userList
      })
    })
  }
  onChangeName = (value,tag) =>{
    console.log(tag)
    this.setState({
      repairUserName:tag.props.children
    })
  }
  //选择部门
  onOrganizationChange = (data,label) => {
    this.setState({
      repairOrganizationName:label[0]
    })
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }
  render() {
    const { data,userList  }  = this.state;
    const { dangerLevel,dangerType } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    const imageUrl = this.state.isAdd === 1 ? this.state.imageUrl:(this.state.imageUrl === undefined ? "http://192.168.1.19/" + this.state.data.icon : this.state.imageUrl);
    return (
      <Form onSubmit={this.handleSubmit}>

        <FormItem
          {...formItemLayout}
          label="标题"
          hasFeedback
        >
          {getFieldDecorator('title', {
            rules: [{
              required: true,
            }],
            initialValue:data === undefined ? "":data.noticeMessage.title
          })(
            <Input placeholder="请输入标题" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="内容"
          hasFeedback
        >
          {getFieldDecorator('content', {
            rules: [{
            message: '请输入备注',
          }],
            initialValue:data === undefined ? "":data.noticeMessage.content
          })(
            <TextArea rows={4} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="接收人部门"
          hasFeedback
        >
          {getFieldDecorator('repairOrganizationId', {
            rules: [
              { required: true,
                message: '请选择接收人部门'
              },
            ],
             initialValue:data === undefined ? "":data.createUser
          })(
            <TreeSelect
              //value={this.state.value}
              allowClear={true}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={this.state.orgList}
              placeholder="请选择上级菜单"
              onChange={this.onOrganizationChange}
              onSelect={this.onSelect}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="接收人"
          hasFeedback
        >
          {getFieldDecorator('receive', {
            rules: [
              { required: true,
                message: '请选择接收人'
              },
            ],
             initialValue:data === undefined ? "":data.createUser
          })(
            <Select
              placeholder="请选择接收人"
              onChange={this.onChangeName}
            >
              {
                userList.map(item => {
                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                })
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 20 }}><Link to='/noticeMessage/Message'>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}
const AddForm = Form.create()(ReportForm);

function mapStateToProps(state) {
  return {
    initState: state.dangerManage.initState,
    //公司列表
    companyListArray:state.depManage.companyListArray,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //公司部门
    initCompanyOrganizationsList:state.depManage.initCompanyOrganizationsList,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //用户列表
    userList:state.userManage.userList,
  };
}

export default connect(mapStateToProps)(AddForm);
