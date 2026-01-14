import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

// Static data for all courses (you can move this to a separate file later)
const allCourses = [
  // برامج موجهة للمهندسين
  {
    category: 'برامج موجهة للمهندسين',
    title: 'إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء - المرحلة الأولى',
    institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
    date: '2025/08/17 - 2025/08/28',
    description: 'تزويد مهندسى ميكانيكا وكهرباء حديثى التخرج حديثى التعيين بالمعارف والمهارات التي تمكنهم من العمل فى مشروعات التشييد بالاساليب الصحيحة والآمنة وكذلك بالجودة المطلوبة.',
  },
  {
    category: 'برامج موجهة للمهندسين',
    title: 'إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء - المرحلة الثانية',
    institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
    date: '2025/12/21 - 2026/01/01',
    description: 'تزويد مهندسى ميكانيكا وكهرباء حديثى التخرج حديثى التعيين بالمعارف والمهارات التي تمكنهم من العمل فى مشروعات التشييد بالأسلوب الصحيح والآمن وكذلك بالجودة المطلوبة',
  },
  {
    category: 'برامج موجهة للمهندسين',
    title: 'إعداد وتأهيل مهندس حديث ميكانيكا وكهرباء - المرحلة الثالثة',
    institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
    date: '2026/04/19 - 2026/04/30',
    description: 'تزويد مهندسى ميكانيكا وكهرباء حديثى التخرج حديثى التعيين بالمعارف والمهارات التي تمكنهم من العمل فى مشروعات التشييد بالأساليب الصحيحه والآمنة بالجودة المطلوبة.',
  },

  // المحور الأول : المعلومات الهندسية الأساسية
  {
    category: 'المحور الأول : المعلومات الهندسية الأساسية',
    title: 'التصميم باستخدام برنامج الــ Rivet مدني (أساسيات)',
    institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
    date: '2025/12/28 - 2026/01/01',
    description: 'التعرف على كيفية التصميم باستخدام برنامج الــ Rivet',
  },
  {
    category: 'المحور الأول : المعلومات الهندسية الأساسية',
    title: 'التصميم باستخدام برنامج الــ Rivet عمارة (أساسيات)',
    institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
    date: '2025/09/28 - 2025/10/02',
    description: 'التعرف على كيفية التصميم باستخدام برنامج الــ Rivet',
  },

  // ... add ALL other courses from your text here (I added a few examples — continue the pattern)
  // Example:
  {
    category: 'المحور الثانى : التطبيقات الهندسية المختلفة',
    title: 'المساحة المستوية بإستخدام تطبيقات الاكسيل',
    institute: 'المعهد التكنولوجي لهندسة التشييد والإدارة',
    date: '2025/08/24 - 2025/08/28',
    description: 'تزويد المشاركين بالمهارات والمعارف التي تخص أعمال المساحة',
  },
  // Keep adding the rest of your courses here...
];

const CourseCategory = () => {
  const { category } = useParams(); // Get category from URL (e.g. /courses/برامج-موجهة-للمهندسين)

  // Filter courses by category (decoded from URL)
  const filteredCourses = allCourses.filter(
    (course) => course.category === decodeURIComponent(category)
  );

  const categoryTitle = decodeURIComponent(category);

  return (
    <div dir="rtl">
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: '#F5F7E1', py: 3, position: 'sticky', top: 0, zIndex: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="body1">
            <Link to="/" style={{ color: '#0d47a1', textDecoration: 'none' }}>
              الصفحة الرئيسية
            </Link>{' '}
            → الخطة التدريبية → {categoryTitle}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 8, color: '#0d47a1' }}
        >
          {categoryTitle}
        </Typography>

        {filteredCourses.length > 0 ? (
          <Grid container spacing={4}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course.title}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                    },
                    borderTop: '4px solid #f57c00',
                  }}
                >
                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Title */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ color: '#0865a8', mb: 3, minHeight: 70 }}
                    >
                      {course.title}
                    </Typography>

                    {/* Details */}
                    <Box sx={{ mb: 3, color: '#555' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box component="span" sx={{ color: '#f57c00' }}>المعهد:</Box>
                        <Typography variant="body2">{course.institute}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box component="span" sx={{ color: '#f57c00' }}>التاريخ:</Box>
                        <Typography variant="body2">{course.date}</Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 4,
                        flexGrow: 1,
                        lineHeight: 1.7,
                      }}
                    >
                      {course.description}
                    </Typography>

                    {/* Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        bgcolor: '#f57c00',
                        py: 1.5,
                        borderRadius: 30,
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#e65100' },
                      }}
                    >
                      تفاصيل الدورة
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center" color="text.secondary">
            لا توجد دورات متاحة في هذه الفئة حالياً
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default CourseCategory;
