import api from './api';

export const submitAbstract = (formData) =>
  api.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const analyzeAbstract = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/submissions/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getSubmissions = () => api.get('/admin/submissions');
export const getSubmissionById = (id) => api.get(`/admin/submissions/${id}`);
export const downloadFile = (id) => api.get(`/admin/submissions/${id}/download`, { responseType: 'blob' });
