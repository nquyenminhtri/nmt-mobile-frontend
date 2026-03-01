import "./ContactFloat.css";

function ContactFloat() {
  return (
    <div className="contact-float">
      {/* Messenger */}
      <a
        href="https://m.me/NguyenMTri.nmt"
        target="_blank"
        rel="noopener noreferrer"
        className="messenger"
      >
         <img src="/icons/Facebook_Messenger_logo_2020.svg.png" alt="Messenger" />
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/0369396573"
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