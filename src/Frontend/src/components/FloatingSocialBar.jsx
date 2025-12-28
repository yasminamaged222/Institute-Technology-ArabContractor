import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GoogleIcon from '@mui/icons-material/Google';
import PhoneIcon from '@mui/icons-material/Phone';

const FloatingSocialBar = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: 16, // مسافة من اليمين
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column', // عمودي
        gap: 2,
        zIndex: 1300,
      }}
    >
      <Tooltip title="تابعنا على فيسبوك" placement="right">
        <IconButton
          component="a"
          href="https://facebook.com" // غيري بالرابط الرسمي
          target="_blank"
          sx={{
            bgcolor: 'white',
            color: '#1877F2',
            boxShadow: 3,
            width: 50,
            height: 50,
            '&:hover': {
              bgcolor: '#1877F2',
              color: 'white',
            },
          }}
        >
          <FacebookIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="تابعنا على يوتيوب" placement="right">
        <IconButton
          component="a"
          href="https://youtube.com" // غيري بالرابط الرسمي
          target="_blank"
          sx={{
            bgcolor: 'white',
            color: '#FF0000',
            boxShadow: 3,
            width: 50,
            height: 50,
            '&:hover': {
              bgcolor: '#FF0000',
              color: 'white',
            },
          }}
        >
          <YouTubeIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="تابعنا على جوجل" placement="right">
        <IconButton
          component="a"
          href="https://google.com" // أو رابط Google Business
          target="_blank"
          sx={{
            bgcolor: 'white',
            color: '#4285F4',
            boxShadow: 3,
            width: 50,
            height: 50,
            '&:hover': {
              bgcolor: '#4285F4',
              color: 'white',
            },
          }}
        >
          <GoogleIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="اتصل بنا: +2 02 23892120" placement="right">
        <IconButton
          component="a"
          href="tel:+20223892120"
          sx={{
            bgcolor: 'white',
            color: '#25D366',
            boxShadow: 3,
            width: 50,
            height: 50,
            '&:hover': {
              bgcolor: '#25D366',
              color: 'white',
            },
          }}
        >
          <PhoneIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FloatingSocialBar;