import React from "react";
import { Link } from "react-router-dom";
import Logo from '../assets/images/logo.svg';
import Facebook from '../assets/images/Facebook.png';
import LinkedIn from '../assets/images/Linkedin.png';
import Twitter from '../assets/images/twitter.png';
const Footer = () => {
  return (
    <footer className="footer bg-gray">
      <div className="container ">
       <div className="row">
        <div className="col-12 col-md-6 col-lg-3">
            <h3 className="title">
                About US
            </h3>
            <p className="text">
                Air enable let's pollination hour catching synergize. Q1 ui replied focus cc. Driving keywords finish language offline mindfulness not spaces box.
            </p>
        </div>
          <div className="col-12 col-md-6 col-lg-3">
            <h3 className="title">
                Company
            </h3>
            <Link to="/" className="text">Products</Link>
             <Link to="/" className="text">Careers</Link>
              <Link to="/" className="text">Contact us</Link>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
            <h3 className="title">
                Products
            </h3>
            <Link to="/" className="text">Supplements</Link>
             <Link to="/" className="text">Meals</Link>
              <Link to="/" className="text">Fitness Program</Link>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
            <h3 className="title">
                Information
            </h3>
            <Link to="/" className="text">Faqs</Link>
             <Link to="/" className="text">Blog</Link>
              <Link to="/" className="text">Support</Link>
        </div>
       </div>
       <div className="hr"></div>
       <div className="bottom">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="links">
            <Link to="/" className="link">Terms</Link>
             <Link to="/" className="link">Privacy</Link>
              <Link to="/" className="link">Cookies</Link>
        </div>
        <div className="social">
            <img src={Facebook} alt="Facebook" className="icon" />
            <img src={LinkedIn} alt="LinkedIn" className="icon" />
            <img src={Twitter} alt="Twitter" className="icon" />
        </div>
       </div>
      </div>
    </footer>
  );
};

export default Footer;
