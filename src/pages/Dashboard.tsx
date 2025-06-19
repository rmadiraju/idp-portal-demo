import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  TextField,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Storage as StorageIcon,
  Widgets as WidgetsIcon,
  RocketLaunch as RocketLaunchIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { businessApplications } from '../data/businessApplications';
import { dummySystems, dummyComponents, dummyOnboardedBAs } from './BusinessApplications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

const validationLabels = [
  { key: 'vulnerabilities', label: 'Validate Build Vulnerabilities' },
  { key: 'componentTests', label: 'Validate Component Tests' },
  { key: 'liveDependency', label: 'Validate Live-Dependency Tests' },
  { key: 'performance', label: 'Validate Performance Tests' },
  { key: 'changeFreeze', label: 'Change Freeze Validation' },
];

const Dashboard: React.FC = () => {
  const { authState } = useAuth();

  const stats = [
    {
      title: 'Total BAs',
      value: businessApplications.length,
      icon: BusinessIcon,
      color: '#1976d2',
    },
    {
      title: 'Total Systems',
      value: dummySystems.length,
      icon: StorageIcon,
      color: '#388e3c',
    },
    {
      title: 'Total Components',
      value: dummyComponents.length,
      icon: WidgetsIcon,
      color: '#8e24aa',
    },
    {
      title: 'Total Releases',
      value: releaseHistory.length,
      icon: RocketLaunchIcon,
      color: '#f57c00',
    },
  ];

  // const recentActivities = [
  //   { id: 1, action: 'BA Created', time: '2 minutes ago', status: 'success' },
  //   { id: 2, action: 'Documentation Updated', time: '15 minutes ago', status: 'info' },
  //   { id: 3, action: 'New API Endpoint Added', time: '1 hour ago', status: 'success' },
  //   { id: 4, action: 'Rate Limit Exceeded', time: '2 hours ago', status: 'warning' },
  //   { id: 5, action: 'SDK Version Released', time: '3 hours ago', status: 'success' },
  // ];

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case 'success':
  //       return <CheckCircle color="success" />;
  //     case 'warning':
  //       return <Warning color="warning" />;
  //     case 'error':
  //       return <Error color="error" />;
  //     default:
  //       return <CheckCircle color="info" />;
  //   }
  // };

  const [onboardBAOpen, setOnboardBAOpen] = useState(false);
  const [releaseOverlayOpen, setReleaseOverlayOpen] = useState(false);
  const [releaseStep, setReleaseStep] = useState(0);
  const [selectedBA, setSelectedBA] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedBuild, setSelectedBuild] = useState('');
  const [validationResults, setValidationResults] = useState<any>(null);
  const [validating, setValidating] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState('');
  // const [releaseSubmitModalOpen, setReleaseSubmitModalOpen] = useState(false);
  const [isExceptionRelease, setIsExceptionRelease] = useState(false);
  const [exceptionJustification, setExceptionJustification] = useState('');
  // const [failedValidations, setFailedValidations] = useState<string[]>([]);

  // Onboarding wizard state
  const [baStep, setBAStep] = useState(0);
  const [selectedBAForOnboard, setSelectedBAForOnboard] = useState('');
  const [onboardForm, setOnboardForm] = useState({ baName: '', email: '', department: '', createSystem: false });
  const [systemForm, setSystemForm] = useState({ systemName: '', systemDescription: '', technology: '', createComponent: false });
  const [componentForm, setComponentForm] = useState({ componentType: 'Microservice', componentName: '', language: '' });
  const [databaseForm, setDatabaseForm] = useState({ databaseType: 'AWS Aurora Postgres', databaseName: '', schemaName: '' });
  const [s3Form, setS3Form] = useState({ bucketName: '', requireEastRegion: false, requireWestRegion: false });
  const [addDB, setAddDB] = useState(false);
  const [addS3, setAddS3] = useState(false);

  // Compute not-onboarded BAs (simulate onboarded as those with a system in dummySystems)
  const onboardedBAIds = Array.from(new Set(dummySystems.map(sys => sys.baId)));
  const notOnboardedBAs = businessApplications.filter(ba => !onboardedBAIds.includes(ba.id));

  const [createSystemOpen, setCreateSystemOpen] = useState(false);
  const [systemStep, setSystemStep] = useState(0);
  const [selectedBAForSystem, setSelectedBAForSystem] = useState('');
  const [systemContact, setSystemContact] = useState({ email: '', department: '' });
  const [systemWizardForm, setSystemWizardForm] = useState({ systemName: '', systemDescription: '', technology: '', createComponent: false });
  const [systemWizardComponentForm, setSystemWizardComponentForm] = useState({ componentType: 'Microservice', componentName: '', language: '' });
  const [systemWizardAddDB, setSystemWizardAddDB] = useState(false);
  const [systemWizardAddS3, setSystemWizardAddS3] = useState(false);
  const [systemWizardDatabaseForm, setSystemWizardDatabaseForm] = useState({ databaseType: 'AWS Aurora Postgres', databaseName: '', schemaName: '' });
  const [systemWizardS3Form, setSystemWizardS3Form] = useState({ bucketName: '', requireEastRegion: false, requireWestRegion: false });

  const [createComponentOpen, setCreateComponentOpen] = useState(false);
  const [componentStep, setComponentStep] = useState(0);
  const [selectedBAForComponent, setSelectedBAForComponent] = useState('');
  const [selectedSystemForComponent, setSelectedSystemForComponent] = useState('');
  const [componentContact, setComponentContact] = useState({ email: '', department: '' });
  const [componentWizardForm, setComponentWizardForm] = useState({ componentType: 'Microservice', componentName: '', language: '' });
  const [componentWizardAddDB, setComponentWizardAddDB] = useState(false);
  const [componentWizardAddS3, setComponentWizardAddS3] = useState(false);
  const [componentWizardDatabaseForm, setComponentWizardDatabaseForm] = useState({ databaseType: 'AWS Aurora Postgres', databaseName: '', schemaName: '' });
  const [componentWizardS3Form, setComponentWizardS3Form] = useState({ bucketName: '', requireEastRegion: false, requireWestRegion: false });

  const resetComponentFlow = () => {
    setCreateComponentOpen(false);
    setComponentStep(0);
    setSelectedBAForComponent('');
    setSelectedSystemForComponent('');
    setComponentContact({ email: '', department: '' });
    setComponentWizardForm({ componentType: 'Microservice', componentName: '', language: '' });
    setComponentWizardAddDB(false);
    setComponentWizardAddS3(false);
    setComponentWizardDatabaseForm({ databaseType: 'AWS Aurora Postgres', databaseName: '', schemaName: '' });
    setComponentWizardS3Form({ bucketName: '', requireEastRegion: false, requireWestRegion: false });
  };

  const resetReleaseFlow = () => {
    setReleaseOverlayOpen(false);
    setReleaseStep(0);
    setSelectedBA('');
    setSelectedSystem('');
    setSelectedComponent('');
    setSelectedBuild('');
    setValidationResults(null);
    setValidating(false);
    setReleaseNotes('');
    setIsExceptionRelease(false);
    setExceptionJustification('');
    // setFailedValidations([]);
  };

  const handleBuildSelect = (e: any) => {
    const buildId = e.target.value;
    setSelectedBuild(buildId);
    setValidationResults(null);
    setValidating(true);
    const build = availableBuilds.find(b => b.id === buildId);
    if (!build) return;
    let results: any = {};
    validationLabels.forEach(v => { results[v.key] = 'fetching'; });
    setValidationResults({ ...results });
    let idx = 0;
    function next() {
      if (idx >= validationLabels.length) {
        setValidating(false);
        return;
      }
      const key = validationLabels[idx].key;
      setTimeout(() => {
        if (!build) return;
        setValidationResults((prev: any) => ({ ...prev, [key]: build.validations[key as keyof typeof build.validations] }));
        idx++;
        next();
      }, 900);
    }
    next();
  };

  // const openReleaseSubmitModal = (exception: boolean) => {
  //   setIsExceptionRelease(exception);
  //   setReleaseSubmitModalOpen(true);
  //   setReleaseNotes('');
  //   setExceptionJustification('');
  //   if (exception && validationResults) {
  //     const failed = validationLabels
  //       .filter(v => validationResults[v.key] === false)
  //       .map(v => v.label);
  //     setFailedValidations(failed);
  //   } else {
  //     setFailedValidations([]);
  //   }
  // };

  const resetBAFlow = () => {
    setOnboardBAOpen(false);
    setBAStep(0);
    setSelectedBAForOnboard('');
    setOnboardForm({ baName: '', email: '', department: '', createSystem: false });
    setSystemForm({ systemName: '', systemDescription: '', technology: '', createComponent: false });
    setComponentForm({ componentType: 'Microservice', componentName: '', language: '' });
    setDatabaseForm({ databaseType: 'AWS Aurora Postgres', databaseName: '', schemaName: '' });
    setS3Form({ bucketName: '', requireEastRegion: false, requireWestRegion: false });
    setAddDB(false);
    setAddS3(false);
  };

  const resetSystemFlow = () => {
    setCreateSystemOpen(false);
    setSystemStep(0);
    setSelectedBAForSystem('');
    setSystemContact({ email: '', department: '' });
    setSystemWizardForm({ systemName: '', systemDescription: '', technology: '', createComponent: false });
    setSystemWizardComponentForm({ componentType: 'Microservice', componentName: '', language: '' });
    setSystemWizardAddDB(false);
    setSystemWizardAddS3(false);
    setSystemWizardDatabaseForm({ databaseType: 'AWS Aurora Postgres', databaseName: '', schemaName: '' });
    setSystemWizardS3Form({ bucketName: '', requireEastRegion: false, requireWestRegion: false });
  };

  const onboardedBAs = dummyOnboardedBAs.map(o => o.ba);
  const getOnboardedBAInfo = (baId: string) => {
    const found = dummyOnboardedBAs.find(o => o.ba.id === baId);
    return found ? found.onboardForm : { email: '', department: '' };
  };

  const getSystemsForBA = (baId: string) => dummySystems.filter(sys => sys.baId === baId);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {onboardBAOpen ? (
        <Paper sx={{ width: '100%', maxWidth: 700, p: 4, boxShadow: 8, mt: 4, mx: 'auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Typography variant="h4" gutterBottom>Onboard Business Application</Typography>
          <Stepper activeStep={baStep} alternativeLabel sx={{ mb: 4 }}>
            {['BA Info', 'System Details', 'Component Details', 'DB & S3', 'Summary'].map(label => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          {baStep === 0 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setBAStep(1); }} sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="ba-select-label">Select Business Application</InputLabel>
                <Select labelId="ba-select-label" value={selectedBAForOnboard} label="Select Business Application" onChange={e => { setSelectedBAForOnboard(e.target.value); setOnboardForm(f => ({ ...f, baName: businessApplications.find(ba => ba.id === e.target.value)?.name || '' })); }} required>
                  {notOnboardedBAs.map(ba => (
                    <MenuItem key={ba.id} value={ba.id}>{ba.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField fullWidth label="Contact Email" value={onboardForm.email} onChange={e => setOnboardForm(f => ({ ...f, email: e.target.value }))} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Department" value={onboardForm.department} onChange={e => setOnboardForm(f => ({ ...f, department: e.target.value }))} required sx={{ mb: 2 }} />
              <FormControlLabel control={<Radio checked={onboardForm.createSystem} onChange={e => setOnboardForm(f => ({ ...f, createSystem: e.target.checked }))} />} label="Create a new system for this BA?" />
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetBAFlow}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={!selectedBAForOnboard}>Next</Button>
              </Box>
            </Box>
          )}
          {baStep === 1 && onboardForm.createSystem && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setBAStep(systemForm.createComponent ? 2 : 3); }} sx={{ mb: 3 }}>
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
                <Button variant="outlined" onClick={resetBAFlow}>Cancel</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {baStep === 2 && systemForm.createComponent && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setBAStep(3); }} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Component Details</Typography>
              <TextField fullWidth label="Component Name" value={componentForm.componentName} onChange={e => setComponentForm(f => ({ ...f, componentName: e.target.value }))} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Component Type" value={componentForm.componentType} onChange={e => setComponentForm(f => ({ ...f, componentType: e.target.value }))} required select sx={{ mb: 2 }}>
                <MenuItem value="Microservice">Microservice</MenuItem>
                <MenuItem value="DB">DB</MenuItem>
                <MenuItem value="S3">S3</MenuItem>
              </TextField>
              {componentForm.componentType === 'Microservice' && (
                <TextField fullWidth label="Language" value={componentForm.language} onChange={e => setComponentForm(f => ({ ...f, language: e.target.value }))} required sx={{ mb: 2 }} />
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetBAFlow}>Cancel</Button>
                <Button variant="outlined" onClick={() => setBAStep(1)}>Back</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {baStep === 3 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setBAStep(4); }} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>DB & S3</Typography>
              <FormControlLabel control={<Radio checked={addDB} onChange={e => setAddDB(e.target.checked)} />} label="Add Database?" />
              {addDB && (
                <Box sx={{ pl: 2, mb: 2 }}>
                  <TextField fullWidth label="Database Type" value={databaseForm.databaseType} onChange={e => setDatabaseForm(f => ({ ...f, databaseType: e.target.value }))} required select sx={{ mb: 2 }}>
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
                <Button variant="outlined" onClick={resetBAFlow}>Cancel</Button>
                <Button variant="outlined" onClick={() => setBAStep(systemForm.createComponent ? 2 : 1)}>Back</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {baStep === 4 && (
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
                <Button variant="outlined" onClick={resetBAFlow}>Cancel</Button>
                <Button variant="contained" onClick={resetBAFlow}>Finish</Button>
              </Box>
            </Box>
          )}
        </Paper>
      ) : releaseOverlayOpen ? (
        <Paper sx={{ width: '100%', maxWidth: 700, p: 4, boxShadow: 8, mt: 4, mx: 'auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Typography variant="h4" gutterBottom>Submit Release</Typography>
          <Stepper activeStep={releaseStep} alternativeLabel sx={{ mb: 4 }}>
            {['BA', 'System', 'Component', 'Build', 'Review & Submit'].map(label => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          {releaseStep === 0 && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="ba-select-label">Select Business Application</InputLabel>
              <Select labelId="ba-select-label" value={selectedBA} label="Select Business Application" onChange={e => { setSelectedBA(e.target.value); setSelectedSystem(''); setSelectedComponent(''); setReleaseStep(1); }}>
                {businessApplications.map(ba => (
                  <MenuItem key={ba.id} value={ba.id}>{ba.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {releaseStep === 1 && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="system-select-label">Select System</InputLabel>
              <Select labelId="system-select-label" value={selectedSystem} label="Select System" onChange={e => { setSelectedSystem(e.target.value); setSelectedComponent(''); setReleaseStep(2); }}>
                {dummySystems.filter(sys => sys.baId === selectedBA).map(sys => (
                  <MenuItem key={sys.id} value={sys.id}>{sys.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {releaseStep === 2 && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="component-select-label">Select Component</InputLabel>
              <Select labelId="component-select-label" value={selectedComponent} label="Select Component" onChange={e => { setSelectedComponent(e.target.value); setReleaseStep(3); }}>
                {dummyComponents.filter(comp => comp.systemId === selectedSystem).map(comp => (
                  <MenuItem key={comp.id} value={comp.id}>{comp.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {releaseStep === 3 && (
            <>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="build-select-label">Select Build</InputLabel>
                <Select labelId="build-select-label" value={selectedBuild} label="Select Build" onChange={handleBuildSelect}>
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
                <Button variant="outlined" onClick={resetReleaseFlow}>Cancel</Button>
                <Button
                  variant="contained"
                  disabled={validating || !selectedBuild || (validationResults && Object.values(validationResults).some((v: any) => v !== true))}
                  onClick={() => setReleaseStep(4)}
                >
                  Next
                </Button>
                {validationResults && !validating && selectedBuild &&
                  Object.values(validationResults).every((v: any) => v === true || v === false) &&
                  Object.values(validationResults).some((v: any) => v === false) && (
                    <Button variant="contained" color="warning" onClick={() => { setReleaseStep(4); setIsExceptionRelease(true); }}>
                      Next with Exception
                    </Button>
                  )}
              </Box>
            </>
          )}
          {releaseStep === 4 && (
            <Box>
              <TextField
                label="Release Notes"
                multiline
                minRows={3}
                required
                value={releaseNotes}
                onChange={e => setReleaseNotes(e.target.value)}
                sx={{ mt: 2, width: '500px', maxWidth: '100%' }}
              />
              {isExceptionRelease && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" color="error" sx={{ mb: 1 }}>Failed Validations</Typography>
                  <ul style={{ marginTop: 0, marginBottom: 8 }}>
                    {validationLabels.filter(v => validationResults && validationResults[v.key] === false).map(v => (
                      <li key={v.key} style={{ color: '#d32f2f' }}>{v.label}</li>
                    ))}
                  </ul>
                  <TextField
                    label="Exception Justification"
                    multiline
                    minRows={2}
                    required
                    value={exceptionJustification}
                    onChange={e => setExceptionJustification(e.target.value)}
                    sx={{ mt: 1, width: '500px', maxWidth: '100%' }}
                  />
                </Box>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetReleaseFlow}>Cancel</Button>
                <Button
                  variant="contained"
                  disabled={!releaseNotes.trim() || (isExceptionRelease && !exceptionJustification.trim())}
                  color={isExceptionRelease ? 'warning' : 'primary'}
                  onClick={resetReleaseFlow}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      ) : createSystemOpen ? (
        <Paper sx={{ width: '100%', maxWidth: 700, p: 4, boxShadow: 8, mt: 4, mx: 'auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', zIndex: 10 }}>
          <Typography variant="h4" gutterBottom>Create System</Typography>
          <Stepper activeStep={systemStep} alternativeLabel sx={{ mb: 4 }}>
            {['BA', 'System Details', 'Component Details', 'DB & S3', 'Summary'].map(label => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          {systemStep === 0 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setSystemStep(1); }} sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="system-ba-select-label">Select Business Application</InputLabel>
                <Select labelId="system-ba-select-label" value={selectedBAForSystem} label="Select Business Application" onChange={e => {
                  setSelectedBAForSystem(e.target.value);
                  const info = getOnboardedBAInfo(e.target.value);
                  setSystemContact({ email: info.email, department: info.department });
                }} required>
                  {onboardedBAs.map(ba => (
                    <MenuItem key={ba.id} value={ba.id}>{ba.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField fullWidth label="Contact Email" value={systemContact.email} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
              <TextField fullWidth label="Department" value={systemContact.department} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetSystemFlow}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={!selectedBAForSystem}>Next</Button>
              </Box>
            </Box>
          )}
          {systemStep === 1 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setSystemStep(systemWizardForm.createComponent ? 2 : 3); }} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>System Details</Typography>
              <TextField fullWidth label="System Name" value={systemWizardForm.systemName} onChange={e => setSystemWizardForm(f => ({ ...f, systemName: e.target.value }))} required sx={{ mb: 2 }} />
              <TextField fullWidth label="System Description" value={systemWizardForm.systemDescription} onChange={e => setSystemWizardForm(f => ({ ...f, systemDescription: e.target.value }))} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Technology Stack" value={systemWizardForm.technology} onChange={e => setSystemWizardForm(f => ({ ...f, technology: e.target.value }))} required select sx={{ mb: 2 }}>
                <MenuItem value="Java Spring Boot">Java Spring Boot</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
                <MenuItem value="Python Django">Python Django</MenuItem>
                <MenuItem value=".NET Core">.NET Core</MenuItem>
              </TextField>
              <FormControlLabel control={<Radio checked={systemWizardForm.createComponent} onChange={e => setSystemWizardForm(f => ({ ...f, createComponent: e.target.checked }))} />} label="Add a component to this system?" />
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetSystemFlow}>Cancel</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {systemStep === 2 && systemWizardForm.createComponent && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setSystemStep(3); }} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Component Details</Typography>
              <TextField fullWidth label="Component Name" value={systemWizardComponentForm.componentName} onChange={e => setSystemWizardComponentForm(f => ({ ...f, componentName: e.target.value }))} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Component Type" value={systemWizardComponentForm.componentType} onChange={e => setSystemWizardComponentForm(f => ({ ...f, componentType: e.target.value }))} required select sx={{ mb: 2 }}>
                <MenuItem value="Microservice">Microservice</MenuItem>
                <MenuItem value="DB">DB</MenuItem>
                <MenuItem value="S3">S3</MenuItem>
              </TextField>
              {systemWizardComponentForm.componentType === 'Microservice' && (
                <TextField fullWidth label="Language" value={systemWizardComponentForm.language} onChange={e => setSystemWizardComponentForm(f => ({ ...f, language: e.target.value }))} required sx={{ mb: 2 }} />
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetSystemFlow}>Cancel</Button>
                <Button variant="outlined" onClick={() => setSystemStep(1)}>Back</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {systemStep === 3 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setSystemStep(4); }} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>DB & S3</Typography>
              <FormControlLabel control={<Radio checked={systemWizardAddDB} onChange={e => setSystemWizardAddDB(e.target.checked)} />} label="Add Database?" />
              {systemWizardAddDB && (
                <Box sx={{ pl: 2, mb: 2 }}>
                  <TextField fullWidth label="Database Type" value={systemWizardDatabaseForm.databaseType} onChange={e => setSystemWizardDatabaseForm(f => ({ ...f, databaseType: e.target.value }))} required select sx={{ mb: 2 }}>
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
                <Button variant="outlined" onClick={resetSystemFlow}>Cancel</Button>
                <Button variant="outlined" onClick={() => setSystemStep(systemWizardForm.createComponent ? 2 : 1)}>Back</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {systemStep === 4 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
              <Typography><b>BA Name:</b> {onboardedBAs.find(ba => ba.id === selectedBAForSystem)?.name}</Typography>
              <Typography><b>Email:</b> {systemContact.email}</Typography>
              <Typography><b>Department:</b> {systemContact.department}</Typography>
              <Typography sx={{ mt: 2 }}><b>System Name:</b> {systemWizardForm.systemName}</Typography>
              <Typography><b>System Description:</b> {systemWizardForm.systemDescription}</Typography>
              <Typography><b>Technology:</b> {systemWizardForm.technology}</Typography>
              {systemWizardForm.createComponent && (
                <>
                  <Typography sx={{ mt: 2 }}><b>Component Name:</b> {systemWizardComponentForm.componentName}</Typography>
                  <Typography><b>Component Type:</b> {systemWizardComponentForm.componentType}</Typography>
                  {systemWizardComponentForm.language && <Typography><b>Language:</b> {systemWizardComponentForm.language}</Typography>}
                </>
              )}
              {systemWizardAddDB && (
                <>
                  <Typography sx={{ mt: 2 }}><b>Database Type:</b> {systemWizardDatabaseForm.databaseType}</Typography>
                  <Typography><b>Database Name:</b> {systemWizardDatabaseForm.databaseName}</Typography>
                  <Typography><b>Schema Name:</b> {systemWizardDatabaseForm.schemaName}</Typography>
                </>
              )}
              {systemWizardAddS3 && (
                <>
                  <Typography sx={{ mt: 2 }}><b>S3 Bucket Name:</b> {systemWizardS3Form.bucketName}</Typography>
                  <Typography><b>East Region:</b> {systemWizardS3Form.requireEastRegion ? 'Yes' : 'No'}</Typography>
                  <Typography><b>West Region:</b> {systemWizardS3Form.requireWestRegion ? 'Yes' : 'No'}</Typography>
                </>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetSystemFlow}>Cancel</Button>
                <Button variant="contained" onClick={resetSystemFlow}>Finish</Button>
              </Box>
            </Box>
          )}
        </Paper>
      ) : createComponentOpen ? (
        <Paper sx={{ width: '100%', maxWidth: 700, p: 4, boxShadow: 8, mt: 4, mx: 'auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', zIndex: 10 }}>
          <Typography variant="h4" gutterBottom>Create Component</Typography>
          <Stepper activeStep={componentStep} alternativeLabel sx={{ mb: 4 }}>
            {['BA', 'System', 'Component Details', 'DB & S3', 'Summary'].map(label => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          {componentStep === 0 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setComponentStep(1); }} sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="component-ba-select-label">Select Business Application</InputLabel>
                <Select labelId="component-ba-select-label" value={selectedBAForComponent} label="Select Business Application" onChange={e => {
                  setSelectedBAForComponent(e.target.value);
                  const info = getOnboardedBAInfo(e.target.value);
                  setComponentContact({ email: info.email, department: info.department });
                  setSelectedSystemForComponent('');
                }} required>
                  {onboardedBAs.map(ba => (
                    <MenuItem key={ba.id} value={ba.id}>{ba.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField fullWidth label="Contact Email" value={componentContact.email} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
              <TextField fullWidth label="Department" value={componentContact.department} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetComponentFlow}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={!selectedBAForComponent}>Next</Button>
              </Box>
            </Box>
          )}
          {componentStep === 1 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setComponentStep(2); }} sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="component-system-select-label">Select System</InputLabel>
                <Select labelId="component-system-select-label" value={selectedSystemForComponent} label="Select System" onChange={e => setSelectedSystemForComponent(e.target.value)} required>
                  {getSystemsForBA(selectedBAForComponent).map(sys => (
                    <MenuItem key={sys.id} value={sys.id}>{sys.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetComponentFlow}>Cancel</Button>
                <Button variant="outlined" onClick={() => setComponentStep(0)}>Back</Button>
                <Button type="submit" variant="contained" disabled={!selectedSystemForComponent}>Next</Button>
              </Box>
            </Box>
          )}
          {componentStep === 2 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setComponentStep(3); }} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Component Details</Typography>
              <TextField fullWidth label="Component Name" value={componentWizardForm.componentName} onChange={e => setComponentWizardForm(f => ({ ...f, componentName: e.target.value }))} required sx={{ mb: 2 }} />
              <TextField fullWidth label="Component Type" value={componentWizardForm.componentType} onChange={e => setComponentWizardForm(f => ({ ...f, componentType: e.target.value }))} required select sx={{ mb: 2 }}>
                <MenuItem value="Microservice">Microservice</MenuItem>
                <MenuItem value="DB">DB</MenuItem>
                <MenuItem value="S3">S3</MenuItem>
              </TextField>
              {componentWizardForm.componentType === 'Microservice' && (
                <TextField fullWidth label="Language" value={componentWizardForm.language} onChange={e => setComponentWizardForm(f => ({ ...f, language: e.target.value }))} required sx={{ mb: 2 }} />
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetComponentFlow}>Cancel</Button>
                <Button variant="outlined" onClick={() => setComponentStep(1)}>Back</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {componentStep === 3 && (
            <Box component="form" onSubmit={e => { e.preventDefault(); setComponentStep(4); }} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>DB & S3</Typography>
              <FormControlLabel control={<Radio checked={componentWizardAddDB} onChange={e => setComponentWizardAddDB(e.target.checked)} />} label="Add Database?" />
              {componentWizardAddDB && (
                <Box sx={{ pl: 2, mb: 2 }}>
                  <TextField fullWidth label="Database Type" value={componentWizardDatabaseForm.databaseType} onChange={e => setComponentWizardDatabaseForm(f => ({ ...f, databaseType: e.target.value }))} required select sx={{ mb: 2 }}>
                    <MenuItem value="AWS Aurora Postgres">AWS Aurora Postgres</MenuItem>
                    <MenuItem value="AWS RDS MySQL">AWS RDS MySQL</MenuItem>
                  </TextField>
                  <TextField fullWidth label="Database Name" value={componentWizardDatabaseForm.databaseName} onChange={e => setComponentWizardDatabaseForm(f => ({ ...f, databaseName: e.target.value }))} required sx={{ mb: 2 }} />
                  <TextField fullWidth label="Schema Name" value={componentWizardDatabaseForm.schemaName} onChange={e => setComponentWizardDatabaseForm(f => ({ ...f, schemaName: e.target.value }))} required sx={{ mb: 2 }} />
                </Box>
              )}
              <FormControlLabel control={<Radio checked={componentWizardAddS3} onChange={e => setComponentWizardAddS3(e.target.checked)} />} label="Add S3 Bucket?" />
              {componentWizardAddS3 && (
                <Box sx={{ pl: 2, mb: 2 }}>
                  <TextField fullWidth label="Bucket Name" value={componentWizardS3Form.bucketName} onChange={e => setComponentWizardS3Form(f => ({ ...f, bucketName: e.target.value }))} required sx={{ mb: 2 }} />
                  <FormControlLabel control={<Radio checked={componentWizardS3Form.requireEastRegion} onChange={e => setComponentWizardS3Form(f => ({ ...f, requireEastRegion: e.target.checked }))} />} label="Require East Region?" />
                  <FormControlLabel control={<Radio checked={componentWizardS3Form.requireWestRegion} onChange={e => setComponentWizardS3Form(f => ({ ...f, requireWestRegion: e.target.checked }))} />} label="Require West Region?" />
                </Box>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetComponentFlow}>Cancel</Button>
                <Button variant="outlined" onClick={() => setComponentStep(2)}>Back</Button>
                <Button type="submit" variant="contained">Next</Button>
              </Box>
            </Box>
          )}
          {componentStep === 4 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
              <Typography><b>BA Name:</b> {onboardedBAs.find(ba => ba.id === selectedBAForComponent)?.name}</Typography>
              <Typography><b>Email:</b> {componentContact.email}</Typography>
              <Typography><b>Department:</b> {componentContact.department}</Typography>
              <Typography sx={{ mt: 2 }}><b>System:</b> {getSystemsForBA(selectedBAForComponent).find(sys => sys.id === selectedSystemForComponent)?.name}</Typography>
              <Typography sx={{ mt: 2 }}><b>Component Name:</b> {componentWizardForm.componentName}</Typography>
              <Typography><b>Component Type:</b> {componentWizardForm.componentType}</Typography>
              {componentWizardForm.language && <Typography><b>Language:</b> {componentWizardForm.language}</Typography>}
              {componentWizardAddDB && (
                <>
                  <Typography sx={{ mt: 2 }}><b>Database Type:</b> {componentWizardDatabaseForm.databaseType}</Typography>
                  <Typography><b>Database Name:</b> {componentWizardDatabaseForm.databaseName}</Typography>
                  <Typography><b>Schema Name:</b> {componentWizardDatabaseForm.schemaName}</Typography>
                </>
              )}
              {componentWizardAddS3 && (
                <>
                  <Typography sx={{ mt: 2 }}><b>S3 Bucket Name:</b> {componentWizardS3Form.bucketName}</Typography>
                  <Typography><b>East Region:</b> {componentWizardS3Form.requireEastRegion ? 'Yes' : 'No'}</Typography>
                  <Typography><b>West Region:</b> {componentWizardS3Form.requireWestRegion ? 'Yes' : 'No'}</Typography>
                </>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={resetComponentFlow}>Cancel</Button>
                <Button variant="contained" onClick={resetComponentFlow}>Finish</Button>
              </Box>
            </Box>
          )}
        </Paper>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome back, {authState.user?.username}!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Here's what's happening with your developer portal today.
          </Typography>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconComponent sx={{ color: stat.color, mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {stat.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Main Content */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Approvals Overview */}
            <Paper sx={{ p: 2, flex: '1 1 340px', minWidth: '320px', minHeight: 320, maxHeight: 400, overflow: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Approvals Overview
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body1">Pending Approvals</Typography>
                  <Chip label="5" color="warning" size="medium" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body1">Pending Escalation Approvals</Typography>
                  <Chip label="2" color="error" size="medium" />
                </Box>
              </Box>
            </Paper>

            {/* Recent Releases */}
            <Paper sx={{ p: 2, flex: '1 1 340px', minWidth: '320px', minHeight: 320, maxHeight: 400, overflow: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Recent Releases
              </Typography>
              <List dense>
                {releaseHistory.slice(0, 3).map((release) => {
                  // Try to find the component name for this release (dummy logic: use first component or placeholder)
                  let componentName = 'Component';
                  if (dummyComponents && dummyComponents.length > 0) {
                    // Try to match by release_id or just use the first for demo
                    componentName = dummyComponents[0].name;
                  }
                  return (
                    <ListItem key={release.release_id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={<>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {componentName} &mdash; {release.release_id} &mdash; {release.version}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">{release.release_date}</Typography>
                        </>}
                        secondary={<>
                          <Typography variant="caption">Submitted by: {release.submitted_by}</Typography>
                          {release.has_exception && <Chip label="Exception" color="error" size="small" sx={{ ml: 1 }} />}
                        </>}
                      />
                    </ListItem>
                  );
                })}
                {releaseHistory.length === 0 && (
                  <ListItem><ListItemText primary="No recent releases." /></ListItem>
                )}
              </List>
            </Paper>
          </Box>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 }, flex: '1 1 200px', minWidth: '200px' }} onClick={() => setOnboardBAOpen(true)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1">Onboard BA</Typography>
                </CardContent>
              </Card>
              <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 }, flex: '1 1 200px', minWidth: '200px' }} onClick={() => setCreateSystemOpen(true)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <StorageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1">Create System</Typography>
                </CardContent>
              </Card>
              <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 }, flex: '1 1 200px', minWidth: '200px' }} onClick={() => setCreateComponentOpen(true)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WidgetsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1">Create Component</Typography>
                </CardContent>
              </Card>
              <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 }, flex: '1 1 200px', minWidth: '200px' }} onClick={() => setReleaseOverlayOpen(true)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <RocketLaunchIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1">Create Release</Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Dashboard; 