<?php

namespace App\Models;

use App\Enums\ServiceType;
use App\Traits\HasInventory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ServiceLog extends Model
{
	use HasFactory;
	use HasInventory;

	protected $table = 'service_logs';

	protected $fillable = [
		'notes',
		'service_date',
		'service_id'
	];

	protected $casts = [
		'type' => ServiceType::class,
		'service_date' => 'datetime',
	];


	public function service(): BelongsTo
	{
		return $this->belongsTo(Service::class);
	}

	public function serviceable(): MorphTo
	{
		return $this->morphTo();
	}
}
