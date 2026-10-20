import { UserReport, AdminActivityLog } from '../../src/types/index.js';

export class ReportModerationService {
  /**
   * Moderates user submitted reports and appends audit trail entries.
   */
  public moderateReport(
    report: UserReport,
    action: 'actioned' | 'dismissed' | 'under_review',
    moderatorId: string,
    moderationNotes: string
  ): { updatedReport: UserReport; logEntry: AdminActivityLog } {
    const updatedReport: UserReport = {
      ...report,
      status: action,
      moderated_by: moderatorId,
      moderation_notes: moderationNotes
    };

    const logEntry: AdminActivityLog = {
      id: `log-${Date.now()}`,
      admin_id: moderatorId,
      admin_name: 'Moderator Desk',
      action: `REPORT_MODERATION_${action.toUpperCase()}`,
      target_type: 'UserReport',
      target_id: report.id,
      old_values: { status: report.status },
      new_values: { status: action, notes: moderationNotes },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    };

    return { updatedReport, logEntry };
  }
}
