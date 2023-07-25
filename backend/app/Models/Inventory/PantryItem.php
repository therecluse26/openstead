<?php

namespace App\Models\Inventory;

use App\Contracts\DataTablePaginatable;
use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\Notable;
use App\Contracts\VarietyContract;
use App\Enums\EdibleCompositeEnum;
use App\Enums\KitchenUnit;
use App\Enums\PantryStorageType;
use App\Resources\FormattedFilter;
use App\Resources\Inventory\Detail\PantryItemResource as PantryItemDetailResource;
use App\Resources\Inventory\List\PantryItemResource as PantryItemListResource;
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

class PantryItem extends Model implements DataTablePaginatable, Inventoriable, VarietyContract, FrontendFilterable, HasMedia, Notable
{
	use HasUlids;
	use HasFactory;
	use HasInventory;
	use HasVariety;
	use HasNotes;
	use HasImages;

	protected $table = 'pantry_items';

	protected $fillable = [
		'name',
		'type',
		'description',
		'variety_id',
		'unit',
		'unit_amount',
		'quantity',
		'expiration_date',
		'storage_type',
		'shelf_life_months',
	];

	protected $casts = [
		'expiration_date' => 'datetime',
		'storage_type' => PantryStorageType::class,
		'unit' => KitchenUnit::class,
	];

	public function getDetailResource(): JsonResource
	{
		return PantryItemDetailResource::make($this);
	}

	public function getListResource(): JsonResource
	{
		return PantryItemListResource::make($this);
	}

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(EdibleCompositeEnum::cases())]);
	}


}
