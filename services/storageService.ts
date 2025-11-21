
import type { Maker, PrintJob } from '../types';
import { MOCK_MAKERS, MOCK_PRINT_JOBS } from '../constants';

const KEYS = {
  MAKERS: 'agencia_maker_users',
  JOBS: 'agencia_maker_jobs',
};

// Initialize Storage with Mock Data if empty
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.MAKERS)) {
    localStorage.setItem(KEYS.MAKERS, JSON.stringify(MOCK_MAKERS));
  }
  if (!localStorage.getItem(KEYS.JOBS)) {
    localStorage.setItem(KEYS.JOBS, JSON.stringify(MOCK_PRINT_JOBS));
  }
};

// --- Users / Makers ---

export const getUsers = (): Maker[] => {
  const data = localStorage.getItem(KEYS.MAKERS);
  return data ? JSON.parse(data) : MOCK_MAKERS;
};

export const saveUser = (user: Maker): void => {
  const users = getUsers();
  // Check if exists update, else add
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(KEYS.MAKERS, JSON.stringify(users));
};

export const getUserByEmail = (email: string): Maker | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

// --- Print Jobs ---

export const getPrintJobs = (): PrintJob[] => {
  const data = localStorage.getItem(KEYS.JOBS);
  return data ? JSON.parse(data) : MOCK_PRINT_JOBS;
};

export const savePrintJob = (job: PrintJob): void => {
  const jobs = getPrintJobs();
  jobs.unshift(job); // Add to top
  localStorage.setItem(KEYS.JOBS, JSON.stringify(jobs));
};
