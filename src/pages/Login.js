/* eslint-disable */
import React,{ Component } from 'react';
import styles from './login.css';
import { connect } from 'dva';
import { setCookie } from "../util/auth";
import {
  Form, Icon, Input, Button, message
} from 'antd';

class NormalLoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'loginSpace/toLogin',
          payload: values,
        }).then(() => {
          if(this.props.data.code == 0){
            setCookie('userName',values.username);
            setCookie(values.username,this.props.data.data.access_token);
            this.props.history.push({pathname: '/index', state:{type: '1'}})
          }else{
            message.error(this.props.data.msg);
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.normal}>
        <div className={styles.title}>消防维保管理平台</div>
        <div className={styles.loginBox}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              )}
            </Form.Item>
            <Form.Item>
              {/*{getFieldDecorator('remember', {*/}
              {/*valuePropName: 'checked',*/}
              {/*initialValue: true,*/}
              {/*})(*/}
              {/*<Checkbox>Remember me</Checkbox>*/}
              {/*)}*/}
              {/*<a className="login-form-forgot" href="">忘记密码</a>*/}
              <Button type="primary" htmlType="submit" className="login-form-button" style={{ width:'100%'}}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state){
  return {
    data:state.loginSpace.data
  }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default connect(mapStateToProps)(WrappedNormalLoginForm);
