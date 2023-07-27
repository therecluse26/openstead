<?php

namespace App\Repositories\Generic;

use App\Enums\ModelName;
use Illuminate\Database\Eloquent\Model;
use App\Helpers\StringHelpers;

class EditableFieldRepository
{
    protected string $modelName;

    public function __construct(string $modelName)
    {
        $this->modelName = ModelName::from($modelName)->class();
    }

    public function updateField(string $modelId, string $field, string $value)
    {
        $model = $this->modelName::find($modelId);

        if(!$model) throw new \Exception('Model not found');

        if(!in_array($field, $model->getFillable())) throw new \Exception('Field not found');

        $model->$field = StringHelpers::sanitizeHtml($value);
        $model->save();

        return $model->$field;
    }
}