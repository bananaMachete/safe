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
const Option = Select.Option;
const sso_token = getCookie(getCookie('username'));
const authHeader = getAuthHeader(sso_token);



class MaintenanceForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          //新增
          const filedValues = {
            ...values
          };
          this.props.dispatch({
            type: 'maintenance/saveMaintenance',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！', 1, () => this.props.history.push('/maintenance/Maintenance'));
            } else {
              message.error('新增失败！');
            }
          });
        }else{
          //编辑
          const id = this.props.location.state.id;
          const filedValues = {
            id:id,
            ...values,
          };
          this.props.dispatch({
            type: 'maintenance/updateMaintenance',
            payload: filedValues
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！', 1, () => this.props.history.push('/maintenance/Maintenance'));
            } else {
              message.error('修改失败！');
            }
          });
        }
      }
    });
  };
  componentDidMount() {
    console.log("state--------"+this.state);
  }

   handleChange(value) {
    console.log(`selected ${value}`);
  }
  render() {
    const { data  }  = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>

        <FormItem
          {...formItemLayout}
          label="统一社会代码"
          hasFeedback
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true,
              message:'请输入统一社会代码'
            }],
            initialValue:data === undefined ? "":data.code
          })(
            <Input placeholder="请输入统一社会代码" />
          )}
        </FormItem> <FormItem
          {...formItemLayout}
          label="单位名称"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message:'请输入单位名称'
            }],
            initialValue:data === undefined ? "":data.name
          })(
            <Input placeholder="请输入单位名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="单位简介"
          hasFeedback
        >
          {getFieldDecorator('details', {
            rules: [{
              required: true,
            message: '请输入单位简介',
          }],
            initialValue:data === undefined ? "":data.details
          })(
            <TextArea rows={4} placeholder="请输入单位简介" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="单位类型"
          hasFeedback
        >
          {getFieldDecorator('companyType', {
            rules: [{
              required: true,
            message: '请输入单位类型',
          }],
            initialValue:data === undefined ? "":(data.companyType==='0'?"合资":"民营")
          })(
            <Select  style={{ width: 120 }} onChange={this.handleChange} placeholder="请选择">
              <Option value="0">合资</Option>
              <Option value="1">民营</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="注册地址"
          hasFeedback
        >
          {getFieldDecorator('address', {
            rules: [{
              required: true,
              message : "请输入注册地址"
            }],
            initialValue:data === undefined ? "":data.address
          })(
            <Input placeholder="请输入注册地址" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="经营范围"
          hasFeedback
        >
          {getFieldDecorator('scope', {
            rules: [{
              required: true,
              message : "请输入经营范围"
            }],
            initialValue:data === undefined ? "":data.scope
          })(
            <Input placeholder="请输入经营范围" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="法人"
          hasFeedback
        >
          {getFieldDecorator('corporation', {
            rules: [{
              required: true,
              message : "请输入单位法人"
            }],
            initialValue:data === undefined ? "":data.corporation
          })(
            <Input placeholder="请输入单位法人" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系电话"
          hasFeedback
        >
          {getFieldDecorator('phone', {
            rules: [{
              required: true,
              message : "请输入单位联系电话"
            }],
            initialValue:data === undefined ? "":data.phone
          })(
            <Input placeholder="请输入单位联系电话" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="单位状态"
          hasFeedback
        >
          {getFieldDecorator('companyStatus', {
            rules: [{
              required: true,
              message: '请输入单位状态',
            }],
            initialValue:data === undefined ? "":(data.companyStatus==='0'?"合作":"弃用")
          })(
            <Select  style={{ width: 120 }} onChange={this.handleChange} placeholder="请选择">
              <Option value="0">合作</Option>
              <Option value="1">弃用</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 20 }}><Link to='/maintenance/Maintenance'>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}
const AddForm = Form.create()(MaintenanceForm);

function mapStateToProps(state) {
  return {
    initState: state.maintenance.initState,
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
