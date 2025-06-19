import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults: React.FC = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Search Results
      </Typography>
      <Typography variant="body1">
        Showing results for: <b>{searchTerm}</b>
      </Typography>
      {/* You can add real search results here later */}
    </Box>
  );
};

export default SearchResults; 