<?php

namespace App\Models;

use App\Enums\ServiceType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Service extends Model
{
	use HasUlids, HasFactory, BelongsToTenant;

	protected $table = 'services';

	protected $fillable = [
		'tenant_id',
		'type',
		'title',
		'description',
	];

	protected $casts = [
		'type' => ServiceType::class
	];
}
