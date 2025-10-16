import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

function NewUserForm() {
    const [name, setName] = useState('');
    const { handleNew } = useContext(UserContext);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        
        // Check if the name is not empty or just whitespace
        if (name.trim()) {
            handleNew({ name });
            // Navigate to the user list after creating the user
            navigate('/users');
        } else {
            alert("Please enter a name for the user.");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New User</h2>
            <div style={{ margin: '1rem 0' }}>
                <label htmlFor="name" style={{ marginRight: '0.5rem' }}>Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter user's name"
                    required
                    autoFocus
                />
            </div>
            <button type="submit">Create User</button>
            <button type="button" onClick={() => navigate('/users')}>Cancel</button>
        </form>
    );
}

export default NewUserForm;