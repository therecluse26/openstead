<?php

namespace App\Http\Controllers\Inventory;

use App\Contracts\HasAppendableSelect;
use App\Enums\LivestockType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreLivestockBreedRequest;
use App\Http\Requests\Inventory\StoreLivestockRequest;
use App\Http\Requests\Inventory\UpdateLivestockRequest;
use App\Models\Inventory\Livestock;
use App\Repositories\Inventory\LivestockRepository;
use App\Resources\Inventory\List\LivestockResource;
use App\Resources\Inventory\List\PaginatedInventoryResource;
use App\Resources\LivestockDropdownResource;
use App\Resources\VarietyDropdownResource;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use JsonException;

class LivestockController extends Controller implements HasAppendableSelect
{
	public function getTypes(): iterable
	{
		return LivestockRepository::getFormattedTypes();
	}

	public function getTypeValues(string $type): ResourceCollection
	{
		return VarietyDropdownResource::collection(
			LivestockRepository::getTypeVarieties($type)
		);
	}

	public function storeTypeValue(LivestockRepository $livestockRepository, StoreLivestockBreedRequest $request): Response
	{
		return response($livestockRepository->createBreedValue($request), 200);
	}

	public function getTypeMembers(LivestockRepository $livestockRepository, LivestockType $type): ResourceCollection
	{
		return LivestockDropdownResource::collection(
			$livestockRepository->getTypeMembers($type)
		);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(Request $request, InventoryService $inventoryService)
	{
		return response(
			PaginatedInventoryResource::make(
				$inventoryService::buildInventoryTableData(Livestock::class, $request),
				LivestockResource::class
			)
		);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreLivestockRequest $request
	 * @return Response
	 */
	public function store(StoreLivestockRequest $request, LivestockRepository $livestockRepository)
	{
		return response(
			$livestockRepository->create(
				$request->only((new Livestock())->getFillable()),
				$request->get('images'),
				$request->get('parents'),
				$request->get('children')),
			200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Livestock $livestock
	 * @return Response
	 */
	public function show(Livestock $livestock): Response
	{
		return response($livestock->getDetailResource());
	}
	
	/**
	 * Update the specified resource in storage.
	 *
	 * @param LivestockRepository $livestockRepository
	 * @param UpdateLivestockRequest $request
	 * @param Livestock $livestock
	 * @return Response
	 */
	public function update(LivestockRepository $livestockRepository, UpdateLivestockRequest $request, Livestock $livestock): Response
	{
		return response(
			$livestockRepository->update(
				$livestock,
				$request->only((new Livestock())->getFillable()),
				$request->get('images'),
				$request->get('parents'),
				$request->get('children')),
			200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Livestock $livestock
	 * @return Response
	 */
	public function destroy(Livestock $livestock)
	{
		$livestock->delete();
	}

	public function getSimilar(Livestock $livestock)
	{
		return response(LivestockResource::collection(
			LivestockRepository::getSimilar($livestock)
		));
	}
}
