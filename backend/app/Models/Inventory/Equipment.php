<?php

namespace App\Models\Inventory;

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
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Equipment extends Model implements Inventoriable, FrontendFilterable, HasMedia, Serviceable, Notable
{
	use HasFactory;
	use HasInventory;
	use HasServiceLogs;
	use HasNotes;
	use InteractsWithMedia;

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
		'primary_image'
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

	public function registerMediaConversions(Media $media = null): void
	{
		$this
			->addMediaConversion('preview')
			->fit(Manipulations::FIT_CROP, 300, 300)
			->nonQueued();
	}

	public static function getFilters(): Collection
	{
		return collect(['types' => FormattedFilter::collection(EquipmentType::cases())]);
	}

	public function primaryImage(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->getMedia('images')->first()?->getTemporaryUrl(Carbon::now()->addMinutes(5)) ?? config('icons.fallback.types.equipment')
		);
	}

	public function getConditionDescriptionAttribute()
	{
		return $this->condition ? $this->condition->toString() : "Unknown";
	}


}
