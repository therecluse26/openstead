<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class LivestockParent extends Pivot
{
	use HasFactory;

	protected $table = 'livestock_parents';

	public $timestamps = false;

	protected $fillable = [
		'livestock_id',
		'parent_id',
	];

}