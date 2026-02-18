'use client';

import { useState } from 'react';
import { User, Bell, Shield, Trash2, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RolesSettingsPage } from '@/features/roles';

export default function SettingsPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [notifications, setNotifications] = useState(true);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, bio, notifications }),
            });

            if (response.ok) {
                alert('Settings saved successfully');
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch('/api/user/account', { method: 'DELETE' });
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Failed to delete account');
            }
        } catch (error) {
            alert('Failed to delete account');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and organization preferences</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Roles
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User size={24} className="text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </TabsContent>

                <TabsContent value="notifications">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell size={24} className="text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Email Notifications</p>
                                <p className="text-sm text-gray-500">Receive email updates about your forms</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="roles">
                    <RolesSettingsPage />
                </TabsContent>

                <TabsContent value="security">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield size={24} className="text-green-600" />
                            <h2 className="text-xl font-bold text-gray-900">Security</h2>
                        </div>

                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Change Password
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 mt-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Trash2 size={24} className="text-red-600" />
                            <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>

                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Delete Account
                        </button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
