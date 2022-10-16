<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Models\Image;
use App\Resources\FormattedFilter;
use App\Traits\HasInventory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Collection;

class Equipment extends Model implements Inventoriable, FrontendFilterable
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

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(EquipmentType::cases()), 'conditions' => FormattedFilter::collection(EquipmentCondition::cases())]);
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
