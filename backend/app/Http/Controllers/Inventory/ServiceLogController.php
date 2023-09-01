<?php

namespace App\Http\Controllers\Inventory;

use App\Contracts\HasAppendableSelect;
use App\Enums\ServiceType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreServiceLogRequest;
use App\Http\Requests\Inventory\UpdateServiceLogRequest;
use App\Models\ServiceLog;
use App\Repositories\Inventory\ServiceLogRepository;
use App\Resources\ServiceDropdownResource;
use App\Resources\ServiceLogResource;
use App\Services\Inventory\ServiceLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

final class ServiceLogController extends Controller implements HasAppendableSelect
{
	public function getTypes(): Collection
	{
		return ServiceLogService::getFormattedTypes();
	}

	public function getServices(): Collection
	{
		return ServiceLogService::getServices();
	}

	public function getTypeValues(string $type): ResourceCollection
	{
		return ServiceDropdownResource::collection(
			ServiceLogService::getTypeServices(ServiceType::from($type))
		);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param ServiceLogRepository $repository
	 * @param string $modelName
	 * @param string $modelId
	 * @return JsonResponse
	 */
	public function index(ServiceLogRepository $repository, string $modelName, string $modelId): JsonResponse
	{
		return response()->json(
			ServiceLogResource::collection(
				$repository->list($modelName, $modelId)
			), 
		200);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreServiceLogRequest $request
	 * @param ServiceLogRepository $serviceLogRepository
	 * @return JsonResponse
	 */
	public function store(StoreServiceLogRequest $request, ServiceLogRepository $serviceLogRepository): JsonResponse
	{
		return response()->json(
			$serviceLogRepository->create(
				$request->all()	
			),
		201);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param ServiceLog $serviceLog
	 * @return JsonResponse
	 */
	public function show(string $serviceLog, ServiceLogRepository $serviceLogRepository): JsonResponse
	{
		return response()->json($serviceLogRepository->find($serviceLog), 200);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateServiceLogRequest $request
	 * @param string $serviceLog
	 * @param ServiceLogRepository $serviceLogRepository
	 * @return JsonResponse
	 */
	public function update(UpdateServiceLogRequest $request, string $serviceLog, ServiceLogRepository $serviceLogRepository): JsonResponse
	{
		return response()->json($serviceLogRepository->update($serviceLog, $request), 200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param ServiceLogRepository $repository
	 * @param string $id
	 * @return JsonResponse
	 */
	public function destroy(ServiceLogRepository $repository, string $id): JsonResponse
	{
		return response()->json($repository->delete($id), 204);
	}
}
