<?php

namespace App\Traits;

use App\Enums\ModelName;

trait PolymorphicRepository
{
	public function findPolymorphicModel(string $type, int $id)
	{
		$model = new(ModelName::from($type)->class());
		return $model->withoutGlobalScopes()->findOrFail($id);
	}
}