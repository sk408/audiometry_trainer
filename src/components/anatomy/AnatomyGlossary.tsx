import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Drawer,
  Fab,
  IconButton,
  InputBase,
  Paper,
  Button,
  Tooltip
} from '@mui/material';
import { MenuBook, Search, Close, ArrowBack } from '@mui/icons-material';
import { glossaryTerms } from '../../data/anatomyData';

const AnatomyGlossary: React.FC = () => {
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossarySearchTerm, setGlossarySearchTerm] = useState('');

  const toggleGlossary = () => {
    setGlossaryOpen(!glossaryOpen);
  };

  const handleGlossarySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlossarySearchTerm(event.target.value);
  };

  const filteredTerms = useMemo(() => {
    if (!glossarySearchTerm) return glossaryTerms;
    const search = glossarySearchTerm.toLowerCase();
    return glossaryTerms.filter(
      item =>
        item.term.toLowerCase().includes(search) ||
        item.definition.toLowerCase().includes(search)
    );
  }, [glossarySearchTerm]);

  return (
    <>
      {/* Floating Glossary Button */}
      <Tooltip title="Ear Anatomy Glossary" arrow placement="left">
        <Fab
          color="primary"
          aria-label="glossary"
          onClick={toggleGlossary}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <MenuBook />
        </Fab>
      </Tooltip>

      {/* Glossary Drawer */}
      <Drawer
        anchor="right"
        open={glossaryOpen}
        onClose={toggleGlossary}
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
          <IconButton onClick={toggleGlossary} aria-label="close glossary">
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
            value={glossarySearchTerm}
            onChange={handleGlossarySearch}
            aria-label="Search glossary terms"
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
            onClick={toggleGlossary}
            size="small"
          >
            Back to Learning
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default AnatomyGlossary;
