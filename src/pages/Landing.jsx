import React from "react";
import ShopIcon from "../assets/images/shop.svg";
import Cat1 from "../assets/images/cat1.png";
import Cat2 from "../assets/images/cat2.png";
import Cat3 from "../assets/images/cat3.png";
import Prod1 from "../assets/images/p1.png";
import Prod2 from "../assets/images/p2.png";
import Prod3 from "../assets/images/p3.png";
import Prod4 from "../assets/images/p4.png";
import Featured1 from "../assets/images/f1.jpg";
import Featured2 from "../assets/images/f2.jpg";
import Featured3 from "../assets/images/f3.jpg";
import Featured4 from "../assets/images/f4.jpg";
import Featured5 from "../assets/images/f5.jpg";
import star from "../assets/images/star.png";
import Meal1 from "../assets/images/meal1.png";
import Meal2 from "../assets/images/meal2.png";
import Meal3 from "../assets/images/meal3.png";
import Meal4 from "../assets/images/meal4.png";
import Meal5 from "../assets/images/meal5.png";
import Meal6 from "../assets/images/meal6.png";
import logo1 from "../assets/images/logo1.png";
import logo2 from "../assets/images/logo2.png";
import logo3 from "../assets/images/logo3.png";
import logo4 from "../assets/images/logo4.png";
import logo5 from "../assets/images/logo5.png";
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user3.jpg";
import WhyImage from "../assets/images/why.png";

import CartImg from "../assets/images/cart1.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const productImages = [Prod1, Prod2, Prod3, Prod4];
const products = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: "Optimum Nutrition Whey Protein",
  price: "Rs.2000",
  desc: "Fuel your workouts and speed up recovery with high-quality whey protein isolate. Packed...",
  reviews: 250,
  image: productImages[i % 4],
}));
const mealImages = [Meal1, Meal2, Meal3, Meal4, Meal5, Meal6];
const meals = [
  {
    image: Meal1,
    name: 'Greek Salad with Feta',
    desc: 'Crisp cucumbers, tomatoes, olives, and feta cheese tossed in olive oil for a light yet filling option.',
    price: 'Rs.1200',
  },
  {
    image: Meal2,
    name: 'Grilled Chicken & Quinoa Bowl',
    desc: 'A lean protein-packed meal with fluffy quinoa, fresh greens, and a light dressing for all-day energy.',
    price: 'Rs.1500',
  },
  {
    image: Meal3,
    name: 'PRO Steamed Salmon with Veggies',
    desc: 'Omega-3 rich salmon paired with broccoli, carrots, and a squeeze of lemon for clean nutrition.',
    price: 'Rs.1700',
  },
  {
    image: Meal4,
    name: 'Paneer Tikka Salad',
    desc: 'High-protein paneer tikka served on a bed of crisp salad for vegetarians.',
    price: 'Rs.1100',
  },
  {
    image: Meal5,
    name: 'Egg White Omelette',
    desc: 'Fluffy egg white omelette loaded with veggies for a light, protein-rich meal.',
    price: 'Rs.900',
  },
  {
    image: Meal6,
    name: 'Tofu Stir Fry',
    desc: 'Tofu and mixed vegetables stir-fried in a savory sauce for a vegan delight.',
    price: 'Rs.1000',
  },
];
const featuredPrograms = [
  {
    title: "Fitness Plans",
    desc: "Tailored workouts based on your goals, fitness level, and lifestyle.",
    image: Featured1,
  },
  {
    title: "SPersonalized Training Plans",
    desc: "Tailored workouts based on your goals, fitness level, and lifestyle.",
    image: Featured2,
  },
  {
    title: "Personalized Training Plans",
    desc: "Tailored workouts based on your goals, fitness level, and lifestyle.",
    image: Featured3,
  },
  {
    title: "Cardio Burn",
    desc: "Cardio-focused plan for heart health and calorie burn.",
    image: Featured4,
  },
  {
    title: "Cardio Burn",
    desc: "Tailored workouts based on your goals, fitness level, and lifestyle.",
    image: Featured5,
  },
];
const Landing = () => {
  return (
    <div className="landing-container">
      <div className="hero-section top-100">
        <div className="container">
          <h3 className="title">WHET PROTINE</h3>
          <div className="stats">
            <div className="stat">
              100%
              <br />
              TESTED
            </div>
            <div className="stat">
              24gr
              <br />
              PROTEIN
            </div>
          </div>
          <button className="button">
            Shop Now <img src={ShopIcon} alt="" />
          </button>
        </div>
      </div>
      <div className="anoucement">
        100% Authenticity Guaranteed | For Orders Call +92 3001234567
      </div>
      <div className="categories">
        <h3 className="title text-center mb-32">Explore By Categories</h3>
        <div className="items">
          <div className="item">
            <div className="image">
              <img src={Cat1} alt="Category 1" />
            </div>
            <h4 className="text">Supplements</h4>
          </div>
          <div className="item">
            <div className="image">
              <img src={Cat2} alt="Category 2" />
            </div>
            <h4 className="text">Workout Plans</h4>
          </div>
          <div className="item">
            <div className="image">
              <img src={Cat3} alt="Category 3" />
            </div>
            <h4 className="text">Meals Plans</h4>
          </div>
        </div>
      </div>
      {/* All Products  */}
      <div className="products-wrapper bg-gray">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-24">
            <h3 className="title-medium">Best Selling Supplements </h3>
            <a href="#" className="view-all">
              View All
            </a>
          </div>
          <div className="row">
            {products.map((product, idx) => (
              <div className="col-12 col-md-6 col-lg-3" key={product.id}>
                <div className="product-card">
                  <div className="image">
                    <img src={product.image} alt={`Product ${product.id}`} />
                  </div>
                  <h3 className="name">{product.name}</h3>
                  <div className="reviews-container">
                    <div className="reviews">
                      {[...Array(5)].map((_, i) => (
                        <img src={star} alt="" key={i} />
                      ))}
                    </div>
                    <div className="text">({product.reviews})</div>
                  </div>
                  <p className="desc">{product.desc}</p>
                  <div className="bottom">
                    <div className="price">{product.price}</div>
                    <button className="button">
                      Add to Cart
                      <img src={CartImg} alt="" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark container  */}
      <div className="dark-bg padding-40">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-24">
            <h3 className="title-medium">Fitness Programs</h3>
            <a href="#" className="view-all">
              View All
            </a>
          </div>
          <div className="row mb-48">
           <div className="col-12 col-md-6">
            <div className="large-card card-wrapper">
              <div className="content">
                <div className="title">
                  Workout Plan
                </div>
                <div className="bottom">
                  <div className="left">
                    <div className="tag">One-Time Plans</div>
                    <div className="tag">
                      Weight loss
                    </div>
                  </div>
                  <button className="button">
                    Add to Cart <img src={CartImg} alt="" />
                  </button>
                </div>
              </div>
              
            </div>
           </div>
           <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-12 col-md-6">
               <div className="small-card card-wrapper mb-16 one">
                 <div className="content">
                   <div className="title">
                    DIET Plans
                   </div>
                   <div className="bottom">
                    <div className="left">
                      <div className="tag">
                        One-Time Plans
                      </div>
                      <div className="tag"> Weight loss
                      </div>
                    </div>
                    <button className="button">
                      Add to Cart <img src={CartImg} alt="" />
                    </button>
                  </div>
                 </div>
               </div>
              </div>
              <div className="col-12 col-md-6">
               <div className="small-card card-wrapper mb-16 two">
                 <div className="content">
                   <div className="title">
                    Gym Membership
                   </div>
                   <div className="bottom">
                    <div className="left">
                      <div className="tag">
                      Membership Plans
                      </div>
                      <div className="tag"> Weight loss
                      </div>
                    </div>
                    <button className="button">
                      Add to Cart <img src={CartImg} alt="" />
                    </button>
                  </div>
                 </div>
               </div>
              </div>
              <div className="col-12 col-md-6">
               <div className="small-card card-wrapper three">
                 <div className="content">
                   <div className="title">
                   Fitness Plan (Trainer)
                   </div>
                   <div className="bottom">
                    <div className="left">
                      <div className="tag">
                      Membership Plans
                      </div>
                      <div className="tag"> Weight loss
                      </div>
                    </div>
                    <button className="button">
                      Add to Cart <img src={CartImg} alt="" />
                    </button>
                  </div>
                 </div>
               </div>
              </div>
               <div className="col-12 col-md-6">
               <div className="small-card card-wrapper four">
                 <div className="content">
                   <div className="title">
                  Ultimate Fitness Plan
                   </div>
                   <div className="bottom">
                    <div className="left">
                      <div className="tag">
                      Membership Plans
                      </div>
                      <div className="tag"> Weight loss
                      </div>
                    </div>
                    <button className="button">
                      Add to Cart <img src={CartImg} alt="" />
                    </button>
                  </div>
                 </div>
               </div>
              </div>
            </div>
           </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-24">
            <h3 className="title-medium">Meals</h3>
            <a href="#" className="view-all">
              View All
            </a>
          </div>
          <div className="row">
            {meals.map((meal, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={idx}>
                <div className="product-card">
                  <div className="image lg">
                    <img src={meal.image} alt={`Meal ${idx + 1}`} />
                  </div>
                  <h3 className="name">{meal.name}</h3>
                  <p className="desc">{meal.desc}</p>
                  <div className="bottom">
                    <div className="price">{meal.price}</div>
                    <button className="button">Add to Cart
                      <img src={CartImg} alt="" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* Featured Progreams */}
      <div className="bg-gray padding-40">
        <div className="container">
        <h3 className="title-medium mb-24">Featured Programs</h3>
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={4}
          slidesToScroll={1}
          arrows={true}
          cssEase="ease"
          responsive={[
            {
              breakpoint: 1200,
              settings: { slidesToShow: 3, arrows: true },
            },
            {
              breakpoint: 992,
              settings: { slidesToShow: 2, arrows: true },
            },
            {
              breakpoint: 576,
              settings: { slidesToShow: 1, arrows: true },
            },
          ]}
          className="featured-slider"
        >
          {featuredPrograms.map((program, idx) => (
            <div key={idx}>
              <div className="featured-card">
                <div className="image">
                  <img src={program.image} alt={program.title} />
                </div>
              <div className="data">
                  <h3 className="title">{program.title}</h3>
                <p className="desc">{program.desc}</p>
              </div>
                
              </div>
            </div>
          ))}
        </Slider>
      </div>
      </div>
      {/* Trusted by 1000+ Customers WorldWide */}
      <div className="padding-40 dark-bg">
        <div className="container">
          <h3 className="title-medium text-center mb-32">
            <span>Trusted By</span> Leading Companies
          </h3>
          <div className="companies-logo">
            <img src={logo1} alt="" />
            <img src={logo2} alt="" />
            <img src={logo3} alt="" />
            <img src={logo4} alt="" />
            <img src={logo5} alt="" />
          </div>
        </div>
        </div>
        {/* Why Choose Us */}
        <div className="padding-40 bg-gray why-choose-us">
          <div className="container">
            <h3 className="title-medium text-center mb-32">Why Choose Us</h3>
            <div className="row align-items-center">
              <div className="col-12 col-md-6">
                <h3 className="title">
                  From Day One to Your Personal Best Here’s Why Our Gym Delivers Results That Last
                </h3>
                <div className="list-item">
                  <div className="label">
                    The Gym That Gets You Results
                  </div>
                  <p className="text">
                    Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.
                  </p>
                </div>
                 <div className="list-item">
                  <div className="label">
                    Your Fitness Journey Starts Here
                  </div>
                  <p className="text">
                    Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.
                  </p>
                </div>
                 <div className="list-item">
                  <div className="label">
                   Train Smarter. Get Stronger.
                  </div>
                  <p className="text">
                    Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="image">
                  <img src={WhyImage} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Testimonials */}
        <div className="padding-40 dark-bg">
          <div className="container">
 <h3 className="title-medium mb-24">What everyone says</h3>
         <div className="testimonial-slider">
              {/* Testimonial Slider with react-slick */}
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={4}
                slidesToScroll={1}
                arrows={true}
                cssEase="ease"
                responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }]}
                className="testimonial-slider"
              >
                {[
                  {
                    text: "Lacus vestibulum ultricies mi risus, duis non, volutpat nullam non. Magna congue nisi maecenas elit aliquet eu sed consectetur. Vitae quis cras vitae praesent morb.",
                    user: user1,
                    name: "Hellen Jummy",
                    role: "Fitness Trainer",
                  },
                  {
                    text: "Amazing results! The trainers are very supportive and the plans are easy to follow. I achieved my goals faster than expected and felt motivated every step of the way.",
                    user: user2,
                    name: "Jason Smith",
                    role: "Gym Member",
                  },
                  {
                    text: "Best gym experience ever. Highly recommend to anyone serious about fitness. The staff is knowledgeable and the environment is always positive and encouraging.",
                    user: user3,
                    name: "Priya Patel",
                    role: "Athlete",
                  },
                  {
                    text: "Great atmosphere and excellent equipment. I love coming here every day! The trainers provide personalized attention and the community is very welcoming.",
                    user: user1,
                    name: "Hellen Jummy",
                    role: "Fitness Trainer",
                  },
                  {
                    text: "The meal plans are delicious and keep me energized throughout the day. I noticed a big improvement in my performance and overall health since joining.",
                    user: user2,
                    name: "Jason Smith",
                    role: "Gym Member",
                  },
                ].map((testimonial, idx) => (
                  <div className="testimonial-card" key={idx}>
                    <p className="text">{testimonial.text}</p>
                    <div className="profile">
                      <img src={testimonial.user} alt="" />
                      <div className="info">
                        <div className="name">{testimonial.name}</div>
                        <div className="role">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
         </div>
          </div>
        
        </div>

    </div>
  );
};

export default Landing;
