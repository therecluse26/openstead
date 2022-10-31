<?php

namespace App\Http\Controllers\Inventory;

use App\Enums\ServiceType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreServiceLogRequest;
use App\Http\Requests\Inventory\UpdateServiceLogRequest;
use App\Models\ServiceLog;
use App\Repositories\Inventory\ServiceLogRepository;
use App\Resources\ServiceDropdownResource;
use App\Services\Inventory\ServiceLogService;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

class ServiceLogController extends Controller
{
	public function getTypes(): Collection
	{
		return ServiceLogService::getFormattedTypes();
	}

	public function getServices(): Collection
	{
		return ServiceLogService::getServices();
	}

	public function getTypeService(string $type): ResourceCollection
	{
		return ServiceDropdownResource::collection(
			ServiceLogService::getTypeServices(ServiceType::from($type))
		);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreServiceLogRequest $request
	 * @param ServiceLogRepository $serviceLogRepository
	 * @return Response
	 */
	public function store(StoreServiceLogRequest $request, ServiceLogRepository $serviceLogRepository): Response
	{
		return response($serviceLogRepository->create($request), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param ServiceLog $serviceLog
	 * @return Response
	 */
	public function show(ServiceLog $serviceLog): Response
	{
		return response($serviceLog);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateServiceLogRequest $request
	 * @param ServiceLog $serviceLog
	 * @param ServiceLogRepository $serviceLogRepository
	 * @return Response
	 */
	public function update(UpdateServiceLogRequest $request, ServiceLog $serviceLog, ServiceLogRepository $serviceLogRepository): Response
	{
		return response($serviceLogRepository->update($serviceLog, $request), 200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param ServiceLog $serviceLog
	 * @return Response
	 */
	public function destroy(ServiceLog $serviceLog): Response
	{
		return response($serviceLog->delete());
	}
}
