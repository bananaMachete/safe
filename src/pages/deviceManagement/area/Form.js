/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button,DatePicker,message,Radio,TreeSelect,Upload,Modal,Icon
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import moment from 'moment';
import { getAuthHeader, getCookie } from '@/util/auth';
const sso_token = getCookie(getCookie('userName'));
const authHeader = getAuthHeader(sso_token);

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
// treeData处理上级项目数据
function combinationClassData(array){
  array.map((item) => {
    item.title = item.projectName;
    item.value = item.id;
    item.key = item.id;
    if(item.children){
      combinationClassData(item.children);
    }
  });
  return array;
}
class AreaForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    userList:[],
    initEquipmentClass:[],
    initAreaList:[],
    securityPersonLiableName:"",
    organizationName:this.props.location.state.data === undefined ? '':this.props.location.state.data.organizationName,
    companyName:this.props.location.state.data === undefined ? '':this.props.location.state.data.companyName,
    parentProject:"",
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {//表单没错的时候
        if (this.state.isAdd === 1) {
          const upload = values['ichnography'];
          console.log(upload);
          let attachment = "";
          if(upload && upload[0].status == 'done'){
            attachment = upload[0].response.data;
          }
          console.log(attachment);
          //新增
          const filedValues = {
            ...values,
            'projectFinishDate': values['projectFinishDate'].format('YYYY-MM-DD HH:mm:ss'),
            'projectStatus': values['projectStatus'].toString(),
            'securityPersonLiableName': this.state.securityPersonLiableName,
            'liableOrganizationName': this.state.organizationName,//责任部门
            'companyName': this.state.companyName,
            'ichnography': attachment.attachmentId
          };
          this.props.dispatch({
            type: 'areaFunction/saveSmsAreaInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！',1,() => this.props.history.push('/deviceManagement/area'));
            } else {
              message.error('新增失败！');
            }
          });
        }else{
          //编辑
          const filedValues = {
            ...values,
            'id':this.state.data.id,
            'projectFinishDate': values['projectFinishDate'].format('YYYY-MM-DD HH:mm:ss'),
            'projectStatus': values['projectStatus'].toString(),
            'securityPersonLiableName':this.state.securityPersonLiableName,
            'liableOrganizationName':this.state.organizationName,//责任部门
            'companyName':this.state.companyName,
          };
          this.props.dispatch({
            type: 'areaFunction/updateSmsAreaInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！',1,() => this.props.history.push('/deviceManagement/area'));
            } else {
              message.error('修改失败！');
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
    //查区域信息
    this.props.dispatch({
      type: 'areaFunction/querySmsAreaList',
    }).then(() => {
      const treeDate = this.props.initAreaList;
      this.setState({
        initAreaList:combinationClassData(treeDate),
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
    this.setState({
      securityPersonLiableName:tag.props.children
    })
  }
  //选择部门
  onOrganizationChange = (data,label) => {
    this.setState({
      organizationName:label[0]
    })
  }
  //选择项目
  onProjectChange = (data,label) => {
    this.setState({
      parentProject:label[0]
    })
  }
  handleUnitChange = (value,option) => {
    this.setState({
      companyName:option.props.children
    });
    this.props.dispatch({
      type: 'depManage/getOrganizationsById',
      payload: {
        id:value
      },
    }).then(() => {
      const treeDate = this.props.initCompanyOrganizationsList;

      this.setState({
        treeData:combinationData(treeDate),
      })
    })
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, ichnography => this.setState({
        ichnography,
        loading: false,
      }));
    }
  }
  render() {
    const { data,userList,previewVisible,previewImage,fileList }  = this.state;
    const { companyListArray } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const imageUrl = this.state.isAdd === 1 ? this.state.imageUrl:(this.state.imageUrl === undefined ? "http://192.168.1.19/" + this.state.data.icon : this.state.imageUrl);
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="项目编号"
          hasFeedback
        >
          {getFieldDecorator('projectCode', {
            rules: [{
              required: true,
              message: '请输入项目编号',
            }],
            initialValue:data === undefined ? "":data.projectCode
          })(
            <Input placeholder="请输入项目编号" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="项目名称"
          hasFeedback
        >
          {getFieldDecorator('projectName', {
            rules: [{
              required: true,
              message: '请输入项目名称',
            }],
            initialValue:data === undefined ? "":data.projectName
          })(
            <Input placeholder="请输入项目名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="上级项目"
        >
          {getFieldDecorator('parentProject', {
            initialValue:data === undefined ? "":data.parentProject
          })(
            <TreeSelect
              //value={this.state.value}
              allowClear={true}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={this.state.initAreaList}
              placeholder="请选择上级菜单"
              onChange={this.onProjectChange}
              onSelect={this.onSelect}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="项目状态"
        >
          {getFieldDecorator('projectStatus', {
            initialValue:data === undefined ? 0:data.projectStatus
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={1}>建成</Radio>
              <Radio value={0}>在建</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="交付日期"
        >
          {getFieldDecorator('projectFinishDate', {
            rules: [{ type: 'object', required: true, message: '交付日期不能为空！' }],
            initialValue:data === undefined ?null:moment(data.projectFinishDate)
          })(
            <DatePicker showTime format="YYYY-MM-DD" />
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
          label="责任部门"
          hasFeedback
        >
          {getFieldDecorator('liableOrganizationId', {
            rules: [
              { required: true,
                message: '请选择责任部门'
              },
            ],
            initialValue:data === undefined ? "":data.liableOrganizationId
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
          label="责任人"
          hasFeedback
        >
          {getFieldDecorator('securityPersonLiableId', {
            rules: [{
              required: true,
              message: '请选择责任人',
            }],
            initialValue:data === undefined ? "":data.securityPersonLiableId
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
          label="联系电话"
          hasFeedback
        >
          {getFieldDecorator('personLiableTelephone', {
            rules: [{
              required: true,
              message: '请输入联系电话',
            }],
            initialValue:data === undefined ? "":data.personLiableTelephone
          })(
            <Input placeholder="请输入联系电话" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="区域图"
        >
          {getFieldDecorator('ichnography', {
            getValueFromEvent: this.normFile,
            initialValue:data === undefined? "":data.ichnography
          })(
            <Upload
              name="file"
              listType="picture-card"
              className="newsImg-uploader"
              showUploadList={true}
              accept="image/*"
              action="http://192.168.1.19:8080/dico-file/upload/image"
              headers={authHeader.headers}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
          )}
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
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
          <Button style={{ marginLeft: 20 }}><Link to='/deviceManagement/area'>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}
const AddForm = Form.create()(AreaForm);

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function mapStateToProps(state) {
  return {
    initState: state.areaFunction.initState,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //用户列表
    userList:state.userManage.userList,
    //设备区域
    initAreaList:state.areaFunction.initAreaList,
    //公司列表
    companyListArray:state.depManage.companyListArray,
    //公司部门
    initCompanyOrganizationsList:state.depManage.initCompanyOrganizationsList,
  };
}

export default connect(mapStateToProps)(AddForm);
