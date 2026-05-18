import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

const CustomerSupport = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Box sx={{ background: '#FFF', maxHeight: '700px', overflowY: 'scroll', p: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.lightblackcolorCode.main || '#253D4E' }}>FAQ</Typography>
        </Box>
        <Box>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{boxShadow: 'none', padding: '7px 0px'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{color: '#000'}} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{fontWeight: 500, fontSize: 18}}>Coupons & Offers</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{boxShadow: 'none', padding: '7px 0px'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{color: '#000'}} />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{fontWeight: 500, fontSize: 18}}>General Inquiry</Typography>              
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                laoreet.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{boxShadow: 'none', padding: '7px 0px'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{color: '#000'}} />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography sx={{fontWeight: 500, fontSize: 18}}>Payment Related</Typography>              
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                amet egestas eros, vitae egestas augue. Duis vel est augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{boxShadow: 'none', padding: '7px 0px'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{color: '#000'}} />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{fontWeight: 500, fontSize: 18}}>Feedback & Suggestions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                amet egestas eros, vitae egestas augue. Duis vel est augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} sx={{boxShadow: 'none', padding: '7px 0px'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{color: '#000'}} />}
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Typography sx={{fontWeight: 500, fontSize: 18}}>Order / Products Related</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="left">
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                amet egestas eros, vitae egestas augue. Duis vel est augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </>
  );
};

export default CustomerSupport;
