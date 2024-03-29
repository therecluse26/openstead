<?php

namespace App\Http\Requests\Generic;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEditableFieldRequest extends FormRequest
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
			'field_name' => ['required', 'string'],
			'value' => ['nullable', 'string'],
		];
	}

}
