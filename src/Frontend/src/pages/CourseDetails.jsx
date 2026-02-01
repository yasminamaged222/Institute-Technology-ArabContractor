import { useSearchParams, Link } from 'react-router-dom';
//import { coursesData } from '../data/coursesData';
import './CourseDetails.css';

const CourseDetails = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');
  const course = coursesData[courseId];

  if (!course) {
    return (
      <div className="not-found-container">
        <div className="not-found-card">
          <div className="not-found-icon">😕</div>
          <h2>الكورس مش موجود!</h2>
          <p>معلش، الكورس اللي بتدور عليه مش موجود</p>
          <Link to="/" className="btn-primary">رجوع للرئيسية</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            
            
            <h1 className="hero-title">{course.title}</h1>
            <p className="hero-description">{course.description}</p>
            
            <div className="hero-meta">
              <div className="rating">
                <span className="rating-badge">Bestseller</span>
                <span className="rating-number">{course.rating}</span>
                <span className="stars">★★★★★</span>
                <span className="rating-count">({course.reviewsCount.toLocaleString('ar-EG')} تقييم)</span>
                <span className="students-count">{course.studentsCount.toLocaleString('ar-EG')} طالب</span>
              </div>
            </div>

            <div className="hero-info">
              <span className="info-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"/>
                  <path d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H5.5a.5.5 0 010-1H7.5V4a.5.5 0 01.5-.5z"/>
                </svg>
                آخر تحديث: {course.startDate}
              </span>
              <span className="info-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z"/>
                </svg>
                {course.language}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-container">
        <div className="content-wrapper">
          {/* Left Content */}
          <div className="left-content">
            {/* محتويات البرنامج */}
            <div className="content-section">
              <h2 className="section-heading">محتويات البرنامج</h2>
              <div className="course-content">
                <p className="content-summary">
                  {course.topics.length} محاضرة • {course.videoDuration} ساعة من المحتوى
                </p>
                <div className="topics-grid">
                  {course.topics.map((topic, index) => (
                    <div key={index} className="topic-card">
                      <div className="topic-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1zM4.5 9a.5.5 0 010-1h7a.5.5 0 010 1h-7zM4 10.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 010-1h4a.5.5 0 010 1h-4z"/>
                        </svg>
                      </div>
                      <div className="topic-content">
                        <h4 className="topic-number">المحاضرة {index + 1}</h4>
                        <p className="topic-text">{topic}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* فائدة حضور البرنامج */}
            <div className="content-section">
              <h2 className="section-heading">ماذا ستتعلم</h2>
              <div className="learning-objectives">
                {course.objectives.map((obj, index) => (
                  <div key={index} className="objective-item">
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
                    </svg>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* لمن يعقد البرنامج */}
            <div className="content-section">
              <h2 className="section-heading">متطلبات الكورس</h2>
              <ul className="requirements-list">
                {course.prerequisites.map((pre, index) => (
                  <li key={index}>{pre}</li>
                ))}
              </ul>
            </div>

            {/* طريقة تنفيذ البرنامج */}
            <div className="content-section">
              <h2 className="section-heading">طريقة تنفيذ البرنامج</h2>
              <div className="method-items">
                <div className="method-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2"/>
                    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2"/>
                    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
                  </svg>
                  <span>محاضرات فيديو تفاعلية</span>
                </div>
                <div className="method-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2"/>
                  </svg>
                  <span>تمارين عملية</span>
                </div>
              </div>
            </div>

            {/* تاريخ انعقاد البرنامج */}
            <div className="content-section">
              <h2 className="section-heading">تاريخ انعقاد البرنامج</h2>
              <div className="date-box">
                <div className="date-item">
                  <span className="date-label">تاريخ البدء:</span>
                  <span className="date-value">{course.startDate}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">تاريخ الانتهاء:</span>
                  <span className="date-value">{course.endDate}</span>
                </div>
              </div>
            </div>

            
          </div>

          {/* Right Sidebar - Price Card */}
          <div className="right-sidebar">
            <div className="price-card">
              <div className="price-preview">
                <img src={course.image} alt={course.title} />
              </div>
              
              <div className="price-content">
                <div className="price-section">
                  <span className="current-price">{course.price.toLocaleString('ar-EG')} {course.currency}</span>
                  <span className="original-price">{course.originalPrice.toLocaleString('ar-EG')} {course.currency}</span>
                  <span className="discount-badge">{course.discount}% خصم</span>
                </div>

                <div className="price-timer">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"/>
                  </svg>
                  <span className="timer-text">باقي 5 ساعات على هذا السعر!</span>
                </div>

                <div className="action-buttons">
                  <button className="btn-add-cart">إضافة إلى السلة</button>
                  <button className="btn-buy-now">اشتري الآن</button>
                </div>

                <p className="guarantee-text">ضمان استرجاع المال خلال 30 يوم</p>

                <div className="course-includes">
                  <h3>هذا الكورس يتضمن:</h3>
                  <ul>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H2z"/>
                        <path d="M6.5 5a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-4a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-4a.5.5 0 01.5-.5z"/>
                      </svg>
                      {course.videoDuration} ساعة فيديو حسب الطلب
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z"/>
                      </svg>
                      {course.articlesCount} مقال
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z"/>
                      </svg>
                      {course.hasLifetimeAccess ? 'وصول كامل مدى الحياة' : 'وصول محدود'}
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1 3a1 1 0 011-1h12a1 1 0 011 1H1zm7 8a2 2 0 100-4 2 2 0 000 4z"/>
                      </svg>
                      الوصول على الموبايل والتلفزيون
                    </li>
                    {course.hasCertificate && (
                      <li>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z"/>
                        </svg>
                        شهادة إتمام
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* الكورسات الأخرى */}
            <div className="programs-card">
              <h3 className="programs-title">كورسات أخرى قد تهمك</h3>
              <div className="other-courses-list">
                {Object.values(coursesData)
                  .filter(c => c.id !== course.id)
                  .map((otherCourse) => (
                    <Link 
                      key={otherCourse.id} 
                      to={`/course?id=${otherCourse.id}`} 
                      className="other-course-card"
                    >
                      <img src={otherCourse.image} alt={otherCourse.title} className="other-course-img" />
                      <div className="other-course-content">
                        <h4 className="other-course-title">{otherCourse.title}</h4>
                        <div className="other-course-rating">
                          <span className="other-rating-num">{otherCourse.rating}</span>
                          <span className="other-stars">★★★★★</span>
                          <span className="other-students">({otherCourse.studentsCount.toLocaleString('ar-EG')})</span>
                        </div>
                        <div className="other-course-price">
                          <span className="other-current-price">{otherCourse.price.toLocaleString('ar-EG')} {otherCourse.currency}</span>
                          <span className="other-original-price">{otherCourse.originalPrice.toLocaleString('ar-EG')} {otherCourse.currency}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;