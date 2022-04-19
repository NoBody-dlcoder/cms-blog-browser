import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space,
  Message,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import useStorage from '@/utils/useStorage';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import {login as userLogin} from '../../api/login/login'
import { useDispatch } from 'react-redux';

export default function LoginForm() {
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] = useStorage('loginParams');
  const t = useLocale(locale);
  const [rememberPassword, setRememberPassword] = useState(!!loginParams);
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  function afterLoginSuccess(params) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params));
      dispatch({
        type: 'update-userInfo',
        paload: params.userName
      })
    } else {
      removeLoginParams();
    }
    // 记录登录状态
    localStorage.setItem('token', params.token);
    // 跳转首页
    window.location.href = '/';
  }

 async  function login(params) {
    setErrorMessage('');
    setLoading(true);
   try {
    const res = await userLogin(params)
    if(res.data && (res as any).code === 0) {
      afterLoginSuccess(params);
    } else {
      setErrorMessage((res as any).msg)
    }
   } catch (error) {
     
   } finally {
    setLoading(false);
   }
  }

  async function onSubmitClick() {
    // 第一种方法
    // formRef.current.validate().then((values) => {
    //   login(values);
    // });

    // 第二种验证方法
    try {
      await form.validate()
      const values = await form.getFields()
      login(values)
    } catch (error) {
      Message.error('校验失败')
    }
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const rememberPassword = !!loginParams;
    setRememberPassword(rememberPassword);
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(loginParams);
      formRef.current.setFieldsValue(parseParams);
    }
  }, [loginParams]);

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{t['login.form.title']}</div>
      <div className={styles['login-form-sub-title']}>
        {t['login.form.title']}
      </div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form
        className={styles['login-form']}
        layout="vertical"
        ref={formRef}
        form={form}
        initialValues={{ userName: 'admin', password: 'adminadmin' }}
      >
        <Form.Item
          field="userName"
          rules={[{ required: true, message: '请输入账号' },{
            match: /^[a-zA-Z0-9_-]{5,20}$/,
            message: '账号5到20位'
          }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={t['login.form.userName.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: '请输入密码' },{
            match: /^[a-zA-Z0-9_-]{6,20}$/,
            message:'密码6-20位数字字母下划线组成'
          }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['login.form.password.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Checkbox checked={rememberPassword} onChange={setRememberPassword}>
              {t['login.form.rememberPassword']}
            </Checkbox>
            <Link>{t['login.form.forgetPassword']}</Link>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            {t['login.form.login']}
          </Button>
          <Button
            type="text"
            long
            className={styles['login-form-register-btn']}
          >
            {t['login.form.register']}
          </Button>
        </Space>
      </Form>
    </div>
  );
}
