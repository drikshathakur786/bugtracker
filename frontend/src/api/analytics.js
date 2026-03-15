import api from './axios';

export const getAnalyticsSummary = (projectId) =>
  api.get(`/projects/${projectId}/analytics/summary`);

export const getByAssignee = (projectId) =>
  api.get(`/projects/${projectId}/analytics/by-assignee`);

export const getByStatus = (projectId) =>
  api.get(`/projects/${projectId}/analytics/by-status`);