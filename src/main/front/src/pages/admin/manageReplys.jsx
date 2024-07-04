import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const ManageReplys = () => {
    const [replys, setReplys] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReplys = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/replys');
                setReplys(response.data.data);
            } catch (error) {
                console.error('Error fetching replies:', error);
            }
        };

        fetchReplys();
    }, []);

    const handleEdit = (replyId) => {
        navigate(`/admin/edit-reply/${replyId}`);
    };

    const handleDelete = async (replyId) => {
        try {
            await axios.delete(`http://localhost:8080/api/admin/replies/${replyId}`);
            setReplys(replys.filter(reply => reply.id !== replyId));
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    return (
        <div>
            <h2>댓글 관리</h2>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>내용</Table.HeaderCell>
                        <Table.HeaderCell>작업</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {replys.map(reply => (
                        <Table.Row key={reply.id}>
                            <Table.Cell>{reply.content}</Table.Cell>
                            <Table.Cell>
                                <Button icon onClick={() => handleEdit(reply.id)}>
                                    <Icon name='edit' />
                                </Button>
                                <Button icon onClick={() => handleDelete(reply.id)}>
                                    <Icon name='delete' />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ManageReplys;