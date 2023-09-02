<?php

namespace App\Repositories\Inventory;

use App\Models\ServiceLog;
use App\Traits\PolymorphicRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Symfony\Component\Translation\Exception\NotFoundResourceException;

class ServiceLogRepository
{
	use PolymorphicRepository;

	private ServiceLog $model;

	private array $fields = [
		'type',
		'notes',
		'service_date',
		'service_id'
	];

	public function __construct()
	{
		$this->model = new ServiceLog();
	}

	public function find(string $id)
	{
		return ServiceLog::findOrFail($id);
	}

	public function list(string $serviceableModelName, string $serviceableModelId)
	{
		return $this->findPolymorphicModel($serviceableModelName, $serviceableModelId)
			->serviceLogs()
			->orderByDesc('service_date')
			->get();
	}

	public function create(Collection|array $data): ServiceLog
	{
		if(is_array($data))
		{
			$data = collect($data);
		}
		
		$serviceableType = $data->get('serviceable_type');
		if ($model = $this->findPolymorphicModel($serviceableType, $data->get('serviceable_id'))) {
			return $model->serviceLogs()->create(
				$data->only($this->model->getFillable())->toArray()
			);
		}
		throw new NotFoundResourceException("Serviceable Model $serviceableType not found");
	}

	public function update(string $serviceLog, Request $request): ServiceLog
	{
		return $this->find($serviceLog)->update(
			$request->only($this->model->getFillable())
		);
	}

	public function delete(string $serviceLog): bool
	{
		return $this->model->destroy($serviceLog);
	}

}