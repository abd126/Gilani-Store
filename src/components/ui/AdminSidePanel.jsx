import React from 'react';
import { NavLink } from 'react-router-dom'; 


const SideNavigation = () => {
  return (
    <aside className="sidenavigation">
      <div className="sidenavigation-wrapper">
        <div className="sidenavigation-item">
        
          <NavLink 
              activeClassName="sidenavigation-menu-active"
              className="sidenavigation-menu"
              to='/admin/products'
          >
            Products
          </NavLink>
        </div>
        <div className="sidenavigation-item">
          <a className="sidenavigation-menu"></a>
          <NavLink 
                activeClassName="sidenavigation-menu-active"
                className="sidenavigation-menu"
                to="/dashboard/users"
            >
              Orders
            </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default SideNavigation;
