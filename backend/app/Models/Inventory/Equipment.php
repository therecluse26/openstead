<?php

namespace App\Models\Inventory;

use App\Contracts\Inventoriable;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Models\Image;
use App\Traits\HasInventory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Equipment extends Model implements Inventoriable
{
	use HasFactory;
	use HasInventory;

	protected $table = 'equipment';

	protected $fillable = [
		'name',
		'type',
		'condition',
		'description',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'type' => EquipmentType::class,
		'condition' => EquipmentCondition::class
	];

	protected $appends = [
		'condition_description',
	];

	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}

	public function getConditionDescriptionAttribute()
	{
		return $this->condition ? $this->condition->toString() : "Unknown";
	}
}
