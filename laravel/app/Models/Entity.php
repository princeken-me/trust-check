<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entity extends Model
{
    use HasFactory;

    protected $fillable = [
        'entity_type',
        'name',
        'slug',
        'description',
        'website',
        'phone',
        'email',
        'address',
        'country',
        'state_region',
        'city',
        'status',
        'verification_status',
        'trust_status',
    ];

    public function websiteData(): HasOne
    {
        return $this->hasOne(Website::class);
    }

    public function businessData(): HasOne
    {
        return $this->hasOne(Business::class);
    }

    public function riskSignals(): HasMany
    {
        return $this->hasMany(RiskSignal::class);
    }

    public function trustSignals(): HasMany
    {
        return $this->hasMany(TrustSignal::class);
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(Evidence::class);
    }

    public function trustScores(): HasMany
    {
        return $this->hasMany(TrustScore::class);
    }

    public function latestTrustScore(): HasOne
    {
        return $this->hasOne(TrustScore::class)->latestOfMany();
    }

    public function userReports(): HasMany
    {
        return $this->hasMany(UserReport::class);
    }

    public function verificationRequests(): HasMany
    {
        return $this->hasMany(VerificationRequest::class);
    }

    public function verifiedEntity(): HasOne
    {
        return $this->hasOne(VerifiedEntity::class);
    }
}
