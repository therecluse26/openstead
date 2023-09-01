<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait HasImages
{
	use InteractsWithMedia;

	public function images(): MediaCollection
	{
		return $this->getMedia('images');
	}

	public function primaryImage(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->getMedia('images')->first()?->getTemporaryUrl(Carbon::now()->addMinutes(5)) ?? config('icons.fallback.types.' . $this->table)
		);
	}

	public function registerMediaConversions(Media $media = null): void
	{
		$this
			->addMediaConversion('preview')
			->fit(Manipulations::FIT_CROP, 300, 300)
			->nonQueued();primaryImage
	}
}