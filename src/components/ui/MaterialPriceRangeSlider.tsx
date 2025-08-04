"use client";

import React, { useState, useEffect } from 'react';
import { 
  Slider, 
  Box, 
  Typography, 
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaRupeeSign as Rupee } from "react-icons/fa";

// Styled components for better customization
const StyledSlider = styled(Slider)(({ theme }) => ({
  color: 'var(--color-primary-500)',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    background: 'linear-gradient(90deg, var(--color-primary-400), var(--color-secondary-400))',
    height: 8,
    borderRadius: 4,
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#e5e7eb',
    height: 8,
    borderRadius: 4,
  },
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    border: '2px solid var(--color-primary-500)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfdbfe',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
  '& .MuiSlider-markLabel': {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: 500,
  },
}));

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showLabels?: boolean;
  className?: string;
}

const MaterialPriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 75000,
  step = 1000,
  disabled = false,
  showLabels = true,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const newRange: [number, number] = [newValue[0], newValue[1]];
      setLocalValue(newRange);
    }
  };

  const handleChangeCommitted = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const newRange: [number, number] = [newValue[0], newValue[1]];
      onChange(newRange);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '₹0';
    if (price >= max) return `₹${(max / 1000).toFixed(0)}K+`;
    return `₹${price.toLocaleString()}`;
  };

  const marks = [
    { value: min, label: formatPrice(min) },
    { value: max / 3, label: formatPrice(max / 3) },
    { value: (max * 2) / 3, label: formatPrice((max * 2) / 3) },
    { value: max, label: formatPrice(max) },
  ];

  return (
    <Paper 
      elevation={0}
      className={`p-4 bg-gray-50 border border-gray-200 rounded-xl ${className}`}
    >
      <Box sx={{ width: '100%' }}>
        {showLabels && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="subtitle1" 
              component="label"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              <Rupee style={{ color: 'var(--color-primary-600)', fontWeight: 'bold' }} />
              Price Range
            </Typography>
            
            <Chip
              label={`${formatPrice(localValue[0])} - ${formatPrice(localValue[1])}`}
              size="small"
              sx={{
                backgroundColor: 'var(--color-primary-900)',
                color: 'var(--color-primary-100)',
                border: '1px solid var(--color-primary-200)',
                fontWeight: 500,
                fontSize: '0.875rem',
                '& .MuiChip-label': {
                  px: 2,
                  py: 0.5,
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ px: 1, py: 2 }}>
          <StyledSlider
            value={localValue}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
            valueLabelDisplay="off"
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            marks={marks}
            disableSwap
            sx={{
              '& .MuiSlider-thumb': {
                '&:nth-of-type(1)': {
                  borderColor: 'var(--color-primary-500)',
                  '&:before': {
                    backgroundColor: 'var(--color-primary-500)',
                  },
                },
                '&:nth-of-type(2)': {
                  borderColor: 'var(--color-secondary-500)',
                  '&:before': {
                    backgroundColor: 'var(--color-secondary-500)',
                  },
                },
              },
            }}
          />
        </Box>

        {/* Price markers */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          sx={{ 
            px: 1, 
            mt: 1,
            '& .marker': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            },
            '& .marker-line': {
              width: 1,
              height: 8,
              backgroundColor: '#d1d5db',
            },
            '& .marker-label': {
              fontSize: '0.75rem',
              color: '#6b7280',
              fontWeight: 500,
            }
          }}
        >
        </Stack>
      </Box>
    </Paper>
  );
};

export default MaterialPriceRangeSlider; 