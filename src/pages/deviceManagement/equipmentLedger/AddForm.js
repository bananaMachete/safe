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
class NewsForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    userList:[],
    initAreaList:[],
    equipmentPersonLiableName:"",
    initEquipmentClass:[],
    companyName:this.props.location.state.data === undefined ? '':this.props.location.state.data.companyName,
    organizationName:this.props.location.state.data === undefined ? '':this.props.location.state.data.organizationName,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          //新增
          const filedValues = {
            ...values,
            //生产日期
            'equipmentManufactureTime': values['equipmentManufactureTime'].format('YYYY-MM-DD HH:mm:ss'),
            'nextRepairTime': values['nextRepairTime'].format('YYYY-MM-DD HH:mm:ss'),
            //报废日期
            'scrapTime': values['scrapTime'].format('YYYY-MM-DD'),
            'organizationName':this.state.organizationName,//责任部门
            'equipmentPersonLiableName':this.state.equipmentPersonLiableName,
            'companyName': this.state.companyName,
          };
          this.props.dispatch({
            type: 'equipmentLedger/saveSmsEquipmentBaseInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！',1,() => this.props.history.push('/deviceManagement/equipmentLedger'));
            } else {
              message.error('新增失败！'+this.props.initState.msg);
            }
          });
        }else{
          //编辑
          const filedValues = {
            ...values,
            'id':this.state.data.id,
            //生产日期
            'equipmentManufactureTime': values['equipmentManufactureTime'].format('YYYY-MM-DD'),
            'nextRepairTime': values['nextRepairTime'].format('YYYY-MM-DD HH:mm:ss'),
            //报废日期
            'scrapTime': values['scrapTime'].format('YYYY-MM-DD'),
            'companyName':this.state.companyName,
            'organizationName':this.state.organizationName,//责任部门
            'equipmentPersonLiableName':this.state.equipmentPersonLiableName,
          };
          this.props.dispatch({
            type: 'equipmentLedger/updateSmsEquipmentBaseInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！',1,() => this.props.history.push('/deviceManagement/equipmentLedger'));
            } else {
              message.error('修改失败！'+this.props.initState.msg);
            }
          });
        }
      }
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'news/queryTypeList',
    });
    if(this.state.isAdd === 0){

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
      payload: {
      },
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
    //查设备分类
    this.props.dispatch({
      type: 'equipmentLedger/getEquipmentClass',
      payload:{
      }
    }).then(() => {
      const treeDate = this.props.initEquipmentClass;
      console.log(treeDate);
      this.setState({
        initEquipmentClass:combinationClassData(treeDate),
      });
      //查安装位置
      this.props.dispatch({
        type: 'areaFunction/querySmsAreaList',
        payload:{
          projectCode:'',
          projectName:'',
          projectStatus:'',
        }
      }).then(() => {
        const treeDate = this.props.initAreaList;
        console.log(treeDate)
        this.setState({
          initAreaList:combinationAreaData(treeDate),
        })
      })
    })


  }
  handleUnitChange = (value,option) => {
    this.setState({
      companyName:option.props.children
    });
    this.props.dispatch({
      type: 'equipmentLedger/getOrganization',
      payload:{
        id:value
      }
    }).then(() => {
      const treeDate = this.props.orgList;
      this.setState({
        orgList:combinationData(treeDate),
      })
    })
  }
  //选择部门
  onOrganzationChange = (data,label) => {
    this.setState({
      organizationName:label[0]
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
      equipmentPersonLiableName:tag.props.children
    })
  }

  render() {
    const { data,userList }  = this.state;
    const { getFieldDecorator } = this.props.form;
    const { companyListArray } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
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
          label="设备分类"
          hasFeedback
        >
          {getFieldDecorator('equipmentType', {
            rules: [
              { required: true,
                message: '请选择设备分类'
              },
            ],
            initialValue:data === undefined ? "":data.equipmentType
          })(
            <TreeSelect
              //value={this.state.value}
              allowClear={true}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={this.state.initEquipmentClass}
              placeholder="请选择设备分类"
              onChange={this.onChange}
              onSelect={this.onSelect}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="设备状态"
        >
          {getFieldDecorator('equipmentStatus', {
            initialValue:data === undefined ? 0:Number(data.equipmentStatus)
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={1}>正常</Radio>
              <Radio value={0}>故障</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="生产厂家"
          hasFeedback
        >
          {getFieldDecorator('equipmentManufacturer', {
            rules: [{
              required: false,
              message: '请输入生产厂家',
            }],
            initialValue:data === undefined ? "":data.equipmentManufacturer
          })(
            <Input placeholder="请输入生产厂家" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="生产日期"
        >
          {getFieldDecorator('equipmentManufactureTime', {
            rules: [{ type: 'object', required: true, message: '生产日期不能为空！' }],
            initialValue:data === undefined ?null:moment(data.equipmentManufactureTime)
          })(
            <DatePicker showTime format="YYYY-MM-DD" />
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
          label="维保单位"
          hasFeedback
        >
          {getFieldDecorator('companyId', {
            rules: [
              { required: true,
                message: '请选择维保单位'
              },
            ],
            initialValue:data === undefined ? "":data.companyId
          })(
            <Select
              placeholder="请选择维保单位"
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
              onChange={this.onOrganzationChange}
              onSelect={this.onSelect}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="责任人"
          hasFeedback
        >
          {getFieldDecorator('equipmentPersonLiableId', {
            rules: [{
              required: true,
              message: '请输入设备责任人',
            }],
            initialValue:data === undefined ? "":data.equipmentPersonLiableId
          })(
            <Select placeholder="请选择责任人" onChange={this.onChangeName}>
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
          {getFieldDecorator('nextRepairTime', {
            rules: [{ type: 'object', required: true, message: '保养日期不能为空！' }],
            initialValue:data === undefined ?null:moment(data.nextRepairTime)
          })(
            <DatePicker showTime format="YYYY-MM-DD" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="安装区域"
          hasFeedback
        >
          {getFieldDecorator('installArea', {
            rules: [
              { required: true,
                message: '请选择安装区域'
              },
            ],
            initialValue:data === undefined ? "":data.installArea
          })(
              <TreeSelect
                // value={this.state.value}
                allowClear={true}
                dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                treeData={this.state.initAreaList}
                placeholder="请选择上级菜单"
                onChange={this.onChange}
                onSelect={this.onSelect}
              />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="报废日期"
        >
          {getFieldDecorator('scrapTime', {
            rules: [{ type: 'object', required: true, message: '报废日期不能为空！' }],
            initialValue:data === undefined ?null:moment(data.scrapTime)
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
const AddForm = Form.create()(NewsForm);


function mapStateToProps(state) {
  return {
    initState: state.equipmentLedger.initState,
    initEquipmentList: state.equipmentLedger.initEquipmentList,
    orgList:state.equipmentLedger.orgList,
    //绑定返回参数
    userList:state.userManage.userList,
    //绑定返回参数
    initAreaList:state.areaFunction.initAreaList,
    //绑定返回参数
    initEquipmentClass:state.equipmentLedger.initEquipmentClass,
    currentCompany:state.depManage.currentCompany,
    //公司列表
    companyListArray:state.depManage.companyListArray,
  };
}

export default connect(mapStateToProps)(AddForm);
