<?php

namespace App\Http\Controllers\Inventory;

use App\Contracts\HasAppendableSelect;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StorePantryItemRequest;
use App\Http\Requests\Inventory\StorePantryItemVarietyRequest;
use App\Http\Requests\Inventory\UpdatePantryItemRequest;
use App\Models\Inventory\PantryItem;
use App\Repositories\Inventory\PantryRepository;
use App\Resources\Inventory\List\PaginatedInventoryResource;
use App\Resources\Inventory\List\PantryItemResource;
use App\Resources\VarietyDropdownResource;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use JsonException;
use ReflectionException;

final class PantryController extends Controller implements HasAppendableSelect
{

	public function getTypes(): Collection
	{
		return PantryRepository::getFormattedTypes();
	}

	public function getTypeValues(string $type): ResourceCollection
	{
		return VarietyDropdownResource::collection(
			PantryRepository::getTypeVarieties($type)
		);
	}

	public function getFilters(PantryRepository $repository): Collection
	{
		return $repository->getFilters();
	}

	public function storeTypeValue(PantryRepository $repository, StorePantryItemVarietyRequest $request): JsonResponse
	{
		return response()->json($repository->createVarietyValue($request), 200);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return JsonResponse
	 * @throws JsonException|ReflectionException
	 */
	public function index(Request $request, InventoryService $inventoryService): JsonResponse
	{
		return response()->json(
			PaginatedInventoryResource::make(
				$inventoryService::buildInventoryTableData(PantryItem::class, $request),
				PantryItemResource::class
			)
		, 200);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StorePantryItemRequest $request
	 * @param PantryRepository $repository
	 * @return JsonResponse
	 */
	public function store(StorePantryItemRequest $request, PantryRepository $repository): JsonResponse
	{
		return response()->json(
			$repository->create(
				$request->only((new PantryItem())->getFillable()),
				$request->get('images'),
			), 
		201);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param PantryRepository $repository
	 * @param string $id
	 * @return JsonResponse
	 */
	public function show(PantryRepository $repository, string $id): JsonResponse
	{
		return response()->json($repository->find($id)->getDetailResource(), 200);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdatePantryItemRequest $request
	 * @param PantryRepository $repository
	 * @param string $id
	 * @return JsonResponse
	 */
	public function update(UpdatePantryItemRequest $request, PantryRepository $repository, string $id): JsonResponse
	{
		return response()->json(
			$repository->update(
				$repository->find($id),
				$request->only((new PantryItem())->getFillable()),
				$request->get('images'),
			), 
		200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param string $id
	 * @param PantryRepository $repository
	 * @return JsonResponse
	 */
	public function destroy(string $id, PantryRepository $repository): JsonResponse
	{
		return response()->json($repository->delete($id), 204);		
	}

	/**
	 * Gets similar item by type
	 *
	 * @param PantryRepository $repository
	 * @param string $id
	 * @return JsonResponse
	 */
	public function getSimilar(PantryRepository $repository, string $id): JsonResponse
	{
		return response()->json(
			PantryItemResource::collection(
				$repository->getSimilar(
					$id
				)
			), 
		200);
	}
}
