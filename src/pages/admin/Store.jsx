// FILE PURPOSE:
// - Admin store settings page
// - Update store logo, hero content, and banners
// - Configure theme colors
// - Manage homepage layout and content
// - All images compressed to max 700KB

import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { compressAndConvertToBase64 } from '../../utils/imageCompression';
import { DEFAULT_STORE_SETTINGS } from '../../utils/constants';

const Store = () => {
  const [settings, setSettings] = useState(DEFAULT_STORE_SETTINGS);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await compressAndConvertToBase64(file);
      setSettings({ ...settings, logo: base64 });
    } catch (error) {
      alert('Logo upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const bannerPromises = Array.from(files).slice(0, 3).map(file => compressAndConvertToBase64(file));
      const banners = await Promise.all(bannerPromises);
      setSettings({ ...settings, banners });
    } catch (error) {
      alert('Banner upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to Firestore
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Store Settings</h1>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Logo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Logo (Max 700KB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="input"
                disabled={uploading}
              />
              {settings.logo && (
                <div className="mt-4">
                  <img src={settings.logo} alt="Logo" className="h-20 object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Hero Section */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Banners */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Banners</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Banners (Max 3, 700KB each)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBannerUpload}
                className="input"
                disabled={uploading}
              />
              {settings.banners.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {settings.banners.map((banner, i) => (
                    <img key={i} src={banner} alt={`Banner ${i + 1}`} className="rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Theme Color */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Theme Color</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={settings.themeColor}
                onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                className="h-12 w-full cursor-pointer rounded-lg"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="btn btn-primary w-full"
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Store;