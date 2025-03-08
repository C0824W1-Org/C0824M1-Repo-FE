import React from "react";

const ListMembers = () => {
  return (
    <div className="content container-fluid">
      <h2>Settings</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">System Settings</h5>
          <form>
            <div className="mb-3">
              <label className="form-label">Site Name</label>
              <input
                type="text"
                className="form-control"
                defaultValue="Admin Panel"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Maintenance Mode</label>
              <select className="form-select">
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListMembers;
