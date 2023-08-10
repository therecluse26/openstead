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

	public function getFilters(EquipmentRepository $repository): Collection
	{
		return $repository->getFilters();
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
	 * @param string $equipment
	 * @return Response
	 */
	public function show(EquipmentRepository $equipmentRepository, string $id): Response
	{
		return response(
			$equipmentRepository->find($id)->getDetailResource()
		);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param EquipmentRepository $equipmentRepository
	 * @param string $equipment
	 * @return Response
	 */
	public function getSimilar(EquipmentRepository $equipmentRepository, string $id): Response
	{
		return response(EquipmentListResource::collection(
			$equipmentRepository->getSimilar($id)
		));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateEquipmentRequest $request
	 * @param string $id
	 * @param EquipmentRepository $equipmentRepository
	 * @return Response
	 */
	public function update(UpdateEquipmentRequest $request, string $id, EquipmentRepository $equipmentRepository): Response
	{
		return response($equipmentRepository->update(
			$equipmentRepository->find($id),
			$request->only((new Equipment())->getFillable()),
			$request->get('images')), 
		200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param string $id
	 * @param EquipmentRepository $equipmentRepository
	 * @return Response
	 */
	public function destroy(string $id, EquipmentRepository $equipmentRepository): Response
	{
		return response($equipmentRepository->delete(
			$equipmentRepository->find($id)
		), 200);
	}

}
