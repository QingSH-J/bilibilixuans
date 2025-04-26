"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// 定义接口
interface User {
  id: string;
  name: string;
  age: number;
}

interface NewUserForm {
  name: string;
  age: string; // 表单中使用字符串，提交时转换为数字
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<NewUserForm>({ name: '', age: '' });

  // 后端 API 地址
  const API_URL: string = 'http://localhost:8080/api';

  // 获取所有用户
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      
      if (!response.ok) {
        throw new Error('获取用户数据失败');
      }
      
      const data: User[] = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('获取用户时出错:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // 创建新用户
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          age: parseInt(newUser.age, 10),
        }),
      });
      
      if (!response.ok) {
        throw new Error('创建用户失败');
      }
      
      // 重新获取用户列表
      fetchUsers();
      
      // 清空表单
      setNewUser({ name: '', age: '' });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('创建用户时出错:', err);
      }
    }
  };

  // 处理输入变化
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">用户列表</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {/* 添加用户表单 */}
      <div className="mb-6 p-4 bg-gray-50 rounded shadow">
        <h2 className="text-xl mb-2">添加新用户</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">姓名</label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">年龄</label>
            <input
              type="number"
              name="age"
              value={newUser.age}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            添加用户
          </button>
        </form>
      </div>
      
      {/* 用户列表 */}
      {loading ? (
        <p>加载中...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-gray-600">ID: {user.id}</p>
              <p className="text-gray-600">年龄: {user.age}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 