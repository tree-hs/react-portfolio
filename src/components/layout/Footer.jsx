function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text">
          Designed & Built by HS
        </p>
        <p className="footer__copyright">
          © {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;