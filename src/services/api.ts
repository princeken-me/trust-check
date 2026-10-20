import { Entity, UserReport, UserRole } from '../types/index.js';

export async function checkEntity(query: string, inputType: string = 'url', userId?: string) {
  const res = await fetch('/api/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, input_type: inputType, user_id: userId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Check request failed');
  }
  return await res.json();
}

export async function fetchEntities(type?: string, status?: string, q?: string) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  if (q) params.append('q', q);

  const res = await fetch(`/api/entities?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch entities');
  return await res.json();
}

export async function fetchEntityById(id: string) {
  const res = await fetch(`/api/entities/${id}`);
  if (!res.ok) throw new Error('Entity not found');
  return await res.json();
}

export async function submitReport(payload: {
  entity_id: string;
  report_type: string;
  description: string;
  evidence_summary?: string;
  user_name?: string;
  user_email?: string;
}) {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to submit report');
  return await res.json();
}

export async function fetchAdminReports() {
  const res = await fetch('/api/admin/reports');
  if (!res.ok) throw new Error('Failed to fetch reports');
  return await res.json();
}

export async function moderateReport(reportId: string, action: string, notes: string) {
  const res = await fetch(`/api/admin/reports/${reportId}/moderate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, notes })
  });
  if (!res.ok) throw new Error('Failed to moderate report');
  return await res.json();
}

export async function submitVerificationRequest(payload: {
  entity_id: string;
  organization_name: string;
  documentation_summary: string;
}) {
  const res = await fetch('/api/verifications/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to submit verification request');
  return await res.json();
}

export async function fetchAdminVerifications() {
  const res = await fetch('/api/admin/verifications');
  if (!res.ok) throw new Error('Failed to fetch verifications');
  return await res.json();
}

export async function reviewVerification(requestId: string, approved: boolean, notes: string) {
  const res = await fetch(`/api/admin/verifications/${requestId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved, notes })
  });
  if (!res.ok) throw new Error('Failed to review verification');
  return await res.json();
}

export async function fetchWatchlist() {
  const res = await fetch('/api/watchlist');
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  return await res.json();
}

export async function toggleWatchlist(entityId: string) {
  const res = await fetch('/api/watchlist/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entity_id: entityId })
  });
  if (!res.ok) throw new Error('Failed to update watchlist');
  return await res.json();
}

export async function fetchAdminLogs() {
  const res = await fetch('/api/admin/logs');
  if (!res.ok) throw new Error('Failed to fetch admin logs');
  return await res.json();
}

export async function fetchDataSources() {
  const res = await fetch('/api/admin/sources');
  if (!res.ok) throw new Error('Failed to fetch data sources');
  return await res.json();
}

export async function fetchArchitectureSpec() {
  const res = await fetch('/api/architecture');
  if (!res.ok) throw new Error('Failed to fetch architecture spec');
  return await res.json();
}

export async function fetchResearchQueue() {
  const res = await fetch('/api/admin/research-queue');
  if (!res.ok) throw new Error('Failed to fetch research queue');
  return await res.json();
}

export async function dispatchResearchJob(payload: {
  entity_id?: string;
  entity_name: string;
  research_type: string;
  sources?: string[];
}) {
  const res = await fetch('/api/admin/research-queue/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to dispatch research job');
  return await res.json();
}

export async function processResearchJob(jobId: string) {
  const res = await fetch(`/api/admin/research-queue/process/${jobId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to process research job');
  return await res.json();
}

export async function fetchDuplicateScan() {
  const res = await fetch('/api/admin/duplicates');
  if (!res.ok) throw new Error('Failed to fetch duplicate scan');
  return await res.json();
}

export async function triggerScheduler() {
  const res = await fetch('/api/admin/scheduled-tasks/run', {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to trigger scheduler');
  return await res.json();
}

