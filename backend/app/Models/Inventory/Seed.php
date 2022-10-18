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
		'variety_id',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'acquired_at' => 'datetime'
	];

	protected $with = [
		'variety'
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

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(PlantType::cases())]);
	}

}
