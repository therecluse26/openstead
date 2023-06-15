<?php

namespace App\Http\Requests\Generic;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNoteRequest extends FormRequest
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
			'notable_type' => ['required', 'string'],
			'notable_id' => ['required', 'integer'],
			'note' => ['required', 'string', 'max:5000'],
		];
	}

}
