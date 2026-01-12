import React, { useEffect, useRef } from 'react';
import { Users, GraduationCap, Monitor, Globe } from 'lucide-react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';

// مكون الرقم المتحرك (نفس المنطق السابق)
const Counter = ({ value }) => {
  const ref = useRef(null);
  const numericValue = parseInt(value.replace(/,/g, ''), 10);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) motionValue.set(numericValue);
  }, [isInView, motionValue, numericValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(latest.toFixed(0));
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
};

const StatsSection = () => {
  const stats = [
    {
      id: 1,
      label: 'دورة تدريبية',
      value: '498',
      icon: <Monitor size={24} />,
    },
    {
      id: 2,
      label: 'متدرب',
      value: '7,225',
      icon: <GraduationCap size={24} />,
    },
    {
      id: 3,
      label: 'الدورات التدريب عن بعد (ONLINE)',
      value: '35',
      icon: <Globe size={24} />,
    },
    
    {
      id: 4,
      label: 'المتدربين للدورات عن بعد (ONLINE)',
      value: '500',
      icon: <Users size={24} />,
    },
    
    
  ];

  return (
    <section style={{ 
      width: '100%', 
      padding: '100px 0', 
      backgroundImage: 'linear-gradient(#ffffff,#ffffff)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      textAlign: 'center',
      color: 'white'
    }}>        
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-[#f57c00]">
            لدينا خلال العام 2023 - 2024 أكثر من :
          </h2>
        </div>

                    {/* Professional Deep-Layered Container */}
          <div 
            className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 transition-all duration-300"
            style={{ 
              /* This creates a huge, deep professional shadow using layers */
              boxShadow: `
                0px 1px 20px rgba(0, 0, 0, 0.06), 
                0px 4px 80px rgba(0, 0, 0, 0.1), 
                0px 20px 400px rgba(0, 0, 0, 0.15), 
                0px 40px 800px rgba(0, 0, 0, 0.2)
              `
            }}
          >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat) => (
              <motion.div 
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.id * 0.1 }}
                className="flex flex-col items-start md:items-center lg:items-start space-y-4"
              >
                <div className="flex items-center gap-4">
                  {/* الأيقونة باللون البرتقالي المخصص وخلفية فاتحة جداً */}
                  <div 
                    className="p-3 rounded-xl flex items-center justify-center border"
                    style={{ 
                      color: '#f57c00', 
                      backgroundColor: '#fff7ed', 
                      borderColor: '#ffedd5' 
                    }}
                  >
                    {stat.icon}
                  </div>
                  
                  {/* الرقم مع الزائد باللون البرتقالي */}
                  <div className="text-3xl font-bold text-slate-800 tracking-tight flex items-center">
                    <Counter value={stat.value} />
                    <span style={{ color: '#f57c00' }} className="ml-1 font-extrabold text-2xl">+</span>
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-500 pr-2 leading-relaxed">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
    </section>
  );
};

export default StatsSection;