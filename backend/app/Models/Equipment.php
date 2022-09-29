<?php

namespace App\Models;

use App\Contracts\Inventoriable;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Equipment extends Model implements Inventoriable
{
	use HasFactory;

	protected $table = 'equipment';

	protected $fillable = [
		'name',
		'type',
		'condition',
		'description'
	];

//	protected $fillableFormTypes = [
//		'type' => ['type' => 'select', 'options' => EquipmentType::class],
//		'condition' => ['type' => 'select', 'options' => EquipmentCondition::class],
//	];

	protected $casts = [
		'type' => EquipmentType::class,
		'condition' => EquipmentCondition::class
	];

	protected $appends = [
		'condition_description',
	];

	public function getFillableFormTypesAttribute()
	{
	}

	public function inventory(): MorphMany
	{
		return $this->morphMany(LocationInventory::class, 'inventoriable');
	}

	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}

	public function getConditionDescriptionAttribute()
	{
		return $this->condition ? $this->condition->toString() : "Unknown";
	}
}
