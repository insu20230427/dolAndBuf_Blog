import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap'

export default function Footer() {

    const jumbotronStyle = {
        background: '#eaecf1',
        color: '#131212',
        padding: '2rem',
        height: '18vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    };


    return (
        <div style={jumbotronStyle}>
            <div>
                <p>🙋‍♂️Created by insu</p>
                <p>📞insubono@gmail.com</p>
                <p>🌎서울시 금천구 가산동</p>
            </div>
        </div>
    );
};