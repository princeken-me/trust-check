<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for TrustCheck Platform (22 Core Tables).
     */
    public function up(): void
    {
        // 1. USERS
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->enum('role', ['Super Admin', 'Admin', 'Analyst', 'Moderator', 'Verified Business', 'Regular User'])->default('Regular User');
            $table->enum('status', ['active', 'suspended', 'pending'])->default('active');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();

            $table->index(['email', 'role', 'status']);
        });

        // 2. ENTITIES
        Schema::create('entities', function (Blueprint $table) {
            $table->id();
            $table->enum('entity_type', [
                'Website', 'Business', 'Seller', 'Job Offer', 'Rental Listing', 
                'Investment Opportunity', 'Social Media Account', 'Phone Number', 
                'Email Address', 'Payment Account', 'Organization'
            ]);
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('website')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('country')->nullable();
            $table->string('state_region')->nullable();
            $table->string('city')->nullable();
            $table->enum('status', ['active', 'flagged', 'archived'])->default('active');
            $table->enum('verification_status', ['unverified', 'pending', 'verified', 'rejected', 'revoked'])->default('unverified');
            $table->enum('trust_status', ['trusted', 'low_risk', 'neutral', 'elevated_risk', 'high_risk', 'unverified'])->default('unverified');
            $table->timestamps();

            $table->index(['entity_type', 'slug', 'verification_status', 'trust_status']);
        });

        // 3. WEBSITES
        Schema::create('websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('domain')->index();
            $table->string('full_url');
            $table->text('registration_info')->nullable();
            $table->integer('domain_age_days')->nullable();
            $table->boolean('https_status')->default(true);
            $table->string('cert_info')->nullable();
            $table->string('registrar')->nullable();
            $table->string('country')->nullable();
            $table->string('hosting_info')->nullable();
            $table->timestamp('first_discovered_date')->nullable();
            $table->timestamp('last_checked_date')->nullable();
            $table->timestamps();
        });

        // 4. BUSINESSES
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('business_name');
            $table->string('registration_number')->nullable();
            $table->text('registration_info')->nullable();
            $table->string('website')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('country')->nullable();
            $table->json('social_profiles')->nullable();
            $table->enum('verification_status', ['unverified', 'pending', 'verified', 'rejected', 'revoked'])->default('unverified');
            $table->boolean('claimed_status')->default(false);
            $table->timestamp('verified_date')->nullable();
            $table->timestamps();
        });

        // 5. SOCIAL PROFILES
        Schema::create('social_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('platform');
            $table->string('username');
            $table->string('profile_url');
            $table->enum('verification_status', ['unverified', 'pending', 'verified'])->default('unverified');
            $table->timestamp('date_discovered')->useCurrent();
            $table->timestamps();
        });

        // 6. JOB OFFERS
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('job_title');
            $table->string('company');
            $table->string('application_url');
            $table->string('recruiter')->nullable();
            $table->string('contact_details')->nullable();
            $table->string('salary')->nullable();
            $table->string('location')->nullable();
            $table->boolean('remote_status')->default(false);
            $table->boolean('payment_request_detected')->default(false);
            $table->boolean('application_fee_detected')->default(false);
            $table->enum('verification_status', ['unverified', 'pending', 'verified'])->default('unverified');
            $table->timestamps();
        });

        // 7. RENTAL LISTINGS
        Schema::create('rental_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('property_title');
            $table->string('location');
            $table->string('landlord_agent');
            $table->string('contact');
            $table->string('listing_url');
            $table->string('price');
            $table->string('property_type');
            $table->json('images')->nullable();
            $table->enum('verification_status', ['unverified', 'pending', 'verified'])->default('unverified');
            $table->enum('duplicate_detection_status', ['none', 'possible_duplicate', 'verified_unique'])->default('none');
            $table->timestamps();
        });

        // 8. INVESTMENT OPPORTUNITIES
        Schema::create('investment_opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('organization');
            $table->string('website');
            $table->string('opportunity_type');
            $table->string('claimed_returns');
            $table->string('minimum_investment')->nullable();
            $table->string('contact_details')->nullable();
            $table->text('regulatory_info')->nullable();
            $table->enum('verification_status', ['unverified', 'pending', 'verified'])->default('unverified');
            $table->timestamps();
        });

        // 9. CHECK REQUESTS
        Schema::create('check_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('input_type');
            $table->string('submitted_url')->nullable();
            $table->text('submitted_text')->nullable();
            $table->string('submitted_phone')->nullable();
            $table->string('submitted_email')->nullable();
            $table->json('uploaded_evidence')->nullable();
            $table->foreignId('entity_matched_id')->nullable()->constrained('entities')->onDelete('set null');
            $table->timestamp('date_submitted')->useCurrent();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('completed');
            $table->timestamps();
        });

        // 10. RISK SIGNALS
        Schema::create('risk_signals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('signal_name');
            $table->string('category');
            $table->text('description');
            $table->enum('severity', ['critical', 'high', 'medium', 'low', 'info'])->default('medium');
            $table->text('evidence')->nullable();
            $table->string('source');
            $table->integer('confidence')->default(80);
            $table->timestamp('date_detected')->useCurrent();
            $table->timestamps();

            $table->index(['entity_id', 'severity', 'category']);
        });

        // 11. TRUST SIGNALS
        Schema::create('trust_signals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('signal_name');
            $table->string('category');
            $table->text('description');
            $table->enum('significance', ['high', 'medium', 'standard'])->default('standard');
            $table->text('evidence')->nullable();
            $table->string('source');
            $table->integer('confidence')->default(80);
            $table->timestamp('date_detected')->useCurrent();
            $table->timestamps();

            $table->index(['entity_id', 'significance', 'category']);
        });

        // 12. EVIDENCE
        Schema::create('evidence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->enum('evidence_type', [
                'Website page', 'Public record', 'User submission', 'Screenshot', 
                'Document', 'External source', 'Business information', 'Historical record'
            ]);
            $table->string('title');
            $table->string('source_url')->nullable();
            $table->text('description');
            $table->string('file_path')->nullable();
            $table->timestamp('collected_date')->useCurrent();
            $table->enum('verification_status', ['verified', 'unverified', 'disputed'])->default('verified');
            $table->timestamps();
        });

        // 13. USER REPORTS
        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('report_type', [
                'Suspicious website', 'Fake business', 'Fake job', 'Fake rental', 
                'Suspicious investment', 'Payment fraud', 'Impersonation', 'Other concern'
            ]);
            $table->text('description');
            $table->text('evidence_summary')->nullable();
            $table->json('evidence_files')->nullable();
            $table->enum('status', ['pending', 'under_review', 'actioned', 'dismissed'])->default('pending');
            $table->text('moderation_notes')->nullable();
            $table->foreignId('moderated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index(['entity_id', 'status', 'report_type']);
        });

        // 14. TRUST SCORES
        Schema::create('trust_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->integer('score');
            $table->enum('risk_level', [
                'Strong Trust Signals', 'Generally Low Risk', 'Moderate Risk', 
                'High Risk', 'Suspicious', 'Limited Verification', 'Unable to Verify', 'Verified Identity'
            ]);
            $table->integer('trust_signals_count')->default(0);
            $table->integer('risk_signals_count')->default(0);
            $table->integer('confidence')->default(50);
            $table->text('score_explanation');
            $table->timestamp('calculated_date')->useCurrent();
            $table->timestamps();

            $table->index(['entity_id', 'score', 'risk_level']);
        });

        // 15. TRUST SCORE HISTORY
        Schema::create('trust_score_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->integer('previous_score');
            $table->integer('new_score');
            $table->string('risk_level');
            $table->text('change_reason');
            $table->timestamp('changed_at')->useCurrent();
            $table->timestamps();
        });

        // 16. VERIFICATION REQUESTS
        Schema::create('verification_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('organization_name');
            $table->text('documentation_summary');
            $table->json('documentation_files')->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('review_notes')->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])->default('pending');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });

        // 17. VERIFIED ENTITIES
        Schema::create('verified_entities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('verification_type');
            $table->json('documents')->nullable();
            $table->foreignId('reviewer_id')->constrained('users');
            $table->timestamp('verification_date')->useCurrent();
            $table->timestamp('expiry_date')->nullable();
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->timestamps();
        });

        // 18. REVIEWS AND EXPERIENCES
        Schema::create('reviews_and_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('user_name');
            $table->integer('rating');
            $table->string('title');
            $table->text('content');
            $table->text('evidence')->nullable();
            $table->enum('moderation_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('moderated_by')->nullable()->constrained('users');
            $table->timestamp('moderated_at')->nullable();
            $table->timestamps();
        });

        // 19. WATCHLIST
        Schema::create('watchlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->json('alert_preferences')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'entity_id']);
        });

        // 20. ALERTS
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->string('alert_type');
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // 21. ADMIN ACTIVITY LOG
        Schema::create('admin_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('admin_name');
            $table->string('action');
            $table->string('target_type');
            $table->string('target_id');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        // 22. DATA SOURCES
        Schema::create('data_sources', function (Blueprint $table) {
            $table->id();
            $table->string('source_name');
            $table->string('source_type');
            $table->string('url_api');
            $table->integer('reliability_rating')->default(5);
            $table->string('country');
            $table->boolean('active_status')->default(true);
            $table->timestamp('last_checked')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_sources');
        Schema::dropIfExists('admin_activity_logs');
        Schema::dropIfExists('alerts');
        Schema::dropIfExists('watchlists');
        Schema::dropIfExists('reviews_and_experiences');
        Schema::dropIfExists('verified_entities');
        Schema::dropIfExists('verification_requests');
        Schema::dropIfExists('trust_score_history');
        Schema::dropIfExists('trust_scores');
        Schema::dropIfExists('user_reports');
        Schema::dropIfExists('evidence');
        Schema::dropIfExists('trust_signals');
        Schema::dropIfExists('risk_signals');
        Schema::dropIfExists('check_requests');
        Schema::dropIfExists('investment_opportunities');
        Schema::dropIfExists('rental_listings');
        Schema::dropIfExists('job_offers');
        Schema::dropIfExists('social_profiles');
        Schema::dropIfExists('businesses');
        Schema::dropIfExists('websites');
        Schema::dropIfExists('entities');
        Schema::dropIfExists('users');
    }
};
