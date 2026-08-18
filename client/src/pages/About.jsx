import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Badge from '../components/ui/Badge';
import albertImg from '../assets/Images/albert.jpg';
import marieeImg from '../assets/Images/mariee.jpeg';
import mahatmaImg from '../assets/Images/mahatma.jpeg';
import mandelaImg from '../assets/Images/Mandela.jpg';
import motherImg from '../assets/Images/mother.jpeg';
import jobsImg from '../assets/Images/jobs.jpeg';

const AboutUs = () => {
  const personalities = [
    {
      name: 'Albert Einstein',
      quote: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
      image: albertImg,
    },
    {
      name: 'Marie Curie',
      quote: 'Nothing in life is to be feared; it is only to be understood.',
      image: marieeImg,
    },
    {
      name: 'Mahatma Gandhi',
      quote: 'Be the change that you wish to see in the world.',
      image: mahatmaImg,
    },
    {
      name: 'Nelson Mandela',
      quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
      image: mandelaImg,
    },
    {
      name: 'Mother Teresa',
      quote: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.',
      image: motherImg,
    },
    {
      name: 'Steve Jobs',
      quote: 'The only way to do great work is to love what you do.',
      image: jobsImg,
    },
  ];

  const values = [
    { title: 'Excellence in Education', desc: 'Providing high-impact, industry-relevant learning experiences.' },
    { title: 'Continuous Improvement', desc: 'Constantly updating curriculum to align with modern standards.' },
    { title: 'Inclusivity & Access', desc: 'Making quality technical education accessible to everyone worldwide.' },
    { title: 'Empowerment', desc: 'Building practical skills that enable real career growth and confidence.' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="indigo" size="sm">Our Mission</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Empowering Great Minds Through Learning
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Welcome to EduMaster. We are dedicated to providing world-class education and hands-on technical training to inspire the next generation of builders, thinkers, and leaders.
        </p>
      </div>

      {/* Quote Carousel */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
        <h2 className="text-xs font-bold uppercase tracking-wider text-center text-slate-400 mb-6">Words of Inspiration</h2>
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          interval={4000}
          showThumbs={false}
          showStatus={false}
        >
          {personalities.map((person, index) => (
            <div key={index} className="flex flex-col items-center py-6 px-4">
              <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
              <p className="text-sm italic text-slate-600 max-w-md mt-2">"{person.quote}"</p>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Values Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="violet" size="sm">Core Principles</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
