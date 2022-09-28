<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
	use HasFactory;

	protected $table = 'locations';

	protected $fillable = [
		'name',
		'description',
		'address1',
		'address2',
		'city',
		'state',
		'zip',
		'country'
	];

	public function inventory(): HasMany
	{
		return $this->hasMany(LocationInventory::class, 'location_id');
	}
}
