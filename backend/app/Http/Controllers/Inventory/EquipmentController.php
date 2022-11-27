<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\ListInventoryRequest;
use App\Http\Requests\Inventory\StoreEquipmentRequest;
use App\Http\Requests\Inventory\UpdateEquipmentRequest;
use App\Models\Inventory\Equipment;
use App\Repositories\Inventory\EquipmentRepository;
use App\Resources\Inventory\List\EquipmentResource as EquipmentListResource;
use App\Resources\Inventory\List\PaginatedInventoryResource;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use JsonException;
use ReflectionException;

final class EquipmentController extends Controller
{
	public function getTypes(): Collection
	{
		return EquipmentRepository::getFormattedTypes();
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param ListInventoryRequest $request
	 * @param InventoryService $inventoryService
	 * @return Response
	 * @throws JsonException
	 * @throws ReflectionException
	 */
	public function index(ListInventoryRequest $request, InventoryService $inventoryService): Response
	{
		return response(
			PaginatedInventoryResource::make(
				$inventoryService::buildInventoryTableData(Equipment::class, $request),
				EquipmentListResource::class
			)
		);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreEquipmentRequest $request
	 * @param EquipmentRepository $equipmentRepository
	 * @return Response
	 */
	public function store(StoreEquipmentRequest $request, EquipmentRepository $equipmentRepository): Response
	{
		return response(
			$equipmentRepository->create($request->only((new Equipment())->getFillable()),
				$request->get('images')
			), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param EquipmentRepository $equipmentRepository
	 * @param int $equipment
	 * @return Response
	 */
	public function show(EquipmentRepository $equipmentRepository, int $equipment): Response
	{
		return response(
			$equipmentRepository->find($equipment)->getDetailResource()
		);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param EquipmentRepository $equipmentRepository
	 * @param int $equipment
	 * @return Response
	 */
	public function getSimilar(EquipmentRepository $equipmentRepository, int $equipment): Response
	{
		return response(EquipmentListResource::collection(
			$equipmentRepository->getSimilar($equipment)
		));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateEquipmentRequest $request
	 * @param Equipment $equipment
	 * @param EquipmentRepository $equipmentRepository
	 * @return Response
	 */
	public function update(UpdateEquipmentRequest $request, Equipment $equipment, EquipmentRepository $equipmentRepository): Response
	{
		return response($equipmentRepository->update($equipment,
			$request->only((new Equipment())->getFillable()),
			$request->get('images')), 200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Equipment $equipment
	 * @param EquipmentRepository $equipmentRepository
	 * @return Response
	 */
	public function destroy(Equipment $equipment, EquipmentRepository $equipmentRepository): Response
	{
		return response($equipmentRepository->delete($equipment), 200);
	}

}
