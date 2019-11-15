/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button,DatePicker,message,Radio,TreeSelect
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
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
// treeData处理数据
function combinationAreaData(array){
  array.map((item) => {
    item.title = item.projectName;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationAreaData(item.children);
    }
  });
  return array;
}
// treeData处理设备分类数据
function combinationClassData(array){
  array.map((item) => {
    item.title = item.className;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationClassData(item.children);
    }
  });
  return array;
}
class MaintainForm extends Component{
  /**
   * 设备保养
   * @type {{isAdd: *, data: *, userList: Array, organizationName: string, personLiableName: string, applyPersonName: string}}
   */
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    userList:[],
    organizationName:"",
    personLiableName:'',
    maintainPersonName:'',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          const filedValues = {
            ...values,
            'maintainDate': values['maintainDate'].format('YYYY-MM-DD HH:mm:ss'),
            //部门名
            'organizationName':this.state.organizationName,
            //责任人
            'personLiableName':this.state.personLiableName,
            //保养人姓名
            'maintainPersonName':this.state.maintainPersonName,
          }
          this.props.dispatch({
            type: 'equipmentMaintain/saveSmsEquipmentMaintainInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！',1,() => this.props.history.push('/deviceManagement/equipmentLedger'));
            } else {
              message.error('新增失败！');
            }
          });
        }else{
          const filedValues = {
            ...values,
            'id':this.state.data.id,
            'maintainDate': values['maintainDate'].format('YYYY-MM-DD HH:mm:ss'),
            //部门名
            'organizationName':this.state.organizationName,
            //责任人
            'personLiableName':this.state.personLiableName,
            //保养人姓名
            'maintainPersonName':this.state.maintainPersonName,
          };
          this.props.dispatch({
            type: 'equipmentMaintain/updateSmsEquipmentMaintainInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！',1,() => this.props.history.push('/deviceManagement/equipmentLedger'));
            } else {
              message.error('修改失败！');
            }
          });
        }
      }
    });
  };

  componentDidMount() {
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

  onChangeName = (value,label) =>{
    this.setState({
      organizationName:label[0]
    })
  }
  onChangeMaintainOrgName = (value,label) =>{
    this.setState({
      organizationName:label[0]
    })
  }
  onChangePersonName = (value,tag) =>{
    this.setState({
      personLiableName:tag.props.children,
      maintainPersonName:tag.props.children,
    })
  }
  onChangeApplyName = (value,tag) =>{
    this.setState({
      personLiableName:tag.props.children,
      maintainPersonName:tag.props.children,
    })
  }


  render() {
    const { data,userList }  = this.state;
    const { orgList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="设备ID"
          hasFeedback
        >
          {getFieldDecorator('equipmentId', {
            rules: [{
              required: true,
              message: '请输入设备ID',
            }],
            initialValue:data === undefined ? "":data.id
          })(
            <Input placeholder="请输入设备ID" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备编号"
          hasFeedback
        >
          {getFieldDecorator('equipmentCode', {
            rules: [{
              required: true,
              message: '请输入设备编号',
            }],
            initialValue:data === undefined ? "":data.equipmentCode
          })(
            <Input placeholder="请输入设备编号" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备名称"
          hasFeedback
        >
          {getFieldDecorator('equipmentName', {
            rules: [{
              required: true,
              message: '请输入设备名称',
            }],
            initialValue:data === undefined ? "":data.equipmentName
          })(
            <Input placeholder="请输入设备名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备型号"
          hasFeedback
        >
          {getFieldDecorator('equipmentModel', {
            rules: [{
              required: true,
              message: '请输入设备型号',
            }],
            initialValue:data === undefined ? "":data.equipmentModel
          })(
            <Input placeholder="请输入设备型号" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="责任部门"
          hasFeedback
        >
          {getFieldDecorator('organizationId', {
            rules: [
              { required: true,
                message: '请选择责任部门'
              },
            ],
            initialValue:data === undefined ? "":data.organizationId
          })(
            <TreeSelect
              //value={this.state.value}
              allowClear={true}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={this.state.orgList}
              placeholder="请选择上级菜单"
              onChange={this.onChangeName}
              onSelect={this.onSelect}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="责任人"
          hasFeedback
        >
          {getFieldDecorator('personLiableId', {
            rules: [{
              required: true,
              message: '请输入设备责任人',
            }],
            initialValue:data === undefined ? "":data.equipmentPersonLiableId
          })(
            <Select placeholder="请选择责任人" onChange={this.onChangePersonName}>
              {
                userList.map(item => {
                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                })
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="保养部门"
          hasFeedback
        >
          {getFieldDecorator('organizationId1', {
            rules: [
              { required: true,
                message: '请选择保养部门'
              },
            ],
            initialValue:data === undefined ? "":data.organizationId
          })(
            <TreeSelect
              //value={this.state.value}
              allowClear={true}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={this.state.orgList}
              placeholder="请选择保养部门"
              onChange={this.onChangeMaintainOrgName}
              onSelect={this.onSelect}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="保养人"
          hasFeedback
        >
          {getFieldDecorator('maintainPersonId', {
            rules: [{
              required: true,
              message: '请输入设备保养人',
            }],
            initialValue:data === undefined ? "":data.maintainPersonId
          })(
            <Select placeholder="请选择保养人" onChange={this.onChangeApplyName}>
              {
                userList.map(item => {
                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                })
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="保养日期"
        >
          {getFieldDecorator('maintainDate', {
            rules: [{ type: 'object', required: true, message: '维修日期不能为空！' }],
            initialValue:data === undefined ?null:moment(data.maintainDate)
          })(
            <DatePicker showTime format="YYYY-MM-DD" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="备注"
          hasFeedback
        >
          {getFieldDecorator('remark', {
            rules: [{
              message: '请输入备注',
            }],
            initialValue:data === undefined ? "":data.remark
          })(
            <TextArea rows={4} />
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 20 }}><Link to='/deviceManagement/equipmentLedger'>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}
const AddForm = Form.create()(MaintainForm);


function mapStateToProps(state) {
  return {
    initState: state.equipmentMaintain.initState,
    initEquipmentList: state.equipmentMaintain.initEquipmentList,
    saveState:state.equipmentMaintain.saveState,
    updateState:state.equipmentMaintain.updateState,
    orgList:state.equipmentLedger.orgList,
    //绑定返回参数
    userList:state.userManage.userList,
    currentCompany:state.depManage.currentCompany,
  };
}

export default connect(mapStateToProps)(AddForm);
