import { VerificationRequest, VerifiedEntity, Entity, AdminActivityLog } from '../../src/types/index.js';

export class VerificationService {
  /**
   * Processes business identity verification requests.
   */
  public processVerification(
    request: VerificationRequest,
    reviewerId: string,
    approved: boolean,
    reviewNotes: string
  ): {
    updatedRequest: VerificationRequest;
    verifiedRecord?: VerifiedEntity;
    updatedEntityStatus: 'verified' | 'unverified';
    logEntry: AdminActivityLog;
  } {
    const status = approved ? 'approved' : 'rejected';
    const updatedRequest: VerificationRequest = {
      ...request,
      status,
      reviewer_id: reviewerId,
      review_notes: reviewNotes
    };

    let verifiedRecord: VerifiedEntity | undefined;
    if (approved) {
      verifiedRecord = {
        id: `ve-${Date.now()}`,
        entity_id: request.entity_id,
        verification_type: 'Government Registry',
        documents: request.documentation_files,
        reviewer_id: reviewerId,
        verification_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };
    }

    const logEntry: AdminActivityLog = {
      id: `log-${Date.now()}`,
      admin_id: reviewerId,
      admin_name: 'Compliance Specialist',
      action: `VERIFICATION_${status.toUpperCase()}`,
      target_type: 'VerificationRequest',
      target_id: request.id,
      old_values: { status: request.status },
      new_values: { status, reviewNotes },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    };

    return {
      updatedRequest,
      verifiedRecord,
      updatedEntityStatus: approved ? 'verified' : 'unverified',
      logEntry
    };
  }
}
