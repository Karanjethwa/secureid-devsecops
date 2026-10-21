export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  status: 'Active' | 'Suspended';
  verification_status: 'Verified (Demo)' | 'Pending review' | 'Unverified';
  sdiId?: string;
  bio?: string;
  department?: string;
  phone?: string;
  created_at: string;
  last_login: string | null;
  stats?: {
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
  };
}

export interface LoginActivity {
  id: number;
  user_id: number | null;
  identifier: string;
  action: string;
  details: string;
  status: 'Successful' | 'Failed';
  ip_address: string;
  user_agent: string;
  risk_level: 'Low' | 'Medium' | 'High';
  created_at: string;
}

export interface SecurityAlert {
  id: number;
  user_id: number | null;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  description: string;
  source_ip: string;
  status: 'Active' | 'Resolved';
  created_at: string;
}

export interface AuditLog {
  id: number;
  admin_id: number;
  admin_username: string;
  action: string;
  target_user_id: number | null;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface SecurityFinding {
  title: string;
  detail: string;
  severity: 'safe' | 'warning' | 'info';
}

export interface SecurityAnalysis {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  failedLogins: number;
  successfulLogins: number;
  eventsAnalyzed: number;
  generatedAt: string;
  findings: SecurityFinding[];
  recommendations: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  adminCount: number;
  totalLogins: number;
  successfulLogins: number;
  failedLogins: number;
  activeAlerts: number;
}
