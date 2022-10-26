<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\VarietyContract;
use App\Enums\PlantType;
use App\Resources\FormattedFilter;
use App\Traits\HasInventory;
use App\Traits\HasVariety;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

	public function primaryImage(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->getMedia('images')->first()?->getTemporaryUrl(Carbon::now()->addMinutes(5)) ?? config('icons.fallback.types.plant')
		);
	}

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(PlantType::cases())]);
	}

}
