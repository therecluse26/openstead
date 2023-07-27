<?php

namespace App\Http\Controllers\Media;

use App\Http\Requests\Media\ImageUploadRequest;
use App\Repositories\Media\ImageRepository;
use Illuminate\Routing\Controller;

final class ImageController extends Controller
{
    public function uploadBase64(ImageUploadRequest $request){
        $image = $request->image;
        $modelName = $request->model_name;
        $modelId = $request->model_id;

        $repository = new ImageRepository($modelName);

        return response($repository->uploadImageFromBase64($image, $modelId));
    }

    public function showImage(string|int $imageId)
    {
        return ImageRepository::showImage($imageId);
            
    }
}
