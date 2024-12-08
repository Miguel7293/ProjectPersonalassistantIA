import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, Box } from '@mui/material';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Card
      sx={{
        perspective: '1000px',
        height: '100%',
      }}
    >
      <CardActionArea
        onClick={handleFlip}
        sx={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s',
          height: '100%',
        }}
      >
        <Box
          sx={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {frontContent}
        </Box>
        <Box
          sx={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
          }}
        >
          {backContent}
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default FlipCard;
