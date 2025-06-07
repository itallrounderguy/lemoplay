const Header = () => {
  return (
    <div className="header">
      <h1 className="logo-wrapper">
        <iframe
          src="https://learnify2025.s3.us-east-1.amazonaws.com/logo/logo.html"
          width="360"
          height="180"
          className="logo-iframe"
          title="Lemo"
          scrolling="no"
          allowTransparency="true"
        ></iframe>
      </h1>
    </div>
  );
};

export default Header;
