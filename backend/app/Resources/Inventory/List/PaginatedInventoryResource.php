<?php

namespace App\Resources\Inventory\List;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaginatedInventoryResource extends ResourceCollection
{
	protected $collectionType;

	public function __construct($resource, $collectionType)
	{
		$this->collectionType = $collectionType;
		parent::__construct($resource);
	}

	public function toArray($request)
	{
		return [
			'data' => $this->collectionType::collection($this->collection),
			'current_page' => $this->currentPage(),
			'first_page_url' => $this->url(1),
			'from' => $this->firstItem(),
			'last_page' => $this->lastPage(),
			'last_page_url' => $this->url($this->lastPage()),
			'next_page_url' => $this->nextPageUrl(),
			'path' => $this->path(),
			'per_page' => $this->perPage(),
			'prev_page_url' => $this->previousPageUrl(),
			'to' => $this->lastItem(),
			'total' => $this->total(),
		];
	}
}