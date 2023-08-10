<?php

namespace App\Traits;

use App\Contracts\AddsMedia;
use Illuminate\Database\Eloquent\Collection;

trait AddMedia
{
	public function addOrReplaceImagesBase64(AddsMedia $model, array|Collection $images): void
	{
		if (is_array($images)) {
			$images = collect($images);
		}
		if ($images->count() === 0) {
			return;
		}

		$model->clearMediaCollection('images');

		foreach ($images as $image) {
			$model
				->addMediaFromBase64($image, ['image/*'])
				->toMediaCollection('images');
		}
	}
}