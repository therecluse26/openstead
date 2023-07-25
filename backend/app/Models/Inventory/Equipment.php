<?php

namespace App\Models\Inventory;

use App\Contracts\DataTablePaginatable;
use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\Notable;
use App\Contracts\Serviceable;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Resources\FormattedFilter;
use App\Resources\Inventory\Detail\EquipmentResource as EquipmentDetailResource;
use App\Resources\Inventory\List\EquipmentResource as EquipmentListResource;
use App\Traits\HasInventory;
use App\Traits\HasNotes;
use App\Traits\HasServiceLogs;
use App\Traits\HasImages;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\HasMedia;

class Equipment extends Model implements DataTablePaginatable, Inventoriable, FrontendFilterable, HasMedia, Serviceable, Notable
{
	use HasUlids;
	use HasFactory;
	use HasInventory;
	use HasServiceLogs;
	use HasNotes;
	use HasImages;

	protected $table = 'equipment';

	protected $fillable = [
		'name',
		'type',
		'condition',
		'rating',
		'description',
		'url',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'type' => EquipmentType::class,
		'condition' => EquipmentCondition::class,
		'acquired_at' => 'datetime'
	];

	protected $appends = [
		'condition_description',
	];

	public static function boot()
	{
		parent::boot();
		self::deleting(function ($model) {
			$model->serviceLogs()->each(function ($r) {
				$r->delete();
			});
		});
	}

	public function getDetailResource(): JsonResource
	{
		return EquipmentDetailResource::make($this);
	}

	public function getListResource(): JsonResource
	{
		return EquipmentListResource::make($this);
	}

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(EquipmentType::cases())]);
	}

	public function getConditionDescriptionAttribute()
	{
		return $this->condition ? $this->condition->toString() : "Unknown";
	}


}
