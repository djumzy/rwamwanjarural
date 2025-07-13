import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Users, BookOpen, Award, Globe, Wifi, Heart, Target, Eye, Check, Mail, Phone, MapPin, GraduationCap, Download, Handshake } from "lucide-react";
import rrfLogo from "@assets/RRF LOGO.jpg";
import AuthModal from "./auth-modal";
// import LearnMore from "./learn-more"; // Removed unused component
import ContactForm from "@/components/contact-form";
import NewsletterForm from "@/components/newsletter-form";
import VolunteerForm from "@/components/volunteer-form";
import PartnershipForm from "@/components/partnership-form";
import HeroSlideshow from "@/components/hero-slideshow";
import awardImg from "@assets/award_1752357197629.jpg";
import labImg from "@assets/lab_1752357203731.jpg";
import workImg from "@assets/work_1752357209693.jpg";
import img1 from "@assets/1_1751298558711.jpeg";
import img2 from "@assets/2_1751298558713.jpeg";
import img3 from "@assets/3_1751298558708.jpeg";
import img4 from "@assets/4_1751298558706.jpeg";
import img5 from "@assets/5_1751298558698.jpeg";
import img6 from "@assets/6_1751298558703.jpeg";
import img7 from "@assets/7_1751298558701.jpeg";
import img9 from "@assets/9_1751298558714.jpeg";

export default function NewEnhancedLanding() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);

  if (showContactForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </section>
      </div>
    );
  }

  if (showLearnMore) {
    // Learn More functionality integrated inline
    setShowLearnMore(false);
    setShowAuthModal(true);
  }

  const downloadApplicationForm = () => {
    // Create a link to download the PDF form
    const link = document.createElement('a');
    link.href = '/attached_assets/application form _1752357115281.pdf';
    link.download = 'RRF_Partnership_Application_Form.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Slideshow Background */}
      <HeroSlideshow images={[img1, img2, img3, img4, img5, img6, img7, img9]}>
        {/* Enhanced Header */}
        <header className="px-4 lg:px-6 h-16 md:h-20 flex items-center justify-between bg-black/30 backdrop-blur-md relative z-10 border-b border-white/10">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <img src={rrfLogo} alt="RRF Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full border-2 border-white/20 bg-white/10 p-1" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white">RRF Learning Platform</h1>
              <p className="text-xs md:text-sm text-white/90 font-medium hidden sm:block">Empowering refugee and rural communities through permaculture education</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-right">
              <p className="text-white/80 text-sm">Trusted by</p>
              <p className="text-white font-bold">1,200+ Students</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Expert Led</p>
              <p className="text-white font-bold">Local Instructors</p>
            </div>
            <div className="text-right">
              <a href="https://thedreamres.org/" target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm hover:text-green-400 transition-colors">
                developed by THE DREAMERS
              </a>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">
              Permaculture for{" "}
              <span className="text-green-400">Regeneration</span>
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto drop-shadow-md px-4">
              A comprehensive e-learning platform designed specifically for refugee and rural communities. 
              Learn sustainable practices, build resilient communities, and transform landscapes through permaculture education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg w-full sm:w-auto"
                onClick={() => setShowAuthModal(true)}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/80 text-white hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto"
                onClick={() => setShowLearnMore(true)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </HeroSlideshow>

      {/* Meet RRF Section with Creative Image Layout */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Rwamwanja Rural Foundation
            </h2>
            <div className="text-gray-600 text-base md:text-lg leading-relaxed max-w-6xl mx-auto space-y-4 px-4">
              <p>
                Rwamwanja Rural Foundation (RRF), a refugee‑led grassroots NGO in Uganda, has been honoured with the <strong className="text-rrf-green">Lush Spring Prize 2023</strong> and the <strong className="text-rrf-green">Webby International Award 2024</strong> in recognition of its groundbreaking work in ecological regeneration and community empowerment. Rooted in permaculture, indigenous practices, and practical entrepreneurship, RRF equips refugees and host‑community members—especially women and youth—with the skills to rebuild degraded ecosystems and restore food sovereignty.
              </p>
              <p>
                Building on this, the Webby International Award in 2024 celebrated RRF's innovative use of digital platforms to share regenerative‑agriculture resources in local languages. By creating accessible online materials, they've extended their reach far beyond Uganda, scaling up climate resilience education within displaced communities.
              </p>
              <p>
                RRF's work is vital for ecological regeneration: it restores biodiversity through tree planting and composting, rebuilds soils, and combats climate‑driven degradation. Simultaneously, it fosters social regeneration—transforming aid dependency into community‑led entrepreneurship, dignity, and long‑term self‑reliance. RRF exemplifies how grassroots action, award‑backed support, and digital innovation can regenerate ecosystems and lives.
              </p>
            </div>
          </div>

          {/* Award Recognition section with image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900">Award-Winning Recognition</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-gray-900 mb-2">Lush Spring Prize 2023</h4>
                  <p className="text-gray-700">£20,000 award for establishing regenerative agriculture learning centres across 12 East African refugee settlements</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 mb-2">Webby International Award 2024</h4>
                  <p className="text-gray-700">Recognition for innovative digital platforms sharing regenerative agriculture resources in local languages</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={awardImg} 
                alt="RRF Award Recognition" 
                className="rounded-2xl shadow-2xl w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Research & Lab section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
            <div className="lg:order-2 space-y-4 md:space-y-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-rrf-green" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Research & Innovation</h3>
              </div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Our state-of-the-art laboratory and research facilities enable us to develop cutting-edge solutions 
                for sustainable agriculture, mushroom cultivation, and environmental restoration.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-rrf-green" />
                  <span className="text-gray-700 text-sm md:text-base">Modern Laboratory</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-rrf-green" />
                  <span className="text-gray-700 text-sm md:text-base">Scientific Research</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-rrf-green" />
                  <span className="text-gray-700 text-sm md:text-base">Innovation Hub</span>
                </div>
              </div>
            </div>
            <div className="lg:order-1 relative">
              <img 
                src={labImg} 
                alt="RRF Research Laboratory" 
                className="rounded-2xl shadow-2xl w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Community Work section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-rrf-green" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Community-Centered Work</h3>
              </div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                We work directly with local communities, providing hands-on training and support. 
                Our programs are designed by and for the communities we serve, ensuring sustainable impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-rrf-green" />
                  <span className="text-gray-700 text-sm md:text-base">Community Leadership</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-rrf-green" />
                  <span className="text-gray-700 text-sm md:text-base">Hands-on Training</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-rrf-green" />
                  <span className="text-gray-700 text-sm md:text-base">Sustainable Impact</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={workImg} 
                alt="RRF Community Work" 
                className="rounded-2xl shadow-2xl w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Stay Connected
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Join our newsletter to receive updates on new courses, success stories, and impact reports from our communities.
            </p>
          </div>
          <div className="flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Partnership Application
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
            Ready to partner with RRF? Fill out our application form online or download the PDF version.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-rrf-green hover:bg-rrf-dark-green text-white w-full sm:w-auto"
              onClick={() => setShowPartnershipForm(true)}
            >
              <Handshake className="w-5 h-5 mr-2" />
              Apply Online
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={downloadApplicationForm}
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF Form
            </Button>
          </div>
        </div>
      </section>

      {/* Footer with Volunteer and Partnership Forms */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Organization Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={rrfLogo} alt="RRF Logo" className="w-12 h-12 object-contain rounded-full" />
                <h3 className="text-xl font-bold">RRF Learning</h3>
              </div>
              <p className="text-gray-300">
                Empowering communities through permaculture education and sustainable practices.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">info@rrfuganda.org</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About RRF</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Our Programs</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get Involved</h4>
              <div className="space-y-3">
                <button 
                  className="w-full px-4 py-2 text-sm text-white border border-white rounded-md hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center space-x-2"
                  onClick={() => setShowVolunteerForm(true)}
                >
                  <Heart className="w-4 h-4" />
                  <span>Volunteer with Us</span>
                </button>
                <button 
                  className="w-full px-4 py-2 text-sm text-white border border-white rounded-md hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center space-x-2"
                  onClick={() => setShowPartnershipForm(true)}
                >
                  <Handshake className="w-4 h-4" />
                  <span>Partnership Form</span>
                </button>
                <button 
                  className="w-full px-4 py-2 text-sm text-white border border-white rounded-md hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center space-x-2"
                  onClick={downloadApplicationForm}
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Form</span>
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    Rwamwanja Rural Foundation<br />
                    Uganda, East Africa
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">ruramwanjaruralfoundation@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <a href="https://thedreamres.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white">
                    rrfuganda.org
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Rwamwanja Rural Foundation. All rights reserved. | Developed by THE DREAMERS
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
      {showVolunteerForm && <VolunteerForm onClose={() => setShowVolunteerForm(false)} />}
      {showPartnershipForm && <PartnershipForm onClose={() => setShowPartnershipForm(false)} />}
    </div>
  );
}
