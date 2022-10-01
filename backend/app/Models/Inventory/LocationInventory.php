<?php

namespace App\Models\Inventory;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

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
