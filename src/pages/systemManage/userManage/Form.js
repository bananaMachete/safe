/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button, DatePicker, message, Radio, Upload, Icon, TreeSelect,
} from 'antd';
import { getAuthHeader,getCookie } from '../../../util/auth';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
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

class NewsForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    temporary:this.props.location.state.data === undefined ? false:this.props.location.state.data.temporary,
    treeData:[],
    organizationName:this.props.location.state.data === undefined ? '':this.props.location.state.data.organizationName,
    companyName:this.props.location.state.data === undefined ? '':this.props.location.state.data.companyName,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 1) {
          const upload = values['attachment'];
          let attachment = "";
          if(upload && upload[0].status == 'done'){
            attachment = upload[0].response.data;
          }
          console.log(attachment);
          if(this.state.temporary === false){
            const filedValues = {
              ...values,
              'imgHref':attachment.attachmentHref,
              'organizationName':this.state.organizationName,
              'companyName':this.state.companyName,
              'attachmentId': attachment.attachmentId,
            };
            delete filedValues.attachment;
            delete filedValues.allowLoginDate;
            console.log(filedValues);
            this.props.dispatch({
              type: 'userManage/saveUser',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('新增成功！', 1, () => this.props.history.push('/systemManage/userManage'));
              } else {
                message.error('新增失败！' + this.props.initState.msg);
              }
            });
          }else{
            const allowLoginDate = values['allowLoginDate'];
            const allowBeginLoginDate = allowLoginDate[0].format('YYYY-MM-DD HH:mm:ss');
            const allowEndLoginDate = allowLoginDate[1].format('YYYY-MM-DD HH:mm:ss');
            const filedValues = {
              ...values,
              'imgHref':attachment.attachmentHref,
              'allowBeginLoginDate':allowBeginLoginDate,
              'allowEndLoginDate':allowEndLoginDate,
              'organizationName':this.state.organizationName,
              'companyName':this.state.companyName,
            };
            delete filedValues.allowLoginDate;
            delete filedValues.attachment;
            this.props.dispatch({
              type: 'userManage/saveUser',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('新增成功！', 1, () => this.props.history.push('/systemManage/userManage'));
              } else {
                message.error('新增失败！');
              }
            });
          }
        } else {
          const upload = values['attachment'];
          let attachment = "";
          if(upload && upload[0].status == 'done'){
            attachment = upload[0].response.data;
          }
          if(this.state.temporary === false){
            const filedValues = {
              ...values,
              'imgHref':attachment.attachmentHref,
              'id':this.state.data.id,
              'organizationName':this.state.organizationName,
              'companyName':this.state.companyName,
              'attachmentId': attachment.attachmentId,
            };
            delete filedValues.attachment;
            delete filedValues.allowLoginDate;
            this.props.dispatch({
              type: 'userManage/updateUser',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('修改成功！', 1, () => this.props.history.push('/systemManage/userManage'));
              } else {
                message.error('修改失败！');
              }
            });
          }else{
            const allowLoginDate = values['allowLoginDate'];
            const allowBeginLoginDate = allowLoginDate[0].format('YYYY-MM-DD HH:mm:ss');
            const allowEndLoginDate = allowLoginDate[1].format('YYYY-MM-DD HH:mm:ss');
            const filedValues = {
              ...values,
              'imgHref':attachment.attachmentHref,
              'id':this.state.data.id,
              'allowBeginLoginDate':allowBeginLoginDate,
              'allowEndLoginDate':allowEndLoginDate,
              'organizationName':this.state.organizationName,
              'companyName':this.state.companyName,
            };
            delete filedValues.allowLoginDate;
            delete filedValues.attachment;
            this.props.dispatch({
              type: 'userManage/updateUser',
              payload: filedValues,
            }).then(() => {
              if (this.props.initState.code === 0) {
                message.success('修改成功！', 1, () => this.props.history.push('/systemManage/userManage'));
              } else {
                message.error('修改失败！');
              }
            });
          }
        }
      }
    });
  };

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

  normFile = (e) => {
    const fileList = e.fileList.slice(-1);
    return fileList;
  };

  onTemporaryChange = (data) =>{
    this.setState({
      temporary:data.target.value
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
  componentDidMount() {
    // 查询单位列表
    this.props.dispatch({
      type: 'depManage/queryCompanyListArray',
      payload: {
        name:'',
        pageNum:0
      },
    });
    if(this.state.data){
      this.props.dispatch({
        type: 'depManage/getOrganizationsById',
        payload: {
          id:this.state.data.companyId
        },
      }).then(() => {
        const treeDate = this.props.initCompanyOrganizationsList;
        this.setState({
          treeData:combinationData(treeDate),
        })
      })
    }
  }

  onOrganizationChange = (data,label) => {
    this.setState({
      organizationName:label[0]
    })
  }

  render() {
    const { data }  = this.state;
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
          label="姓名"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message: '请输入姓名',
            }],
            initialValue:data === undefined ? "":data.name
          })(
            <Input placeholder="请输入姓名" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="岗位"
          hasFeedback
        >
          {getFieldDecorator('post', {
            rules: [{
              required: true,
              message: '岗位',
            }],
            initialValue:data === undefined ? "":data.post
          })(
            <Input placeholder="请输入岗位" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="职位"
          hasFeedback
        >
          {getFieldDecorator('position', {
            rules: [{
              required: true,
              message: '请输入姓名',
            }],
            initialValue:data === undefined ? "":data.position
          })(
            <Input placeholder="请输入姓名" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="联系电话"
          hasFeedback
        >
          {getFieldDecorator('phoneNum', {
            rules: [{
              required: true,
              message: '请输入联系电话',
            }],
            initialValue:data === undefined ? "":data.phoneNum
          })(
            <Input placeholder="请输入联系电话" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="用户类型"
        >
          {getFieldDecorator('temporary', {
            rules: [
              { required: true,
                message: '请选择用户类型'
              },
            ],
            initialValue:data === undefined ? false:data.temporary
          })(
            <RadioGroup onChange={this.onTemporaryChange}>
              <Radio value={true}>临时用户</Radio>
              <Radio value={false}>系统用户</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="账号状态"
        >
          {getFieldDecorator('enable', {
            rules: [
              { required: true,
                message: '请选择账号状态'
              },
            ],
            initialValue:data === undefined ? true:data.enable
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>启用</Radio>
              <Radio value={false}>禁用</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="头像"
        >
          {getFieldDecorator('attachment', {
            getValueFromEvent: this.normFile,
            initialValue:data === undefined? "":data.imgHref
          })(
            <Upload
              name="file"
              listType="picture-card"
              className="newsImg-uploader"
              showUploadList={false}
              accept="image/*"
              action="http://192.168.1.19:8080/dico-file/upload/image"
              headers={authHeader.headers}
              onChange={this.handleChange}
            >
              {imageUrl ? <img style={{ width: '100%' }} src={imageUrl} alt="暂无图片" /> : uploadButton}
            </Upload>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="用户名"
          hasFeedback
        >
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              min:6,
              max:20,
              message: '用户名长度应在6-20之间',
            }],
            initialValue:data === undefined ? "":data.username
          })(
            <Input placeholder="请输入用户名" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              min:6,
              message: '密码长度应大于6位',
            }],
            initialValue:data === undefined ? "":data.password
          })(
            <Input type="password" />
          )}
        </FormItem>
        {
          this.state.temporary === false ? "":
            <FormItem
              {...formItemLayout}
              label="允许登录起止时间"
            >
              {getFieldDecorator('allowLoginDate', {
                rules: [{ required: true, message: '允许登录起止时间！' }],
                initialValue:data === undefined ? null:data.allowBeginLoginDate === null ? null : data.allowEndLoginDate === null ? null : [moment(data.allowBeginLoginDate),moment(data.allowEndLoginDate)]
              })(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
        }

        <FormItem
          {...formItemLayout}
          label="所在单位"
          hasFeedback
        >
          {getFieldDecorator('companyId', {
            rules: [
              { required: true,
                message: '请选择单位'
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
          label="所属部门"
          hasFeedback
        >
          {getFieldDecorator('organizationId', {
            rules: [
              { required: true,
                message: '请选择所属部门'
              },
            ],
            initialValue:data === undefined ? "":data.organizationId
          })(
            <TreeSelect
              // value={this.state.value}
              allowClear={true}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={this.state.treeData}
              placeholder="请选择所属部门"
              onChange={this.onOrganizationChange}
            />
          )}
        </FormItem>


        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 20 }}><Link to='/systemManage/userManage'>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}
const AddForm = Form.create()(NewsForm);

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function mapStateToProps(state) {
  return {
    initState: state.userManage.initState,
    companyListArray:state.depManage.companyListArray,
    initCompanyOrganizationsList:state.depManage.initCompanyOrganizationsList,
  };
}

export default connect(mapStateToProps)(AddForm);
