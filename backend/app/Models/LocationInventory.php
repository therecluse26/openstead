<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class LocationInventory extends Model
{
    use HasFactory;

	protected $table = 'location_inventory';

	protected $fillable = [
		'location_id',
		'quantity',
		'acquired_at'
	];

	public function inventoriable(): MorphTo
	{
		return $this->morphTo();
	}

	public function location(): BelongsTo
	{
		return $this->belongsTo(Location::class);
	}

}