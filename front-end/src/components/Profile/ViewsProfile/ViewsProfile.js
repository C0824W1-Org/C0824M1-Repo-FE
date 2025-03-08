import React from "react";

const ViewsProfile = () => {
  return (
    <div className="content container-fluid">
      <h2>Users Management</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User List</h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Admin</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>User</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewsProfile;
