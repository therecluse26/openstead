<?php

namespace App\Repositories\Media;

use App\Enums\ModelName;
use App\Traits\AddMedia;
use Illuminate\Database\Eloquent\Model;
use App\Models\Media;
use Illuminate\Http\Request;

class ImageRepository
{
    use AddMedia;

    private Model $model;

    public function __construct(string $modelName)
    {
        $modelName = ModelName::from($modelName)->class();
        if(!class_exists($modelName)) throw new \Exception('Model not found');

        $this->model = new $modelName;
    }

    public function uploadImageFromBase64(string $imageData, string $modelId, bool $compress = false)
    {
        $record = $this->model::find($modelId);

        if(!$record) throw new \Exception('Record not found');

        $image = $record->addMediaFromBase64($imageData, ['image/*'])
            ->toMediaCollection('images');

        return $this->generateImageStreamUrl($image->id);
    }

    public function generateImageStreamUrl($imageId){
        return route('image.show', ['imageId' => $imageId]);
    }

    public static function showImage(string $imageId){
        $image = Media::find($imageId);

        return $image->toInlineResponse(request());
    }
}