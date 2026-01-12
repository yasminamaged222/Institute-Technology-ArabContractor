import React, { useState } from 'react';
import './news.css';

const News = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
 // News data for all years
 const newsData = {
    '2026': [],
    '2025': [
      {
        id: 1,
        date: '25 نوفمبر 2025',
        title: 'اتفاقية بين المعهد القومي للحوكمة والمعهد التكنولوجي لهندسة التشييد والإدارة',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
        link: '/news/2025-68'
      },
      {
        id: 2,
        date: '22 أكتوبر 2025',
        title: 'ختام المرحلة الأولى من برنامج التدريب المشترك بين المقاولون العرب والجامعة',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
        link: '/news/2025-67'
      },
      {
        id: 3,
        date: '22 أكتوبر 2025',
        title: 'انطلاق البرنامج التدريبي للمهندسين من دولة زامبيا',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        link: '/news/2025-66'
      },
      {
        id: 4,
        date: '7 أكتوبر 2025',
        title: 'تجديد إعتماد المعهد من الجهاز المركزي للتنظيم والإدارة',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
        link: '/news/2025-65'
      },
      {
        id: 5,
        date: '3 سبتمبر 2025',
        title: 'المقاولون العرب تكرم أوئل الثانوية العامة',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        link: '/news/2025-64'
      },
      {
        id: 6,
        date: '14 أغسطس 2025',
        title: 'المنتور للأعمال تكرم المتميزين من شركة المقاولون العرب في إطار اتفاقية',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        link: '/news/2025-63'
      },
      {
        id: 7,
        date: '10 أغسطس 2025',
        title: 'جامعة المنصورة الأهلية تستعين بالمقاولون العرب لتدريب خريجيها ورفع جودة',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
        link: '/news/2025-62'
      },
      {
        id: 8,
        date: '7 أغسطس 2025',
        title: 'المقاولون العرب توقع اتفاق تعاون مع الجانب الألماني لتنفيذ برامج تدريبية',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop',
        link: '/news/2025-61'
      },
      {
        id: 9,
        date: '20 يوليو 2025',
        title: 'توقيع ملحق عقد البرنامج التدريبي بين المعهد التكنولوجي والجامعة الألمانية',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
        link: '/news/2025-59'
      },
      {
        id: 10,
        date: '27 مايو 2025',
        title: 'تجديد شهادة الأيزو للمعهد',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
        link: '/news/2025-58'
      },
      {
        id: 11,
        date: '29 أبريل 2025',
        title: 'التدريب الصيفي 2025 لطلبة الجامعات',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
        link: '/news/2025-57'
      },
      {
        id: 12,
        date: '5 فبراير 2025',
        title: 'توقيع بروتوكول تعاون مع معهد Green Educational Building بباريس',
        image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
        link: '/news/2025-56'
      },
      {
        id: 13,
        date: '23 يناير 2025',
        title: 'المقاولون العرب تشارك في معرض القاهرة الدولي للكتاب 2025',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
        link: '/news/2025-55'
      }
    ],
    '2024': [
      {
        id: 1,
        date: '5 نوفمبر 2024',
        title: 'إعتماد المعهد من الجهاز المركزي للتنظيم والإدارة',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
        link: '/news/2024-54'
      },
      {
        id: 2,
        date: '13 أكتوبر 2024',
        title: 'مكتبة الإسكندرية تفتتح سفارة المعرفة رقم 27 داخل المعهد التكنولوجي لهندسة التشييد والإدارة',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        link: '/news/2024-53'
      },
      {
        id: 3,
        date: '10 يونيو 2024',
        title: 'توقيع إتفاقية بين المعهد التكنولوجي وشركة أمان',
        image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop',
        link: '/news/2024-52'
      },
      {
        id: 4,
        date: '5 يونيو 2024',
        title: 'السعى نحو اعتماد المعهد من الجهاز المركزي للتنظيم والإدارة',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
        link: '/news/2024-51'
      },
      {
        id: 5,
        date: '4 يونيو 2024',
        title: 'تجديد شهادة الأيزو للمعهد',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
        link: '/news/2024-50'
      },
      {
        id: 6,
        date: '3 يونيو 2024',
        title: 'توقيع عقد تدريب بين المقاولون العرب والجامعة الألمانية لإعداد قيادات الصف الأول',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
        link: '/news/2024-49'
      },
      {
        id: 7,
        date: '9 مايو 2024',
        title: 'تكريم العامل المثالي',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
        link: '/news/2024-48'
      },
      {
        id: 8,
        date: '24 أبريل 2024',
        title: 'بروتوكول تعاون مع Medix',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
        link: '/news/2024-47'
      },
      {
        id: 9,
        date: '13 مارس 2024',
        title: 'المعهد القومي للجودة يمنح رخصة مزاولة نشاط التدريب للمعهد التكنولوجي',
        image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=300&fit=crop',
        link: '/news/2024-46'
      },
      {
        id: 10,
        date: '12 مارس 2024',
        title: 'المعهد التكنولوجي يعلن عن موعد التقديم للتدريب الصيفى لطلبة الجامعات',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
        link: '/news/2024-45'
      }
    ],
    '2023': [
      {
        id: 1,
        date: '1 نوفمبر 2023',
        title: 'بروتكول تعاون بين جامعة القاهرة التكنولوجية والمقاولون العرب',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2023-44'
      },
      {
        id: 2,
        date: '1 سبتمبر 2023',
        title: 'اتفاقيه مع أستاذ دكتور شريف الهجان',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2023-43'
      },
      {
        id: 3,
        date: '1 أغسطس 2023',
        title: 'اتفاقية تعاون هيئة الطاقة النووية',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2023-42'
      },
      {
        id: 4,
        date: '1 يوليو 2023',
        title: 'بروتكول تعاون مع positive Academy',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2023-41'
      }
    ],
    '2022': [
      {
        id: 1,
        date: '4 يوليو 2022',
        title: 'حصول المعهد علي شهادة إعتماد من Autodesk',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2022-40'
      },
      {
        id: 2,
        date: '22 مارس 2022',
        title: 'التعليم الفنى بالاسماعيلية يشيد بدور المعهد فى تدريب طلبة المدارس الثانوية الصناعية',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2022-39'
      }
    ],
    '2021': [
      {
        id: 1,
        date: '21 نوفمبر 2021',
        title: 'المقاولون العرب تدرب طلاب تشاد فى مصر',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-38'
      },
      {
        id: 2,
        date: '17 أكتوبر 2021',
        title: 'إشادة الادارة التعليمية بمستوي الاجراءات الاحترازية ضد فيروس كورونا خلال امتحانات التأهيل',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-37'
      },
      {
        id: 3,
        date: '14 أكتوبر 2021',
        title: 'شركة ريدكون للتعمير تشيد بمنظومة التدريب بشركة المقاولون العرب',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-36'
      },
      {
        id: 4,
        date: '14 أكتوبر 2021',
        title: 'الدكتور محمد يوسف يشهد الإحتفال بتخريج الدفعة الأولي من برنامج اعداد مهندس التنفيذ',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-35'
      },
      {
        id: 5,
        date: '11 أغسطس 2021',
        title: 'المقاولون العرب بالقوائم المختصرة النهائية لترشيحات جوائز فى دبى "The Big 5"',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-34'
      },
      {
        id: 6,
        date: '11 يوليو 2021',
        title: 'رئيس مجلس الإدارة يلتقى أبناء الشركة المكرمين بجائزة Big5',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-33'
      },
      {
        id: 7,
        date: '28 يونيو 2021',
        title: 'المعهد التكنولوجي يحصد جائزة The Big 5 construction Egypt',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-32'
      },
      {
        id: 8,
        date: '9 يونيو 2021',
        title: 'المقاولون العرب تشارك في أعمال امتحانات التأهيل العملي لدبلوم مدارس التكنولوجيا التطبيقية',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-31'
      },
      {
        id: 9,
        date: '11 فبراير 2021',
        title: 'خلال 8 أسابيع فقط المعهد ينظم 76 دورة تدريبية في السلامة والجودة للمهندس',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2021-30'
      }
    ],
    '2020': [
      {
        id: 1,
        date: '10 ديسمبر 2020',
        title: 'برنامجي السلامة والصحة المهنية والجودة للمهندسين المرشحين للترقي',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2020-29'
      }
    ],
    '2019': [
      {
        id: 1,
        date: '5 أكتوبر 2019',
        title: 'الدكتور محمد يوسف : تصنيع كرافانات شمسية لأول مرة بالشركة',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2019-28'
      },
      {
        id: 2,
        date: '29 يوليو 2019',
        title: 'المعهد التكنولوجى يواصل نجاحة ويعقد برامج تدريبية للأشقاء العرب والمصريين',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2019-27'
      },
      {
        id: 3,
        date: '20 فبراير 2019',
        title: 'المعهد التكنولوجى يعقد برامج تدريبية لمهندسي هيئة المحطات النووية والمشروعات الكبرى',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2019-26'
      },
      {
        id: 4,
        date: '5 فبراير 2019',
        title: 'نشاط مكثف للمعهد التكنولوجي في 2019',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2019-25'
      }
    ],
    '2018': [
      {
        id: 1,
        date: '14 أكتوبر 2018',
        title: 'المعهد التكنولوجى يساهم فى تنمية قدرات العاملين بأحدث النظم التعليمية والعلمية',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2018-24'
      }
    ],
    '2017': [
      {
        id: 1,
        date: '11 أكتوبر 2017',
        title: 'المقاولون العرب تدرب10 ألاف طالب بالجامعات والمدارس الفنية فى المشروعات القومية',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2017-23'
      },
      {
        id: 2,
        date: '23 أبريل 2017',
        title: 'المقاولون العرب تشارك فى المؤتمر الدولى التاسع للهندسة والتشييد',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2017-22'
      }
    ],
    '2016': [
      {
        id: 1,
        date: '27 ديسمبر 2016',
        title: 'عقد أكبر دورة تدريبية للمهندسين عن إدارة مشـــروعات PMP وتطبيقــــاتها في البرامج',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2016-21'
      },
      {
        id: 2,
        date: '27 ديسمبر 2016',
        title: 'الإستشارات الهندسية بالمقاولون العرب تدخل قائمة الـ 25 "بيت خبرة " على مستوى العالم',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2016-20'
      }
    ],
    '2015': [
      {
        id: 1,
        date: '21 مايو 2015',
        title: 'تدريب 300 طالب من المدارس الصناعيه بمركز جسر السويس',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2015-19'
      },
      {
        id: 2,
        date: '20 مايو 2015',
        title: 'برنامج تدريبي عن مهارات الإشراف على مشاريع السفلته الأولية لمهندسين سعوديين',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2015-18'
      },
      {
        id: 3,
        date: '18 مايو 2015',
        title: 'جهاز الجودة ينظم دورات تدريبية لرفع كفاءة مهندسي التنفيذ والمشرفين',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2015-17'
      },
      {
        id: 4,
        date: '25 فبراير 2015',
        title: 'المعهد التكنولوجي ينتهي من تدريب 1000 مهني في وقت قياسي',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2015-16'
      },
      {
        id: 5,
        date: '20 فبراير 2015',
        title: 'برنامج تدريبي بفرع شرق ووسط الدلتا عن علاقة الأعمال الإنشائية والمعمارية بالصرف الصحى',
        image: 'https://via.placeholder.com/400x300',
        link: '/news/2015-15'
      }
    ]
  };

  const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

  return (
    <div className="news-page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-content">
          <a href="/" className="breadcrumb-link">الصفحة الرئيسية</a>
          <span className="breadcrumb-arrow">→</span>
          <span className="breadcrumb-current">الأخبار</span>
        </div>
      </div>

      {/* Year Filter Pills */}
      <div className="year-filter-container">
        <div className="year-pills">
          {years.map(year => (
            <button
              key={year}
              className={`year-pill ${selectedYear === year ? 'year-pill-active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="news-content-wrapper">
        <div className="news-cards-grid">
          {newsData[selectedYear] && newsData[selectedYear].length > 1 ? (
            newsData[selectedYear].map(news => (
              <div key={news.id} className="news-card-item">
                <div className="news-card-inner">
                  {/* Date Badge */}
                  <div className="news-date-badge">
                    {news.date}
                  </div>
                  
                  {/* Image */}
                  <a href={news.link} className="news-image-wrapper">
                    <img src={news.image} alt={news.title} className="news-image" />
                  </a>
                  
                  {/* Title */}
                  <div className="news-title-wrapper">
                    <a href={news.link} className="news-title-link">
                      {news.title}
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-news-message">
              <p>لا توجد أخبار لهذا العام</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {newsData[selectedYear] && newsData[selectedYear].length > 0 && (
        <div className="pagination-wrapper">
          <div className="pagination-dots">
            <button className="pagination-arrow pagination-arrow-disabled">‹</button>
            <button className="pagination-dot pagination-dot-active">1</button>
            <button className="pagination-dot">2</button>
            <button className="pagination-arrow">›</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;