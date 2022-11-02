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
use JsonException;

class EquipmentController extends Controller
{
	public function getTypes()
	{
		return EquipmentRepository::getFormattedTypes();
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(ListInventoryRequest $request, InventoryService $inventoryService)
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
	 * @return Response
	 */
	public function store(StoreEquipmentRequest $request, EquipmentRepository $equipmentRepository)
	{
		return response($equipmentRepository->create($request), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function show(Equipment $equipment): Response
	{
		return response($equipment->getDetailResource());
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function getSimilar(Equipment $equipment)
	{
		return response(EquipmentListResource::collection(
			EquipmentRepository::getSimilar($equipment)
		));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function edit(Equipment $equipment)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateEquipmentRequest $request
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function update(UpdateEquipmentRequest $request, Equipment $equipment, EquipmentRepository $equipmentRepository)
	{
		return response($equipmentRepository->update($equipment, $request), 200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Equipment $equipment
	 * @return Response
	 */
	public function destroy(Equipment $equipment)
	{
		$equipment->delete();
	}
}
