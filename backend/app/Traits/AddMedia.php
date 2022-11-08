<?php

namespace App\Traits;

use Spatie\MediaLibrary\HasMedia;

trait AddMedia
{
	public function addOrReplaceImagesBase64(HasMedia $model, iterable $images = null): void
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