export interface BusinessApplication {
  id: string;
  name: string;
  description: string;
}

export interface OnboardFormData {
  baName: string;
  email: string;
  department: string;
  createSystem: boolean;
}

export interface SystemFormData {
  systemName: string;
  systemDescription: string;
  technology: string;
  createComponent: boolean;
}

export type ComponentType =
  | 'Microservice'
  | 'DB'
  | 'AWS Managed Service'
  | 'Streaming Consumer'
  | 'Streaming Producer'
  | 'Web UI';

export type DatabaseType = 'AWS Aurora Postgres';

export interface DatabaseFormData {
  databaseType: DatabaseType;
  databaseName: string;
  schemaName: string;
}

export interface S3FormData {
  bucketName: string;
  requireEastRegion: boolean;
  requireWestRegion: boolean;
}

export interface ComponentFormData {
  componentType: ComponentType;
  componentName: string;
  language?: string;
  orgName?: string;
  artifactName?: string;
  basePackageName?: string;
  requiresDatabase?: boolean;
  databaseDetails?: DatabaseFormData;
  requiresS3?: boolean;
  s3Details?: S3FormData;
} 