import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/app', icon: 'LayoutDashboard', exact: true },
    { name: 'My Helpers', href: '/app/helpers', icon: 'Users' },
    { name: 'Knowledge Base', href: '/app/knowledge-base', icon: 'Database' },
    { name: 'Account', href: '/app/account', icon: 'Settings' },
    { name: 'Billing', href: '/app/billing', icon: 'CreditCard' },
  ];

  const NavItem = ({ item }) => {
    const isActive = item.exact 
      ? location.pathname === item.href
      : location.pathname.startsWith(item.href);

    return (
      <NavLink
        to={item.href}
        className={({ isActive: routerIsActive }) => {
          const active = item.exact 
            ? location.pathname === item.href
            : routerIsActive;
          
          return `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active
              ? 'bg-sunset-gradient text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
          }`;
        }}
      >
        <ApperIcon name={item.icon} size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="ml-3 truncate">{item.name}</span>
        )}
      </NavLink>
    );
  };

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
      className="bg-white border-r border-gray-200 h-full flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-sunset-gradient rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-bold text-charcoal truncate">
                AI Marketing Team
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-sunset-gradient rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="User" size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">
                Demo User
              </p>
              <p className="text-xs text-gray-500 truncate">
                Professional Plan
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
      >
        <ApperIcon 
          name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
          size={14} 
          className="text-gray-600" 
        />
      </button>
    </motion.aside>
  );
};

export default Sidebar;