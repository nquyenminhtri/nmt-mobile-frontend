import banner from "../assets/banner.png";
import "./PublicLayout.css";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="public-layout"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="public-overlay">
        {children}
      </div>
    </div>
  );
}

export default PublicLayout;