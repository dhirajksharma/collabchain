import { Project } from "./Project";

export interface User {
  name: string;
  email: string;
  verifyEmailStatus: boolean;
  phone?: number;
  aadhar: number;
  ethAddress: string;
  password: string;
  organization?: {
    organization_id: string; // Assuming this is of type string (MongoDB ObjectId)
    designation?: string;
  };
  project_ongoing?: Project; // Assuming this is of type string (MongoDB ObjectId)
  projects_completed?: Project[]; // Array of strings (MongoDB ObjectId)
  projects_saved?: Project[]; // Array of strings (MongoDB ObjectId)
}
