import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <DefaultFooter
            style={{
                background: 'none',
            }}
            links={[
                {
                    key: 'github',
                    title: <><GithubOutlined /> KoryXia</>,
                    href: 'https://github.com/KoryXia',
                    blankTarget: true,
                }
            ]}
            copyright={'xsd666.top 2024'}
        />
    );
};


export default Footer;
