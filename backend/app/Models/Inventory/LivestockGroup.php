<?php

namespace App\Models\Inventory;

use App\Enums\LivestockType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LivestockGroup extends Model
{
	use HasFactory;

	protected $table = 'livestock_groups';

	protected $fillable = [
		'name',
		'type',
		'description'
	];

	protected $casts = [
		'type' => LivestockType::class
	];
}
