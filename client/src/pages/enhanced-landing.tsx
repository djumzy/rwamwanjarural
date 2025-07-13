import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Users, BookOpen, Award, Globe, Wifi, Heart, Target, Eye, Check, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import rrfLogo from "@assets/RRF LOGO.jpg";
import AuthModal from "./auth-modal";
import LearnMore from "./learn-more";
import ContactForm from "@/components/contact-form";
import HeroSlideshow from "@/components/hero-slideshow";
import img1 from "@assets/1_1751298558711.jpeg";
import img2 from "@assets/2_1751298558713.jpeg";
import img3 from "@assets/3_1751298558708.jpeg";
import img4 from "@assets/4_1751298558706.jpeg";
import img5 from "@assets/5_1751298558698.jpeg";
import img6 from "@assets/6_1751298558703.jpeg";
import img7 from "@assets/7_1751298558701.jpeg";

import img9 from "@assets/9_1751298558714.jpeg";
import orgBg from "@assets/1_1751298558711.jpeg";
import impactImg from "@assets/4_1751298558706.jpeg";

export default function EnhancedLanding() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

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
    return (
      <LearnMore 
        onBack={() => setShowLearnMore(false)}
        onGetStarted={() => {
          setShowLearnMore(false);
          setShowAuthModal(true);
        }}
      />
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Slideshow Background */}
      <HeroSlideshow images={[img1, img2, img3, img4, img5, img6, img7, img9]}>
        {/* Enhanced Header */}
        <header className="px-4 lg:px-6 h-20 flex items-center justify-between bg-black/30 backdrop-blur-md relative z-10 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={rrfLogo} alt="RRF Logo" className="w-16 h-16 object-contain rounded-full border-2 border-white/20 bg-white/10 p-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">RRF Learning Platform</h1>
              <p className="text-sm text-white/90 font-medium">Empowering refugee and rural communities through permaculture education</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-right">
              <p className="text-white/80 text-sm">Trusted by</p>
              <p className="text-white font-bold">1,200+ Students</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Expert Led</p>
              <p className="text-white font-bold">Local Instructors</p>
            </div>
            <div className="text-right">
              <a href="https://www.thedreamres.org/" target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm hover:text-white transition-colors">
                developed by THE DREAMERS
              </a>
            </div>
          </div>
        </header>

        {/* Enhanced Hero Content */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              {/* Main Headline */}
              <div className="mb-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                  Permaculture for{" "}
                  <span className="text-rrf-green bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    Regeneration
                  </span>
                </h1>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="h-px bg-white/30 w-16"></div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <span className="text-2xl">🌱</span>
                    <span className="font-medium">Expert-Led • Community-Driven • Locally Rooted</span>
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div className="h-px bg-white/30 w-16"></div>
                </div>
              </div>

              {/* Enhanced Description */}
              <p className="text-xl lg:text-2xl text-white/95 mb-8 max-w-4xl mx-auto drop-shadow-md leading-relaxed">
                Join <strong className="text-rrf-green">1,200+ students</strong> learning from local experts in East Africa. 
                Master sustainable practices, build resilient communities, and transform landscapes through proven permaculture education.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">🎓</div>
                  <h3 className="text-white font-bold mb-2">Expert Instructors</h3>
                  <p className="text-white/80 text-sm">Learn from local permaculture experts with 10+ years of experience in East Africa</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="text-white font-bold mb-2">Certified Learning</h3>
                  <p className="text-white/80 text-sm">Earn recognized certificates that validate your permaculture knowledge and skills</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="text-white font-bold mb-2">Community Support</h3>
                  <p className="text-white/80 text-sm">Connect with fellow learners and experienced practitioners in your local area</p>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-rrf-green hover:bg-rrf-dark-green text-white shadow-2xl px-8 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-200"
                  onClick={() => setShowAuthModal(true)}
                >
                  <span className="mr-2">🚀</span>
                  Start Learning Today
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl backdrop-blur-md px-8 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-200"
                  onClick={() => setShowLearnMore(true)}
                >
                  <span className="mr-2">📖</span>
                  Explore Courses
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <span className="text-rrf-green">✓</span>
                  <span>Trusted by DIT Uganda</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-rrf-green">✓</span>
                  <span>9+ years of impact in Uganda</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-rrf-green">✓</span>
                  <span>Available in multiple languages</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HeroSlideshow>

      {/* Enhanced Who We Are Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white via-green-50/30 to-white relative overflow-hidden" style={{ backgroundImage: `url(${orgBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-60 bg-black/30"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">🌱</div>
          <div className="absolute top-32 right-20 text-4xl">🌍</div>
          <div className="absolute bottom-20 left-20 text-5xl">🤝</div>
          <div className="absolute bottom-32 right-10 text-3xl">🎓</div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-rrf-green/10 rounded-full px-6 py-2 mb-6">
              <span className="text-rrf-green font-semibold">🏆 Award-Winning Organization</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet <span className="text-rrf-green">Rwamwanja Rural Foundation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Rwamwanja Rural Foundation (RRF), a refugee‑led grassroots NGO in Uganda, has been honoured with the Lush Spring Prize 2023 and the Webby International Award 2024 in recognition of its groundbreaking work in ecological regeneration and community empowerment. Rooted in permaculture, indigenous practices, and practical entrepreneurship, RRF equips refugees and host‑community members—especially women and youth—with the skills to rebuild degraded ecosystems and restore food sovereignty.
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
              The Lush Spring Prize awarded £20,000 to RRF in 2023, enabling the establishment of regenerative agriculture learning centres across twelve East‑African refugee settlements. This investment fortified their capacity to train 500+ young refugees in permaculture techniques like kitchen gardening, agroforestry, composting, and mushroom cultivation, yielding immediate benefits in nutrition, income, and soil health.
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
              Building on this, the Webby International Award in 2024 celebrated RRF's innovative use of digital platforms to share regenerative‑agriculture resources in local languages. By creating accessible online materials, they've extended their reach far beyond Uganda, scaling up climate resilience education within displaced communities.
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
              RRF's work is vital for ecological regeneration: it restores biodiversity through tree planting and composting, rebuilds soils, and combats climate‑driven degradation. Simultaneously, it fosters social regeneration—transforming aid dependency into community‑led entrepreneurship, dignity, and long‑term self‑reliance. RRF exemplifies how grassroots action, award‑backed support, and digital innovation can regenerate ecosystems and lives.
            </p>
          </div>

          {/* Enhanced Story Cards */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rrf-green to-rrf-dark-green rounded-2xl flex items-center justify-center">
                  <Sprout className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We empower refugee and rural communities through comprehensive permaculture education, mushroom cultivation training, and regenerative livelihood programs that build sustainable futures.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-rrf-green">9</p>
                  <p className="text-sm text-gray-600">Years of Impact</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-rrf-green">25,000+</p>
                  <p className="text-sm text-gray-600">Individuals Impacted</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <img src={impactImg} alt="Our Impact" className="w-full h-40 object-cover rounded-2xl mb-6" />
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Impact</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Training refugees and rural communities in Uganda, Kenya, and Tanzania with practical skills that transform landscapes and create sustainable livelihoods for generations.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">1,200+</p>
                  <p className="text-sm text-gray-600">Students Trained</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">250+</p>
                  <p className="text-sm text-gray-600">Villages Impacted</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">25,000+</p>
                  <p className="text-sm text-gray-600">Individuals Impacted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-rrf-green to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Sprout className="text-white w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Permaculture Expertise</h4>
              <p className="text-gray-600 leading-relaxed">
                Master sustainable farming, soil regeneration, and ecosystem design with guidance from certified local experts who understand the unique challenges of East African agriculture.
              </p>
            </div>

            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="text-white w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Proven Methods</h4>
              <p className="text-gray-600 leading-relaxed">
                Learn field-tested techniques that have successfully transformed over 50 communities, combining traditional knowledge with modern sustainable practices.
              </p>
            </div>

            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Community Network</h4>
              <p className="text-gray-600 leading-relaxed">
                Join a supportive network of learners, mentors, and practitioners who share resources, celebrate successes, and overcome challenges together.
              </p>
            </div>
          </div>

          {/* Local Expert Highlight */}
          <div className="bg-gradient-to-r from-rrf-green to-rrf-dark-green rounded-3xl p-8 lg:p-12 text-white text-center">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-6 py-2 mb-4">
                <span className="text-2xl">🌟</span>
                <span className="font-semibold">Locally Rooted, Globally Informed</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Education by Experts, For Communities
              </h3>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Our instructors are experienced practitioners who have successfully implemented permaculture solutions in refugee settlements and rural communities across Uganda, Kenya, and Tanzania.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <p className="font-bold text-lg">Practical Focus</p>
                <p className="text-sm text-white/80">Real-world applicable skills</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <p className="font-bold text-lg">Local Context</p>
                <p className="text-sm text-white/80">Climate-specific solutions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <p className="font-bold text-lg">Community-Led</p>
                <p className="text-sm text-white/80">By refugees, for refugees</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📜</div>
                <p className="font-bold text-lg">Certified</p>
                <p className="text-sm text-white/80">Recognized credentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Organization Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src={rrfLogo} alt="RRF Logo" className="w-8 h-8 object-contain rounded-lg border border-white/20 bg-white/10 p-1" />
                <span className="text-lg font-semibold">RRF Learning Platform</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering refugee and rural communities through permaculture education. Trusted by DIT Uganda.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-rrf-green" />
                  <span>Nkoma Katalyeba Town Council, Uganda</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-rrf-green" />
                  <a href="mailto:info@rrfuganda.org" className="hover:text-rrf-green transition-colors">
                    info@rrfuganda.org
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-rrf-green" />
                  <a href="tel:+256786625299" className="hover:text-rrf-green transition-colors">
                    +256 786 625299
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="hover:text-rrf-green transition-colors"
                  >
                    Login / Register
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowLearnMore(true)}
                    className="hover:text-rrf-green transition-colors"
                  >
                    Browse Courses
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className="hover:text-rrf-green transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <a href="#about" className="hover:text-rrf-green transition-colors">
                    About RRF
                  </a>
                </li>
              </ul>
            </div>

            {/* Office Hours */}
            <div>
              <h3 className="text-white font-semibold mb-4">Office Hours</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p className="text-rrf-green font-medium">Monday - Friday</p>
                <p>8:30 AM - 5:30 PM</p>
                <p className="text-gray-500 mt-2">East Africa Time (EAT)</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex flex-col items-center md:items-start">
              <p>&copy; 2024 Rwamwanja Rural Foundation. All rights reserved.</p>
              <a href="https://www.thedreamres.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rrf-green transition-colors mt-1">
                developed by THE DREAMERS
              </a>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="hover:text-rrf-green transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-rrf-green transition-colors">Terms of Service</a>
              <a href="#support" className="hover:text-rrf-green transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}