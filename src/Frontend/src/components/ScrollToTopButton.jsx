import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const ScrollToTopButton = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShow(window.scrollY > 300);
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!show) return null;

    return (
        <Box
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
                position: 'fixed',
                bottom: { xs: 20, md: 30 },
                right: { xs: 20, md: 30 },
                width: { xs: 45, md: 50 },
                height: { xs: 45, md: 50 },
                borderRadius: '50%',
                backgroundColor: '#ff8c42',
                color: '#fff',
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: '#e67a35',
                    transform: 'translateY(-5px)',
                },
            }}
        >
            ↑
        </Box>
    );
};

export default ScrollToTopButton;
