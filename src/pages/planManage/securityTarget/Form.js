/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button, DatePicker, message, Radio, Upload, Icon, TreeSelect, Table, Modal, Divider,
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import moment from 'moment';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;


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

class PlanForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    companyId:'',
    companyName:'',
    visible: false,
    userList:[],
    personLiableName:'',
    organzationName:this.props.location.state.data === undefined ? '':this.props.location.state.data.organzationName,
    //设备IDS
    equipmentIds:''
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          const filedValues = {
            ...values,
            'companyId':this.state.companyId,
            'companyName':this.state.companyName,
            'runCycleName':"每日",
          };
          this.props.dispatch({
            type: 'securityTarget/saveSecurityTarget',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！', 1, () => this.props.history.push('/planManage/securityTarget'));
            } else {
              message.error('新增失败！');
            }
          });
        } else {
          const filedValues = {
            ...values,
            'id':this.state.data.id,
            'companyId':this.state.companyId,
            'companyName':this.state.companyName,
            'runCycleName':"每日",
          };
          this.props.dispatch({
            type: 'securityTarget/updateSecurityTarget',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！', 1, () => this.props.history.push('/planManage/securityTarget'));
            } else {
              message.error('修改失败！');
            }
          });
        }
      }
    });
  };

  componentDidMount() {
    // 查询单位列表
    this.props.dispatch({
      type: 'depManage/queryCompanyListArray',
      payload: {
        name:'',
        pageNum:0
      },
    });
    // 查询单位列表
    this.props.dispatch({
      type: 'depManage/getCurrentCompany',
      payload: {},
    }).then(() => {
      this.setState({
        companyId:this.props.currentCompany.id,
        companyName:this.props.currentCompany.name
      })
    })
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
    //查设备列表
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        pageNum:0,
      },
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
    this.setState({
      personLiableName:tag.props.children
    })
  }
  //选择部门
  onOrganzationChange = (data,label) => {
    this.setState({
      organzationName:label[0]
    })
  }
  handleInspectionItem(){
    this.setState({
      visible: true,
    });
  }

  handleEquipmentSearch(){

  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { data,userList }  = this.state;
    const { orgList, companyListArray} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          equipmentIds:selectedRowKeys
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="目标编码"
            hasFeedback
          >
            {getFieldDecorator('targetCode', {
              rules: [{
                required: true,
              }],
              initialValue:data === undefined ? "":data.targetCode
            })(
              <Input placeholder="请输入目标编码" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="目标名称"
            hasFeedback
          >
            {getFieldDecorator('targetName', {
              rules: [{
                required: true,
              }],
              initialValue:data === undefined ? "":data.targetName
            })(
              <Input placeholder="请输入目标名称" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="目标周期"
          >
            {getFieldDecorator('runCycleId', {
              rules: [
                { required: true,
                  message: '请选择目标周期'
                },
              ],
              initialValue:data === undefined ? 0:Number(data.runCycleId )
            })(
              <RadioGroup onChange={this.onChange}>
                <Radio value={0}>每日</Radio>
                <Radio value={1}>每周</Radio>
                <Radio value={2}>每月</Radio>
                <Radio value={3}>每季</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="指标类型"
          >
            {getFieldDecorator('targetType', {
              rules: [
                { required: true,
                  message: '请选择指标类型'
                },
              ],
              initialValue:data === undefined ? 0:Number(data.targetType )
            })(
              <RadioGroup onChange={this.onChange}>
                <Radio value={0}>目标</Radio>
                <Radio value={1}>指标</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="所属单位"
            hasFeedback
          >
            {getFieldDecorator('companyId', {
              rules: [
                { required: true,
                  message: '请选择所属单位'
                },
              ],
              initialValue:data === undefined ? "":data.companyId
            })(
              <Select
                placeholder="请选择单位"
                onChange={this.handleUnitChange}
              >
                {
                  companyListArray.map((item) => {
                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                  })
                }
              </Select>
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

          <FormItem   wrapperCol={{ span: 12, offset: 6 }}   >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{ marginLeft: 20 }}><Link to='/planManage/patrolPlan'>取消</Link></Button>
          </FormItem>
        </Form>

      </div>
    )
  }
}
const AddForm = Form.create()(PlanForm);


function mapStateToProps(state) {
  return {
    initState: state.securityTarget.initState,
    //公司列表
    companyListArray:state.depManage.companyListArray,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //用户列表
    userList:state.userManage.userList,
  };
}

export default connect(mapStateToProps)(AddForm);
