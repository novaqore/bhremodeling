"use client"
import { useAuth } from "@/contexts/auth"
import { auth } from "@/lib/firebase/init"
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { LogOut, Mail, Key, ArrowLeft, Lock, Eye, EyeOff, Loader2, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Profile() {
    const { user } = useAuth()
    const router = useRouter()
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess(false)

        // Validation
        if (newPassword !== confirmPassword) {
            setError("New passwords don't match")
            return
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters")
            return
        }

        setIsLoading(true)

        try {
            // First reauthenticate
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            )
            await reauthenticateWithCredential(user, credential)
            
            await updatePassword(user, newPassword)
            setSuccess(true)
            setShowPasswordModal(false)
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setSuccess(false)
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                setError("Current password is incorrect")
            } else {
                setError("Failed to change password. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return null
    }

    return (
        <div className="mx-auto px-6 pb-6 pt-20">
            <div className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="flex flex-row">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
                </div>
            </div>

            <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-gray-700">
                            <Mail size={20} />
                            <span className="font-medium">Email:</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                            <Key size={20} />
                            <span className="font-medium">User ID:</span>
                            <span className="font-mono text-sm">{user.uid}</span>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <Lock size={20} />
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => {
                                setShowPasswordModal(false)
                                setCurrentPassword("")
                                setNewPassword("")
                                setConfirmPassword("")
                                setError("")
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            {/* Modal Header */}
                            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Lock className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                                    <p className="text-sm text-gray-600">Update your account password</p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                                        <Check size={16} />
                                        Password successfully updated!
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(false)
                                            setCurrentPassword("")
                                            setNewPassword("")
                                            setConfirmPassword("")
                                            setError("")
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || success}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Updating...
                                            </>
                                        ) : success ? (
                                            <>
                                                <Check size={16} />
                                                Updated!
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={16} />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}