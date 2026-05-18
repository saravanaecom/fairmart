import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { fetchUsers } from '../redux/settingsActions';

const SomeComponent = () => {
  const dispatch = useDispatch();

  // Get the state from Redux store
  const { loading, users, error } = useSelector((state) => state.users);

  useEffect(() => {
    // Fetch users on component mount
    //dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SomeComponent;
