<?php

namespace App\Repositories\Generic;

use App\Models\Note;
use App\Traits\PolymorphicRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Symfony\Component\Translation\Exception\NotFoundResourceException;

class NoteRepository
{
	use PolymorphicRepository;

	private Note $model;

	private array $fields = [
		'notable_type',
		'notable_id',
		'note',
	];

	public function __construct()
	{
		$this->model = new Note();
	}

	public function list(string $notableModelName, string $notableModelId): Collection
	{
		return $this->findPolymorphicModel($notableModelName, $notableModelId)
			->notes()
			->orderByDesc('updated_at')
			->get();
	}

	public function find(string $id)
	{
		return Note::findOrFail($id);
	}

	public function create(Collection $data): Note
	{
		$notableType = $data->get('notable_type');
		if ($model = $this->findPolymorphicModel($notableType, $data->get('notable_id'))) {
			return $model->notes()->create(
				$data->only($this->model->getFillable())->toArray()
			);
		}
		throw new NotFoundResourceException("Notable Model $notableType not found");
	}

	public function update(string $note, Request $request): Note
	{
		return $this->find($note)->update(
			$request->only($this->model->getFillable())
		);
	}

	public function delete(string $note): bool
	{
		return $this->model->destroy($note);
	}

}