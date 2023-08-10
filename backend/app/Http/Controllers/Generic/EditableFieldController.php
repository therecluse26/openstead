<?php

namespace App\Http\Controllers\Generic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Generic\UpdateEditableFieldRequest;
use App\Http\Requests\Generic\UpdateNoteRequest;
use App\Repositories\Generic\EditableFieldRepository;
use App\Repositories\Generic\NoteRepository;
use Illuminate\Http\Response;

final class EditableFieldController extends Controller
{
	/**
	 * Update editable field
	 *
	 * @param UpdateNoteRequest $request
	 * @param string $note
	 * @param NoteRepository $repository
	 * @return Response
	 */
	public function update(UpdateEditableFieldRequest $request, string $modelName, string $modelId): Response
	{
        try {
            $repository = new EditableFieldRepository($modelName);

            $fieldName = $request->get('field_name');
            $value = $request->get('value');
            
            return response($repository->updateField($modelId, $fieldName, $value), 200);

        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
	}

	
}
