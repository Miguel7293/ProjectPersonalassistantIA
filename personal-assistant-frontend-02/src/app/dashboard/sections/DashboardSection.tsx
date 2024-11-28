'use client';

import { Box, Typography, Card, CardContent, Grid, Divider } from '@mui/material';

const DashboardSection = () => {
  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Título principal */}
      <Typography variant="h4" gutterBottom>
        Overview
      </Typography>
      <Divider sx={{ marginBottom: '20px' }} />

      {/* Contenido del Dashboard */}
      <Grid container spacing={3}>
        {/* Tarjeta 1: Usuarios */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4" color="primary">
                14k
              </Typography>
              <Typography color="success.main">+25% since last month</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 2: Ventas */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sales</Typography>
              <Typography variant="h4" color="primary">
                $32,400
              </Typography>
              <Typography color="success.main">+12% since last week</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 3: Visitas al sitio */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Website Visits</Typography>
              <Typography variant="h4" color="primary">
                120k
              </Typography>
              <Typography color="error.main">-5% compared to last month</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 4: Feedback */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Feedback Received</Typography>
              <Typography variant="h4" color="primary">
                8,500
              </Typography>
              <Typography color="success.main">+18% this quarter</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos o secciones adicionales */}
      <Box sx={{ marginTop: '30px' }}>
        <Typography variant="h5" gutterBottom>
          Performance Metrics
        </Typography>

        <Grid container spacing={3}>
          {/* Ejemplo de gráfico ficticio o sección */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Monthly Revenue</Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Aquí puedes agregar un gráfico real */}
                  <Typography variant="body1" color="text.secondary">
                    [Chart Placeholder]
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Active Users</Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Aquí puedes agregar un gráfico real */}
                  <Typography variant="body1" color="text.secondary">
                    [Chart Placeholder]
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardSection;
