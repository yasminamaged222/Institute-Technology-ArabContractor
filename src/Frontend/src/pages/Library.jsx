// import React from 'react';
// import { BookOpen, Check, Building2 } from 'lucide-react';

// export default function Library() {
//   const features = [
//     {
//       text: "تضم المكتبة تخبة من الكتب المتميزة والتي تزيد عن أربعة ألاف كتاباً في جميع مجالات العلوم الهندسية المختلفة (مدنية – معمارية – ميكانيكا – كهرباء – صحي – مساحة .....) إلى جانب العلوم الأخرى (الإدارة – الاقتصاد – القانون – المحاسبة – الحاسب الآلي...)"
//     },
//     {
//       text: "تشترك المكتبة في17 دورية علمية متخصصة تغطي معظم المجالات المختلفة والتي تخدم جميع مشروعات الشركة."
//     },
//     {
//       text: "3 مواقع متخصصة (موقع global render – موقع خلاصات كتب المدير وملفات المختار الإداري – موقع بوابة الخدمات القانونية)"
//     },
//     {
//       text: "تحتوي المكتبة على أكثر من 2500 مادة علمية متخصصة بها خلاصة الخبرات العلمية لمشروعات الشركة والتي تم إعدادها من قبل الخبراء والمتخصصين بالشركة بهدف نقل الخبرات المختلفة إلى جميع العاملين من خلال العملية التدريبية."
//     }
//   ];

//   const books = [
//     {
//       title: "Capture and reuse of project knowledge in construction",
//       publisher: "Willy-Blackwell",
//       image: "https://www.arabcont.com/icemt/assets/images/Book01.jpg",
//       url: "https://online.fliphtml5.com/cvhml/vzfl/#p=1"
//     },
//     {
//       title: "ICE manual of highway design and management",
//       publisher: "Second Edition",
//       image: "https://www.arabcont.com/icemt/assets/images/Book02.jpg",
//       url: "https://online.fliphtml5.com/cvhml/qzxx/#p=1"
//     },
//     {
//       title: "Construction Dewatering and Groundwater Control",
//       publisher: "Third Edition",
//       image: "https://www.arabcont.com/icemt/assets/images/Book03.jpg",
//       url: "https://online.fliphtml5.com/cvhml/wdbx/#p=1"
//     }
//   ];

//   const handleBookClick = (url) => {
//     window.open(url, '_blank', 'noopener,noreferrer');
//   };

//   return (
//     <div style={styles.page}>


//       {/* Main Content */}
//       <main style={styles.main}>
//         {/* Title Section */}
//         <div style={styles.titleSection}>
//           <div style={styles.iconWrapper}>
//             <BookOpen style={styles.iconWrapperSvg} />
//           </div>
//           <h2 style={styles.mainTitle}>المكتبة</h2>
//           <div style={styles.titleUnderline}></div>
//         </div>

//         {/* Description Card */}
//         <div style={styles.descriptionCard}>
//           <p style={styles.descriptionText}>
//             لدينا مكتبة عريقة تم إنشاؤها منذ عام 1975 وذلك إيماناً من شركة المقاولون العرب بأهمية القراءة والاطلاع المستمر ومعرفة كل ما هو حديث وجديد بسوق العمل
//           </p>
//         </div>

//         {/* Library Image */}
//         <div style={styles.imageContainer}>
//           <img 
//             src="https://www.arabcont.com/icemt/assets/images/library-02.jpg" 
//             alt="المكتبة" 
//             style={styles.libraryImage}
//           />
//         </div>

//         {/* Features Grid */}
//         <div style={styles.featuresGrid}>
//           {features.map((feature, index) => (
//             <FeatureCard key={index} text={feature.text} />
//           ))}
//         </div>

//         {/* Footer Note */}
//         <div style={styles.footerNote}>
//           <div style={styles.noteBadge}>
//             <p style={styles.noteText}>القسم الأول - المحتوى الثابت</p>
//           </div>
//         </div>

//         {/* Books Section */}
//         <div style={styles.booksSection}>
//           <h2 style={styles.booksTitle}>أمثلة من الكتب</h2>
//           <div style={styles.booksGrid}>
//             {books.map((book, index) => (
//               <BookCard 
//                 key={index} 
//                 book={book}
//                 onClick={() => handleBookClick(book.url)}
//               />
//             ))}
//           </div>
//         </div>
//       </main>


//     </div>
//   );
// }

// function FeatureCard({ text }) {
//   return (
//     <div style={styles.featureCard}>
//       <div style={styles.featureContent}>
//         <div style={styles.checkIconWrapper}>
//           <div style={styles.checkIcon}>
//             <Check style={styles.checkIconSvg} />
//           </div>
//         </div>
//         <p style={styles.featureText}>{text}</p>
//       </div>
//     </div>
//   );
// }

// function BookCard({ book, onClick }) {
//   const [isHovered, setIsHovered] = React.useState(false);

//   return (
//     <div 
//       style={{
//         ...styles.bookCard,
//         ...(isHovered ? styles.bookCardHover : {})
//       }}
//       onClick={onClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div style={styles.bookImageWrapper}>
//         <img 
//           src={book.image} 
//           alt={book.title}
//           style={{
//             ...styles.bookImage,
//             ...(isHovered ? styles.bookImageHover : {})
//           }}
//         />
//         <div style={{
//           ...styles.bookOverlay,
//           ...(isHovered ? styles.bookOverlayVisible : {})
//         }}>
//           <div style={styles.searchIcon}>
//             <svg 
//               width="40" 
//               height="40" 
//               viewBox="0 0 24 24" 
//               fill="none" 
//               stroke="currentColor" 
//               strokeWidth="2"
//               style={styles.searchIconSvg}
//             >
//               <circle cx="11" cy="11" r="8"></circle>
//               <path d="m21 21-4.35-4.35"></path>
//             </svg>
//           </div>
//         </div>
//       </div>
//       <div style={styles.bookInfo}>
//         <p style={styles.bookPublisher}>{book.publisher}</p>
//         <h3 style={styles.bookTitleText}>{book.title}</h3>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #f8fafc 100%)',
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
//   },
//   header: {
//     background: 'white',
//     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//     borderBottom: '4px solid #2563eb'
//   },
//   headerContent: {
//     maxWidth: '1280px',
//     margin: '0 auto',
//     padding: '24px 32px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   headerLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px'
//   },
//   headerIcon: {
//     width: '40px',
//     height: '40px',
//     color: '#2563eb'
//   },
//   headerTitle: {
//     fontSize: '30px',
//     fontWeight: 'bold',
//     color: '#111827',
//     margin: 0
//   },
//   main: {
//     maxWidth: '1280px',
//     margin: '0 auto',
//     padding: '48px 32px'
//   },
//   titleSection: {
//     textAlign: 'center',
//     marginBottom: '48px'
//   },
//   iconWrapper: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80px',
//     height: '80px',
//     background: '#2563eb',
//     borderRadius: '50%',
//     marginBottom: '24px',
//     boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
//   },
//   iconWrapperSvg: {
//     width: '40px',
//     height: '40px',
//     color: 'white'
//   },
//   mainTitle: {
//     fontSize: '36px',
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: '16px'
//   },
//   titleUnderline: {
//     width: '96px',
//     height: '4px',
//     background: '#2563eb',
//     margin: '0 auto',
//     borderRadius: '9999px'
//   },
//   descriptionCard: {
//     background: 'white',
//     borderRadius: '16px',
//     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//     padding: '32px',
//     marginBottom: '48px',
//     borderTop: '4px solid #2563eb'
//   },
//   descriptionText: {
//     fontSize: '20px',
//     color: '#374151',
//     lineHeight: '1.75',
//     textAlign: 'right',
//     margin: 0
//   },
//   imageContainer: {
//     marginBottom: '48px',
//     borderRadius: '16px',
//     overflow: 'hidden',
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
//   },
//   libraryImage: {
//     width: '100%',
//     height: '384px',
//     objectFit: 'cover',
//     display: 'block'
//   },
//   featuresGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//     gap: '32px',
//     marginBottom: '48px'
//   },
//   featureCard: {
//     background: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//     padding: '24px',
//     borderRight: '4px solid #2563eb',
//     transition: 'all 0.3s ease'
//   },
//   featureContent: {
//     display: 'flex',
//     alignItems: 'flex-start',
//     gap: '16px'
//   },
//   checkIconWrapper: {
//     flexShrink: 0,
//     marginTop: '4px'
//   },
//   checkIcon: {
//     width: '32px',
//     height: '32px',
//     background: '#2563eb',
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   checkIconSvg: {
//     width: '20px',
//     height: '20px',
//     color: 'white'
//   },
//   featureText: {
//     color: '#374151',
//     fontSize: '18px',
//     lineHeight: '1.75',
//     textAlign: 'right',
//     flex: 1,
//     margin: 0
//   },
//   footerNote: {
//     marginTop: '48px',
//     textAlign: 'center'
//   },
//   noteBadge: {
//     display: 'inline-block',
//     background: '#dbeafe',
//     borderRadius: '9999px',
//     padding: '12px 24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//   },
//   noteText: {
//     color: '#1e40af',
//     fontWeight: '600',
//     margin: 0
//   },
//   booksSection: {
//     marginTop: '80px',
//     marginBottom: '48px'
//   },
//   booksTitle: {
//     fontSize: '32px',
//     fontWeight: 'bold',
//     color: '#111827',
//     textAlign: 'center',
//     marginBottom: '48px'
//   },
//   booksGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//     gap: '32px'
//   },
//   bookCard: {
//     background: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//     overflow: 'hidden',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease'
//   },
//   bookCardHover: {
//     transform: 'translateY(-8px)',
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
//   },
//   bookImageWrapper: {
//     position: 'relative',
//     overflow: 'hidden',
//     height: '350px'
//   },
//   bookImage: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//     transition: 'transform 0.3s ease'
//   },
//   bookImageHover: {
//     transform: 'scale(1.1)'
//   },
//   bookOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'rgba(37, 99, 235, 0.9)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     opacity: 0,
//     transition: 'opacity 0.3s ease'
//   },
//   bookOverlayVisible: {
//     opacity: 1
//   },
//   searchIcon: {
//     color: 'white'
//   },
//   searchIconSvg: {
//     animation: 'pulse 2s infinite'
//   },
//   bookInfo: {
//     padding: '24px'
//   },
//   bookPublisher: {
//     color: '#f97316',
//     fontWeight: '600',
//     fontSize: '14px',
//     marginBottom: '8px',
//     textTransform: 'uppercase',
//     margin: '0 0 8px 0'
//   },
//   bookTitleText: {
//     color: '#111827',
//     fontSize: '18px',
//     fontWeight: '600',
//     lineHeight: '1.5',
//     margin: 0
//   },
//   footer: {
//     background: '#111827',
//     color: 'white',
//     marginTop: '80px'
//   },
//   footerContent: {
//     maxWidth: '1280px',
//     margin: '0 auto',
//     padding: '32px',
//     textAlign: 'center'
//   },
//   footerText: {
//     color: '#9ca3af',
//     margin: 0
//   }
// };













// import React from 'react';
// import { BookOpen, Check, Building2 , Search, Calendar, Tag, ChevronDown } from 'lucide-react';


// export default function Library() {

//     const [windowWidth, setWindowWidth] = React.useState(
//         typeof window !== 'undefined' ? window.innerWidth : 1200
//     );

//     React.useEffect(() => {
//         const handleResize = () => setWindowWidth(window.innerWidth);
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const isMobile = windowWidth <= 640;
//     const isTablet = windowWidth <= 768 && windowWidth > 640;

//     const features = [
//         {
//             text: "تضم المكتبة تخبة من الكتب المتميزة والتي تزيد عن أربعة ألاف كتاباً في جميع مجالات العلوم الهندسية المختلفة (مدنية – معمارية – ميكانيكا – كهرباء – صحي – مساحة .....) إلى جانب العلوم الأخرى (الإدارة – الاقتصاد – القانون – المحاسبة – الحاسب الآلي...)"
//         },
//         {
//             text: "تشترك المكتبة في17 دورية علمية متخصصة تغطي معظم المجالات المختلفة والتي تخدم جميع مشروعات الشركة."
//         },
//         {
//             text: "3 مواقع متخصصة (موقع global render – موقع خلاصات كتب المدير وملفات المختار الإداري – موقع بوابة الخدمات القانونية)"
//         },
//         {
//             text: "تحتوي المكتبة على أكثر من 2500 مادة علمية متخصصة بها خلاصة الخبرات العلمية لمشروعات الشركة والتي تم إعدادها من قبل الخبراء والمتخصصين بالشركة بهدف نقل الخبرات المختلفة إلى جميع العاملين من خلال العملية التدريبية."
//         }
//     ];

//     const books = [
//         {
//             title: "Capture and reuse of project knowledge in construction",
//             publisher: "Willy-Blackwell",
//             image: "https://www.arabcont.com/icemt/assets/images/Book01.jpg",
//             url: "https://online.fliphtml5.com/cvhml/vzfl/#p=1"
//         },
//         {
//             title: "ICE manual of highway design and management",
//             publisher: "Second Edition",
//             image: "https://www.arabcont.com/icemt/assets/images/Book02.jpg",
//             url: "https://online.fliphtml5.com/cvhml/qzxx/#p=1"
//         },
//         {
//             title: "Construction Dewatering and Groundwater Control",
//             publisher: "Third Edition",
//             image: "https://www.arabcont.com/icemt/assets/images/Book03.jpg",
//             url: "https://online.fliphtml5.com/cvhml/wdbx/#p=1"
//         }
//     ];

//     const handleBookClick = (url) => {
//         window.open(url, '_blank', 'noopener,noreferrer');
//     };

//     const responsiveStyles = getResponsiveStyles(isMobile, isTablet);

//     return (
//         <div style={responsiveStyles.page}>


//             {/* Main Content */}
//             <main style={responsiveStyles.main}>
//                 {/* Title Section */}
//                 <div style={responsiveStyles.titleSection}>
//                     <div style={responsiveStyles.iconWrapper}>
//                         <BookOpen style={responsiveStyles.iconWrapperSvg} />
//                     </div>
//                     <h2 style={responsiveStyles.mainTitle}>المكتبة</h2>
//                     <div style={responsiveStyles.titleUnderline}></div>
//                 </div>

//                 {/* Description Card */}
//                 <div style={responsiveStyles.descriptionCard}>
//                     <p style={responsiveStyles.descriptionText}>
//                         لدينا مكتبة عريقة تم إنشاؤها منذ عام 1975 وذلك إيماناً من شركة المقاولون العرب بأهمية القراءة والاطلاع المستمر ومعرفة كل ما هو حديث وجديد بسوق العمل
//                     </p>
//                 </div>

//                 {/* Library Image */}
//                 <div style={responsiveStyles.imageContainer}>
//                     <img
//                         src="https://www.arabcont.com/icemt/assets/images/library-02.jpg"
//                         alt="المكتبة"
//                         style={responsiveStyles.libraryImage}
//                     />
//                 </div>

//                 {/* Features Grid */}
//                 <div style={responsiveStyles.featuresGrid}>
//                     {features.map((feature, index) => (
//                         <FeatureCard key={index} text={feature.text} isMobile={isMobile} />
//                     ))}
//                 </div>

//                 {/* Footer Note */}
//                 <div style={responsiveStyles.footerNote}>
//                     <div style={responsiveStyles.noteBadge}>
//                         <p style={responsiveStyles.noteText}>القسم الأول - المحتوى الثابت</p>
//                     </div>
//                 </div>

//                 {/* Books Section */}
//                 <div style={responsiveStyles.booksSection}>
//                     <h2 style={responsiveStyles.booksTitle}>أمثلة من الكتب</h2>
//                     <div style={responsiveStyles.booksGrid}>
//                         {books.map((book, index) => (
//                             <BookCard
//                                 key={index}
//                                 book={book}
//                                 onClick={() => handleBookClick(book.url)}
//                                 isMobile={isMobile}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </main>


//         </div>
//     );
// }

// function FeatureCard({ text, isMobile }) {
//     const responsiveFeatureStyles = {
//         featureText: {
//             color: '#374151',
//             fontSize: isMobile ? '16px' : '18px',
//             lineHeight: '1.75',
//             textAlign: 'right',
//             flex: 1,
//             margin: 0
//         }
//     };

//     return (
//         <div style={styles.featureCard}>
//             <div style={styles.featureContent}>
//                 <div style={styles.checkIconWrapper}>
//                     <div style={styles.checkIcon}>
//                         <Check style={styles.checkIconSvg} />
//                     </div>
//                 </div>
//                 <p style={responsiveFeatureStyles.featureText}>{text}</p>
//             </div>
//         </div>
//     );
// }

// function BookCard({ book, onClick, isMobile }) {
//     const [isHovered, setIsHovered] = React.useState(false);

//     const responsiveBookStyles = {
//         bookImageWrapper: {
//             position: 'relative',
//             overflow: 'hidden',
//             height: isMobile ? '300px' : '350px'
//         }
//     };

//     return (
//         <div
//             style={{
//                 ...styles.bookCard,
//                 ...(isHovered ? styles.bookCardHover : {})
//             }}
//             onClick={onClick}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <div style={responsiveBookStyles.bookImageWrapper}>
//                 <img
//                     src={book.image}
//                     alt={book.title}
//                     style={{
//                         ...styles.bookImage,
//                         ...(isHovered ? styles.bookImageHover : {})
//                     }}
//                 />
//                 <div style={{
//                     ...styles.bookOverlay,
//                     ...(isHovered ? styles.bookOverlayVisible : {})
//                 }}>
//                     <div style={styles.searchIcon}>
//                         <svg
//                             width="40"
//                             height="40"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             style={styles.searchIconSvg}
//                         >
//                             <circle cx="11" cy="11" r="8"></circle>
//                             <path d="m21 21-4.35-4.35"></path>
//                         </svg>
//                     </div>
//                 </div>
//             </div>
//             <div style={styles.bookInfo}>
//                 <p style={styles.bookPublisher}>{book.publisher}</p>
//                 <h3 style={styles.bookTitleText}>{book.title}</h3>
//             </div>
//         </div>
//     );
// }

// function getResponsiveStyles(isMobile, isTablet) {
//     return {
//         page: styles.page,
//         header: styles.header,
//         headerContent: {
//             ...styles.headerContent,
//             padding: isMobile ? '20px 16px' : isTablet ? '20px 16px' : '24px 32px'
//         },
//         headerLeft: styles.headerLeft,
//         headerIcon: {
//             ...styles.headerIcon,
//             width: isMobile ? '32px' : '40px',
//             height: isMobile ? '32px' : '40px'
//         },
//         headerTitle: {
//             ...styles.headerTitle,
//             fontSize: isMobile ? '20px' : isTablet ? '24px' : '30px'
//         },
//         main: {
//             ...styles.main,
//             padding: isMobile ? '32px 16px' : isTablet ? '32px 16px' : '48px 32px'
//         },
//         titleSection: styles.titleSection,
//         iconWrapper: {
//             ...styles.iconWrapper,
//             width: isMobile ? '64px' : '80px',
//             height: isMobile ? '64px' : '80px'
//         },
//         iconWrapperSvg: {
//             ...styles.iconWrapperSvg,
//             width: isMobile ? '32px' : '40px',
//             height: isMobile ? '32px' : '40px'
//         },
//         mainTitle: {
//             ...styles.mainTitle,
//             fontSize: isMobile ? '24px' : isTablet ? '28px' : '36px'
//         },
//         titleUnderline: styles.titleUnderline,
//         descriptionCard: styles.descriptionCard,
//         descriptionText: {
//             ...styles.descriptionText,
//             fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px'
//         },
//         imageContainer: styles.imageContainer,
//         libraryImage: {
//             ...styles.libraryImage,
//             height: isMobile ? '250px' : isTablet ? '300px' : '384px'
//         },
//         featuresGrid: {
//             ...styles.featuresGrid,
//             gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(2, 1fr)'
//         },
//         footerNote: styles.footerNote,
//         noteBadge: styles.noteBadge,
//         noteText: styles.noteText,
//         booksSection: styles.booksSection,
//         booksTitle: {
//             ...styles.booksTitle,
//             fontSize: isMobile ? '22px' : isTablet ? '24px' : '32px'
//         },
//         booksGrid: {
//             ...styles.booksGrid,
//             gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
//         },
//         footer: styles.footer,
//         footerContent: styles.footerContent,
//         footerText: styles.footerText
//     };
// }

// const styles = {
//     page: {
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #f8fafc 100%)',
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
//     },
//     header: {
//         background: 'white',
//         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//         borderBottom: '4px solid #2563eb'
//     },
//     headerContent: {
//         maxWidth: '1280px',
//         margin: '0 auto',
//         padding: '24px 32px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between'
//     },
//     headerLeft: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px'
//     },
//     headerIcon: {
//         width: '40px',
//         height: '40px',
//         color: '#2563eb'
//     },
//     headerTitle: {
//         fontSize: '30px',
//         fontWeight: 'bold',
//         color: '#111827',
//         margin: 0
//     },
//     main: {
//         maxWidth: '1280px',
//         margin: '0 auto',
//         padding: '48px 32px'
//     },
//     titleSection: {
//         textAlign: 'center',
//         marginBottom: '48px'
//     },
//     iconWrapper: {
//         display: 'inline-flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '80px',
//         height: '80px',
//         background: '#2563eb',
//         borderRadius: '50%',
//         marginBottom: '24px',
//         boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
//     },
//     iconWrapperSvg: {
//         width: '40px',
//         height: '40px',
//         color: 'white'
//     },
//     mainTitle: {
//         fontSize: '36px',
//         fontWeight: 'bold',
//         color: '#111827',
//         marginBottom: '16px'
//     },
//     titleUnderline: {
//         width: '96px',
//         height: '4px',
//         background: '#2563eb',
//         margin: '0 auto',
//         borderRadius: '9999px'
//     },
//     descriptionCard: {
//         background: 'white',
//         borderRadius: '16px',
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//         padding: '32px',
//         marginBottom: '48px',
//         borderTop: '4px solid #2563eb'
//     },
//     descriptionText: {
//         fontSize: '20px',
//         color: '#374151',
//         lineHeight: '1.75',
//         textAlign: 'right',
//         margin: 0
//     },
//     imageContainer: {
//         marginBottom: '48px',
//         borderRadius: '16px',
//         overflow: 'hidden',
//         boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
//     },
//     libraryImage: {
//         width: '100%',
//         height: '384px',
//         objectFit: 'cover',
//         display: 'block'
//     },
//     featuresGrid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(2, 1fr)',
//         gap: '32px',
//         marginBottom: '48px'
//     },
//     featureCard: {
//         background: 'white',
//         borderRadius: '12px',
//         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//         padding: '24px',
//         borderRight: '4px solid #2563eb',
//         transition: 'all 0.3s ease'
//     },
//     featureContent: {
//         display: 'flex',
//         alignItems: 'flex-start',
//         gap: '16px'
//     },
//     checkIconWrapper: {
//         flexShrink: 0,
//         marginTop: '4px'
//     },
//     checkIcon: {
//         width: '32px',
//         height: '32px',
//         background: '#2563eb',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     checkIconSvg: {
//         width: '20px',
//         height: '20px',
//         color: 'white'
//     },
//     featureText: {
//         color: '#374151',
//         fontSize: '18px',
//         lineHeight: '1.75',
//         textAlign: 'right',
//         flex: 1,
//         margin: 0
//     },
//     footerNote: {
//         marginTop: '48px',
//         textAlign: 'center'
//     },
//     noteBadge: {
//         display: 'inline-block',
//         background: '#dbeafe',
//         borderRadius: '9999px',
//         padding: '12px 24px',
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//     },
//     noteText: {
//         color: '#1e40af',
//         fontWeight: '600',
//         margin: 0
//     },
//     booksSection: {
//         marginTop: '80px',
//         marginBottom: '48px'
//     },
//     booksTitle: {
//         fontSize: '32px',
//         fontWeight: 'bold',
//         color: '#111827',
//         textAlign: 'center',
//         marginBottom: '48px'
//     },
//     booksGrid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//         gap: '32px'
//     },
//     bookCard: {
//         background: 'white',
//         borderRadius: '12px',
//         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//         overflow: 'hidden',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease'
//     },
//     bookCardHover: {
//         transform: 'translateY(-8px)',
//         boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
//     },
//     bookImageWrapper: {
//         position: 'relative',
//         overflow: 'hidden',
//         height: '350px'
//     },
//     bookImage: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//         transition: 'transform 0.3s ease'
//     },
//     bookImageHover: {
//         transform: 'scale(1.1)'
//     },
//     bookOverlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'rgba(37, 99, 235, 0.9)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         opacity: 0,
//         transition: 'opacity 0.3s ease'
//     },
//     bookOverlayVisible: {
//         opacity: 1
//     },
//     searchIcon: {
//         color: 'white'
//     },
//     searchIconSvg: {
//         animation: 'pulse 2s infinite'
//     },
//     bookInfo: {
//         padding: '24px'
//     },
//     bookPublisher: {
//         color: '#f97316',
//         fontWeight: '600',
//         fontSize: '14px',
//         marginBottom: '8px',
//         textTransform: 'uppercase',
//         margin: '0 0 8px 0'
//     },
//     bookTitleText: {
//         color: '#111827',
//         fontSize: '18px',
//         fontWeight: '600',
//         lineHeight: '1.5',
//         margin: 0
//     },
//     footer: {
//         background: '#111827',
//         color: 'white',
//         marginTop: '80px'
//     },
//     footerContent: {
//         maxWidth: '1280px',
//         margin: '0 auto',
//         padding: '32px',
//         textAlign: 'center'
//     },
//     footerText: {
//         color: '#9ca3af',
//         margin: 0
//     }
// };

















import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Building2, Search, Calendar, Tag } from 'lucide-react';
import libraryImage from '/images/library-02.jpg';


export default function Library() {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 640;
    const isTablet = windowWidth <= 768 && windowWidth > 640;

    const features = [
        {
            text: "تضم المكتبة تخبة من الكتب المتميزة والتي تزيد عن أربعة ألاف كتاباً في جميع مجالات العلوم الهندسية المختلفة (مدنية – معمارية – ميكانيكا – كهرباء – صحي – مساحة .....) إلى جانب العلوم الأخرى (الإدارة – الاقتصاد – القانون – المحاسبة – الحاسب الآلي...)"
        },
        {
            text: "تشترك المكتبة في17 دورية علمية متخصصة تغطي معظم المجالات المختلفة والتي تخدم جميع مشروعات الشركة."
        },
        {
            text: "3 مواقع متخصصة (موقع global render – موقع خلاصات كتب المدير وملفات المختار الإداري – موقع بوابة الخدمات القانونية)"
        },
        {
            text: "تحتوي المكتبة على أكثر من 2500 مادة علمية متخصصة بها خلاصة الخبرات العلمية لمشروعات الشركة والتي تم إعدادها من قبل الخبراء والمتخصصين بالشركة بهدف نقل الخبرات المختلفة إلى جميع العاملين من خلال العملية التدريبية."
        }
    ];

    const books = [
        {
            title: "Capture and reuse of project knowledge in construction",
            publisher: "Willy-Blackwell",
            image: "https://www.arabcont.com/icemt/assets/images/Book01.jpg",
            url: "https://online.fliphtml5.com/cvhml/vzfl/#p=1"
        },
        {
            title: "ICE manual of highway design and management",
            publisher: "Second Edition",
            image: "https://www.arabcont.com/icemt/assets/images/Book02.jpg",
            url: "https://online.fliphtml5.com/cvhml/qzxx/#p=1"
        },
        {
            title: "Construction Dewatering and Groundwater Control",
            publisher: "Third Edition",
            image: "https://www.arabcont.com/icemt/assets/images/Book03.jpg",
            url: "https://online.fliphtml5.com/cvhml/wdbx/#p=1"
        }
    ];

    const handleBookClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const responsiveStyles = getResponsiveStyles(isMobile, isTablet);

    return (
        
        <div style={responsiveStyles.page}>
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>
                <span className="overview" style={{ position: 'relative', bottom: '5px' }}><a href="/" className="btn_go_home">الصفحة الرئيسية</a> - المكتبة </span>
            </div>

            {/* Main Content */}
            <main style={responsiveStyles.main}>
                {/* Title Section */}
                <div style={responsiveStyles.titleSection}>
                    <div style={responsiveStyles.iconWrapper}>
                        <BookOpen style={responsiveStyles.iconWrapperSvg} />
                    </div>
                    <h2 style={responsiveStyles.mainTitle}>المكتبة</h2>
                    <div style={responsiveStyles.titleUnderline}></div>
                </div>

                {/* Description Card */}
                <div style={responsiveStyles.descriptionCard}>
                    <p style={responsiveStyles.descriptionText}>
                        لدينا مكتبة عريقة تم إنشاؤها منذ عام 1975 وذلك إيماناً من شركة المقاولون العرب بأهمية القراءة والاطلاع المستمر ومعرفة كل ما هو حديث وجديد بسوق العمل
                    </p>
                </div>

                {/* Library Image */}
                <div style={responsiveStyles.imageContainer}>
                    <img
                        src={libraryImage}
                        alt="المكتبة"
                        style={responsiveStyles.libraryImage}
                    />
                </div>

                {/* Features Grid */}
                <div style={responsiveStyles.featuresGrid}>
                    {features.map((feature, index) => (
                        <FeatureCard key={index} text={feature.text} isMobile={isMobile} />
                    ))}
                </div>

                {/* Footer Note */}
                <div style={responsiveStyles.footerNote}>
                    <div style={responsiveStyles.noteBadge}>
                        <p style={responsiveStyles.noteText}>القسم الأول - المحتوى الثابت</p>
                    </div>
                </div>

                {/* Books Section */}
                <div style={responsiveStyles.booksSection}>
                    <h2 style={responsiveStyles.booksTitle}>أمثلة من الكتب</h2>
                    <div style={responsiveStyles.booksGrid}>
                        {books.map((book, index) => (
                            <BookCard
                                key={index}
                                book={book}
                                onClick={() => handleBookClick(book.url)}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>
                </div>

                {/* Search Section */}
                <LibrarySearchSection isMobile={isMobile} isTablet={isTablet} />
            </main>
        </div>
    );
}

function FeatureCard({ text, isMobile }) {
    const responsiveFeatureStyles = {
        featureText: {
            color: '#374151',
            fontSize: isMobile ? '16px' : '18px',
            lineHeight: '1.75',
            textAlign: 'right',
            flex: 1,
            margin: 0
        }
    };

    return (
        <div style={styles.featureCard}>
            <div style={styles.featureContent}>
                <div style={styles.checkIconWrapper}>
                    <div style={styles.checkIcon}>
                        <Check style={styles.checkIconSvg} />
                    </div>
                </div>
                <p style={responsiveFeatureStyles.featureText}>{text}</p>
            </div>
        </div>
    );
}

function BookCard({ book, onClick, isMobile }) {
    const [isHovered, setIsHovered] = useState(false);

    const responsiveBookStyles = {
        bookImageWrapper: {
            position: 'relative',
            overflow: 'hidden',
            height: isMobile ? '300px' : '350px'
        }
    };

    return (
        <div
            style={{
                ...styles.bookCard,
                ...(isHovered ? styles.bookCardHover : {})
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={responsiveBookStyles.bookImageWrapper}>
                <img
                    src={book.image}
                    alt={book.title}
                    style={{
                        ...styles.bookImage,
                        ...(isHovered ? styles.bookImageHover : {})
                    }}
                />
                <div style={{
                    ...styles.bookOverlay,
                    ...(isHovered ? styles.bookOverlayVisible : {})
                }}>
                    <div style={styles.searchIconWrapper}>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div style={styles.bookInfo}>
                <p style={styles.bookPublisher}>{book.publisher}</p>
                <h3 style={styles.bookTitleText}>{book.title}</h3>
            </div>
        </div>
    );
}

const extractYear = (dateStr) => {
    if (!dateStr) return null;

    // takes last 4 digits → 1996
    const match = dateStr.match(/(\d{4})$/);
    return match ? match[1] : null;
};


function LibrarySearchSection({ isMobile, isTablet }) {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);

    const [categories, setCategories] = useState([]);
    const [years, setYears] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchText, setSearchText] = useState('');

    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(true);

    /* ===== Fetch Books ===== */
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch(
                    'https://acwebsite-icmet-test.azurewebsites.net/api/Book/getAllBooks'
                );
                const data = await res.json();

                setBooks(data);

                // Categories
                setCategories([
                    ...new Set(data.map(b => b.typeName))
                ]);

                // Years
                setYears([
                    ...new Set(
                        data
                            .map(b => extractYear(b.bookDate))
                            .filter(Boolean)
                    )
                ].sort((a, b) => b - a));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    /* ===== Search ===== */
    const handleSearch = () => {
        setHasSearched(true);

        let results = [...books];

        if (selectedCategory) {
            results = results.filter(
                b => b.typeName === selectedCategory
            );
        }

        if (selectedYear) {
            results = results.filter(
                b => extractYear(b.bookDate) === selectedYear
            );
        }

        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            results = results.filter(
                b =>
                    b.bookName.toLowerCase().includes(q) ||
                    b.author.toLowerCase().includes(q)
            );
        }

        setFilteredBooks(results);
    };

    const stylesSearch = getSearchStyles(isMobile, isTablet);

    return (
        <div style={stylesSearch.container}>
            <div style={stylesSearch.searchSection}>
                <h2 style={stylesSearch.sectionTitle}>
                    بحث في المكتبة
                </h2>

                <div style={stylesSearch.searchForm}>
                    {/* Text */}
                    <div style={stylesSearch.inputGroup}>
                        <input
                            placeholder="ادخل كلمة البحث..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={stylesSearch.searchInput}
                        />
                        <Search style={stylesSearch.searchIcon} />
                    </div>

                    {/* Category */}
                    <div style={stylesSearch.inputGroup}>
                        <select
                            value={selectedCategory}
                            onChange={e =>
                                setSelectedCategory(e.target.value)
                            }
                            style={stylesSearch.select}
                        >
                            <option value="">اختر التصنيف</option>
                            {categories.map(cat => (
                                <option key={cat}>{cat}</option>
                            ))}
                        </select>
                        <Tag style={stylesSearch.selectIcon} />
                    </div>

                    {/* Year */}
                    <div style={stylesSearch.inputGroup}>
                        <select
                            value={selectedYear}
                            onChange={e =>
                                setSelectedYear(e.target.value)
                            }
                            style={stylesSearch.select}
                        >
                            <option value="">اختر السنة</option>
                            {years.map(y => (
                                <option key={y}>{y}</option>
                            ))}
                        </select>
                        <Calendar style={stylesSearch.selectIcon} />
                    </div>

                    <button
                        onClick={handleSearch}
                        style={stylesSearch.searchButton}
                    >
                        بحث
                    </button>
                </div>

                {hasSearched && (
                    <div style={stylesSearch.resultsCount}>
                        {filteredBooks.length} نتيجة
                    </div>
                )}
            </div>

            {/* Results */}
            {hasSearched && filteredBooks.length > 0 && (
                <div style={stylesSearch.resultsGrid}>
                    {filteredBooks.map((book, i) => (
                        <SearchBookResult key={i} book={book} />
                    ))}
                </div>
            )}

            {hasSearched && filteredBooks.length === 0 && !loading && (
                <div style={stylesSearch.noResults}>
                    لا توجد نتائج
                </div>
            )}
        </div>
    );
}

/* ========================= */
/* Book Card                 */
/* ========================= */

function SearchBookResult({ book }) {
    return (
        <div style={searchResultStyles.bookCard}>
            <h4 style={searchResultStyles.bookCategory}>
                {book.typeName}
            </h4>
            <h3 style={searchResultStyles.bookTitle}>
                {book.bookName}
            </h3>
            <p style={searchResultStyles.bookAuthor}>
                {book.author}
            </p>
            <p style={searchResultStyles.bookYear}>
                {extractYear(book.bookDate)}
            </p>
        </div>
    );
}

function getResponsiveStyles(isMobile, isTablet) {
    return {
        page: styles.page,
        main: {
            ...styles.main,
            padding: isMobile ? '32px 16px' : isTablet ? '32px 16px' : '48px 32px'
        },
        titleSection: styles.titleSection,
        iconWrapper: {
            ...styles.iconWrapper,
            width: isMobile ? '64px' : '80px',
            height: isMobile ? '64px' : '80px'
        },
        iconWrapperSvg: {
            ...styles.iconWrapperSvg,
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px'
        },
        mainTitle: {
            ...styles.mainTitle,
            fontSize: isMobile ? '24px' : isTablet ? '28px' : '36px'
        },
        titleUnderline: styles.titleUnderline,
        descriptionCard: styles.descriptionCard,
        descriptionText: {
            ...styles.descriptionText,
            fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px'
        },
        imageContainer: styles.imageContainer,
        libraryImage: {
            ...styles.libraryImage,
            height: isMobile ? '250px' : isTablet ? '300px' : '384px'
        },
        featuresGrid: {
            ...styles.featuresGrid,
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(2, 1fr)'
        },
        footerNote: styles.footerNote,
        noteBadge: styles.noteBadge,
        noteText: styles.noteText,
        booksSection: styles.booksSection,
        booksTitle: {
            ...styles.booksTitle,
            fontSize: isMobile ? '22px' : isTablet ? '24px' : '32px'
        },
        booksGrid: {
            ...styles.booksGrid,
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
        }
    };
}

function getSearchStyles(isMobile, isTablet) {
    return {
        container: {
            marginTop: '80px',
            marginBottom: '40px'
        },
        searchSection: {
            background: 'white',
            borderRadius: '16px',
            padding: isMobile ? '24px' : '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '40px'
        },
        sectionTitle: {
            fontSize: isMobile ? '22px' : isTablet ? '24px' : '28px',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '32px',
            margin: '0 0 32px 0'
        },
        searchForm: {
            display: 'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(4, 1fr)',
            gap: '16px',
            alignItems: 'end'
        },
        inputGroup: {
            position: 'relative',
            width: '100%'
        },
        searchInput: {
            width: '100%',
            padding: '14px 45px 14px 16px',
            fontSize: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.3s ease',
            textAlign: 'right',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
        },
        searchIcon: {
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '20px',
            height: '20px',
            pointerEvents: 'none'
        },
        select: {
            width: '100%',
            padding: '14px 45px 14px 16px',
            fontSize: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.3s ease',
            textAlign: 'right',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontFamily: 'inherit',
            appearance: 'none',
            boxSizing: 'border-box'
        },
        selectIcon: {
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '20px',
            height: '20px',
            pointerEvents: 'none'
        },
        searchButton: {
            padding: '14px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            background: '#17a2b8',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
        },
        resultsCount: {
            marginTop: '24px',
            padding: '12px 20px',
            background: '#f0f9ff',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#0369a1',
            fontSize: '16px',
            fontWeight: '600'
        },
        resultsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '40px'
        },
        noResults: {
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            marginBottom: '40px'
        },
        noResultsText: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '12px',
            margin: '0 0 12px 0'
        },
        noResultsHint: {
            fontSize: '16px',
            color: '#9ca3af',
            margin: 0
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
        },
        paginationButton: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid #e5e7eb',
            background: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
        },
        activePage: {
            background: '#f97316',
            color: 'white',
            borderColor: '#f97316'
        }
    };
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #f8fafc 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    main: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 32px'
    },
    titleSection: {
        textAlign: 'center',
        marginBottom: '48px'
    },
    iconWrapper: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        background: '#2563eb',
        borderRadius: '50%',
        marginBottom: '24px',
        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
    },
    iconWrapperSvg: {
        width: '40px',
        height: '40px',
        color: 'white'
    },
    mainTitle: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '16px'
    },
    titleUnderline: {
        width: '96px',
        height: '4px',
        background: '#2563eb',
        margin: '0 auto',
        borderRadius: '9999px'
    },
    descriptionCard: {
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        marginBottom: '48px',
        borderTop: '4px solid #2563eb'
    },
    descriptionText: {
        fontSize: '20px',
        color: '#374151',
        lineHeight: '1.75',
        textAlign: 'right',
        margin: 0
    },
    imageContainer: {
        marginBottom: '48px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
    },
    libraryImage: {
        width: '100%',
        height: '384px',
        objectFit: 'cover',
        display: 'block'
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '32px',
        marginBottom: '48px'
    },
    featureCard: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        borderRight: '4px solid #2563eb',
        transition: 'all 0.3s ease'
    },
    featureContent: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
    },
    checkIconWrapper: {
        flexShrink: 0,
        marginTop: '4px'
    },
    checkIcon: {
        width: '32px',
        height: '32px',
        background: '#2563eb',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkIconSvg: {
        width: '20px',
        height: '20px',
        color: 'white'
    },
    featureText: {
        color: '#374151',
        fontSize: '18px',
        lineHeight: '1.75',
        textAlign: 'right',
        flex: 1,
        margin: 0
    },
    footerNote: {
        marginTop: '48px',
        textAlign: 'center'
    },
    noteBadge: {
        display: 'inline-block',
        background: '#dbeafe',
        borderRadius: '9999px',
        padding: '12px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    noteText: {
        color: '#1e40af',
        fontWeight: '600',
        margin: 0
    },
    booksSection: {
        marginTop: '80px',
        marginBottom: '48px'
    },
    booksTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: '48px'
    },
    booksGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px'
    },
    bookCard: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    bookCardHover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },
    bookImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease'
    },
    bookImageHover: {
        transform: 'scale(1.1)'
    },
    bookOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(37, 99, 235, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.3s ease'
    },
    bookOverlayVisible: {
        opacity: 1
    },
    searchIconWrapper: {
        color: 'white'
    },
    bookInfo: {
        padding: '24px'
    },
    bookPublisher: {
        color: '#f97316',
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '8px',
        textTransform: 'uppercase',
        margin: '0 0 8px 0'
    },
    bookTitleText: {
        color: '#111827',
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '1.5',
        margin: 0
    }
};

const searchResultStyles = {
    bookCard: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    },
    bookCardHover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    },
    bookContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    bookImageWrapper: {
        width: '100%',
        height: '250px',
        overflow: 'hidden'
    },
    bookImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    bookInfo: {
        padding: '20px'
    },
    bookCategory: {
        color: '#f97316',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: '8px',
        margin: '0 0 8px 0'
    },
    bookTitle: {
        color: '#111827',
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '1.4',
        marginBottom: '12px',
        minHeight: '44px',
        margin: '0 0 12px 0'
    },
    bookAuthor: {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '8px',
        textAlign: 'right',
        margin: '0 0 8px 0'
    },
    authorName: {
        color: '#374151',
        fontWeight: '500'
    },
    bookYear: {
        color: '#9ca3af',
        fontSize: '13px',
        fontWeight: '600',
        textAlign: 'right',
        margin: 0
    }
};