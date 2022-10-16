<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\VarietyContract;
use App\Enums\PlantType;
use App\Models\Image;
use App\Resources\FormattedFilter;
use App\Traits\HasInventory;
use App\Traits\HasVariety;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Collection;

class Seed extends Model implements Inventoriable, VarietyContract, FrontendFilterable
{
	use HasFactory;
	use HasInventory;
	use HasVariety;

	protected $table = 'seeds';

	protected $fillable = [
		'type',
		'variety_id',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'type' => PlantType::class,
		'acquired_at' => 'datetime'
	];

	protected $appends = [
		'type_description',
		'variety_name'
	];

	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}

	public function breed(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->variety?->name ?? null
		);
	}

	public function getTypeDescriptionAttribute()
	{
		return $this->type->toFilter();
	}

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(PlantType::cases())]);
	}

}
