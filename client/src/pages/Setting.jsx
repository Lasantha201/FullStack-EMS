import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Lock } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordMode from "../components/ChangePasswordMode";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

const Setting = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModel, setShowPasswordModel] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/profile");

      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Setting</h1>
        <p className="page-subtitle">
          Manage your account and preferences
        </p>
      </div>

      {profile && (
        <ProfileForm
          initialData={profile}
          onSuccess={fetchProfile}
        />
      )}

      <div className="card max-w-md p-6 flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <div>
            <Lock className="w-5 h-5 text-slate-600" />
          </div>

          <div>
            <p className="font-medium text-slate-900">
              Password
            </p>

            <p className="text-sm text-slate-500">
              Update your account password
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPasswordModel(true)}
          className="btn-secondary text-sm"
        >
          Change
        </button>
      </div>

      <ChangePasswordMode
        open={showPasswordModel}
        onClose={() => setShowPasswordModel(false)}
      />
    </div>
  );
};

export default Setting;