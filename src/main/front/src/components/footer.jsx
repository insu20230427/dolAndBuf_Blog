import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';

export default function Footer() {
    const footerStyle = {
        background: '#eaecf1',
        color: '#131212',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height : '270px',
        width: '100%',
        boxSizing: 'border-box',
    };

    return (
        <footer style={footerStyle}>
            <div>
                <p>🙋‍♂️Created by insu</p>
                <p>📞insubono@gmail.com</p>
                <p>🌎서울시 금천구 가산동</p>
            </div>
        </footer>
    );
}
