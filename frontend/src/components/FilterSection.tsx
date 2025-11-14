/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
  Typography
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { useState } from 'react';

interface FilterSectionProps {
  preferences: {
    dietary: string[];
    cuisine: string;
    difficulty: string;
  };
  onPreferencesChange: (prefs: any) => void;
}

const FilterSection = ({ preferences, onPreferencesChange }: FilterSectionProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto'];
  const cuisines = ['Italian', 'Asian', 'Mexican', 'Indian', 'Mediterranean', 'American'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleDietaryToggle = (option: string) => {
    const current = preferences.dietary;
    const updated = current.includes(option)
      ? current.filter(d => d !== option)
      : [...current, option];
    onPreferencesChange({ ...preferences, dietary: updated });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
          <FilterIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          Filters & Preferences
        </Typography>
      </Stack>

      <Collapse in={showFilters}>
        <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Dietary Preferences
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {dietaryOptions.map(option => (
                <Chip
                  key={option}
                  label={option}
                  size="small"
                  onClick={() => handleDietaryToggle(option)}
                  color={preferences.dietary.includes(option) ? 'primary' : 'default'}
                  variant={preferences.dietary.includes(option) ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={preferences.cuisine}
                label="Cuisine"
                onChange={(e) => onPreferencesChange({
                  ...preferences,
                  cuisine: e.target.value
                })}
              >
                <MenuItem value="">Any</MenuItem>
                {cuisines.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={preferences.difficulty}
                label="Difficulty"
                onChange={(e) => onPreferencesChange({
                  ...preferences,
                  difficulty: e.target.value
                })}
              >
                <MenuItem value="">Any</MenuItem>
                {difficulties.map(d => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default FilterSection;
