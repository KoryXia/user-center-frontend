import {Footer} from '@/components';
import {login} from '@/services/ant-design-pro/api';
import {
    LockOutlined,
    MobileOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import {Helmet, history, useModel} from '@umijs/max';
import {Alert, Tabs, message} from 'antd';
import {createStyles} from 'antd-style';
import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({token}) => {
    return {
        action: {
            marginLeft: '8px',
            color: 'rgba(0, 0, 0, 0.2)',
            fontSize: '24px',
            verticalAlign: 'middle',
            cursor: 'pointer',
            transition: 'color 0.3s',
            '&:hover': {
                color: token.colorPrimaryActive,
            },
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            backgroundImage:
                "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
            backgroundSize: '100% 100%',
        },
    };
});

const LoginMessage: React.FC<{
    content: string;
}> = ({content}) => {
    return (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    );
};
const Login: React.FC = () => {
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
    const [type, setType] = useState<string>('mobile');
    const {initialState, setInitialState} = useModel('@@initialState');
    const {styles} = useStyles();
    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
            flushSync(() => {
                setInitialState((s) => ({
                    ...s,
                    currentUser: userInfo,
                }));
            });
        }
    };
    const handleSubmit = async (values: API.LoginParams) => {
        try {
            // 登录
            const user = await login(values);
            if (user) {
                const defaultLoginSuccessMessage = '登录成功！';
                message.success(defaultLoginSuccessMessage);
                await fetchUserInfo();
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                return;
            }
            console.log(user);
            // 如果失败去设置用户错误信息
            setUserLoginState(user);
        } catch (error) {
            const defaultLoginFailureMessage = '登录失败，请重试！';
            console.log(error);
            message.error(defaultLoginFailureMessage);
        }
    };
    const {status, type: loginType} = userLoginState;
    return (
        <div className={styles.container}>
            <Helmet>
                <title>
                    {'登录'}- {Settings.title}
                </title>
            </Helmet>
            <div
                style={{
                    flex: '1',
                    padding: '32px 0',
                }}
            >
                <LoginForm
                    contentStyle={{
                        minWidth: 280,
                        maxWidth: '75vw',
                    }}
                    logo={<img alt="logo" src="/logo.svg"/>}
                    title="不知道取什么名字"
                    subTitle={'最具影响力什么什么东西'}
                    initialValues={{
                        autoLogin: false,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginParams);
                    }}
                >
                    <Tabs
                        activeKey={type}
                        onChange={setType}
                        centered
                        items={[
                            {
                                key: 'mobile',
                                label: '手机号登录',
                            },
                        ]}
                    />

                    {status === 'error' && (
                        <LoginMessage content={'错误的手机号和密码'}/>
                    )}
                    {type === 'mobile' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined/>,
                                }}
                                name="phone"
                                placeholder={'请输入手机号！'}
                                rules={[
                                    {
                                        required: true,
                                        message: '手机号是必填项！',
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: '不合法的手机号！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined/>,
                                }}
                                placeholder={'请输入密码！'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '密码至少8位',
                                    },
                                ]}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle>
                            自动登录
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            忘记密码 ? 请联系管理员
                        </a>
                    </div>
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};
export default Login;
