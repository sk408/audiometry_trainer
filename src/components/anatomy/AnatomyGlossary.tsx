import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  InputBase,
  Paper,
  Button,
} from '@mui/material';
import { Search, Close, ArrowBack } from '@mui/icons-material';
import { glossaryTerms } from '../../data/anatomyData';

interface AnatomyGlossaryProps {
  open: boolean;
  onClose: () => void;
}

const AnatomyGlossary: React.FC<AnatomyGlossaryProps> = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return glossaryTerms;
    const lower = searchTerm.toLowerCase();
    return glossaryTerms.filter(
      (item) =>
        item.term.toLowerCase().includes(lower) ||
        item.definition.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 350 },
            maxWidth: '100%',
            p: 2,
            boxSizing: 'border-box'
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Ear Anatomy Glossary
          </Typography>
          <IconButton onClick={onClose} aria-label="close glossary">
            <Close />
          </IconButton>
        </Box>

        <Typography variant="body2" paragraph>
          Quick reference for ear anatomy terminology. Search or scroll to find terms.
        </Typography>

        {/* Search box */}
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search glossary terms..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
        </Paper>

        {filteredTerms.length === 0 ? (
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            No matching terms found.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            {filteredTerms.map((item, index) => (
              <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
                  {item.term}
                </Typography>
                <Typography variant="body2">
                  {item.definition}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onClose}
            size="small"
          >
            Back to Learning
          </Button>
        </Box>
      </Drawer>
  );
};

export default AnatomyGlossary;
