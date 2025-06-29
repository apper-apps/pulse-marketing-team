import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Billing from "@/components/pages/Billing";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const Account = () => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState({
    email: user?.emailAddress || 'demo@aimarketingteam.com',
    company_name: user?.accounts?.[0]?.companyName || 'FitTech Solutions',
    first_name: user?.firstName || 'Demo',
    last_name: user?.lastName || 'User',
    phone: user?.phoneNumber || '+1 (555) 123-4567',
    timezone: 'America/New_York'
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [saving, setSaving] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your profile and account preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-charcoal">
              Profile Information
            </h2>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="first_name"
              value={profileData.first_name}
              onChange={handleProfileChange}
            />

            <Input
              label="Last Name"
              name="last_name"
              value={profileData.last_name}
              onChange={handleProfileChange}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
            />

            <Input
              label="Company Name"
              name="company_name"
              value={profileData.company_name}
              onChange={handleProfileChange}
              className="md:col-span-2"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={profileData.timezone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              loading={saving}
              icon="Save"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Subscription Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-charcoal">Subscription</h3>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium">Professional</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Messages</span>
                <span className="font-medium">47/500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next billing</span>
                <span className="font-medium">Feb 15, 2024</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              icon="CreditCard"
            >
              Manage Billing
            </Button>
          </div>

          {/* Usage Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-charcoal mb-4">Usage This Month</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Messages</span>
                  <span className="font-medium">47/500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-sunset-gradient h-2 rounded-full" style={{ width: '9.4%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Helpers Used</span>
                  <span className="font-medium">6/8</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Password Change Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-charcoal">
            Change Password
          </h2>
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Lock" size={20} className="text-secondary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Current Password"
            name="current_password"
            type="password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            name="new_password"
            type="password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
          />
        </div>

<div className="mt-6">
          <Button
            variant="secondary"
            onClick={handleChangePassword}
            loading={saving}
            icon="Lock"
          >
            {saving ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </motion.div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-charcoal mb-2">
              Account Actions
            </h2>
            <p className="text-gray-600">
              Manage your account session and security
            </p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            icon="LogOut"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;