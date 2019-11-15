/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button,DatePicker,message,Radio,Upload,Icon
} from 'antd';
import { getAuthHeader,getCookie } from '../../../util/auth';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const sso_token = getCookie(getCookie('username'));
const authHeader = getAuthHeader(sso_token);

class NewsForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data
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
          const filedValues = {
            ...values,
            'icon':attachment,
          };
          this.props.dispatch({
            type: 'depManage/saveCompany',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('新增成功！', 1, () => this.props.history.push('/systemManage/unitManage'));
            } else {
              message.error('新增失败！');
            }
          });
        } else {
          const upload = values['attachment'];
          let attachment = "";
          if(typeof(upload) === 'string'){
            attachment = upload;
          }else{
            if(upload && upload[0].status == 'done'){
              attachment = upload[0].response.data;
            }
          }
          const filedValues = {
            ...values,
            'id': this.state.data.id,
            'icon':attachment,
          };
          this.props.dispatch({
            type: 'depManage/updateCompany',
            payload: filedValues,
          }).then(() => {
            if (this.props.initState.code === 0) {
              message.success('修改成功！', 1, () => this.props.history.push('/systemManage/unitManage'));
            } else {
              message.error('修改失败！');
            }
          });
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

  componentDidMount() {
  }


  render() {
    const { data }  = this.state;
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
          label="图标"
        >
          {getFieldDecorator('attachment', {
            getValueFromEvent: this.normFile,
            initialValue:data === undefined? "":data.attachment
          })(
            <Upload
              name="file"
              listType="picture-card"
              className="newsImg-uploader"
              showUploadList={false}
              accept="image/*"
              action="http://192.168.1.19/upload/file"
              headers={authHeader.headers}
              onChange={this.handleChange}
            >
              {imageUrl ? <img style={{ width: '100%' }} src={imageUrl} alt="暂无图片" /> : uploadButton}
            </Upload>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="单位编号"
          hasFeedback
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true,
              message: '请输入单位编号',
            }],
            initialValue:data === undefined ? "":data.code
          })(
            <Input placeholder="请输入单位编号" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="单位名称"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message: '请输入单位名称',
            }],
            initialValue:data === undefined ? "":data.name
          })(
            <Input placeholder="请输入单位名称" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="详情"
          hasFeedback
        >
          {getFieldDecorator('details', {
            rules: [{
              required: true,
              message: '请输入详情',
            }],
            initialValue:data === undefined ? "":data.details
          })(
            <TextArea rows={4} />
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 20 }}><Link to='/systemManage/unitManage'>取消</Link></Button>
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
    initState: state.depManage.initState,
    // saveState:state.news.saveState,
    // updateState:state.news.updateState,
  };
}

export default connect(mapStateToProps)(AddForm);
