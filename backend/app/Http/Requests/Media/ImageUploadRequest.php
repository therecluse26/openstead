<?php

namespace App\Http\Requests\Media;

use App\Enums\ModelName;
use App\Rules\Contains;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ImageUploadRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'image' => ['string', 'max:1361920', new Contains('data:image/')],
            'model_name' => ['required', new Enum(ModelName::class)],
            'model_id' => ['required', 'ulid'],
		];
	}
}
