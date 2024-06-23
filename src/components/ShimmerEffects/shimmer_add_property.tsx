import React from 'react';
import { Grid, Box } from '@mui/material';
import styled from 'styled-components';

const Shimmer = styled.div`
  background-image: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const ShimmerEffect = () => {
  const ShimmerBlock = ({ width, height }) => (
    <Shimmer style={{ width: `${width}px`, height: `${height}px` }} />
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      pl={3}
      pr={3}
    >
      <Grid container spacing={3} alignItems="center" justifyContent="space-between">
        {/* Скелет для каждого поля ввода и его заголовка */}
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
        <Grid item xs={6} md={6} display="flex" alignItems="center">
          <ShimmerBlock width={200} height={36} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShimmerEffect;
