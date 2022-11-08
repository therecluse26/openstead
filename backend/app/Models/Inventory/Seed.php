<?php

namespace App\Models\Inventory;

use App\Contracts\FrontendFilterable;
use App\Contracts\Inventoriable;
use App\Contracts\Notable;
use App\Contracts\VarietyContract;
use App\Enums\PlantType;
use App\Resources\FormattedFilter;
use App\Resources\Inventory\Detail\SeedResource as SeedDetailResource;
use App\Resources\Inventory\List\SeedResource as SeedListResource;
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

class Seed extends Model implements Inventoriable, VarietyContract, FrontendFilterable, HasMedia, Notable
{
	use HasFactory;
	use HasInventory;
	use HasVariety;
	use HasNotes;
	use InteractsWithMedia;

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

	public function getDetailResource(): JsonResource
	{
		return SeedDetailResource::make($this);
	}

	public function getListResource(): JsonResource
	{
		return SeedListResource::make($this);
	}

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

	public function registerMediaConversions(Media $media = null): void
	{
		$this
			->addMediaConversion('preview')
			->fit(Manipulations::FIT_CROP, 300, 300)
			->nonQueued();
	}

}
