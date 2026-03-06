import "./ContactFloat.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ContactFloat() {
  const [settings, setSettings] = useState<any>({
    facebook: "",
    zalo: "",
    messenger: ""
  });

  useEffect(() => {

    const fetchSettings = async () => {

      try {

        const res = await axios.get(
          "https://nmt-mobile-backend.onrender.com/api/settings"
        );

        setSettings(res.data);

      } catch (err) {
        console.error(err);
      }

    };

    fetchSettings();

  }, []);
  return (
    <div className="contact-float">
      {/* Messenger */}
      <a
        href={settings.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="messenger"
      >
         <img src="/icons/Facebook_Messenger_logo_2020.svg.png" alt="Messenger" />
      </a>

      {/* Zalo */}
      <a
        href={settings.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className="zalo"
      >
        <img src="/icons/Icon_of_Zalo.svg.webp" alt="Zalo" />
      </a>
    </div>
  );
}

export default ContactFloat;