<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectItemRequest extends FormRequest
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
			'title' => ['required', 'string', 'max:255'],
			'description' => ['nullable', 'string'],
			'project_item_status_id' => ['required', 'string', 'exists:project_item_statuses,id'],
			'due_date' => ['nullable', 'date'],
			'assignee_id' => ['nullable', 'string', 'exists:users,id'],
		];
	}

	public function messages()
	{
		return [
		];
	}
}
