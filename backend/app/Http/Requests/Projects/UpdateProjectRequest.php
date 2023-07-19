<?php

namespace App\Http\Requests\Projects;

use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Rules\Contains;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateProjectRequest extends FormRequest
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
			'name' => 'required',
            'slug' => 'required',
			'images' => ['array'],
			'description' => ['string'],
			'images.*' => ['string', 'max:1361920', new Contains('data:image/')],
            'project_workflow_id' => 'nullable|integer',
		];
	}

	public function messages()
	{
		return [
			'images.*.max' => 'Maximum image upload size is 1MB',
		];
	}
}
