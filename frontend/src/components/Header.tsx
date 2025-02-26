import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="logo">THE FRENCH PRESS</h1>
      <nav className="nav-menu">
        <a href="#" className="nav-link active">
          HOME
        </a>
        <a href="#" className="nav-link">
          MENU
        </a>
        <a href="#" className="nav-link">
          LOCATIONS
        </a>
      </nav>
    </header>
  );
};

export default Header;
