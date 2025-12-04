import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('userEmail');
    if (!username) {
      navigate('/login');
      return;
    }
    
    // Use localStorage data initially
    const userData = {
      username: username,
      email: email,
      fullName: localStorage.getItem('fullName') || username,
      mobile: localStorage.getItem('mobile') || '',
      monthlyIncome: localStorage.getItem('monthlyIncome') || '$3,000 - $5,000',
      preferredCurrency: localStorage.getItem('preferredCurrency') || 'USD',
      financialGoal: localStorage.getItem('financialGoal') || 'Save for a new laptop',
      financialScore: parseInt(localStorage.getItem('financialScore')) || 75,
      profileImage: localStorage.getItem('profileImage') || null,
      createdAt: new Date().toISOString()
    };
    
    setUser(userData);
    setFormData(userData);

    
    // Try to fetch from backend
    UserService.getProfile(username)
      .then(response => {
        setUser(response.data);
        setFormData(response.data);
      })
      .catch(error => {
        console.log('Backend not available, using localStorage data');
      });
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    
    // Save image to localStorage as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      localStorage.setItem('profileImage', base64Image);
      setUser({...user, profileImage: base64Image});
      setSelectedImage(null);
      setImagePreview(null);
    };
    reader.readAsDataURL(selectedImage);
    
    // Try to upload to backend
    const formDataImg = new FormData();
    formDataImg.append('image', selectedImage);
    
    try {
      await UserService.uploadProfileImage(user.username, formDataImg);
    } catch (error) {
      console.log('Backend not available, image saved locally');
    }
  };

  const handleDeleteImage = async () => {
    // Remove from localStorage
    localStorage.removeItem('profileImage');
    setUser({...user, profileImage: null});
    setImagePreview(null);
    setSelectedImage(null);
    
    // Try to delete from backend
    try {
      await UserService.deleteProfileImage(user.username);
    } catch (error) {
      console.log('Backend not available, image deleted locally');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('fullName', formData.fullName || '');
      localStorage.setItem('userEmail', formData.email || '');
      localStorage.setItem('mobile', formData.mobile || '');
      localStorage.setItem('monthlyIncome', formData.monthlyIncome || '');
      localStorage.setItem('preferredCurrency', formData.preferredCurrency || '');
      localStorage.setItem('financialGoal', formData.financialGoal || '');
      localStorage.setItem('financialScore', formData.financialScore || '75');
      
      // Try to save to backend
      await UserService.updateProfile(user.username, formData);
      setUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.log('Backend not available, saved locally');
      setUser(formData);
      setIsEditing(false);
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <img 
              src={imagePreview || user.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
              alt="Profile" 
              className="profile-image"
            />
            <div className="image-upload-overlay">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="image-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-btn">
                📷
              </label>
            </div>
          </div>
          {selectedImage && (
            <button onClick={handleImageUpload} className="save-image-btn">
              Save Image
            </button>
          )}
          {user.profileImage && isEditing && (
            <button onClick={handleDeleteImage} className="delete-image-btn">
              Delete Image
            </button>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{user.fullName || user.username}</h1>
          <p className="username">@{user.username}</p>
          <p className="email">{user.email}</p>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="edit-profile-btn"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="profile-content">
        {/* Personal Details Section */}
        <div className="profile-section">
          <h2>Personal Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} className="edit-input" />
              ) : (
                <span>{user.fullName || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-item">
              <label>Email</label>
              {isEditing ? (
                <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="edit-input" />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            
            <div className="info-item">
              <label>Mobile</label>
              {isEditing ? (
                <input type="tel" name="mobile" value={formData.mobile || ''} onChange={handleInputChange} className="edit-input" />
              ) : (
                <span>{user.mobile || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-item">
              <label>Monthly Income Range</label>
              {isEditing ? (
                <select name="monthlyIncome" value={formData.monthlyIncome || ''} onChange={handleInputChange} className="edit-input">
                  <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
              ) : (
                <span>{user.monthlyIncome || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-item">
              <label>Preferred Currency</label>
              {isEditing ? (
                <select name="preferredCurrency" value={formData.preferredCurrency || ''} onChange={handleInputChange} className="edit-input">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              ) : (
                <span>{user.preferredCurrency || 'USD'}</span>
              )}
            </div>
            
            <div className="info-item full-width">
              <label>Financial Goal</label>
              {isEditing ? (
                <input type="text" name="financialGoal" value={formData.financialGoal || ''} onChange={handleInputChange} className="edit-input" placeholder="e.g., Save for a new laptop" />
              ) : (
                <span>{user.financialGoal || 'Not set'}</span>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Username</label>
              <span>{user.username}</span>
            </div>
            
            <div className="info-item">
              <label>Member Since</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="info-item">
              <label>Account Status</label>
              <span className="status-active">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;