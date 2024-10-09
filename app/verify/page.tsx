'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './VerifyPage.module.css';

function useToken() {
  const getToken = () => {
    return localStorage.getItem('token');
  };
  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  const removeToken = () => {
    localStorage.removeItem('token');
  };

  return { getToken, setToken, removeToken };
}

export default function VerifyPage() { // 验证页面
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle'); // 状态
    const [password, setPassword] = useState(''); // 密码
    const router = useRouter();
    const { getToken, setToken, removeToken } = useToken();
    
    
    const handleVerify = async () => { // 验证
        setStatus('verifying'); // 设置状态为验证中
        try {
            const response = await fetch('/api/verify', { // 发送请求
                method: 'POST', // 方法
                headers: { // 头部
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            const data = await response.json(); // 获取数据
            if (data.success) { // 成功
                setStatus('success'); // 设置状态为成功
                setToken(data.token);  // 使用 cookie 存储 token
                router.push('/sys'); // 修改这里：将 '/' 改为 '/sys'
            } else {
                setStatus('failure'); // 设置状态为失败
            }
        } catch (error) {
            setStatus('failure'); // 设置状态为失败
        }
    };

    useEffect(() => {  
        // 获取cookie
        const token = getToken();
        
        if (token === undefined) {
            setStatus('idle');
        } else if (token) {
            setStatus('verifying'); // 设置状态为验证中
            fetch('/api/verify', { // 发送验证请求
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ token }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setToken(data.token);  // 更新 cookie 中的 token
                    router.push('/sys');
                } else {
                    removeToken();  // 清除 cookie 中的 token
                    setStatus('failure');
                }
            })
            .catch(error => {
                removeToken();  // 清除 cookie 中的 token
                setStatus('failure');
            });
        } else {
            setStatus('idle');
        }
    }, [router, getToken, setToken, removeToken]); // 添加 router 作为依赖项

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>验证您的身份</h2>
                <div className={styles.inputWrapper}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        className={styles.input}
                    />
                </div>
                <div className={styles.statusMessage}>
                    {status === 'idle' && <p>请输入密码并点击验证按钮。</p>}
                    {status === 'verifying' && <p className={styles.verifying}>正在验证<span>...</span></p>}
                    {status === 'success' && <p className={styles.success}>验证通过！正在跳转...</p>}
                    {status === 'failure' && <p className={styles.failure}>验证失败，请重试。</p>}
                </div>
                <button 
                    onClick={handleVerify} 
                    disabled={status === 'verifying'} 
                    className={`${styles.button} ${status === 'verifying' ? styles.disabled : ''}`}
                >
                    {status === 'failure' ? '重新验证' : '验证'}
                </button>
            </div>
        </div>
    );
}