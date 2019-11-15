/* eslint-disable */
import {Component} from "react";
import {
  Form, Select, Input, Button, message, Radio,Icon,Upload,Modal
} from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import React from "react";
import { getAuthHeader, getCookie } from '@/util/auth';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const sso_token = getCookie(getCookie('userName'));
const authHeader = getAuthHeader(sso_token);



class DangerForm extends Component{
  state = {
    isAdd:this.props.location.state.isAdd,
    data:this.props.location.state.data,
    levelName:'',
    TypeName:'',
    fileList: [],
    previewVisible: false,
    previewImage: '',
    equipmentName:'',//设备名
    initEquipmentList:[],

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
      if (!err) {
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
          'dangerLevelName':this.state.levelName,
          'dangerTypeName':this.state.TypeName,
          'equipmentName':this.state.equipmentName,
          'attachments':ids,
        };
        this.props.dispatch({
          type: 'dangerManage/saveDangerInfo',
          payload: filedValues,
        }).then(() => {
          if (this.props.initState.code === 0) {
            message.success('新增成功！', 1, () => this.props.history.push('/dangerManage/DangerManage'));
          } else {
            message.error('新增失败！');
          }
        });
      }
    });
  };


  handleLevelChange = (value,option) => {
    this.setState({
      levelName:option.props.children
    });
  }
  handleTypeChange = (value,option) => {
    this.setState({
      TypeName:option.props.children
    });
  }
  handleEquipment = (value,option) => {
    this.setState({
      equipmentName:option.props.children
    });
  }
  componentDidMount() {
    // 查询隐患级别列表
    this.props.dispatch({
      type: 'dangerManage/queryDangerLevel',
      payload: {
        typeId:'1',
        name:''
      },
    }).then(()=>{
      // 查询隐患类型列表
      this.props.dispatch({
        type: 'dangerManage/queryDangerType',
        payload: {
          typeId:'2',
          name:''
        },
      });
    });
    //查询设备列表
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        installArea:'',
        equipmentCode:'',
        equipmentName:'',
        equipmentStatus:'',
        scrapTime:'',
        equipmentType:'',
        pageNum:0,
      },
    }).then(() =>{
      const equipmentList = this.props.initEquipmentList.content;
      this.setState({
        initEquipmentList:equipmentList
      });
    });
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
    const { data,previewVisible, previewImage,initEquipmentList, fileList}  = this.state;
    const { dangerLevel,dangerType } = this.props;
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
          label="隐患地址"
          hasFeedback
        >
          {getFieldDecorator('dangerAddress', {
            rules: [{
              required: true,
              message: '请输入隐患地址'
            }],
            initialValue:data === undefined ? "":data.dangerAddress
          })(
            <Input placeholder="请输入隐患地址" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="隐患设施"
          hasFeedback
        >
          {getFieldDecorator('equipmentId', {
            rules: [{
              required: true,
              message: '请输入隐患设施'
            }],
            initialValue:data === undefined ? "":data.equipmentId
          })(
            <Select
              placeholder="请选择隐患类型"
              onChange={this.handleEquipment}
            >
              {
                initEquipmentList.map((item) => {
                  return (<Option key={item.id} value={item.id}>{item.equipmentName}</Option>)
                })
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="隐患级别"
          hasFeedback
        >
          {getFieldDecorator('dangerLevelId', {
            rules: [
              { required: true,
                message: '请选择隐患级别'
              },
            ],
            initialValue:data === undefined ? "":data.dangerLevelId
          })(
            <Select
              placeholder="请选择隐患级别"
              onChange={this.handleLevelChange}
            >
              {
                dangerLevel.map((item) => {
                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                })
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="隐患类型"
        >
          {getFieldDecorator('dangerTypeId', {
            rules: [
              { required: true,
                message: '请选择隐患类型'
              },
            ],
            initialValue:data === undefined ? "":data.dangerTypeId
          })(
          <Select
                placeholder="请选择隐患类型"
                onChange={this.handleTypeChange}
              >
              {
                dangerType.map((item) => {
                  return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                })
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="隐患描述"
          hasFeedback
        >
          {getFieldDecorator('remark', {
            initialValue:data === undefined ? "":data.remark
          })(
            <TextArea rows={4} placeholder="请输入隐患描述" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="隐患附件"
        >
          {getFieldDecorator('attachment', {
            getValueFromEvent: this.normFile,
            initialValue:data === undefined? "":data.attachment
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
              { fileList.length >= 5 ? null : uploadButton }
            </Upload>
          )}
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">提交</Button>
          <Button style={{ marginLeft: 20 }}><Link to={{pathname:'/dangerManage/DangerManage',style:{display: "inline"},state:{dangerStatus:1}}}>取消</Link></Button>
        </FormItem>
      </Form>
    )
  }
}
const AddForm = Form.create()(DangerForm);

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
    //设备列表
    initEquipmentList: state.equipmentLedger.initEquipmentList,
  };
}

export default connect(mapStateToProps)(AddForm);
