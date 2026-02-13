import React from 'react';

const WebsiteList = () => {
    const websites = [
        { name: 'Google', url: 'https://www.google.com' },
        { name: 'Facebook', url: 'https://www.facebook.com' },
        { name: 'Twitter', url: 'https://www.twitter.com' },
        { name: 'GitHub', url: 'https://www.github.com' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com' },
    ];

    return (
        <div>
            <h1>Website List</h1>
            <ul>
                {websites.map((website, index) => (
                    <li key={index}>
                        <a href={website.url} target="_blank" rel="noopener noreferrer">
                            {website.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WebsiteList;
