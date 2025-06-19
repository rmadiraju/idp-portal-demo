import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';

const validationLabels = [
  { key: 'vulnerabilities', label: 'Validate Build Vulnerabilities' },
  { key: 'componentTests', label: 'Validate Component Tests' },
  { key: 'liveDependency', label: 'Validate Live-Dependency Tests' },
  { key: 'performance', label: 'Validate Performance Tests' },
  { key: 'changeFreeze', label: 'Change Freeze Validation' },
];

const mockApprovals = [
  {
    release_id: 'REL-2001',
    component: 'Lease Processor',
    system: 'Lease End System',
    ba: 'Lease End BA',
    submitted_by: 'alice',
    date_submitted: '2024-06-16',
    validations: {
      vulnerabilities: true,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: true,
    },
    has_exception: false,
    release_notes: 'This release includes bug fixes and performance improvements for Lease Processor.',
  },
  {
    release_id: 'REL-2002',
    component: 'Analytics Engine',
    system: 'Lease End Analytics',
    ba: 'Lease End BA',
    submitted_by: 'bob',
    date_submitted: '2024-06-15',
    validations: {
      vulnerabilities: true,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: true,
    },
    has_exception: false,
    release_notes: 'Adds new analytics dashboard and improves data pipeline reliability.',
  },
];

const mockExceptionApprovals = [
  {
    release_id: 'REL-2003',
    component: 'Lending Core Service',
    system: 'Lending Core',
    ba: 'Lending BA',
    submitted_by: 'carol',
    date_submitted: '2024-06-14',
    validations: {
      vulnerabilities: false,
      componentTests: true,
      liveDependency: true,
      performance: false,
      changeFreeze: false,
    },
    has_exception: true,
    release_notes: 'Critical patch for Lending Core Service. Some tests failed but urgent deployment required.',
  },
];

const Approvals: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [comments, setComments] = useState('');

  const handleOpenModal = (release: any) => {
    setSelectedRelease(release);
    setModalOpen(true);
    setComments('');
  };

  const handleApprove = () => {
    setModalOpen(false);
    setComments('');
  };

  const handleReject = () => {
    setModalOpen(false);
    setComments('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Approvals</Typography>
      {/* Section 1: Release Approval Requests */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Release Approval Requests</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Release ID</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>System</TableCell>
                <TableCell>BA</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockApprovals.map(r => (
                <TableRow key={r.release_id} hover sx={{ cursor: 'pointer' }} onClick={() => handleOpenModal(r)}>
                  <TableCell sx={{ color: 'primary.main', textDecoration: 'underline' }}>{r.release_id}</TableCell>
                  <TableCell>{r.component}</TableCell>
                  <TableCell>{r.system}</TableCell>
                  <TableCell>{r.ba}</TableCell>
                  <TableCell>{r.submitted_by}</TableCell>
                  <TableCell>{r.date_submitted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Section 2: Exception Approvals */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Exception Approvals</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Release ID</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>System</TableCell>
                <TableCell>BA</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockExceptionApprovals.map(r => (
                <TableRow key={r.release_id} hover sx={{ cursor: 'pointer' }} onClick={() => handleOpenModal(r)}>
                  <TableCell sx={{ color: 'primary.main', textDecoration: 'underline' }}>{r.release_id}</TableCell>
                  <TableCell>{r.component}</TableCell>
                  <TableCell>{r.system}</TableCell>
                  <TableCell>{r.ba}</TableCell>
                  <TableCell>{r.submitted_by}</TableCell>
                  <TableCell>{r.date_submitted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Modal for release details */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Release Details</DialogTitle>
        <DialogContent>
          {selectedRelease && (
            <Box>
              <Typography><b>Release ID:</b> {selectedRelease.release_id}</Typography>
              <Typography><b>Component:</b> {selectedRelease.component}</Typography>
              <Typography><b>System:</b> {selectedRelease.system}</Typography>
              <Typography><b>BA:</b> {selectedRelease.ba}</Typography>
              <Typography><b>Submitted By:</b> {selectedRelease.submitted_by}</Typography>
              <Typography><b>Date Submitted:</b> {selectedRelease.date_submitted}</Typography>
              <Typography><b>Has Exception:</b> {selectedRelease.has_exception ? 'Yes' : 'No'}</Typography>
              <TextField
                label="Release Notes"
                multiline
                minRows={2}
                fullWidth
                value={selectedRelease.release_notes || ''}
                InputProps={{ readOnly: true }}
                sx={{ mt: 3 }}
              />
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Validation Results</Typography>
                {validationLabels.map(v => (
                  <Box key={v.key} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <Typography sx={{ minWidth: 220 }}>{v.label}</Typography>
                    {selectedRelease.validations[v.key] === true ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </Box>
                ))}
              </Box>
              <TextField
                label="Comments (optional)"
                multiline
                minRows={2}
                fullWidth
                value={comments}
                onChange={e => setComments(e.target.value)}
                sx={{ mt: 3 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApprove} color="success" variant="contained">Approve</Button>
          <Button onClick={handleReject} color="error" variant="contained">Reject</Button>
          <Button onClick={() => setModalOpen(false)} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Approvals; 