import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

function EditUserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { users, handleEdit } = useContext(UserContext);
    const [name, setName] = useState('');

    useEffect(() => {
        const userToEdit = users.find(u => u.id === Number(id));
        if (userToEdit) {
            setName(userToEdit.name);
        }
    }, [id, users]);

    function handleSubmit(e) {
        e.preventDefault();
        if (name) {
            handleEdit({ id: Number(id), name });
            navigate('/users');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit User</h2>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditUserForm;