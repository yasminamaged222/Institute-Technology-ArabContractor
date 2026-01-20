import React, { useState, useEffect } from 'react';
import './news.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');

  const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

  useEffect(() => {
    setLoading(true);
    setError(null);

      fetch(`https://acwebsite-icmet-test.azurewebsites.net/api/News/getAllNews?year=${selectedYear}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        return response.json();
      })
      .then(data => {
        setNews(data.data); // 👈 الأخبار بتيجي هنا
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedYear]); // 👈 كل ما السنة تتغير نعمل fetch

  return (
    <div className="news-page-container">
      {/* Breadcrumb */}
      <div>
            
            <div className="overview_intro" style={{ position: 'fixed', background: '#F5F7E1', width: '100%', zIndex: '1' }}>
                <span className="overview" style={{ position: 'relative', bottom: '5px' }}><a href="/" className="btn_go_home">الصفحة الرئيسية</a> - الأخبار</span>
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

          {loading && <p>جارٍ تحميل الأخبار...</p>}

          {error && <p>حدث خطأ: {error}</p>}

          {!loading && !error && news.length > 0 ? (
            news.map(item => (
              <div key={item.id} className="news-card-item">
                <div className="news-card-inner">
                  
                  {/* Date Badge */}
                  <div className="news-date-badge">
                    {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Image */}
                  <a href={`/news/${item.id}`} className="news-image-wrapper">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="news-image"
                    />
                  </a>

                  {/* Title */}
                  <div className="news-title-wrapper">
                    <a href={`/news/${item.id}`} className="news-title-link">
                      {item.title}
                    </a>
                  </div>

                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="no-news-message">
                <p>لا توجد أخبار لهذا العام</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Pagination (Static for now) */}
      {news.length > 0 && (
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
