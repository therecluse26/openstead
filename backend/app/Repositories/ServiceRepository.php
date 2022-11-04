<?php

namespace App\Repositories;

use App\Models\Service;
use App\Repositories\Inventory\InventoryRepository;
use Illuminate\Http\Request;

class ServiceRepository extends InventoryRepository
{
	private Service $model;

	private array $fields = [
		'type',
		'title',
		'description'
	];

	public function __construct()
	{
		$this->model = new Service();
		parent::__construct($this->model);
	}


	public function create(Request $request): Service
	{
		return $this->model->create(
			$request->only($this->fields)
		);
	}

	public function update(Service $service, Request $request): Service
	{
		$service->update(
			$request->only($this->fields)
		);

		return $service;
	}

}