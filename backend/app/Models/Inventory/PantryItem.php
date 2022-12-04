<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\Notable;
use App\Contracts\VarietyContract;
use App\Traits\HasInventory;
use App\Traits\HasNotes;
use App\Traits\HasVariety;
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

class PantryItem extends Model implements Inventoriable, VarietyContract, FrontendFilterable, HasMedia, Notable
{
	use HasFactory;
	use HasInventory;
	use HasVariety;
	use HasNotes;
	use InteractsWithMedia;

	protected $table = 'pantry_items';

	protected $fillable = [
		'name',
		'type',
		'description',
		'variety_id',
		'unit',
		'unit_amount',
		'quantity',
		'expiration_date'
	];

	protected $casts = [
	];

	public function getDetailResource(): JsonResource
	{
	}

	public function getListResource(): JsonResource
	{
	}

	public static function getFilters(): Collection
	{
	}

	public function primaryImage(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->getMedia('images')->first()?->getTemporaryUrl(Carbon::now()->addMinutes(5)) ?? config('icons.fallback.types.pantry')
		);
	}

	public function registerMediaConversions(Media $media = null): void
	{
		$this
			->addMediaConversion('preview')
			->fit(Manipulations::FIT_CROP, 300, 300)
			->nonQueued();
	}

}
