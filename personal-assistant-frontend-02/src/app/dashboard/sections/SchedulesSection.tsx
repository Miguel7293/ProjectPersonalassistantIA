'use client';

import { Box, Typography, Card, CardContent, Grid, Divider, Button, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '9:00 AM', uv: 300, pv: 2400, amt: 2400 },
  { name: '10:00 AM', uv: 200, pv: 4567, amt: 2400 },
  { name: '11:00 AM', uv: 278, pv: 3908, amt: 2400 },
  { name: '12:00 PM', uv: 189, pv: 4800, amt: 2400 },
  { name: '1:00 PM', uv: 239, pv: 3800, amt: 2400 },
  { name: '2:00 PM', uv: 349, pv: 4300, amt: 2400 },
  { name: '3:00 PM', uv: 400, pv: 5000, amt: 2400 },
];

const ShedulesSection = () => {
  return (
    <Box sx={{ padding: '20px' }}>
      {/* Título de la Sección */}
      <Typography variant="h4" gutterBottom sx={{ color: '#E0E0E0' }}>
        Project Schedules
      </Typography>

      {/* Contenedor de los proyectos */}
      <Grid container spacing={3}>
        {/* Proyecto 1 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#2C2C2C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#E0E0E0' }}>
                Project A
              </Typography>
              <Divider sx={{ marginY: '10px' }} />
              <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                Time: 9:00 AM - 5:00 PM
              </Typography>
              <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                Active: +10%
              </Typography>

              {/* Gráfico de barras */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="uv" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>

              <Button
                sx={{
                  marginTop: '15px',
                  backgroundColor: '#1976D2',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#1565C0',
                  },
                }}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Proyecto 2 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#2C2C2C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#E0E0E0' }}>
                Project B
              </Typography>
              <Divider sx={{ marginY: '10px' }} />
              <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                Time: 8:30 AM - 4:30 PM
              </Typography>
              <Typography variant="body2" sx={{ color: '#F44336' }}>
                Delayed: -5%
              </Typography>

              {/* Gráfico de barras */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="uv" fill="#FF6347" />
                </BarChart>
              </ResponsiveContainer>

              <Button
                sx={{
                  marginTop: '15px',
                  backgroundColor: '#1976D2',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#1565C0',
                  },
                }}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Proyecto 3 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#2C2C2C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#E0E0E0' }}>
                Project C
              </Typography>
              <Divider sx={{ marginY: '10px' }} />
              <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                Time: 10:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body2" sx={{ color: '#FF9800' }}>
                In Progress: 50%
              </Typography>

              {/* Gráfico de barras */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="uv" fill="#FF9800" />
                </BarChart>
              </ResponsiveContainer>

              <Button
                sx={{
                  marginTop: '15px',
                  backgroundColor: '#1976D2',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#1565C0',
                  },
                }}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShedulesSection;
