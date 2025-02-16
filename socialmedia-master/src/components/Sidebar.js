import React from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material';

const Sidebar = () => {
  return (
    <Box sx={{ width: '25%', padding: 2 }}>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Avatar src="/path/to/avatar.jpg" sx={{ width: 56, height: 56 }} />
        <Box marginLeft={2}>
          <Typography variant="subtitle1">username</Typography>
          <Typography variant="body2" color="text.secondary">
            Full Name
          </Typography>
        </Box>
      </Box>
      <Typography variant="subtitle2" color="text.secondary" marginBottom={2}>
        Suggestions For You
      </Typography>
      <List>
        {[1, 2, 3].map((item) => (
          <ListItem key={item}>
            <ListItemAvatar>
              <Avatar src={`/path/to/avatar${item}.jpg`} />
            </ListItemAvatar>
            <ListItemText primary={`User ${item}`} secondary="Suggested for you" />
            <Button size="small">Follow</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;