import React, { useState } from 'react';
import { businessApplications } from '../data/businessApplications';
import type {
  BusinessApplication,
  OnboardFormData,
  SystemFormData,
  ComponentFormData,
  DatabaseFormData,
  S3FormData,
} from '../types/businessApplication';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, FormControlLabel, Radio, FormControl,  Stepper, Step, StepLabel, MenuItem, Select, InputLabel, CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// import AddIcon from '@mui/icons-material/Add';

const initialOnboardForm: OnboardFormData = {
  baName: '',
  email: '',
  department: '',
  createSystem: false,
};
const initialSystemForm: SystemFormData = {
  systemName: '',
  systemDescription: '',
  technology: '',
  createComponent: false,
};
const initialComponentForm: ComponentFormData = {
  componentType: 'Microservice',
  componentName: '',
  language: '',
};
const initialDatabaseForm: DatabaseFormData = {
  databaseType: 'AWS Aurora Postgres',
  databaseName: '',
  schemaName: '',
};
const initialS3Form: S3FormData = {
  bucketName: '',
  requireEastRegion: false,
  requireWestRegion: false,
};

const steps = [
  'Business Application Info',
  'System Details',
  'Component Details',
  'DB & S3',
  'Summary',
];

type OnboardedBA = {
  ba: BusinessApplication;
  onboardForm: OnboardFormData;
  systemForm: SystemFormData;
  componentForm: ComponentFormData;
  databaseForm: DatabaseFormData | null;
  s3Form: S3FormData | null;
};

export const dummyOnboardedBAs = [
  {
    ba: businessApplications[0],
    onboardForm: {
      baName: businessApplications[0].name,
      email: 'leaseend@example.com',
      department: 'Leasing',
      createSystem: true,
    },
    systemForm: {
      systemName: 'Lease End System',
      systemDescription: 'Handles all end-of-lease operations',
      technology: 'Java Spring Boot',
      createComponent: true,
    },
    componentForm: {
      componentType: 'Microservice' as const,
      componentName: 'Lease Processor',
      language: 'Java',
    },
    databaseForm: {
      databaseType: 'AWS Aurora Postgres' as const,
      databaseName: 'lease_end_db',
      schemaName: 'leases',
    },
    s3Form: {
      bucketName: 'lease-end-bucket',
      requireEastRegion: true,
      requireWestRegion: false,
    },
  },
  {
    ba: businessApplications[1],
    onboardForm: {
      baName: businessApplications[1].name,
      email: 'lending@example.com',
      department: 'Finance',
      createSystem: false,
    },
    systemForm: {
      systemName: '',
      systemDescription: '',
      technology: '',
      createComponent: false,
    },
    componentForm: {
      componentType: 'Microservice' as const,
      componentName: '',
      language: '',
    },
    databaseForm: null,
    s3Form: null,
  },
];

// Export dummySystems for Dashboard and allow mutation for demo
export let dummySystems = [
  {
    id: 'sys1',
    name: 'Lease End System',
    description: 'Handles all end-of-lease operations',
    technology: 'Java Spring Boot',
    baId: '1',
  },
  {
    id: 'sys1b',
    name: 'Lease End Analytics',
    description: 'Analytics and reporting for lease end operations',
    technology: 'Python Django',
    baId: '1',
  },
  {
    id: 'sys2',
    name: 'Lending Core',
    description: 'Core system for commercial lending',
    technology: 'Node.js',
    baId: '2',
  },
];

// Dummy components data for demo
export const dummyComponents = [
  {
    id: 'comp1',
    name: 'Lease Processor',
    type: 'Microservice',
    language: 'Java',
    systemId: 'sys1',
  },
  {
    id: 'comp2',
    name: 'Lease DB',
    type: 'DB',
    language: '',
    systemId: 'sys1',
  },
  {
    id: 'comp3',
    name: 'Analytics Engine',
    type: 'Microservice',
    language: 'Python',
    systemId: 'sys1b',
  },
  {
    id: 'comp4',
    name: 'Analytics S3',
    type: 'S3',
    language: '',
    systemId: 'sys1b',
  },
  {
    id: 'comp5',
    name: 'Lending Core Service',
    type: 'Microservice',
    language: 'Node.js',
    systemId: 'sys2',
  },
];

const BusinessApplications: React.FC = () => {
  const [selectedBA, setSelectedBA] = useState<BusinessApplication | null>(null);
  const [step, setStep] = useState(0);
  const [onboardForm, setOnboardForm] = useState<OnboardFormData>(initialOnboardForm);
  const [systemForm, setSystemForm] = useState<SystemFormData>(initialSystemForm);
  const [componentForm, setComponentForm] = useState<ComponentFormData>(initialComponentForm);
  const [databaseForm, setDatabaseForm] = useState<DatabaseFormData>(initialDatabaseForm);
  const [s3Form, setS3Form] = useState<S3FormData>(initialS3Form);
  const [addDB, setAddDB] = useState(false);
  const [addS3, setAddS3] = useState(false);
  const [onboarded, setOnboarded] = useState<OnboardedBA[]>(dummyOnboardedBAs);
  const [baDetails, setBADetails] = useState<OnboardedBA | null>(null);
  const [systemView, setSystemView] = useState<any | null>(null);
  const [componentView, setComponentView] = useState<any | null>(null);
  const [startRelease, setStartRelease] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('');
  const [validationResults, setValidationResults] = useState<any>(null);
  const [validating, setValidating] = useState(false);
  const [releaseDetailsOpen, setReleaseDetailsOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [releaseSubmitModalOpen, setReleaseSubmitModalOpen] = useState(false);
  const [isExceptionRelease, setIsExceptionRelease] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState('');
  const [exceptionJustification, setExceptionJustification] = useState('');
  const [failedValidations, setFailedValidations] = useState<string[]>([]);
  // Create System flow state
  // const [createSystemOpen, setCreateSystemOpen] = useState(false);
  // const [selectedBAForSystem, setSelectedBAForSystem] = useState<BusinessApplication | null>(null);
  // const [newSystemForm, setNewSystemForm] = useState<SystemFormData>(initialSystemForm);
  // Add state for system creation wizard
  const [systemWizardStep, setSystemWizardStep] = useState<number | null>(null);
  const [systemWizardForm, setSystemWizardForm] = useState<SystemFormData>(initialSystemForm);
  const [systemWizardComponentForm, setSystemWizardComponentForm] = useState<ComponentFormData>(initialComponentForm);
  const [systemWizardAddComponent, setSystemWizardAddComponent] = useState(false);
  const [systemWizardAddDB, setSystemWizardAddDB] = useState(false);
  const [systemWizardAddS3, setSystemWizardAddS3] = useState(false);
  const [systemWizardDatabaseForm, setSystemWizardDatabaseForm] = useState<DatabaseFormData>(initialDatabaseForm);
  const [systemWizardS3Form, setSystemWizardS3Form] = useState<S3FormData>(initialS3Form);

  // Reset wizard state
  const resetWizard = () => {
    setStep(0);
    setOnboardForm(initialOnboardForm);
    setSystemForm(initialSystemForm);
    setComponentForm(initialComponentForm);
    setDatabaseForm(initialDatabaseForm);
    setS3Form(initialS3Form);
    setAddDB(false);
    setAddS3(false);
    setSelectedBA(null);
  };

  // Reset system wizard state
  const resetSystemWizard = () => {
    setSystemWizardStep(null);
    setSystemWizardForm(initialSystemForm);
    setSystemWizardComponentForm(initialComponentForm);
    setSystemWizardAddComponent(false);
    setSystemWizardAddDB(false);
    setSystemWizardAddS3(false);
    setSystemWizardDatabaseForm(initialDatabaseForm);
    setSystemWizardS3Form(initialS3Form);
  };

  // Step 1: BA Info
  const handleBAInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  // Step 2: System
  const handleSystemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(systemForm.createComponent ? 2 : 3);
  };

  // Step 3: Component
  const handleComponentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  // Step 4: DB/S3
  const handleDBS3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  // Step 5: Back to list
  // const handleSummaryBack = () => {
  //   resetWizard();
  // };

  // Step 5: Finish onboarding
  const handleFinishOnboarding = () => {
    setOnboarded(prev => [
      ...prev,
      {
        ba: selectedBA!,
        onboardForm,
        systemForm,
        componentForm,
        databaseForm: addDB ? databaseForm : null,
        s3Form: addS3 ? s3Form : null,
      },
    ]);
    resetWizard();
  };

  // Mock release data
  const currentRelease = {
    version: 'v1.2.3',
    lastReleaseDate: '2024-06-10',
  };
  const releaseHistory = [
    {
      release_id: 'REL-1001',
      version: 'v1.2.3',
      release_date: '2024-06-10',
      submitted_by: 'alice',
      approved_by: 'bob',
      has_exception: false,
    },
    {
      release_id: 'REL-1000',
      version: 'v1.2.2',
      release_date: '2024-05-15',
      submitted_by: 'carol',
      approved_by: 'dave',
      has_exception: true,
    },
    {
      release_id: 'REL-0999',
      version: 'v1.2.1',
      release_date: '2024-04-20',
      submitted_by: 'eve',
      approved_by: 'frank',
      has_exception: false,
    },
  ];

  // Mock available builds
  const availableBuilds = [
    {
      id: 'build-123',
      label: 'Build 1.2.4 (2024-06-15)',
      validations: {
        vulnerabilities: true,
        componentTests: true,
        liveDependency: true,
        performance: true,
        changeFreeze: true,
      },
    },
    {
      id: 'build-122',
      label: 'Build 1.2.3 (2024-06-10)',
      validations: {
        vulnerabilities: false,
        componentTests: true,
        liveDependency: true,
        performance: true,
        changeFreeze: false,
      },
    },
    {
      id: 'build-121',
      label: 'Build 1.2.2 (2024-05-15)',
      validations: {
        vulnerabilities: true,
        componentTests: false,
        liveDependency: true,
        performance: false,
        changeFreeze: true,
      },
    },
  ];

  // Validation labels
  const validationLabels = [
    { key: 'vulnerabilities', label: 'Validate Build Vulnerabilities' },
    { key: 'componentTests', label: 'Validate Component Tests' },
    { key: 'liveDependency', label: 'Validate Live-Dependency Tests' },
    { key: 'performance', label: 'Validate Performance Tests' },
    { key: 'changeFreeze', label: 'Change Freeze Validation' },
  ];

  // Handle build selection and validations
  const handleBuildSelect = (e: any) => {
    const buildId = e.target.value;
    setSelectedBuild(buildId);
    setValidationResults(null);
    setValidating(true);
    // Simulate validations with delay
    const build = availableBuilds.find(b => b.id === buildId);
    if (!build) return;
    // Show fetching for each, then set result
    let results: any = {};
    validationLabels.forEach(v => { results[v.key] = 'fetching'; });
    setValidationResults({ ...results });
    // Simulate sequential validation
    let idx = 0;
    function next() {
      if (idx >= validationLabels.length) {
        setValidating(false);
        return;
      }
      const key = validationLabels[idx].key;
      setTimeout(() => {
        if (!build) return; // Guard for TS
        setValidationResults((prev: any) => ({ ...prev, [key]: build.validations[key as keyof typeof build.validations] }));
        idx++;
        next();
      }, 900);
    }
    next();
  };

  // Mock validation breakdown for releases
  const releaseValidationsMap: Record<string, any> = {
    'REL-1001': {
      vulnerabilities: true,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: true,
    },
    'REL-1000': {
      vulnerabilities: false,
      componentTests: true,
      liveDependency: true,
      performance: true,
      changeFreeze: false,
    },
    'REL-0999': {
      vulnerabilities: true,
      componentTests: false,
      liveDependency: true,
      performance: false,
      changeFreeze: true,
    },
  };

  // Helper to open release submit modal
  const openReleaseSubmitModal = (exception: boolean) => {
    setIsExceptionRelease(exception);
    setReleaseSubmitModalOpen(true);
    setReleaseNotes('');
    setExceptionJustification('');
    // Find failed validations if exception
    if (exception && validationResults) {
      const failed = validationLabels
        .filter(v => validationResults[v.key] === false)
        .map(v => v.label);
      setFailedValidations(failed);
    } else {
      setFailedValidations([]);
    }
  };

  // Handle Create System submit
  // const handleCreateSystemSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!baDetails) return;
  //   dummySystems.push({
  //     id: `sys${dummySystems.length + 1}`,
  //     name: newSystemForm.systemName,
  //     description: newSystemForm.systemDescription,
  //     technology: newSystemForm.technology,
  //     baId: baDetails.ba.id ?? '',
  //   });
  //   setCreateSystemOpen(false);
  //   setNewSystemForm(initialSystemForm);
  // };

  // Add a type guard for baDetails
  function isOnboardedBA(obj: any): obj is OnboardedBA {
    return obj && typeof obj === 'object' && obj.ba && typeof obj.ba === 'object';
  }

  // Move this block to the top of the render logic, before componentView/systemView/baDetails
  if (systemWizardStep !== null && isOnboardedBA(baDetails)) {
    const baName = baDetails.ba.name ?? '';
    const baId = baDetails.ba.id ?? '';
    const systemSteps = [
      'System Details',
      'Component Details',
      'DB & S3',
      'Summary',
    ];
    return (
      <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>Create System for {baName}</Typography>
        <Stepper activeStep={systemWizardStep} alternativeLabel sx={{ mb: 4 }}>
          {systemSteps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {systemWizardStep === 0 && (
          <Box component="form" onSubmit={e => { e.preventDefault(); setSystemWizardStep(systemWizardAddComponent ? 1 : 2); }} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>System Details</Typography>
            <TextField fullWidth label="System Name" value={systemWizardForm.systemName} onChange={e => setSystemWizardForm(f => ({ ...f, systemName: e.target.value }))} required sx={{ mb: 2 }} />
            <TextField fullWidth label="System Description" value={systemWizardForm.systemDescription} onChange={e => setSystemWizardForm(f => ({ ...f, systemDescription: e.target.value }))} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Technology Stack" value={systemWizardForm.technology} onChange={e => setSystemWizardForm(f => ({ ...f, technology: e.target.value }))} required select sx={{ mb: 2 }}>
              <MenuItem value="Java Spring Boot">Java Spring Boot</MenuItem>
              <MenuItem value="Node.js">Node.js</MenuItem>
              <MenuItem value="Python Django">Python Django</MenuItem>
              <MenuItem value=".NET Core">.NET Core</MenuItem>
            </TextField>
            <FormControlLabel control={<Radio checked={systemWizardAddComponent} onChange={e => setSystemWizardAddComponent(e.target.checked)} />} label="Add a component to this system?" />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetSystemWizard}>Cancel</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        )}
        {systemWizardStep === 1 && systemWizardAddComponent && (
          <Box component="form" onSubmit={e => { e.preventDefault(); setSystemWizardStep(2); }} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Component Details</Typography>
            <TextField fullWidth label="Component Name" value={systemWizardComponentForm.componentName} onChange={e => setSystemWizardComponentForm(f => ({ ...f, componentName: e.target.value }))} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Component Type" value={systemWizardComponentForm.componentType} onChange={e => setSystemWizardComponentForm(f => ({ ...f, componentType: e.target.value as any }))} required select sx={{ mb: 2 }}>
              <MenuItem value="Microservice">Microservice</MenuItem>
              <MenuItem value="DB">DB</MenuItem>
              <MenuItem value="S3">S3</MenuItem>
            </TextField>
            {systemWizardComponentForm.componentType === 'Microservice' && (
              <TextField fullWidth label="Language" value={systemWizardComponentForm.language} onChange={e => setSystemWizardComponentForm(f => ({ ...f, language: e.target.value }))} required sx={{ mb: 2 }} />
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetSystemWizard}>Cancel</Button>
              <Button variant="outlined" onClick={() => setSystemWizardStep(0)}>Back</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        )}
        {systemWizardStep === 2 && (
          <Box component="form" onSubmit={e => { e.preventDefault(); setSystemWizardStep(3); }} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>DB & S3</Typography>
            <FormControlLabel control={<Radio checked={systemWizardAddDB} onChange={e => setSystemWizardAddDB(e.target.checked)} />} label="Add Database?" />
            {systemWizardAddDB && (
              <Box sx={{ pl: 2, mb: 2 }}>
                <TextField fullWidth label="Database Type" value={systemWizardDatabaseForm.databaseType} onChange={e => setSystemWizardDatabaseForm(f => ({ ...f, databaseType: e.target.value as any }))} required select sx={{ mb: 2 }}>
                  <MenuItem value="AWS Aurora Postgres">AWS Aurora Postgres</MenuItem>
                  <MenuItem value="AWS RDS MySQL">AWS RDS MySQL</MenuItem>
                </TextField>
                <TextField fullWidth label="Database Name" value={systemWizardDatabaseForm.databaseName} onChange={e => setSystemWizardDatabaseForm(f => ({ ...f, databaseName: e.target.value }))} required sx={{ mb: 2 }} />
                <TextField fullWidth label="Schema Name" value={systemWizardDatabaseForm.schemaName} onChange={e => setSystemWizardDatabaseForm(f => ({ ...f, schemaName: e.target.value }))} required sx={{ mb: 2 }} />
              </Box>
            )}
            <FormControlLabel control={<Radio checked={systemWizardAddS3} onChange={e => setSystemWizardAddS3(e.target.checked)} />} label="Add S3 Bucket?" />
            {systemWizardAddS3 && (
              <Box sx={{ pl: 2, mb: 2 }}>
                <TextField fullWidth label="Bucket Name" value={systemWizardS3Form.bucketName} onChange={e => setSystemWizardS3Form(f => ({ ...f, bucketName: e.target.value }))} required sx={{ mb: 2 }} />
                <FormControlLabel control={<Radio checked={systemWizardS3Form.requireEastRegion} onChange={e => setSystemWizardS3Form(f => ({ ...f, requireEastRegion: e.target.checked }))} />} label="Require East Region?" />
                <FormControlLabel control={<Radio checked={systemWizardS3Form.requireWestRegion} onChange={e => setSystemWizardS3Form(f => ({ ...f, requireWestRegion: e.target.checked }))} />} label="Require West Region?" />
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetSystemWizard}>Cancel</Button>
              <Button variant="outlined" onClick={() => setSystemWizardStep(systemWizardAddComponent ? 1 : 0)}>Back</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        )}
        {systemWizardStep === 3 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
            <Typography><b>System Name:</b> {systemWizardForm.systemName ?? ''}</Typography>
            <Typography><b>System Description:</b> {systemWizardForm.systemDescription ?? ''}</Typography>
            <Typography><b>Technology:</b> {systemWizardForm.technology ?? ''}</Typography>
            {systemWizardAddComponent && (
              <>
                <Typography sx={{ mt: 2 }}><b>Component Name:</b> {systemWizardComponentForm.componentName ?? ''}</Typography>
                <Typography><b>Component Type:</b> {systemWizardComponentForm.componentType ?? ''}</Typography>
                {systemWizardComponentForm.language && <Typography><b>Language:</b> {systemWizardComponentForm.language ?? ''}</Typography>}
              </>
            )}
            {systemWizardAddDB && (
              <>
                <Typography sx={{ mt: 2 }}><b>Database Type:</b> {systemWizardDatabaseForm.databaseType ?? ''}</Typography>
                <Typography><b>Database Name:</b> {systemWizardDatabaseForm.databaseName ?? ''}</Typography>
                <Typography><b>Schema Name:</b> {systemWizardDatabaseForm.schemaName ?? ''}</Typography>
              </>
            )}
            {systemWizardAddS3 && (
              <>
                <Typography sx={{ mt: 2 }}><b>S3 Bucket Name:</b> {systemWizardS3Form.bucketName ?? ''}</Typography>
                <Typography><b>East Region:</b> {systemWizardS3Form.requireEastRegion ? 'Yes' : 'No'}</Typography>
                <Typography><b>West Region:</b> {systemWizardS3Form.requireWestRegion ? 'Yes' : 'No'}</Typography>
              </>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetSystemWizard}>Cancel</Button>
              <Button variant="outlined" onClick={() => setSystemWizardStep(2)}>Back</Button>
              <Button variant="contained" onClick={() => {
                // Add new system to dummySystems
                dummySystems.push({
                  id: `sys${dummySystems.length + 1}`,
                  name: systemWizardForm.systemName ?? '',
                  description: systemWizardForm.systemDescription ?? '',
                  technology: systemWizardForm.technology ?? '',
                  baId: baId,
                });
                // Optionally add component to dummyComponents
                if (systemWizardAddComponent) {
                  dummyComponents.push({
                    id: `comp${dummyComponents.length + 1}`,
                    name: systemWizardComponentForm.componentName ?? '',
                    type: systemWizardComponentForm.componentType ?? '',
                    language: systemWizardComponentForm.language ?? '',
                    systemId: `sys${dummySystems.length}`,
                  });
                }
                resetSystemWizard();
              }}>Finish</Button>
            </Box>
          </Box>
        )}
      </Paper>
    );
  }

  // Render order: componentView > systemView > baDetails
  if (selectedBA) {
    return (
      <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>Onboard Business Application</Typography>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {step === 0 && (
          <Box component="form" onSubmit={handleBAInfoSubmit} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Business Application Info</Typography>
            <TextField fullWidth label="BA Name" value={onboardForm.baName} disabled sx={{ mb: 2 }} />
            <TextField fullWidth label="Contact Email" value={onboardForm.email} onChange={e => setOnboardForm(f => ({ ...f, email: e.target.value }))} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Department" value={onboardForm.department} onChange={e => setOnboardForm(f => ({ ...f, department: e.target.value }))} required sx={{ mb: 2 }} />
            <FormControlLabel control={<Radio checked={onboardForm.createSystem} onChange={e => setOnboardForm(f => ({ ...f, createSystem: e.target.checked }))} />} label="Create a new system for this BA?" />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetWizard}>Cancel</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        )}
        {step === 1 && onboardForm.createSystem && (
          <Box component="form" onSubmit={handleSystemSubmit} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>System Details</Typography>
            <TextField fullWidth label="System Name" value={systemForm.systemName} onChange={e => setSystemForm(f => ({ ...f, systemName: e.target.value }))} required sx={{ mb: 2 }} />
            <TextField fullWidth label="System Description" value={systemForm.systemDescription} onChange={e => setSystemForm(f => ({ ...f, systemDescription: e.target.value }))} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Technology Stack" value={systemForm.technology} onChange={e => setSystemForm(f => ({ ...f, technology: e.target.value }))} required select sx={{ mb: 2 }}>
              <MenuItem value="Java Spring Boot">Java Spring Boot</MenuItem>
              <MenuItem value="Node.js">Node.js</MenuItem>
              <MenuItem value="Python Django">Python Django</MenuItem>
              <MenuItem value=".NET Core">.NET Core</MenuItem>
            </TextField>
            <FormControlLabel control={<Radio checked={systemForm.createComponent} onChange={e => setSystemForm(f => ({ ...f, createComponent: e.target.checked }))} />} label="Add a component to this system?" />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetWizard}>Cancel</Button>
              <Button variant="outlined" onClick={() => setStep(0)}>Back</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        )}
        {step === 2 && systemForm.createComponent && (
          <Box component="form" onSubmit={handleComponentSubmit} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Component Details</Typography>
            <TextField fullWidth label="Component Name" value={componentForm.componentName} onChange={e => setComponentForm(f => ({ ...f, componentName: e.target.value }))} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Component Type" value={componentForm.componentType} onChange={e => setComponentForm(f => ({ ...f, componentType: e.target.value as any }))} required select sx={{ mb: 2 }}>
              <MenuItem value="Microservice">Microservice</MenuItem>
              <MenuItem value="DB">DB</MenuItem>
              <MenuItem value="S3">S3</MenuItem>
            </TextField>
            {componentForm.componentType === 'Microservice' && (
              <TextField fullWidth label="Language" value={componentForm.language} onChange={e => setComponentForm(f => ({ ...f, language: e.target.value }))} required sx={{ mb: 2 }} />
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetWizard}>Cancel</Button>
              <Button variant="outlined" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        )}
        {step === 3 && (
          <Box component="form" onSubmit={handleDBS3Submit} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>DB & S3</Typography>
            <FormControlLabel control={<Radio checked={addDB} onChange={e => setAddDB(e.target.checked)} />} label="Add Database?" />
            {addDB && (
              <Box sx={{ pl: 2, mb: 2 }}>
                <TextField fullWidth label="Database Type" value={databaseForm.databaseType} onChange={e => setDatabaseForm(f => ({ ...f, databaseType: e.target.value as any }))} required select sx={{ mb: 2 }}>
                  <MenuItem value="AWS Aurora Postgres">AWS Aurora Postgres</MenuItem>
                  <MenuItem value="AWS RDS MySQL">AWS RDS MySQL</MenuItem>
                </TextField>
                <TextField fullWidth label="Database Name" value={databaseForm.databaseName} onChange={e => setDatabaseForm(f => ({ ...f, databaseName: e.target.value }))} required sx={{ mb: 2 }} />
                <TextField fullWidth label="Schema Name" value={databaseForm.schemaName} onChange={e => setDatabaseForm(f => ({ ...f, schemaName: e.target.value }))} required sx={{ mb: 2 }} />
              </Box>
            )}
            <FormControlLabel control={<Radio checked={addS3} onChange={e => setAddS3(e.target.checked)} />} label="Add S3 Bucket?" />
            {addS3 && (
              <Box sx={{ pl: 2, mb: 2 }}>
                <TextField fullWidth label="Bucket Name" value={s3Form.bucketName} onChange={e => setS3Form(f => ({ ...f, bucketName: e.target.value }))} required sx={{ mb: 2 }} />
                <FormControlLabel control={<Radio checked={s3Form.requireEastRegion} onChange={e => setS3Form(f => ({ ...f, requireEastRegion: e.target.checked }))} />} label="Require East Region?" />
                <FormControlLabel control={<Radio checked={s3Form.requireWestRegion} onChange={e => setS3Form(f => ({ ...f, requireWestRegion: e.target.checked }))} />} label="Require West Region?" />
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetWizard}>Cancel</Button>
              <Button variant="outlined" onClick={() => setStep(systemForm.createComponent ? 2 : 1)}>Back</Button>
              <Button type="submit" variant="contained">Next</Button>
            </Box>
          </Box>
        )}
        {step === 4 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
            <Typography><b>BA Name:</b> {onboardForm.baName}</Typography>
            <Typography><b>Email:</b> {onboardForm.email}</Typography>
            <Typography><b>Department:</b> {onboardForm.department}</Typography>
            {onboardForm.createSystem && (
              <>
                <Typography sx={{ mt: 2 }}><b>System Name:</b> {systemForm.systemName || ''}</Typography>
                <Typography><b>System Description:</b> {systemForm.systemDescription || ''}</Typography>
                <Typography><b>Technology:</b> {systemForm.technology || ''}</Typography>
                {systemForm.createComponent && (
                  <>
                    <Typography sx={{ mt: 2 }}><b>Component Name:</b> {componentForm.componentName}</Typography>
                    <Typography><b>Component Type:</b> {componentForm.componentType}</Typography>
                    {componentForm.language && <Typography><b>Language:</b> {componentForm.language}</Typography>}
                  </>
                )}
              </>
            )}
            {addDB && (
              <>
                <Typography sx={{ mt: 2 }}><b>Database Type:</b> {databaseForm.databaseType}</Typography>
                <Typography><b>Database Name:</b> {databaseForm.databaseName}</Typography>
                <Typography><b>Schema Name:</b> {databaseForm.schemaName}</Typography>
              </>
            )}
            {addS3 && (
              <>
                <Typography sx={{ mt: 2 }}><b>S3 Bucket Name:</b> {s3Form.bucketName}</Typography>
                <Typography><b>East Region:</b> {s3Form.requireEastRegion ? 'Yes' : 'No'}</Typography>
                <Typography><b>West Region:</b> {s3Form.requireWestRegion ? 'Yes' : 'No'}</Typography>
              </>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={resetWizard}>Cancel</Button>
              <Button variant="outlined" onClick={() => setStep(addS3 || addDB ? 3 : (systemForm.createComponent ? 2 : (onboardForm.createSystem ? 1 : 0)))}>Back</Button>
              <Button variant="contained" onClick={handleFinishOnboarding}>Finish</Button>
            </Box>
          </Box>
        )}
      </Paper>
    );
  }
  if (componentView) {
    // Find system and BA for this component
    const system = dummySystems.find(sys => sys.id === componentView.systemId);
    const ba = system ? businessApplications.find(b => b.id === system.baId) : null;
    // Type-specific details
    let typeDetails = null;
    if (componentView.type === 'DB') {
      // Try to find DB details from onboarded or dummy
      let dbDetails = null;
      for (const o of onboarded) {
        if (
          o.systemForm.systemName === system?.name &&
          o.componentForm.componentName === componentView.name &&
          o.databaseForm
        ) {
          dbDetails = o.databaseForm;
          break;
        }
      }
      typeDetails = dbDetails ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Database Details</Typography>
          <Typography><b>DB Name:</b> {dbDetails.databaseName}</Typography>
          <Typography><b>Schema:</b> {dbDetails.schemaName}</Typography>
        </Box>
      ) : (
        <Typography>No DB details available.</Typography>
      );
    } else if (componentView.type === 'S3') {
      let s3Details = null;
      for (const o of onboarded) {
        if (
          o.systemForm.systemName === system?.name &&
          o.componentForm.componentName === componentView.name &&
          o.s3Form
        ) {
          s3Details = o.s3Form;
          break;
        }
      }
      typeDetails = s3Details ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">S3 Bucket Details</Typography>
          <Typography><b>Bucket Name:</b> {s3Details.bucketName}</Typography>
          <Typography><b>East Region:</b> {s3Details.requireEastRegion ? 'Yes' : 'No'}</Typography>
          <Typography><b>West Region:</b> {s3Details.requireWestRegion ? 'Yes' : 'No'}</Typography>
        </Box>
      ) : (
        <Typography>No S3 details available.</Typography>
      );
    } else if (componentView.type === 'Microservice') {
      typeDetails = (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Microservice Details</Typography>
          <Typography><b>Language:</b> {componentView.language}</Typography>
          <Typography color="text.secondary">(Endpoints and more details coming soon)</Typography>
        </Box>
      );
    } else {
      typeDetails = <Typography>No additional details for this component type.</Typography>;
    }

    return (
      <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 4 }}>
        {/* Top row: title and actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Component Details</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined">Edit</Button>
            <Button variant="outlined">View Logs</Button>
            <Button
              variant="outlined"
              onClick={() => window.open('https://app.harness.io/ng/account/AbxyMx_xQDyZL99AYBGckQ/all/orgs/default/projects/javaService?tab=summaryTab', '_blank', 'noopener,noreferrer')}
            >
              View Harness Details
            </Button>
          </Box>
        </Box>
        {/* Section 1: Component Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Component</Typography>
          <Typography><b>Name:</b> {componentView.name}</Typography>
          <Typography><b>Type:</b> {componentView.type}</Typography>
          {componentView.language && <Typography><b>Language:</b> {componentView.language}</Typography>}
        </Box>
        {/* Section 2: System Details */}
        {system && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">System</Typography>
            <Typography><b>Name:</b> {system.name}</Typography>
            <Typography><b>Description:</b> {system.description}</Typography>
            <Typography><b>Technology:</b> {system.technology}</Typography>
          </Box>
        )}
        {/* Section 3: BA Details */}
        {ba && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Business Application</Typography>
            <Typography><b>Name:</b> {ba.name}</Typography>
            <Typography><b>Description:</b> {ba.description}</Typography>
          </Box>
        )}
        {/* Section 4: Type-specific details */}
        {typeDetails}

        {/* Section 5: Release Info or Start New Release */}
        {!startRelease ? (
          <Box sx={{ mb: 3, mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Current Production Release</Typography>
            <Typography><b>Version:</b> {currentRelease.version}</Typography>
            <Typography><b>Last Release Date:</b> {currentRelease.lastReleaseDate}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setStartRelease(true)}>Start New Release</Button>
          </Box>
        ) : (
          <Box sx={{ mb: 3, mt: 4, p: 2, bgcolor: '#fdeaea', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Start New Release</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="build-select-label">Select Build</InputLabel>
              <Select
                labelId="build-select-label"
                value={selectedBuild}
                label="Select Build"
                onChange={handleBuildSelect}
              >
                {availableBuilds.map(b => (
                  <MenuItem key={b.id} value={b.id}>{b.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedBuild && (
              <Box>
                {validationLabels.map(v => (
                  <Box key={v.key} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                    <Typography sx={{ minWidth: 240 }}>{v.label}</Typography>
                    {validationResults && validationResults[v.key] === 'fetching' && <CircularProgress size={20} />}
                    {validationResults && validationResults[v.key] === true && <CheckCircleIcon color="success" />}
                    {validationResults && validationResults[v.key] === false && <CancelIcon color="error" />}
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => { setStartRelease(false); setSelectedBuild(''); setValidationResults(null); setValidating(false); }}>Cancel</Button>
              <Button
                variant="contained"
                disabled={validating || !selectedBuild || (validationResults && Object.values(validationResults).some((v: any) => v !== true))}
                onClick={() => openReleaseSubmitModal(false)}
              >
                Submit Release
              </Button>
              {/* Show 'Submit Release with Exception' if all validations are done, at least one failed, and not validating */}
              {validationResults && !validating && selectedBuild &&
                Object.values(validationResults).every((v: any) => v === true || v === false) &&
                Object.values(validationResults).some((v: any) => v === false) && (
                  <Button variant="contained" color="warning" onClick={() => openReleaseSubmitModal(true)}>
                    Submit Release with Exception
                  </Button>
                )}
            </Box>
          </Box>
        )}

        {/* Release Submit Modal */}
        <Dialog open={releaseSubmitModalOpen} onClose={() => setReleaseSubmitModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Release</DialogTitle>
          <DialogContent>
            <TextField
              label="Release Notes"
              multiline
              minRows={3}
              fullWidth
              required
              value={releaseNotes}
              onChange={e => setReleaseNotes(e.target.value)}
              sx={{ mt: 2 }}
            />
            {isExceptionRelease && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" color="error" sx={{ mb: 1 }}>Failed Validations</Typography>
                <ul style={{ marginTop: 0, marginBottom: 8 }}>
                  {failedValidations.map(f => (
                    <li key={f} style={{ color: '#d32f2f' }}>{f}</li>
                  ))}
                </ul>
                <TextField
                  label="Exception Justification"
                  multiline
                  minRows={2}
                  fullWidth
                  required
                  value={exceptionJustification}
                  onChange={e => setExceptionJustification(e.target.value)}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReleaseSubmitModalOpen(false)} variant="outlined">Close</Button>
            <Button
              onClick={() => {
                setReleaseSubmitModalOpen(false);
                setReleaseNotes('');
                setExceptionJustification('');
              }}
              variant="contained"
              disabled={
                !releaseNotes.trim() ||
                (isExceptionRelease && !exceptionJustification.trim())
              }
              color={isExceptionRelease ? 'warning' : 'primary'}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Section 6: Release History */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Release History</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Release ID</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Release Date</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>Has Exception</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {releaseHistory.map(r => (
                  <TableRow key={r.release_id} hover sx={{ cursor: 'pointer' }}
                    onClick={() => { setSelectedRelease(r); setReleaseDetailsOpen(true); }}
                  >
                    <TableCell sx={{ color: 'primary.main', textDecoration: 'underline' }}>{r.release_id}</TableCell>
                    <TableCell>{r.version}</TableCell>
                    <TableCell>{r.release_date}</TableCell>
                    <TableCell>{r.submitted_by}</TableCell>
                    <TableCell>{r.approved_by}</TableCell>
                    <TableCell>{r.has_exception ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Release Details Modal */}
        <Dialog open={releaseDetailsOpen} onClose={() => setReleaseDetailsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Release Details</DialogTitle>
          <DialogContent>
            {selectedRelease && (
              <Box>
                <Typography><b>Release ID:</b> {selectedRelease.release_id}</Typography>
                <Typography><b>Version:</b> {selectedRelease.version}</Typography>
                <Typography><b>Release Date:</b> {selectedRelease.release_date}</Typography>
                <Typography><b>Submitted By:</b> {selectedRelease.submitted_by}</Typography>
                <Typography><b>Approved By:</b> {selectedRelease.approved_by}</Typography>
                <Typography><b>Has Exception:</b> {selectedRelease.has_exception ? 'Yes' : 'No'}</Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Validation Results</Typography>
                  {validationLabels.map(v => (
                    <Box key={v.key} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <Typography sx={{ minWidth: 220 }}>{v.label}</Typography>
                      {releaseValidationsMap[selectedRelease.release_id] &&
                        (releaseValidationsMap[selectedRelease.release_id][v.key] === true ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        ))}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReleaseDetailsOpen(false)} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={() => setComponentView(null)}>Back to System</Button>
        </Box>
      </Paper>
    );
  }
  if (systemView) {
    const systemComponents = dummyComponents.filter(c => c.systemId === systemView.id);
    return (
      <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>System Details</Typography>
        {/* Section 1: System Details */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => {
            resetSystemWizard();
            setSystemWizardForm({
              systemName: systemView.name || '',
              systemDescription: systemView.description || '',
              technology: systemView.technology || '',
              createComponent: true,
            });
            setSystemWizardAddComponent(true);
            setSystemWizardStep(1);
            // Set baDetails to the correct BA for this system if not already set
            const ba = businessApplications.find(b => b.id === systemView.baId);
            if (ba && (!baDetails || baDetails.ba.id !== ba.id)) {
              setBADetails({
                ba,
                onboardForm: { baName: ba.name, email: '', department: '', createSystem: false },
                systemForm: initialSystemForm,
                componentForm: initialComponentForm,
                databaseForm: null,
                s3Form: null,
              });
            }
          }}>
            Create Component
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.open('https://app.harness.io/ng/account/AbxyMx_xQDyZL99AYBGckQ/all/orgs/default/projects/idporchestrator/overview', '_blank', 'noopener,noreferrer')}
          >
            View Harness Details
          </Button>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography><b>Name:</b> {systemView.name}</Typography>
          <Typography><b>Description:</b> {systemView.description}</Typography>
          <Typography><b>Technology:</b> {systemView.technology}</Typography>
        </Box>
        {/* Section 2: Components */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Components</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {systemComponents.map(comp => (
              <Paper
                key={comp.id}
                sx={{ p: 2, minWidth: 200, cursor: 'pointer', boxShadow: 2 }}
                onClick={() => setComponentView(comp)}
              >
                <Typography variant="subtitle1" fontWeight="bold">{comp.name}</Typography>
                <Typography variant="body2">{comp.type}</Typography>
                {comp.language && <Typography variant="caption" color="text.secondary">{comp.language}</Typography>}
              </Paper>
            ))}
            {systemComponents.length === 0 && <Typography>No components found for this system.</Typography>}
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={() => setSystemView(null)}>Back to BA Details</Button>
        </Box>
      </Paper>
    );
  }
  if (baDetails) {
    const baSystems = dummySystems.filter(sys => sys.baId === baDetails.ba.id);
    return (
      <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>Business Application Details</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={() => {
            resetSystemWizard();
            setSystemWizardStep(0);
          }}>
            Create System
          </Button>
        </Box>
        {/* Section 1: BA Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Details</Typography>
          <Typography><b>Name:</b> {baDetails.ba.name}</Typography>
          <Typography><b>Email:</b> {baDetails.onboardForm.email}</Typography>
          <Typography><b>Department:</b> {baDetails.onboardForm.department}</Typography>
        </Box>
        {/* Section 2: Systems */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Systems</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {baSystems.map(sys => (
              <Paper
                key={sys.id}
                sx={{ p: 2, minWidth: 220, cursor: 'pointer', boxShadow: 2 }}
                onClick={() => setSystemView(sys)}
              >
                <Typography variant="subtitle1" fontWeight="bold">{sys.name}</Typography>
                <Typography variant="body2">{sys.description}</Typography>
                <Typography variant="caption" color="text.secondary">{sys.technology}</Typography>
              </Paper>
            ))}
            {baSystems.length === 0 && <Typography>No systems found for this BA.</Typography>}
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={() => setBADetails(null)}>Back to List</Button>
        </Box>
      </Paper>
    );
  }

  // Split BAs into onboarded and not-onboarded
  const onboardedBAs = onboarded.map(o => o.ba);
  const notOnboardedBAs = businessApplications.filter(ba => !onboarded.some(o => o.ba.id === ba.id));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Business Applications
      </Typography>

      {/* Onboarded Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Onboarded</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {onboardedBAs.length === 0 && (
              <TableRow><TableCell colSpan={3}>No onboarded business applications.</TableCell></TableRow>
            )}
            {onboardedBAs.map((ba) => (
              <TableRow key={ba.id}>
                <TableCell>{ba.name}</TableCell>
                <TableCell>{ba.description}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => {
                    const found = onboarded.find(o => o.ba.id === ba.id);
                    if (found) setBADetails(found);
                  }}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Not Onboarded Section */}
      <Typography variant="h6" sx={{ mb: 1 }}>Not Onboarded</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notOnboardedBAs.length === 0 && (
              <TableRow><TableCell colSpan={3}>All business applications are onboarded.</TableCell></TableRow>
            )}
            {notOnboardedBAs.map((ba) => (
              <TableRow key={ba.id}>
                <TableCell>{ba.name}</TableCell>
                <TableCell>{ba.description}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" onClick={() => {
                    setSelectedBA(ba);
                    setStep(0);
                    setOnboardForm({ ...initialOnboardForm, baName: ba.name });
                    setBADetails(null);
                    setSystemView(null);
                    setComponentView(null);
                  }}>
                    Onboard
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BusinessApplications; 