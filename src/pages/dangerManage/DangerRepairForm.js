/* eslint-disable */
import {Component} from "react";
import {  Form, Select, Input, Button, message, Radio,Upload,Icon,TreeSelect,Switch,Alert} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import { getAuthHeader,getCookie } from '../../util/auth';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const sso_token = getCookie(getCookie('userName'));
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

class DangerRepairForm extends Component{
  state = {
    levelName:'',
    userList:[],
    repairUserName:"",
    repairOrganizationName:"",
    companyName:"",
    fileList: [],
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          const upload = values['attachment'];
          const ids = [];
          if(typeof(upload) === 'string'){
            console.log("未上传附件");
          }else{
            if(upload && upload[0].status == 'done'){
              upload.map(function(item) {
                ids.push(item.response.data.attachmentId);
              })
            }
          }
          const filedValues = {
            ...values,
            'dangerId': this.props.location.state.id,
            'repairOrganizationName': this.state.repairOrganizationName,
            'repairUserName': this.state.repairUserName,
            'attachments':ids,
          };
          this.props.dispatch({
            type: 'dangerManage/saveDangerRepairInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！', 1, () => this.props.history.push({ pathname: '/dangerManage/dangerManage/repairList', state:{dangerStatus:0}}));
            } else {
              message.error('新增失败！');
            }
          });
        }else{
          const upload = values['attachment'];
          const ids = [];
          if(typeof(upload) === 'string'){
            console.log("未上传附件");
          }else{
            if(upload && upload[0].status == 'done'){
              upload.map(function(item) {
                ids.push(item.response.data.attachmentId);
              })
            }
          }
          const filedValues = {
            ...values,
            'id':this.state.data.id,
            'dangerId':this.state.data.dangerId,
            'repairOrganizationName': this.state.data.repairOrganizationName,
            'repairUserName': this.state.data.repairUserName,
            'attachments':ids,
          };
          this.props.dispatch({
            type: 'dangerManage/updateDangerRepairInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！', 1, () => this.props.history.push({ pathname: '/dangerManage/dangerManage/repairList', state:{dangerStatus:0}}));
            } else {
              message.error('修改失败！');
            }
          });
        }
      }
    });
  };

  handleEditorInfo(data){
    this.props.history.push({ pathname: '/planManage/checkItem/add', state: { isAdd:0,data:data } })
  }

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
    });
    //0表示编辑页,1表示新增页
    if (this.state.isAdd === 0){
      this.props.dispatch({
        type:'depManage/queryDangerReviewInfo',
        payload:{
          id:this.props.location.state.data,
        }
      })
    }
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
      repairUserName:tag.props.children
    })
  }
  //选择部门
  onOrganizationChange = (data,label) => {
    this.setState({
      repairOrganizationName:label[0]
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
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  render() {
    const { data,userList,fileList }  = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>);
    return (
      <Form onSubmit={this.handleSubmit}>
        <Alert message="复查人默认为指派人" type="warning" />
        <FormItem
          {...formItemLayout}
          label="整改部门"
          hasFeedback
        >
          {getFieldDecorator('repairOrganizationId', {
            rules: [
              { required: true,
                message: '请选择整改部门'
              },
            ],
             initialValue:data === undefined ? "":data.repairOrganizationId
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
          label="整改人"
          hasFeedback
        >
          {getFieldDecorator('repairUserId', {
            rules: [
              { required: true,
                message: '请选择整改人'
              },
            ],
             initialValue:data === undefined ? "":data.repairUserId
          })(
            <Select
              placeholder="请选择整改人"
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
          {...formItemLayout}
          label="整改期限"
          hasFeedback
        >
          {getFieldDecorator('repairLimit', {
            initialValue:data === undefined ? "":data.repairLimit
          })(
            <Input placeholder="请输入整改期限" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="整改意见"
          hasFeedback
        >
          {getFieldDecorator('repairOpinion', {
             initialValue:data === undefined ? "":data.repairOpinion
          })(
            <TextArea rows={4} placeholder="请输入整改意见" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="整改状态"
          hasFeedback
        >
          {getFieldDecorator('repairStatus', {
            initialValue:data === undefined ? "true":data.repairStatus
          })(
            <Radio.Group defaultValue="true" buttonStyle="solid">
              <Radio.Button value="true">整改完成</Radio.Button>
              <Radio.Button value="false">隐患指派</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="通知整改人"
          hasFeedback
        >
          {getFieldDecorator('isNotice', {
            initialValue:data === undefined ? "":data.isNotice
          })(
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              defaultChecked
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="整改结果"
          hasFeedback
        >
          {getFieldDecorator('repairResult', {
            initialValue:data === undefined ? "":data.repairResult
          })(
            <TextArea rows={4} placeholder="请输入整改结果" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="整改附件"
        >
          {getFieldDecorator('attachment', {
            getValueFromEvent: this.normFile,
            initialValue:data === undefined? "":data.imgHref
          })(
            <Upload
              name="file"
              listType="picture-card"
              className="newsImg-uploader"
              showUploadList={true}
              accept="image/*"
              action="http://192.168.1.19:8080/dico-file/upload/image"
              headers={authHeader.headers}
              onChange={this.handleChange}
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 20 }}><Link to='/dangerManage/dangerManage/repairList'>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}
const AddForm = Form.create()(DangerRepairForm);

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function mapStateToProps(state) {
  return {
    initState: state.dangerManage.initState,
    dangerLevel:state.dangerManage.dangerLevel,
    dangerType:state.dangerManage.dangerType,
    //repair详细信息
    data:state.dangerManage.dangerRepairInfo,
    //部门列表
    orgList:state.equipmentLedger.orgList,
    //当前公司
    currentCompany:state.depManage.currentCompany,
    //设备区域
    initAreaList:state.areaFunction.initAreaList,
    //公司列表
    companyListArray:state.depManage.companyListArray,
    //公司部门
    initCompanyOrganizationsList:state.depManage.initCompanyOrganizationsList,
    //用户列表
    userList:state.userManage.userList,

  };
}

export default connect(mapStateToProps)(AddForm);
