import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import axios from 'axios';
import Cookies from 'js-cookie';

function BannerAddModal({ open, setOpen }) {
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');

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
      }
      );
      if (response.status === 200) {
        alert('배너가 성공적으로 추가되었습니다.');
        console.log("for banner bannerImageUrl : " + response.data.data.bannerImageUrl)
        console.log("for banner bannerDescription : " + response.data.data.bannerDescription)
        setOpen(false); // 성공적으로 추가 후 모달 닫기
      }
    } catch (error) {
      console.error('배너 추가 중 오류가 발생했습니다.', error);
      alert('배너 추가 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Modal.Header>배너 추가</Modal.Header>
      <Modal.Content>
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
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          취소
        </Button>
        <Button
          content="추가하기"
          labelPosition='right'
          icon='checkmark'
          onClick={handleSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default BannerAddModal;