<?php

namespace App\Models\Inventory;

use App\Contracts\AddsMedia;
use App\Contracts\DataTablePaginatable;
use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\Notable;
use App\Contracts\VarietyContract;
use App\Enums\HardinessZone;
use App\Enums\PlantLifeCycle;
use App\Enums\PlantLightRequirement;
use App\Enums\PlantType;
use App\Resources\FormattedFilter;
use App\Resources\Inventory\Detail\SeedResource as SeedDetailResource;
use App\Resources\Inventory\List\SeedResource as SeedListResource;
use App\Traits\HasInventory;
use App\Traits\HasNotes;
use App\Traits\HasVariety;
use App\Traits\HasImages;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\HasMedia;

class Seed extends Model implements DataTablePaginatable, Inventoriable, VarietyContract, FrontendFilterable, HasMedia, AddsMedia, Notable
{
	use HasUlids;
	use HasFactory;
	use HasInventory;
	use HasVariety;
	use HasNotes;
	use HasImages;

	protected $table = 'seeds';

	protected $fillable = [
		'variety_id',
		'quantity',
		'life_cycle',
		'days_to_germination',
		'days_to_maturity',
		'planting_depth',
		'plant_spacing',
		'light_requirement',
		'zone_lower',
		'zone_upper',
		'url',
		'acquired_at'
	];

	protected $casts = [
		'life_cycle' => PlantLifeCycle::class,
		'light_requirement' => PlantLightRequirement::class,
		'zone_lower' => HardinessZone::class,
		'zone_upper' => HardinessZone::class,
		'acquired_at' => 'datetime'
	];

	public function getDetailResource(): JsonResource
	{
		return SeedDetailResource::make($this);
	}

	public function getListResource(): JsonResource
	{
		return SeedListResource::make($this);
	}

	public function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(PlantType::cases())]);
	}

}
