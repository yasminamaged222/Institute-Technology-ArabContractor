import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, TextField, Menu, MenuItem, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" color="primary" sx={{ py: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>
            ICEMT LMS
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for courses..."
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              sx: { bgcolor: 'white', borderRadius: 10 },
            }}
          />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <Button color="inherit" onClick={handleClick}>
            Categories
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClose}>Engineering
</MenuItem>
            <MenuItem onClick={handleClose}>Management</MenuItem>
            <MenuItem onClick={handleClose}>Safety</MenuItem>
            <MenuItem onClick={handleClose}>Online Training</MenuItem>
          </Menu>
          <Button color="inherit" component={Link} to="/courses">Courses</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </Box>
        <IconButton color="inherit" sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
