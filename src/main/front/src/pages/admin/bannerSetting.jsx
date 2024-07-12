import React, { useState, useEffect } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const BannerSetting = () => {
    const [bannerUrl, setBannerUrl] = useState('');
    const [bannerDescription, setBannerDescription] = useState('');
    const [currentBanner, setCurrentBanner] = useState({});

    const fetchBanner = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/banners', {
                withCredentials: true,
                headers: {
                    Authorization: Cookies.get('Authorization')
                }
            });
            const currentUrl = response.data.data.bannerImageUrl;
            const currentDescription = response.data.data.bannerDescription;
            setCurrentBanner({ url : currentUrl , bannerDescription : currentDescription});
            setBannerUrl(response.data.data.url);
            setBannerDescription(response.data.data.bannerDescription);
        } catch (error) {
            console.error('배너 정보를 불러오는 중 오류가 발생했습니다.', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/banners', {
                url: bannerUrl,
                bannerDescription: bannerDescription,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: Cookies.get('Authorization')
                }
            });
            if (response.status === 200) {
                alert('배너가 성공적으로 추가되었습니다.');
                setCurrentBanner(response.data);
                console.log("for banner bannerImageUrl : " + response.data.data.bannerImageUrl)
                console.log("for banner bannerDescription : " + response.data.data.bannerDescription)
            }
        } catch (error) {
            console.error('배너 추가 중 오류가 발생했습니다.', error);
            alert('배너 추가 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    return (
        <div style={{padding: '20px'}}>
            <h2>배너 설정</h2>
            <Form>
                <Form.Field>
                    <label>배너 URL</label>
                    <input
                        placeholder='배너 이미지 URL을 입력하세요'
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>배너 설명</label>
                    <input
                        placeholder='배너 설명을 입력하세요'
                        value={bannerDescription}
                        onChange={(e) => setBannerDescription(e.target.value)}
                    />
                </Form.Field>
                <Button
                    content="추가하기"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={handleSubmit}
                    positive
                />
            </Form>
            {currentBanner && (
                <Segment>
                    <h3>현재 배너</h3>
                    <p><strong>URL:</strong> {currentBanner.url}</p>
                    <p><strong>설명:</strong> {currentBanner.bannerDescription}</p>
                    <img src={currentBanner.url} alt="Current Banner" style={{ maxWidth: '100%' }} />
                </Segment>
            )}
        </div>
    );
};

export default BannerSetting;
