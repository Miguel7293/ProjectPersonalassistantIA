'use client';

import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const DashboardSection = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4" color="primary">
                14k
              </Typography>
              <Typography color="success.main">+25%</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more cards or charts */}
      </Grid>
    </Box>
  );
};

export default DashboardSection;
