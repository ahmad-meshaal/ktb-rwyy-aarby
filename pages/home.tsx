import React from 'react';
import { Upload, Button, Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;

const HomePage = () => {
    const handleUpload = (file) => {
        // Handle file upload logic here
        console.log('Uploaded file:', file);
    };

    return (
        <Layout>
            <Header>
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1">Dashboard</Menu.Item>
                    <Menu.Item key="2">Website Management</Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '50px' }}>
                <h1>Welcome to the Website Management Dashboard</h1>
                <h2>Upload Your Files</h2>
                <Upload beforeUpload={handleUpload} showUploadList={false}>
                    <Button>Click to Upload</Button>
                </Upload>
                <h2>Dashboard Features</h2>
                <p>Here you can manage your website efficiently, track user engagement, and analyze data. </p>
                <ul>
                    <li>File Uploads: Easily upload files and documents.</li>
                    <li>Website Management: Control your site's content and features.</li>
                    <li>Analytics Dashboard: View detailed analytics on your website's performance.</li>
                </ul>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Website Management ©2026</Footer>
        </Layout>
    );
};

export default HomePage;