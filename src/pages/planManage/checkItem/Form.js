/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button, DatePicker, message, Radio, Upload, Icon, TreeSelect, Table, Modal, Divider,
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import moment from 'moment';
import router from 'umi/router';

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

class ItemForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    companyId:'',
    companyName:'',
    visible: false,
    runCycleName:'每日',
    initEquipmentClass:[],
    equipmentClassName:"",//分类名称
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
              'runCycleName':this.state.runCycleName,
              'equipmentClassName':this.state.equipmentClassName,
            };
            console.log(filedValues);
            this.props.dispatch({
              type: 'checkItem/saveInspectionTarget',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('新增成功！', 1, () => this.props.history.push('/planManage/checkItem'));
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
              'runCycleName':this.state.runCycleName,
              'equipmentClassName':this.state.equipmentClassName,
            };
            this.props.dispatch({
              type: 'checkItem/updateInspectionTarget',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('修改成功！', 1, () => this.props.history.push('/planManage/checkItem'));
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
    //查部门
    this.props.dispatch({
      type: 'depManage/getCurrentCompany',
    }).then(() => {
      this.setState({
        companyId:this.props.currentCompany.id,
        companyName:this.props.currentCompany.name
      })
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
    //查设备分类
    this.props.dispatch({
      type: 'equipmentLedger/getEquipmentClass',
    }).then(() => {
      const treeDate = this.props.initEquipmentClass;
      this.setState({
        initEquipmentClass:combinationClassData(treeDate),
      })
    })
  }
  handleUnitChange = (value,option) => {
    this.setState({
      companyName:option.props.children
    });
  };

  onChangeCycle = e => {
    let cycleName = this.generate(e.target.value);
    this.setState({
      runCycleName: cycleName,
    });
  };

  //选择项目
  onChangeEquipmentClass = (data,label) => {
    this.setState({
      equipmentClassName:label[0]
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  generate =(num) =>{
    switch (num) {
      case 0:
        return '每日'
      case 1:
        return '每周'
      case 2:
        return '每月'
      case 3:
        return '每季度'
      default :
        return '每日'
    }
  }

  render() {
    const { data }  = this.state;
    const { companyListArray } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="标准编号"
            hasFeedback
          >
            {getFieldDecorator('targetCode', {
              rules: [{
                required: true,
              }],
              initialValue:data === undefined ? "":data.targetCode
            })(
              <Input placeholder="请输入标准编号" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="标准名称"
            hasFeedback
          >
            {getFieldDecorator('targetName', {
              rules: [{
                required: true,
              }],
              initialValue:data === undefined ? "":data.targetName
            })(
              <Input placeholder="请输入标准名称" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="标准周期"
          >
            {getFieldDecorator('runCycleId', {
              rules: [
                { required: true,
                  message: '请选择标准周期'
                },
              ],
              initialValue:data === undefined ? 0:Number(data.runCycleId)
            })(
              <RadioGroup onChange={this.onChangeCycle}>
                <Radio.Button value={0}>每日</Radio.Button>
                <Radio.Button value={1}>每周</Radio.Button>
                <Radio.Button value={2}>每月</Radio.Button>
                <Radio.Button value={3}>每季度</Radio.Button>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所属分类"
            hasFeedback
          >
            {getFieldDecorator('equipmentClassId', {
              rules: [
                { required: true,
                  message: '请选择所属分类'
                },
              ],
              initialValue:data === undefined ? "":data.equipmentClassId
            })(
              <TreeSelect
                //value={this.state.value}
                allowClear={true}
                dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                treeData={this.state.initEquipmentClass}
                placeholder="请选择所属分类"
                onChange={this.onChangeEquipmentClass}
                onSelect={this.onSelect}
              />
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
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{ marginLeft: 20 }}><Link to='/planManage/checkItem'>取消</Link></Button>
          </FormItem>
        </Form>

      </div>
    )
  }
}
const AddForm = Form.create()(ItemForm);


function mapStateToProps(state) {
  return {
    initState: state.checkItem.initState,
    initEquipmentList: state.equipmentLedger.initEquipmentList,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //用户列表
    userList:state.userManage.userList,
    //公司列表
    companyListArray:state.depManage.companyListArray,
    //绑定返回参数
    initEquipmentClass:state.equipmentLedger.initEquipmentClass,
  };
}

export default connect(mapStateToProps)(AddForm);
