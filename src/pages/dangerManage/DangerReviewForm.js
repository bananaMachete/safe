/* eslint-disable */
import {Component} from "react";
import {  Form, Select, Input, Button, message, Radio,Upload,Icon,TreeSelect } from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import { getAuthHeader, getCookie } from '@/util/auth';

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
class DangerReviewForm extends Component{
  state = {
    levelName:'',
    userList:[],
    reviewUserName:"",
    reviewOrganizationName:"",
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
            'reviewOrganizationName':this.state.reviewOrganizationName,
            'reviewUserName':this.state.reviewUserName,
            'attachments':ids,
          };
          this.props.dispatch({
            type: 'dangerManage/saveDangerReviewInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！', 1, () => this.props.history.push({ pathname: '/dangerManage/dangerManage/reviewList', state:{dangerStatus:0}}));
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
            'reviewOrganizationName':this.state.reviewOrganizationName,
            'reviewUserName':this.state.reviewUserName,
            'attachments':ids,
          };
          this.props.dispatch({
            type: 'dangerManage/updateDangerReviewInfo',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！', 1, () => this.props.history.push({ pathname: '/dangerManage/dangerManage/reviewList', state:{dangerStatus:0}}));
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
    this.setState({
      reviewUserName:tag.props.children
    })
  }
  //选择部门
  onOrganzationChange = (data,label) => {
    this.setState({
      reviewOrganizationName:label[0]
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


        <FormItem
          {...formItemLayout}
          label="复查部门"
          hasFeedback
        >
          {getFieldDecorator('reviewOrganizationId', {
            rules: [
              { required: true,
                message: '请选择复查部门'
              },
            ],
             initialValue:data === undefined ? "":data.reviewOrganizationId
          })(
            <TreeSelect
              //value={this.state.value}
              allowClear={true}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={this.state.orgList}
              placeholder="请选择复查部门"
              onChange={this.onOrganzationChange}
              onSelect={this.onSelect}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="复查人"
          hasFeedback
        >
          {getFieldDecorator('reviewUserId', {
            rules: [
              { required: true,
                message: '请选择复查人'
              },
            ],
             initialValue:data === undefined ? "":data.reviewUserId
          })(
            <Select
              placeholder="请选择复查人"
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
          label="复查状态"
          hasFeedback
        >
          {getFieldDecorator('reviewStatus', {
            initialValue:data === undefined ? "true":data.reviewStatus
          })(
            <Radio.Group defaultValue="true" buttonStyle="solid">
              <Radio.Button value="true">通过</Radio.Button>
              <Radio.Button value="false">不通过</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="复查结果"
          hasFeedback
        >
          {getFieldDecorator('reviewResult', {
             initialValue:data === undefined ? "":data.reviewResult
          })(
            <TextArea rows={4} placeholder="请输入复查结果" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="复查附件"
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
const AddForm = Form.create()(DangerReviewForm);

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
