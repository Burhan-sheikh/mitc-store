// FILE PURPOSE:
// - User profile page with editable information
// - Update name, phone, and profile photo
// - Display user stats and activity

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { compressAndConvertToBase64 } from '../utils/imageCompression';

const Profile = () => {
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    photoURL: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        photoURL: userProfile.photoURL || '',
      });
    }
  }, [userProfile]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await compressAndConvertToBase64(file);
      setFormData({ ...formData, photoURL: base64 });
    } catch (error) {
      alert('Failed to upload photo: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Profile Photo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {formData.photoURL ? (
                    <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                {editing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="input bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="input"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              {editing ? (
                <>
                  <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                    <Save size={20} className="mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="btn btn-primary w-full"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;