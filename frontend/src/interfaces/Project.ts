// src/interfaces/Project.ts

import { Document, Schema } from "mongoose";
import { User } from "./User";

export interface ProjectReview {
  userId: Schema.Types.ObjectId;
  name: string;
  rating: number;
  comment?: string;
}

export interface MenteeApplication {
  userId: Schema.Types.ObjectId;
  name?: string;
  status: string;
}

export interface MenteeApproved {
  userId: Schema.Types.ObjectId;
  name?: string;
  assignedTaskIds?: string[];
}

export interface Task {
  id: string;
  title: string;
  token?: number;
  description?: string;
  priority?: string;
  dueDate?: Date;
  taskStatus?: string;
  menteesAssigned?: { userId: Schema.Types.ObjectId; name?: string }[];
  verificationKey?: string;
}

export interface Project {
  _id: string;
  title?: string;
  domain?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  token?: number;
  ratings?: number;
  numOfReviews?: number;
  reviews?: ProjectReview[];
  mentor?: Schema.Types.ObjectId;
  organization?: Schema.Types.ObjectId;
  menteesRequired?: number;
  menteesApplication?: MenteeApplication[];
  menteesApproved?: MenteeApproved[];
  tasks?: Task[];
  parentProjectId?: Schema.Types.ObjectId;
  links?: { linkType?: string; linkUrl?: string }[];
}

export interface ProjectDocument extends Project, Document {}
