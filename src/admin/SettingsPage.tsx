import { useEffect, useState } from "react";
import axios from "axios";

function SettingsPage() {

  const [settings, setSettings] = useState<any>({
    site_name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    logo_url: "",
    banner_url: ""
  });

  useEffect(() => {

    const fetchSettings = async () => {

      const res = await axios.get(
        "https://nmt-mobile-backend.onrender.com/api/settings"
      );

      setSettings(res.data);

    };

    fetchSettings();

  }, []);

  const handleChange = (e: any) => {

    const { name, value } = e.target;

    setSettings((prev: any) => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSave = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        "https://nmt-mobile-backend.onrender.com/api/admin/settings",
        settings,
        {
          headers: { Authorization: token }
        }
      );

      alert("Cập nhật thành công");

    } catch (err) {

      alert("Lỗi cập nhật");

    }

  };

  return (
    <div style={{ padding: 30 }}>

      <h2>Cấu hình hệ thống</h2>

      <input
        name="site_name"
        value={settings.site_name}
        onChange={handleChange}
        placeholder="Tên website"
      />

      <input
        name="phone"
        value={settings.phone}
        onChange={handleChange}
        placeholder="Số điện thoại"
      />

      <input
        name="email"
        value={settings.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        name="address"
        value={settings.address}
        onChange={handleChange}
        placeholder="Địa chỉ"
      />

      <textarea
        name="description"
        value={settings.description}
        onChange={handleChange}
        placeholder="Mô tả dịch vụ"
      />

      <input
        name="logo_url"
        value={settings.logo_url}
        onChange={handleChange}
        placeholder="Link logo"
      />

      <input
        name="banner_url"
        value={settings.banner_url}
        onChange={handleChange}
        placeholder="Link banner"
      />

      <br /><br />

      <button onClick={handleSave}>
        Lưu cấu hình
      </button>

    </div>
  );
}

export default SettingsPage;