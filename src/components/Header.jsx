const Header = () => {
  return (
    <div className="header">
      <h1 className="logo-wrapper">
        <iframe
          src="https://learnify2025.s3.us-east-1.amazonaws.com/logo/logo.html?animation=idle&scale=1.8"
          width="300"
          height="220"
          className="logo-iframe"
          title="Lemo"
          allowTransparency="true"
        ></iframe>
      </h1>
    </div>
  );
};

export default Header;
