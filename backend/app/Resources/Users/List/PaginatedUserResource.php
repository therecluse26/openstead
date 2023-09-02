<?php
namespace App\Resources\Users\List;

use App\Resources\Users\List\UserListResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PaginatedUserResource extends ResourceCollection 
{
	public function toArray($request)
	{
		return [
			'data' => UserListResource::collection($this->collection),
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