<?php

namespace App\Http\Controllers\Generic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Generic\StoreNoteRequest;
use App\Http\Requests\Generic\UpdateNoteRequest;
use App\Repositories\Generic\NoteRepository;
use App\Resources\Generic\Detail\NoteResource;
use Illuminate\Http\Response;

final class NoteController extends Controller
{

	public function index(NoteRepository $repository, string $modelName, string $modelId): Response
	{
		return response(
			NoteResource::collection(
				$repository->list($modelName, $modelId)
			), 200);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreNoteRequest $request
	 * @param NoteRepository $repository
	 * @return Response
	 */
	public function store(StoreNoteRequest $request, NoteRepository $repository): Response
	{
		return response($repository->create(
			collect(
				$request->all()
			)),
			200
		);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateNoteRequest $request
	 * @param string $note
	 * @param NoteRepository $repository
	 * @return Response
	 */
	public function update(UpdateNoteRequest $request, string $note, NoteRepository $repository): Response
	{
		return response($repository->update($note, $request), 200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param NoteRepository $repository
	 * @param string $id
	 * @return Response
	 */
	public function destroy(NoteRepository $repository, string $id): Response
	{
		return response($repository->delete($id));
	}
}
