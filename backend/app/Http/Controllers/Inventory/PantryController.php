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

	public function storeTypeValue(PantryRepository $repository, StorePantryItemVarietyRequest $request): Response
	{
		return response($repository->createVarietyValue($request), 200);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException|ReflectionException
	 */
	public function index(Request $request, InventoryService $inventoryService)
	{
		return response(
			PaginatedInventoryResource::make(
				$inventoryService::buildInventoryTableData(PantryItem::class, $request),
				PantryItemResource::class
			)
		);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StorePantryItemRequest $request
	 * @param PantryRepository $repository
	 * @return Response
	 */
	public function store(StorePantryItemRequest $request, PantryRepository $repository)
	{
		return response($repository->create(
			$request->only((new PantryItem())->getFillable()),
			$request->get('images'),
		), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param PantryRepository $repository
	 * @param string $id
	 * @return Response
	 */
	public function show(PantryRepository $repository, string $id): Response
	{
		return response($repository->find($id)->getDetailResource());
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdatePantryItemRequest $request
	 * @param PantryRepository $repository
	 * @param string $id
	 * @return Response
	 */
	public function update(UpdatePantryItemRequest $request, PantryRepository $repository, string $id): Response
	{
		return response($repository->update(
			$repository->find($id),
			$request->only((new PantryItem())->getFillable()),
			$request->get('images'),
		), 200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param PantryItem $model
	 * @return Response
	 */
	public function destroy(PantryItem $model)
	{
		$model->delete();
	}

	/**
	 * Gets similar item by type
	 *
	 * @param PantryRepository $repository
	 * @param string $id
	 * @return Response
	 */
	public function getSimilar(PantryRepository $repository, string $id)
	{
		return response(PantryItemResource::collection(
			$repository->getSimilar(
				$id
			)
		));
	}
}
