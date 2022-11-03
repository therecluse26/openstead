<?php

namespace App\Repositories\Inventory;

use App\Enums\ModelName;
use App\Models\ServiceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Symfony\Component\Translation\Exception\NotFoundResourceException;

class ServiceLogRepository extends InventoryRepository
{
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
		parent::__construct($this->model);
	}

	public function list(ModelName $modelName, int $modelId)
	{
		return ServiceLog::where('serviceable_type', $modelName->class())->where('serviceable_id', $modelId)->orderByDesc('service_date')->get();
	}

	public function create(Collection $data): ServiceLog
	{
		$serviceableType = $data->get('serviceable_type');
		if ($model = new(ModelName::from($data->get('serviceable_type'))->class())) {
			$model = $model->findOrFail($data->get('serviceable_id'));
			return $model->serviceLogs()->create(
				$data->only($this->fields)->toArray()
			);
		}
		throw new NotFoundResourceException("Serviceable Model $serviceableType not found");
	}

	public function update(ServiceLog $serviceLog, Request $request): ServiceLog
	{
		$serviceLog->update(
			$request->only($this->fields)
		);

		return $serviceLog;
	}

}